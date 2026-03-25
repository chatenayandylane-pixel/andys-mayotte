export default function sitemap() {
  const base = 'https://chezandys.com'
  return [
    { url: base,                   lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/produits`,     lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/reservation`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/panier`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]
}
