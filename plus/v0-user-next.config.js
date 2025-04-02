/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Assurez-vous que l'application est correctement construite pour la production
  output: "standalone",
  // Désactivez temporairement le strict mode pour le débogage
  experimental: {
    appDir: true,
  },
  // Assurez-vous que les routes sont correctement gérées
  async redirects() {
    return []
  },
  // Assurez-vous que les en-têtes sont correctement configurés
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

