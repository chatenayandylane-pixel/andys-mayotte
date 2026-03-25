/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permet d'afficher des images depuis des domaines externes si besoin
  images: {
    remotePatterns: [],
  },
  // Désactive le strict mode pour éviter les doubles renders en dev
  // reactStrictMode: false,
}

module.exports = nextConfig
