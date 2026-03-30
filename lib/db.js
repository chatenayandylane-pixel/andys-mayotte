import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  console.warn('[db] DATABASE_URL non défini — les requêtes DB échoueront')
}

export const sql = neon(process.env.DATABASE_URL || 'postgresql://localhost/fallback')
