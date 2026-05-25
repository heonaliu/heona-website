/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: '/Users/heona/Documents/Projects/heona-website',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
};

export default nextConfig;
