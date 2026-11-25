/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    // Geração estática sequencial (1 worker) para respeitar o rate limit da API da Notion
    cpus: 1,
    optimizePackageImports: ['@notionhq/client', 'three', 'prismjs'],
    // Inline do CSS no HTML — mantém o objetivo do antigo optimizeCss
    // (CSS crítico) sem depender do critters.
    inlineCss: true,
  },
  // Timeout maior para absorver retries com backoff contra a API da Notion
  staticPageGenerationTimeout: 300,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Next 16 só permite q=75 por padrão; preserva as quality usadas no site.
    qualities: [70, 75, 85],
    deviceSizes: [640, 750, 828, 1080, 1200],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        // Capa do "Ouvindo agora" (Spotify)
        protocol: 'https',
        hostname: 'i.scdn.co',
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
  // Vídeo do hero: nomes versionados (-v1) + cache imutável de 1 ano.
  // Ao trocar o arquivo, suba a versão no nome e no componente.
  async headers() {
    return [
      {
        source: '/video/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
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
