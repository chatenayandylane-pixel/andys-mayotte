'use client'
import { Printer } from 'lucide-react'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-primary-800 hover:bg-primary-700 text-white font-medium text-sm px-4 py-2 rounded-xl transition-colors"
    >
      <Printer size={15} />
      Imprimer / PDF
    </button>
  )
}
