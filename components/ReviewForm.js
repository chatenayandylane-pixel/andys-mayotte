'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

export default function ReviewForm() {
  const [name, setName]         = useState('')
  const [rating, setRating]     = useState(0)
  const [hovered, setHovered]   = useState(0)
  const [comment, setComment]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || rating === 0 || !comment.trim()) {
      setError('Veuillez remplir tous les champs et choisir une note.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rating, comment }),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
      setName('')
      setRating(0)
      setComment('')
    } catch {
      setError('Une erreur est survenue. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="mt-8 rounded-2xl border p-8 text-center" style={{ background: '#F9F5EE', borderColor: 'rgba(201,161,74,0.25)' }}>
        <p className="text-3xl mb-3">✅</p>
        <p className="font-serif text-xl font-semibold text-primary-800 mb-1">Merci pour votre avis !</p>
        <p className="text-stone-500 text-sm">Votre avis sera publié après modération.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border p-6 md:p-8" style={{ background: '#FDFAF5', borderColor: 'rgba(201,161,74,0.2)' }}>
      <h3 className="font-serif font-semibold text-primary-800 text-xl mb-1">Laissez votre avis</h3>
      <p className="text-stone-500 text-sm mb-6">Votre avis sera publié après vérification.</p>

      <div className="space-y-4">
        {/* Nom */}
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
            Votre nom
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Jean Dupont"
            className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow"
            style={{ '--tw-ring-color': 'rgba(201,161,74,0.4)' }}
          />
        </div>

        {/* Étoiles */}
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
            Note
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="transition-transform hover:scale-110 active:scale-95"
                aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
              >
                <Star
                  size={28}
                  fill={(hovered || rating) >= star ? '#C9A14A' : 'none'}
                  stroke={(hovered || rating) >= star ? '#C9A14A' : '#d1d5db'}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Commentaire */}
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
            Commentaire
          </label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Partagez votre expérience..."
            rows={3}
            className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow resize-none"
            style={{ '--tw-ring-color': 'rgba(201,161,74,0.4)' }}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-primary-900 hover:bg-primary-800 active:scale-95 text-white font-semibold px-7 py-3 rounded-xl text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Envoi...' : 'Publier mon avis'}
        </button>
      </div>
    </form>
  )
}
