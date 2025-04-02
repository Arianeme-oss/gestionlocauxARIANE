/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  // Assurez-vous que les routes sont correctement gérées
  async redirects() {
    return [
      {
        source: "/index",
        destination: "/",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

