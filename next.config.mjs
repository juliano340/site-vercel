/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    // Geração estática sequencial (1 worker) para respeitar o rate limit da API da Notion
    cpus: 1,
    optimizePackageImports: ['@notionhq/client', 'three', 'react-typing-effect', 'prismjs'],
  },
  // Timeout maior para absorver retries com backoff contra a API da Notion
  staticPageGenerationTimeout: 300,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml',
      },
    ];
  },
  // Configuração de cache (30 segundos = 30000 milissegundos)
  poweredByHeader: false,
  generateEtags: true,
  onDemandEntries: {
    maxInactiveAge: 30000, // 30 segundos em milissegundos
    pagesBufferLength: 2,
  },
};

export default nextConfig;