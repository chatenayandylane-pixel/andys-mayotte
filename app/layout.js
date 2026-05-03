import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RevealObserver from '@/components/RevealObserver'
import CookieBanner from '@/components/CookieBanner'
import WhatsAppButton from '@/components/WhatsAppButton'

export const metadata = {
  title: {
    default: "Chez Andy's — Grossiste alimentaire à Mayotte",
    template: "%s · Chez Andy's",
  },
  description:
    "Commandez vos produits alimentaires en gros chez Andy's à Poroani, Mayotte. Réservez en ligne, venez récupérer et payez sur place.",
  keywords: "grossiste alimentaire Mayotte, Poroani, réservation en ligne, achat en gros 976, courses Mayotte",
  metadataBase: new URL('https://chezandys.com'),
  alternates: { canonical: '/' },
  themeColor: '#0a2618',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: "Andy's" },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://chezandys.com/',
    siteName: "Chez Andy's",
    title: "Chez Andy's — Grossiste alimentaire à Mayotte",
    description: "Commandez vos produits alimentaires en gros à Poroani, Mayotte. Réservation en ligne, retrait et paiement en magasin.",
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: "Chez Andy's — Grossiste alimentaire" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Chez Andy's — Grossiste alimentaire à Mayotte",
    description: "Réservation en ligne, retrait et paiement en magasin à Poroani.",
    images: ['/logo.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'GroceryStore'],
  '@id': 'https://chezandys.com/#business',
  name: "Chez Andy's",
  alternateName: "Andy's Grossiste Mayotte",
  url: 'https://chezandys.com/',
  logo: 'https://chezandys.com/logo.png',
  image: 'https://chezandys.com/logo.png',
  description: "Grossiste alimentaire à Poroani (Mayotte). Réservation en ligne, retrait et paiement en magasin. Produits secs, frais et boissons à prix de gros.",
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Poroani',
    addressLocality: 'Chirongui',
    addressRegion: 'Mayotte',
    postalCode: '97620',
    addressCountry: 'FR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -12.8920760,
    longitude: 45.1419095,
  },
  areaServed: { '@type': 'AdministrativeArea', name: 'Mayotte' },
  priceRange: '€',
  paymentAccepted: 'Cash, Credit Card',
  currenciesAccepted: 'EUR',
  potentialAction: {
    '@type': 'ReserveAction',
    target: 'https://chezandys.com/reservation',
    name: 'Réserver un retrait',
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://chezandys.com/#website',
  url: 'https://chezandys.com/',
  name: "Chez Andy's",
  inLanguage: 'fr-FR',
  publisher: { '@id': 'https://chezandys.com/#business' },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://chezandys.com/produits?search={query}' },
    'query-input': 'required name=query',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
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
        <CookieBanner />
        <WhatsAppButton />
      </body>
    </html>
  )
}
