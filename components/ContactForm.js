'use client'

import { useState } from 'react'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const fieldBase = 'w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-white placeholder:text-stone-400'
const fieldNormal = `${fieldBase} border-stone-200 focus:ring-primary-500/40`
const fieldError  = `${fieldBase} border-red-300 bg-red-50/60 focus:ring-red-300/40`

export default function ContactForm() {
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [serverError, setServerError] = useState('')

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.nom.trim())     e.nom     = 'Votre nom est requis'
    if (!form.email.trim())   e.email   = 'Votre email est requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = 'Email invalide'
    if (!form.message.trim()) e.message = 'Votre message est requis'
    else if (form.message.length > 2000) e.message = 'Message trop long (max 2000 caractères)'
    return e
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setStatus('loading')
    setServerError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur serveur')
      setStatus('success')
      setForm({ nom: '', email: '', sujet: '', message: '' })
    } catch (err) {
      setServerError(err.message)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-6 h-full">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-5">
          <CheckCircle size={28} className="text-emerald-500" />
        </div>
        <h3 className="font-serif font-semibold text-primary-800 text-xl mb-2">Message envoyé !</h3>
        <p className="text-stone-500 text-sm max-w-xs leading-relaxed">
          Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm text-primary-600 hover:text-primary-800 underline underline-offset-2 transition-colors"
        >
          Envoyer un autre message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1.5 tracking-wide uppercase">
            Nom <span className="text-primary-500">*</span>
          </label>
          <input
            name="nom"
            value={form.nom}
            onChange={handleChange}
            placeholder="Jean Dupont"
            className={errors.nom ? fieldError : fieldNormal}
          />
          {errors.nom && <p className="mt-1 text-xs text-red-500">{errors.nom}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1.5 tracking-wide uppercase">
            Email <span className="text-primary-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="jean@exemple.com"
            className={errors.email ? fieldError : fieldNormal}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-600 mb-1.5 tracking-wide uppercase">
          Sujet
        </label>
        <input
          name="sujet"
          value={form.sujet}
          onChange={handleChange}
          placeholder="Demande d'information, commande…"
          className={fieldNormal}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-600 mb-1.5 tracking-wide uppercase">
          Message <span className="text-primary-500">*</span>
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          placeholder="Votre message…"
          className={`${errors.message ? fieldError : fieldNormal} resize-none`}
        />
        <div className="flex justify-between mt-1">
          {errors.message
            ? <p className="text-xs text-red-500">{errors.message}</p>
            : <span />
          }
          <span className="text-xs text-stone-400">{form.message.length}/2000</span>
        </div>
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <AlertCircle size={15} className="shrink-0" />
          {serverError || 'Une erreur est survenue. Réessayez.'}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full inline-flex items-center justify-center gap-2 bg-primary-900 hover:bg-primary-800 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-all shadow-forest hover:-translate-y-0.5"
      >
        {status === 'loading' ? (
          <><Loader2 size={15} className="animate-spin" /> Envoi en cours…</>
        ) : (
          <><Send size={15} /> Envoyer le message</>
        )}
      </button>
    </form>
  )
}
