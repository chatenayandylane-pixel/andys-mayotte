export default function manifest() {
  return {
    name: "Chez Andy's — Grossiste alimentaire",
    short_name: "Andy's",
    description: "Commandez en ligne, récupérez à Poroani, Mayotte",
    start_url: "/",
    display: "standalone",
    background_color: "#0a2618",
    theme_color: "#0a2618",
    icons: [
      { src: "/logo.png", sizes: "192x192", type: "image/png" },
      { src: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
  }
}
