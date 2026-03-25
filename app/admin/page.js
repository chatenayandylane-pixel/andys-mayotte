'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Plus, Pencil, Trash2, Save, X, Lock, Package, ShoppingBag,
  Eye, EyeOff, ImagePlus, Link2, Upload, CheckCircle, Clock,
  Users, Search, AlertTriangle, FileText, ExternalLink, RefreshCw,
  Star, Tag, CalendarDays, Sparkles,
} from 'lucide-react'

const EMPTY_PRODUCT = {
  id: null, name: '', description: '', price: '', unit: '',
  category: '', emoji: '', image: '', available: true, stock: 0,
  featured: false, promo: false,
}

const UNIT_OPTIONS = [
  { value: 'carton',    label: 'Carton' },
  { value: 'unité',     label: 'Unité' },
  { value: 'pack',      label: 'Pack' },
  { value: 'sac',       label: 'Sac' },
  { value: 'bidon',     label: 'Bidon' },
  { value: 'bouteille', label: 'Bouteille' },
  { value: 'boîte',     label: 'Boîte' },
  { value: 'palette',   label: 'Palette' },
]

// ─── Utilitaires ──────────────────────────────────────────────────────────────
const formatDate = str => {
  if (!str) return ''
  return new Date(str + 'T00:00:00').toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

const formatDateTime = str => {
  if (!str) return ''
  return new Date(str).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ─── Composant badge statut ───────────────────────────────────────────────────
function StatusBadge({ status }) {
  if (status === 'validee') {
    return (
      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full">
        <CheckCircle size={11} /> Validée
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full">
      <Clock size={11} /> En attente
    </span>
  )
}

// ─── Composant badge stock ─────────────────────────────────────────────────────
function StockBadge({ stock, available }) {
  if (!available || stock === 0) return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-500">Épuisé</span>
  if (stock <= 5)  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-500">{stock} restants</span>
  if (stock <= 20) return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">{stock}</span>
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">{stock}</span>
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminPage() {

  // null = vérification en cours, false = non connecté, true = connecté
  const [authed,   setAuthed]   = useState(null)
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [authError,setAuthError]= useState('')

  const [products,     setProducts]     = useState([])
  const [reservations, setReservations] = useState([])
  const [invoices,     setInvoices]     = useState([])
  const [hours,        setHours]        = useState([])
  const [categories,   setCategories]   = useState([])
  const [newCat,       setNewCat]       = useState('')
  const [tab,          setTab]          = useState('reservations')
  const [saveMsg,      setSaveMsg]      = useState('')
  const [loadingId,    setLoadingId]    = useState(null)

  // Produits
  const [editProduct,  setEditProduct]  = useState(null)
  const [isNew,        setIsNew]        = useState(false)
  const [imgMode,      setImgMode]      = useState('url')
  const [imgUploading, setImgUploading] = useState(false)
  const fileInputRef = useRef(null)

  // Clients
  const [clientSearch, setClientSearch] = useState('')

  // Recherche produits (admin)
  const [productSearch, setProductSearch] = useState('')

  // ── Chargement des données ──────────────────────────────────────────────────
  const loadData = () => {
    fetch('/api/products')
      .then(r => r.json())
      .then(setProducts)
      .catch(() => {})

    fetch('/api/reservations')
      .then(r => r.json())
      .then(setReservations)
      .catch(() => setReservations([]))

    fetch('/api/invoices')
      .then(r => r.json())
      .then(setInvoices)
      .catch(() => setInvoices([]))

    fetch('/api/hours')
      .then(r => r.json())
      .then(setHours)
      .catch(() => {})

    fetch('/api/categories')
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {})
  }

  // Vérifier la session existante au chargement
  useEffect(() => {
    fetch('/api/admin/verify')
      .then(r => r.json())
      .then(d => setAuthed(d.valid ? true : false))
      .catch(() => setAuthed(false))
  }, [])

  useEffect(() => { if (authed === true) loadData() }, [authed])

  // ── Auth ────────────────────────────────────────────────────────────────────
  const handleLogin = async e => {
    e.preventDefault()
    setAuthError('')
    try {
      const res = await fetch('/api/admin/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password }),
      })
      if (res.ok) { setAuthed(true) }
      else        { setAuthError('Mot de passe incorrect') }
    } catch {
      setAuthError('Erreur de connexion. Réessayez.')
    }
  }

  const notify = msg => {
    setSaveMsg(msg)
    setTimeout(() => setSaveMsg(''), 3000)
  }

  // ── CRUD Produits (via API serveur) ─────────────────────────────────────────
  const saveProducts = async updated => {
    try {
      const res = await fetch('/api/products', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(updated),
      })
      if (!res.ok) throw new Error()
      setProducts(updated)
      notify('Sauvegardé ✓')
    } catch {
      notify('Erreur lors de la sauvegarde')
    }
  }

  const saveHours = async updated => {
    try {
      const res = await fetch('/api/hours', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(updated),
      })
      if (!res.ok) throw new Error()
      setHours(updated)
      notify('Horaires sauvegardés ✓')
    } catch {
      notify('Erreur lors de la sauvegarde')
    }
  }

  const saveCategories = async updated => {
    try {
      const res = await fetch('/api/categories', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(updated),
      })
      if (!res.ok) throw new Error()
      setCategories(updated)
      notify('Catégories sauvegardées ✓')
    } catch {
      notify('Erreur lors de la sauvegarde')
    }
  }

  const handleDelete = id => {
    if (!confirm('Supprimer ce produit ?')) return
    saveProducts(products.filter(p => p.id !== id))
  }

  const handleToggle = (id, field) => {
    saveProducts(products.map(p => p.id === id ? { ...p, [field]: !p[field] } : p))
  }

  const handleEdit = p => { setEditProduct({ ...p }); setIsNew(false); setImgMode('url') }
  const handleNew  = ()  => { setEditProduct({ ...EMPTY_PRODUCT, id: Date.now() }); setIsNew(true); setImgMode('url') }

  const handleSave = e => {
    e.preventDefault()
    const prod = {
      ...editProduct,
      price:     parseFloat(editProduct.price) || 0,
      stock:     parseInt(editProduct.stock)   || 0,
      available: parseInt(editProduct.stock)   > 0 ? editProduct.available : false,
    }
    const updated = isNew
      ? [...products, prod]
      : products.map(p => p.id === prod.id ? prod : p)
    saveProducts(updated)
    setEditProduct(null)
  }

  // ── Upload image ─────────────────────────────────────────────────────────────
  const handleFileUpload = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    setImgUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res  = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        setEditProduct(prev => ({ ...prev, image: data.url }))
        notify('Image uploadée ✓')
      }
    } catch {
      alert('Erreur lors de l\'upload.')
    } finally {
      setImgUploading(false)
    }
  }

  // ── Valider le paiement d'une réservation ────────────────────────────────────
  const handleValidatePayment = async (reservationId) => {
    if (!confirm('Confirmer la validation du paiement ? Le stock sera mis à jour et la facture envoyée par email.')) return
    setLoadingId(reservationId)
    try {
      const res = await fetch(`/api/reservations/${reservationId}`, { method: 'PATCH' })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error || 'Erreur serveur')
        return
      }
      // Recharger les données
      loadData()
      notify('Paiement validé ✓ — Facture envoyée par email')
    } catch {
      notify('Erreur lors de la validation')
    } finally {
      setLoadingId(null)
    }
  }

  // ── Données clients (groupées par email) ────────────────────────────────────
  const clientsMap = reservations.reduce((acc, r) => {
    const key = r.email || `${r.nom}-${r.prenom}`
    if (!acc[key]) {
      acc[key] = { nom: r.nom, prenom: r.prenom, email: r.email, telephone: r.telephone, orders: [] }
    }
    acc[key].orders.push(r)
    return acc
  }, {})

  const clientsList = Object.values(clientsMap).sort((a, b) =>
    `${a.nom} ${a.prenom}`.localeCompare(`${b.nom} ${b.prenom}`)
  )

  const filteredClients = clientSearch.trim()
    ? clientsList.filter(c =>
        `${c.prenom} ${c.nom} ${c.email}`.toLowerCase().includes(clientSearch.toLowerCase())
      )
    : clientsList

  // ── Statistiques rapides ─────────────────────────────────────────────────────
  const pendingCount   = reservations.filter(r => r.status === 'en_attente').length
  const validatedCount = reservations.filter(r => r.status === 'validee').length
  const lowStockCount  = products.filter(p => p.available && p.stock > 0 && p.stock <= 10).length
  const outOfStockCount= products.filter(p => !p.available || p.stock === 0).length

  // ── Chargement session ───────────────────────────────────────────────────────
  if (authed === null) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
      </div>
    )
  }

  // ── Écran de connexion ────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-primary-50">
        <div className="bg-white rounded-2xl shadow-hover border border-stone-100 p-8 w-full max-w-sm">
          <div className="flex items-center gap-2 justify-center mb-2">
            <Lock size={20} className="text-primary-500" />
            <h1 className="font-serif text-xl font-semibold text-primary-800">Administration</h1>
          </div>
          <p className="text-center text-stone-400 text-xs mb-6">Accès réservé</p>
          <form onSubmit={handleLogin}>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">Mot de passe</label>
            <div className="relative mb-4">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-10 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {authError && <p className="text-red-500 text-xs mb-3 bg-red-50 px-3 py-2 rounded-xl">{authError}</p>}
            <button type="submit"
              className="w-full bg-primary-800 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
              Accéder
            </button>
          </form>
          <p className="text-xs text-stone-400 text-center mt-4">
            Mot de passe par défaut : <code className="bg-stone-100 px-1.5 py-0.5 rounded">admin123</code>
          </p>
        </div>
      </div>
    )
  }

  // ── Interface admin ───────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-primary-800">Administration</h1>
          <p className="text-stone-400 text-sm mt-1">Gérez vos produits, commandes et clients</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData}
            className="p-2 text-stone-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Actualiser">
            <RefreshCw size={16} />
          </button>
          <button onClick={async () => {
            await fetch('/api/admin/logout', { method: 'POST' })
            setAuthed(false)
            setPassword('')
          }} className="text-sm text-stone-400 hover:text-red-500 transition-colors flex items-center gap-1.5">
            <Lock size={13} /> Déconnexion
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'En attente',   value: pendingCount,    bg: 'bg-amber-50',   border: 'border-amber-100',   iconCls: 'text-amber-500',   valCls: 'text-amber-700',   icon: <Clock size={16} /> },
          { label: 'Validées',     value: validatedCount,  bg: 'bg-emerald-50', border: 'border-emerald-100', iconCls: 'text-emerald-500', valCls: 'text-emerald-700', icon: <CheckCircle size={16} /> },
          { label: 'Stock faible', value: lowStockCount,   bg: 'bg-orange-50',  border: 'border-orange-100',  iconCls: 'text-orange-500',  valCls: 'text-orange-700',  icon: <AlertTriangle size={16} /> },
          { label: 'Épuisés',      value: outOfStockCount, bg: 'bg-red-50',     border: 'border-red-100',     iconCls: 'text-red-500',     valCls: 'text-red-700',     icon: <Package size={16} /> },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
            <div className={`${s.iconCls} mb-2`}>{s.icon}</div>
            <p className={`text-2xl font-bold ${s.valCls}`}>{s.value}</p>
            <p className={`text-xs ${s.iconCls} font-medium`}>{s.label}</p>
          </div>
        ))}
      </div>

      {saveMsg && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-medium">
          {saveMsg}
        </div>
      )}

      {/* Onglets */}
      <div className="flex gap-1 mb-8 bg-stone-100 p-1 rounded-xl w-fit flex-wrap">
        {[
          { id: 'reservations', label: `Commandes (${reservations.length})`,                        icon: <ShoppingBag size={14} /> },
          { id: 'invoices',     label: `Factures (${invoices.length})`,                            icon: <FileText size={14} /> },
          { id: 'products',     label: `Produits (${products.length})`,                            icon: <Package size={14} /> },
          { id: 'clients',      label: `Clients (${clientsList.length})`,                          icon: <Users size={14} /> },
          { id: 'categories',   label: `Catégories (${categories.length})`,                        icon: <Tag size={14} /> },
          { id: 'selection',    label: `Sélection (${products.filter(p=>p.featured).length})`,   icon: <Sparkles size={14} /> },
          { id: 'horaires',     label: 'Horaires',                                                  icon: <CalendarDays size={14} /> },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? 'bg-white shadow-sm text-primary-800' : 'text-stone-500 hover:text-stone-700'
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ═══ Onglet Commandes ════════════════════════════════════════════════════ */}
      {tab === 'reservations' && (
        reservations.length === 0 ? (
          <div className="text-center py-20 text-stone-300">
            <p className="text-5xl mb-4">📋</p>
            <p className="font-serif text-xl text-stone-400">Aucune commande pour le moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[...reservations].reverse().map(r => (
              <div key={r.id} className={`bg-white rounded-2xl shadow-card border p-5 transition-all ${
                r.status === 'validee' ? 'border-emerald-100' : 'border-stone-100'
              }`}>
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-primary-800">
                        {r.prenom} {r.nom}
                      </p>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-sm text-stone-500">{r.telephone} — {r.email}</p>
                    <p className="text-xs text-stone-400 mt-0.5">#{r.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">{formatDate(r.date)}</p>
                    <p className="text-sm text-primary-500 font-medium">{r.creneau}</p>
                    {r.validatedAt && (
                      <p className="text-xs text-stone-400 mt-1">Validée le {formatDateTime(r.validatedAt)}</p>
                    )}
                  </div>
                </div>

                {/* Articles */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {r.articles?.map((a, i) => (
                    <span key={i} className="bg-primary-50 border border-primary-100 px-2 py-0.5 rounded-full text-xs text-primary-700">
                      {a.emoji} {a.name} ×{a.quantity}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-sm font-semibold text-stone-700">
                      Total : <span className="text-primary-600">{parseFloat(r.totalIndicatif || 0).toFixed(2)} €</span>
                    </p>
                    {r.note && <p className="text-xs text-stone-400 italic mt-0.5">Note : {r.note}</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Voir la facture */}
                    {r.invoiceId && (
                      <a
                        href={`/facture/${r.invoiceId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-3 py-2 rounded-xl transition-colors border border-primary-100"
                      >
                        <FileText size={13} />
                        Facture {r.invoiceId}
                        <ExternalLink size={11} />
                      </a>
                    )}

                    {/* Valider paiement */}
                    {r.status === 'en_attente' ? (
                      <button
                        onClick={() => handleValidatePayment(r.id)}
                        disabled={loadingId === r.id}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white px-4 py-2 rounded-xl transition-colors"
                      >
                        {loadingId === r.id ? (
                          <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <CheckCircle size={13} />
                        )}
                        Valider le paiement
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle size={13} /> Payé
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ═══ Onglet Factures ════════════════════════════════════════════════════ */}
      {tab === 'invoices' && (
        invoices.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🧾</p>
            <p className="text-stone-400 font-serif text-xl">Aucune facture pour le moment</p>
          </div>
        ) : (
          <>
            {/* Résumé */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-2xl font-bold text-amber-700">{invoices.filter(i => i.status === 'en_attente').length}</p>
                <p className="text-xs text-amber-500 font-medium">En attente</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <p className="text-2xl font-bold text-emerald-700">{invoices.filter(i => i.status === 'payee').length}</p>
                <p className="text-xs text-emerald-500 font-medium">Payées</p>
              </div>
              <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 col-span-2 sm:col-span-1">
                <p className="text-2xl font-bold text-primary-700">
                  {invoices.filter(i => i.status === 'payee').reduce((s, i) => s + parseFloat(i.total || 0), 0).toFixed(2)} €
                </p>
                <p className="text-xs text-primary-500 font-medium">Total encaissé</p>
              </div>
            </div>

            {/* Tableau factures */}
            <div className="bg-white rounded-2xl shadow-card border border-stone-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-primary-50 border-b border-primary-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">N° Facture</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden sm:table-cell">Client</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Montant</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Statut</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {[...invoices].reverse().map(inv => (
                    <tr key={inv.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-primary-700">{inv.id}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <p className="font-medium text-stone-700 text-xs">{inv.clientPrenom} {inv.clientNom}</p>
                        <p className="text-stone-400 text-xs">{inv.clientEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-stone-500 hidden md:table-cell">
                        {formatDateTime(inv.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-primary-800">
                        {parseFloat(inv.total || 0).toFixed(2)} €
                      </td>
                      <td className="px-4 py-3 text-center">
                        {inv.status === 'payee' ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                            <CheckCircle size={10} /> Payée
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                            <Clock size={10} /> En attente
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a
                          href={`/facture/${inv.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-2.5 py-1.5 rounded-lg transition-colors border border-primary-100"
                        >
                          <FileText size={12} /> Voir
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )
      )}

      {/* ═══ Onglet Produits ════════════════════════════════════════════════════ */}
      {tab === 'products' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {/* Barre de recherche */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                placeholder="Rechercher un produit par nom ou catégorie…"
                className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              />
              {productSearch && (
                <button onClick={() => setProductSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  <X size={14} />
                </button>
              )}
            </div>
            <button onClick={handleNew}
              className="flex items-center gap-2 bg-primary-800 hover:bg-primary-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-colors shrink-0">
              <Plus size={15} /> Ajouter un produit
            </button>
          </div>

          {/* Formulaire édition */}
          {editProduct && (
            <div className="bg-white rounded-2xl shadow-card border border-primary-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-semibold text-primary-800">
                  {isNew ? 'Nouveau produit' : 'Modifier le produit'}
                </h2>
                <button onClick={() => setEditProduct(null)} className="text-stone-400 hover:text-stone-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {[
                    { label: 'Nom',      field: 'name',  type: 'text',   placeholder: 'Ex: Eau minérale', req: true },
                    { label: 'Prix (€)', field: 'price', type: 'number', placeholder: '0.00', req: true },
                    { label: 'Stock',    field: 'stock', type: 'number', placeholder: '0' },
                  ].map(f => (
                    <div key={f.field}>
                      <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                      <input
                        type={f.type} step={f.type === 'number' ? '0.01' : undefined}
                        value={editProduct[f.field]}
                        onChange={e => setEditProduct(prev => ({ ...prev, [f.field]: e.target.value }))}
                        placeholder={f.placeholder} required={f.req}
                        className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  ))}

                  {/* Catégorie — select */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Catégorie</label>
                    <select
                      value={editProduct.category}
                      onChange={e => setEditProduct(prev => ({ ...prev, category: e.target.value }))}
                      required
                      className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    >
                      <option value="">Choisir une catégorie…</option>
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Emoji — optionnel, avec bouton effacer */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                      Emoji <span className="text-stone-300 normal-case font-normal">(optionnel)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editProduct.emoji}
                        onChange={e => setEditProduct(prev => ({ ...prev, emoji: e.target.value }))}
                        placeholder="🥥 🍚 💧 …"
                        className="flex-1 px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      {editProduct.emoji && (
                        <button
                          type="button"
                          onClick={() => setEditProduct(prev => ({ ...prev, emoji: '' }))}
                          className="px-3 py-2.5 border border-stone-200 rounded-xl text-stone-400 hover:text-red-500 hover:border-red-200 transition-colors text-sm"
                          title="Effacer l'emoji"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Conditionnement — select */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Conditionnement</label>
                    <select
                      value={editProduct.unit}
                      onChange={e => setEditProduct(prev => ({ ...prev, unit: e.target.value }))}
                      required
                      className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    >
                      <option value="">Choisir…</option>
                      {UNIT_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    value={editProduct.description}
                    onChange={e => setEditProduct(prev => ({ ...prev, description: e.target.value }))}
                    rows={2} placeholder="Description courte du produit..."
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>
                {/* Image */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Image</label>
                  {editProduct.image && (
                    <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-stone-200 mb-3">
                      <img src={editProduct.image} alt="Aperçu" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setEditProduct(prev => ({ ...prev, image: '' }))}
                        className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5 shadow">
                        <X size={12} className="text-stone-500" />
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2 mb-3">
                    {[['url', <Link2 size={12} />, 'Lien URL'], ['upload', <Upload size={12} />, 'Ordinateur']].map(([mode, icon, label]) => (
                      <button key={mode} type="button" onClick={() => setImgMode(mode)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                          imgMode === mode ? 'bg-primary-100 text-primary-700' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}>
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                  {imgMode === 'url' && (
                    <input type="url" value={editProduct.image}
                      onChange={e => setEditProduct(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://…"
                      className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  )}
                  {imgMode === 'upload' && (
                    <div>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      <button type="button" onClick={() => fileInputRef.current?.click()} disabled={imgUploading}
                        className="flex items-center gap-2 bg-primary-50 hover:bg-primary-100 border border-dashed border-primary-300 text-primary-700 font-medium text-sm px-4 py-3 rounded-xl w-full justify-center">
                        {imgUploading ? <span className="animate-spin w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full" /> : <ImagePlus size={16} />}
                        {imgUploading ? 'Upload...' : 'Choisir une photo'}
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-5 mb-6 bg-stone-50 rounded-xl px-4 py-3 border border-stone-100">
                  <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                    <input type="checkbox" checked={editProduct.available}
                      onChange={e => setEditProduct(prev => ({ ...prev, available: e.target.checked }))}
                      className="accent-primary-600 w-4 h-4"
                    />
                    Disponible à la vente
                  </label>
                  <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                    <input type="checkbox" checked={editProduct.featured ?? false}
                      onChange={e => setEditProduct(prev => ({ ...prev, featured: e.target.checked }))}
                      className="accent-amber-500 w-4 h-4"
                    />
                    <Star size={13} className="text-amber-400" />
                    Produit du moment (accueil)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                    <input type="checkbox" checked={editProduct.promo ?? false}
                      onChange={e => setEditProduct(prev => ({ ...prev, promo: e.target.checked }))}
                      className="accent-red-500 w-4 h-4"
                    />
                    <Tag size={13} className="text-red-400" />
                    Badge Promo
                  </label>
                </div>
                <div className="flex gap-3">
                  <button type="submit"
                    className="flex items-center gap-2 bg-primary-800 hover:bg-primary-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl">
                    <Save size={14} /> Enregistrer
                  </button>
                  <button type="button" onClick={() => setEditProduct(null)}
                    className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-sm px-5 py-2.5 rounded-xl">
                    <X size={14} /> Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tableau produits */}
          <div className="bg-white rounded-2xl shadow-card border border-stone-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-primary-50 border-b border-primary-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Produit</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden sm:table-cell">Catégorie</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Prix</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Stock</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden md:table-cell" title="Produit du moment">⭐</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden md:table-cell" title="Badge promo">🏷️</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {products
                  .filter(p => !productSearch.trim() ||
                    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                    p.category.toLowerCase().includes(productSearch.toLowerCase())
                  )
                  .map(p => (
                  <tr key={p.id} className={`hover:bg-stone-50 transition-colors ${(!p.available || p.stock === 0) ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-primary-50 shrink-0 flex items-center justify-center">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover"
                              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}
                            />
                          ) : null}
                          <span className={`text-lg ${p.image ? 'hidden' : 'flex'}`}>
                            {p.emoji?.trim() || '📦'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-primary-800 text-xs leading-snug block">{p.name}</span>
                          <span className="text-stone-400 text-xs">{p.unit}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="bg-primary-50 text-primary-600 border border-primary-100 px-2 py-0.5 rounded-full text-xs">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-primary-800">
                      {parseFloat(p.price).toFixed(2)} €
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StockBadge stock={p.stock} available={p.available} />
                    </td>
                    {/* Toggle Vedette */}
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <button
                        onClick={() => handleToggle(p.id, 'featured')}
                        title={p.featured ? "Retirer de l'accueil" : "Mettre en avant sur l'accueil"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          p.featured ? 'text-amber-400 bg-amber-50 hover:bg-amber-100' : 'text-stone-200 hover:text-amber-300 hover:bg-amber-50'
                        }`}
                      >
                        <Star size={15} fill={p.featured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    {/* Toggle Promo */}
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <button
                        onClick={() => handleToggle(p.id, 'promo')}
                        title={p.promo ? "Retirer le badge promo" : "Ajouter le badge promo"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          p.promo ? 'text-red-400 bg-red-50 hover:bg-red-100' : 'text-stone-200 hover:text-red-300 hover:bg-red-50'
                        }`}
                      >
                        <Tag size={15} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(p)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {productSearch && products.filter(p =>
              p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
              p.category.toLowerCase().includes(productSearch.toLowerCase())
            ).length === 0 && (
              <div className="text-center py-10 text-stone-400 text-sm">
                Aucun produit trouvé pour &quot;{productSearch}&quot;
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══ Onglet Clients ═════════════════════════════════════════════════════ */}
      {tab === 'clients' && (
        <>
          {/* Barre de recherche */}
          <div className="relative mb-6">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={clientSearch}
              onChange={e => setClientSearch(e.target.value)}
              placeholder="Rechercher un client par nom ou email…"
              className="w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            />
            {clientSearch && (
              <button onClick={() => setClientSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                <X size={15} />
              </button>
            )}
          </div>

          {filteredClients.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">👤</p>
              <p className="text-stone-400">
                {clientSearch ? `Aucun client trouvé pour "${clientSearch}"` : 'Aucun client enregistré'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredClients.map(client => {
                const clientKey = client.email || `${client.nom}-${client.prenom}`
                const totalSpent = client.orders
                  .filter(o => o.status === 'validee')
                  .reduce((s, o) => s + parseFloat(o.totalIndicatif || 0), 0)

                return (
                  <div key={clientKey} className="bg-white rounded-2xl shadow-card border border-stone-100 overflow-hidden">
                    {/* Infos client */}
                    <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 bg-primary-50 border-b border-primary-100">
                      <div>
                        <p className="font-semibold text-primary-800 text-base">
                          {client.prenom} {client.nom}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-1">
                          {client.email && <p className="text-sm text-stone-500">{client.email}</p>}
                          {client.telephone && <p className="text-sm text-stone-500">{client.telephone}</p>}
                        </div>
                      </div>
                      <div className="flex gap-4 text-right">
                        <div>
                          <p className="text-2xl font-bold text-primary-700">{client.orders.length}</p>
                          <p className="text-xs text-stone-400">commande{client.orders.length > 1 ? 's' : ''}</p>
                        </div>
                        {totalSpent > 0 && (
                          <div>
                            <p className="text-2xl font-bold text-emerald-600">{totalSpent.toFixed(2)} €</p>
                            <p className="text-xs text-stone-400">total payé</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Historique des commandes */}
                    <div className="divide-y divide-stone-50">
                      {[...client.orders].reverse().map(order => (
                        <div key={order.id} className="px-5 py-3 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <StatusBadge status={order.status} />
                            <span className="text-sm font-medium text-stone-700">
                              {formatDate(order.date)} — {order.creneau}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {order.articles?.map((a, i) => (
                                <span key={i} className="bg-stone-50 border border-stone-100 px-2 py-0.5 rounded-full text-xs text-stone-600">
                                  {a.emoji} {a.name} ×{a.quantity}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-sm text-primary-700">
                              {parseFloat(order.totalIndicatif || 0).toFixed(2)} €
                            </span>
                            {order.invoiceId && (
                              <a href={`/facture/${order.invoiceId}`} target="_blank" rel="noreferrer"
                                className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-2.5 py-1.5 rounded-lg transition-colors border border-primary-100">
                                <FileText size={12} /> {order.invoiceId}
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ═══ Onglet Catégories ══════════════════════════════════════════════════ */}
      {tab === 'categories' && (
        <div className="max-w-lg">
          <div className="bg-white rounded-2xl shadow-card border border-stone-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 bg-primary-50">
              <h2 className="font-semibold text-primary-800 text-sm">Gérer les catégories</h2>
              <p className="text-xs text-stone-400 mt-0.5">Les catégories sont disponibles dans le formulaire produit et les filtres du catalogue.</p>
            </div>

            {/* Liste */}
            <div className="divide-y divide-stone-50">
              {categories.length === 0 && (
                <p className="text-center text-stone-400 text-sm py-10">Aucune catégorie</p>
              )}
              {categories.map((cat, i) => {
                const count = products.filter(p => p.category === cat).length
                return (
                  <div key={cat} className="flex items-center justify-between px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-primary-800">{cat}</span>
                      <span className="text-xs text-stone-400 bg-stone-50 border border-stone-100 px-2 py-0.5 rounded-full">
                        {count} produit{count !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (count > 0 && !confirm(`"${cat}" est utilisée par ${count} produit(s). Supprimer quand même ?`)) return
                        saveCategories(categories.filter((_, j) => j !== i))
                      }}
                      className="p-1.5 rounded-lg text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Ajouter */}
            <div className="px-6 py-4 border-t border-stone-100 bg-stone-50">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Ajouter une catégorie</p>
              <form
                onSubmit={e => {
                  e.preventDefault()
                  const name = newCat.trim()
                  if (!name || categories.includes(name)) return
                  saveCategories([...categories, name])
                  setNewCat('')
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={newCat}
                  onChange={e => setNewCat(e.target.value)}
                  placeholder="Ex : Surgelés, Snacks…"
                  className="flex-1 px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                />
                <button
                  type="submit"
                  disabled={!newCat.trim() || categories.includes(newCat.trim())}
                  className="flex items-center gap-1.5 bg-primary-800 hover:bg-primary-700 disabled:opacity-40 text-white font-medium text-sm px-4 py-2 rounded-xl transition-colors"
                >
                  <Plus size={14} /> Ajouter
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Onglet Sélection du moment ════════════════════════════════════════ */}
      {tab === 'selection' && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-stone-500 mt-1">
                Cliquez sur un produit pour l&apos;ajouter ou le retirer de la sélection affichée sur l&apos;accueil.
              </p>
              <p className="text-xs text-stone-400 mt-0.5">
                {products.filter(p => p.featured).length} produit{products.filter(p => p.featured).length !== 1 ? 's' : ''} sélectionné{products.filter(p => p.featured).length !== 1 ? 's' : ''}
              </p>
            </div>
            {products.some(p => p.featured) && (
              <button
                onClick={() => saveProducts(products.map(p => ({ ...p, featured: false })))}
                className="text-xs text-stone-400 hover:text-red-500 transition-colors border border-stone-200 hover:border-red-200 px-3 py-1.5 rounded-lg"
              >
                Tout désélectionner
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.filter(p => p.available).concat(products.filter(p => !p.available)).map(p => (
              <button
                key={p.id}
                onClick={() => handleToggle(p.id, 'featured')}
                className={`relative text-left rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                  p.featured
                    ? 'border-amber-400 shadow-lg scale-[1.02]'
                    : 'border-stone-100 hover:border-stone-300 opacity-70 hover:opacity-100'
                }`}
              >
                {/* Image ou emoji */}
                <div className="h-28 bg-primary-50 flex items-center justify-center overflow-hidden relative">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  ) : p.emoji?.trim() ? (
                    <span className="text-4xl">{p.emoji}</span>
                  ) : (
                    <span className="text-4xl opacity-20">📦</span>
                  )}
                  {/* Overlay sombre si indisponible */}
                  {!p.available && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded-full">Indisponible</span>
                    </div>
                  )}
                  {/* Badge sélectionné */}
                  {p.featured && (
                    <div className="absolute top-2 right-2 bg-amber-400 text-white rounded-full p-1 shadow">
                      <Star size={12} fill="white" />
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div className={`p-3 ${p.featured ? 'bg-amber-50' : 'bg-white'}`}>
                  <p className="text-xs font-semibold text-primary-800 leading-snug line-clamp-2">{p.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{p.category}</p>
                  <p className={`text-xs font-bold mt-1 ${p.featured ? 'text-amber-600' : 'text-stone-400'}`}>
                    {p.featured ? '⭐ En sélection' : 'Cliquer pour ajouter'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ═══ Onglet Horaires ════════════════════════════════════════════════════ */}
      {tab === 'horaires' && (
        <div className="max-w-xl">
          <div className="bg-white rounded-2xl shadow-card border border-stone-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 bg-primary-50">
              <h2 className="font-semibold text-primary-800 text-sm">Horaires d&apos;ouverture</h2>
              <p className="text-xs text-stone-400 mt-0.5">Modifiez et enregistrez vos horaires. Les changements s&apos;affichent immédiatement sur le site.</p>
            </div>

            <div className="divide-y divide-stone-50">
              {hours.map((h, i) => (
                <div key={h.day} className="px-6 py-4 flex items-center gap-4 flex-wrap">

                  {/* Jour */}
                  <span className="w-24 text-sm font-semibold text-primary-800 shrink-0">{h.day}</span>

                  {/* Toggle ouvert / fermé */}
                  <label className="flex items-center gap-2 cursor-pointer shrink-0">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={h.open}
                        onChange={e => {
                          const updated = hours.map((d, j) => j === i ? { ...d, open: e.target.checked } : d)
                          setHours(updated)
                        }}
                      />
                      <div className={`w-10 h-5 rounded-full transition-colors ${h.open ? 'bg-emerald-400' : 'bg-stone-200'}`} />
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${h.open ? 'translate-x-5' : ''}`} />
                    </div>
                    <span className={`text-xs font-medium ${h.open ? 'text-emerald-600' : 'text-stone-400'}`}>
                      {h.open ? 'Ouvert' : 'Fermé'}
                    </span>
                  </label>

                  {/* Plages horaires */}
                  {h.open && (
                    <div className="flex items-center gap-2 ml-auto">
                      <input
                        type="time"
                        value={h.openTime}
                        onChange={e => {
                          const updated = hours.map((d, j) => j === i ? { ...d, openTime: e.target.value } : d)
                          setHours(updated)
                        }}
                        className="text-sm border border-stone-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="text-stone-400 text-sm">–</span>
                      <input
                        type="time"
                        value={h.closeTime}
                        onChange={e => {
                          const updated = hours.map((d, j) => j === i ? { ...d, closeTime: e.target.value } : d)
                          setHours(updated)
                        }}
                        className="text-sm border border-stone-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-stone-100 bg-stone-50">
              <button
                onClick={() => saveHours(hours)}
                className="flex items-center gap-2 bg-primary-800 hover:bg-primary-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors"
              >
                <Save size={14} /> Enregistrer les horaires
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
