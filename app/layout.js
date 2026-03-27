import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RevealObserver from '@/components/RevealObserver'

export const metadata = {
  title: "Chez Andy's — Grossiste alimentaire à Mayotte",
  description:
    "Commandez vos produits alimentaires en gros chez Andy's à Poroani, Mayotte. Réservez en ligne, venez récupérer et payez sur place.",
  keywords: "grossiste, alimentaire, Mayotte, Poroani, réservation, commande",
  metadataBase: new URL('https://chezandys.com'),
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="flex flex-col min-h-screen">
        {/* CartProvider enveloppe toute l'app pour partager l'état du panier */}
        <CartProvider>
          <Header />
          <main className="flex-1 pb-nav md:pb-0">
            {children}
          </main>
          <Footer />
        </CartProvider>
        <RevealObserver />
      </body>
    </html>
  )
}
