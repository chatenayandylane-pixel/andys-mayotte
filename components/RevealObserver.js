'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const SELECTORS = '.reveal, .reveal-left, .reveal-right, .reveal-scale'

export default function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    // IntersectionObserver : rend visible chaque élément quand il entre dans le viewport
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    )

    // Observe un élément : retire d'abord .visible pour réinitialiser l'animation
    const observe = (el) => {
      el.classList.remove('visible')
      io.observe(el)
    }

    // Observe tous les éléments déjà présents dans le DOM
    document.querySelectorAll(SELECTORS).forEach(observe)

    // MutationObserver : observe les nouveaux éléments ajoutés au DOM (streaming SSR)
    const mo = new MutationObserver((mutations) => {
      mutations.forEach(({ addedNodes }) => {
        addedNodes.forEach(node => {
          if (node.nodeType !== Node.ELEMENT_NODE) return
          if (node.matches?.(SELECTORS)) observe(node)
          node.querySelectorAll?.(SELECTORS).forEach(observe)
        })
      })
    })

    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])

  return null
}
