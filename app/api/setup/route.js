import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { readFileSync } from 'fs'
import { join } from 'path'

function readJson(name) {
  try { return JSON.parse(readFileSync(join(process.cwd(), 'data', `${name}.json`), 'utf-8')) }
  catch { return [] }
}

// POST /api/setup — crée les tables et importe les données JSON existantes
// Protégé par le mot de passe admin
export async function POST(request) {
  try {
    const { password } = await request.json()
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // ── 0. Corriger le type de colonne si besoin ────────────────────────────
    await sql`ALTER TABLE IF EXISTS products ALTER COLUMN id TYPE BIGINT`.catch(() => {})

    // ── 1. Créer les tables ─────────────────────────────────────────────────
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id          BIGINT PRIMARY KEY,
        name        TEXT    NOT NULL,
        description TEXT    DEFAULT '',
        price       NUMERIC(10,2) NOT NULL DEFAULT 0,
        unit        TEXT    DEFAULT '',
        category    TEXT    DEFAULT '',
        emoji       TEXT    DEFAULT '',
        image       TEXT    DEFAULT '',
        available   BOOLEAN DEFAULT true,
        stock       INTEGER DEFAULT 0,
        featured    BOOLEAN DEFAULT false,
        promo       BOOLEAN DEFAULT false
      )
    `
    await sql`
      CREATE TABLE IF NOT EXISTS reservations (
        id               TEXT PRIMARY KEY,
        prenom           TEXT,
        nom              TEXT,
        telephone        TEXT,
        email            TEXT,
        date             TEXT,
        creneau          TEXT,
        articles         JSONB   DEFAULT '[]',
        total_indicatif  NUMERIC(10,2) DEFAULT 0,
        status           TEXT    DEFAULT 'en_attente',
        created_at       TIMESTAMPTZ DEFAULT NOW(),
        validated_at     TIMESTAMPTZ,
        invoice_id       TEXT
      )
    `
    await sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id                TEXT PRIMARY KEY,
        reservation_id    TEXT,
        client_nom        TEXT,
        client_prenom     TEXT,
        client_email      TEXT,
        client_telephone  TEXT,
        articles          JSONB   DEFAULT '[]',
        total             NUMERIC(10,2) DEFAULT 0,
        status            TEXT    DEFAULT 'en_attente',
        created_at        TIMESTAMPTZ DEFAULT NOW(),
        paid_at           TIMESTAMPTZ
      )
    `
    await sql`
      CREATE TABLE IF NOT EXISTS hours (
        day         TEXT PRIMARY KEY,
        open        BOOLEAN DEFAULT true,
        open_time   TEXT    DEFAULT '08:00',
        close_time  TEXT    DEFAULT '18:00'
      )
    `
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        name TEXT PRIMARY KEY
      )
    `
    await sql`
      CREATE TABLE IF NOT EXISTS blocked_dates (
        id         SERIAL PRIMARY KEY,
        date       TEXT NOT NULL UNIQUE,
        reason     TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `
    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id         SERIAL PRIMARY KEY,
        author     TEXT    NOT NULL,
        rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment    TEXT    NOT NULL,
        approved   BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id         SERIAL PRIMARY KEY,
        title      TEXT NOT NULL,
        slug       TEXT NOT NULL UNIQUE,
        excerpt    TEXT DEFAULT '',
        content    TEXT DEFAULT '',
        image      TEXT DEFAULT '',
        published  BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `

    // ── 2. Importer les produits ────────────────────────────────────────────
    const products = readJson('products')
    for (const p of products) {
      await sql`
        INSERT INTO products (id, name, description, price, unit, category, emoji, image, available, stock, featured, promo)
        VALUES (${p.id}, ${p.name}, ${p.description ?? ''}, ${p.price}, ${p.unit ?? ''}, ${p.category ?? ''},
                ${p.emoji ?? ''}, ${p.image ?? ''}, ${p.available ?? true}, ${p.stock ?? 0},
                ${p.featured ?? false}, ${p.promo ?? false})
        ON CONFLICT (id) DO NOTHING
      `
    }

    // ── 3. Importer les réservations ────────────────────────────────────────
    const reservations = readJson('reservations')
    for (const r of reservations) {
      await sql`
        INSERT INTO reservations (id, prenom, nom, telephone, email, date, creneau, articles,
          total_indicatif, status, created_at, validated_at, invoice_id)
        VALUES (${r.id}, ${r.prenom}, ${r.nom}, ${r.telephone}, ${r.email}, ${r.date}, ${r.creneau},
                ${JSON.stringify(r.articles ?? [])}, ${parseFloat(r.totalIndicatif) || 0},
                ${r.status ?? 'en_attente'},
                ${r.createdAt ? new Date(r.createdAt) : new Date()},
                ${r.validatedAt ? new Date(r.validatedAt) : null},
                ${r.invoiceId ?? null})
        ON CONFLICT (id) DO NOTHING
      `
    }

    // ── 4. Importer les factures ────────────────────────────────────────────
    const invoices = readJson('invoices')
    for (const inv of invoices) {
      await sql`
        INSERT INTO invoices (id, reservation_id, client_nom, client_prenom, client_email,
          client_telephone, articles, total, status, created_at, paid_at)
        VALUES (${inv.id}, ${inv.reservationId ?? null}, ${inv.clientNom ?? ''}, ${inv.clientPrenom ?? ''},
                ${inv.clientEmail ?? ''}, ${inv.clientTelephone ?? ''},
                ${JSON.stringify(inv.articles ?? [])}, ${parseFloat(inv.total) || 0},
                ${inv.status ?? 'en_attente'},
                ${inv.createdAt ? new Date(inv.createdAt) : new Date()},
                ${inv.paidAt ? new Date(inv.paidAt) : null})
        ON CONFLICT (id) DO NOTHING
      `
    }

    // ── 5. Importer les horaires ────────────────────────────────────────────
    const hours = readJson('hours')
    for (const h of hours) {
      await sql`
        INSERT INTO hours (day, open, open_time, close_time)
        VALUES (${h.day}, ${h.open}, ${h.openTime}, ${h.closeTime})
        ON CONFLICT (day) DO UPDATE SET open = ${h.open}, open_time = ${h.openTime}, close_time = ${h.closeTime}
      `
    }

    // ── 6. Importer les catégories ──────────────────────────────────────────
    const categories = readJson('categories')
    for (const name of categories) {
      await sql`INSERT INTO categories (name) VALUES (${name}) ON CONFLICT (name) DO NOTHING`
    }

    return NextResponse.json({
      success: true,
      imported: {
        products: products.length,
        reservations: reservations.length,
        invoices: invoices.length,
        hours: hours.length,
        categories: categories.length,
      }
    })
  } catch (err) {
    console.error('Setup error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
