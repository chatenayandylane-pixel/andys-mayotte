'use client'

import { useEffect } from 'react'

// Active les animations .reveal / .reveal-left / .reveal-right / .reveal-scale
// au passage dans le viewport via IntersectionObserver.
export default function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.10, rootMargin: '0px 0px -32px 0px' }
    )

    const els = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    )
    els.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return null
}
