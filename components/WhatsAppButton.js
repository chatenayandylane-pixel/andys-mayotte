'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function WhatsAppButton() {
  const pathname = usePathname()
  const [hovered, setHovered] = useState(false)

  // Masquer sur les pages admin
  if (pathname?.startsWith('/admin')) return null

  return (
    <a
      href="https://wa.me/33672758478"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous contacter sur WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-lg transition-all duration-200 group"
      style={{
        width: 56,
        height: 56,
        background: '#25D366',
        boxShadow: hovered
          ? '0 8px 32px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.18)'
          : '0 4px 16px rgba(37,211,102,0.3), 0 2px 6px rgba(0,0,0,0.12)',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
      }}
    >
      {/* Icône WhatsApp SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="28"
        height="28"
        fill="white"
        aria-hidden="true"
      >
        <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.363.626 4.676 1.816 6.71L2.667 29.333l6.832-1.794A13.267 13.267 0 0 0 16.003 29.333c7.363 0 13.33-5.973 13.33-13.333S23.366 2.667 16.003 2.667zm0 24A10.603 10.603 0 0 1 10.34 25.2l-.38-.226-3.95 1.037 1.053-3.84-.248-.395A10.574 10.574 0 0 1 5.333 16c0-5.888 4.782-10.667 10.67-10.667S26.667 10.112 26.667 16 21.888 26.667 16.003 26.667zm5.82-7.987c-.318-.16-1.883-.928-2.175-1.035-.293-.107-.506-.16-.72.16-.213.318-.825 1.035-.011 1.248.107.107.213.16.32.213-.32.08-1.77-.16-3.346-1.726a6.24 6.24 0 0 1-1.602-2.415c-.16-.32 0-.48.12-.64.107-.107.24-.267.347-.4.107-.133.145-.24.213-.4.068-.16.034-.32-.017-.453-.052-.133-.72-1.733-.986-2.373-.267-.64-.534-.56-.72-.56-.187 0-.4-.027-.613-.027s-.56.08-.853.4c-.293.32-1.12 1.093-1.12 2.666s1.147 3.094 1.307 3.307c.16.213 2.255 3.44 5.467 4.826 3.213 1.387 3.213.92 3.787.866.573-.053 1.853-.76 2.12-1.493.266-.733.266-1.36.186-1.493-.08-.134-.294-.214-.612-.374z" />
      </svg>

      {/* Tooltip */}
      <span
        className="absolute right-full mr-3 whitespace-nowrap bg-primary-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg pointer-events-none transition-all duration-200"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateX(0)' : 'translateX(6px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
        aria-hidden="true"
      >
        Nous contacter sur WhatsApp
      </span>

      {/* Animation pulse ring */}
      <span
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          animation: 'whatsapp-pulse 2.4s ease-out infinite',
          background: 'rgba(37,211,102,0.35)',
        }}
      />

      <style jsx>{`
        @keyframes whatsapp-pulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </a>
  )
}
