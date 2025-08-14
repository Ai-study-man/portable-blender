/** @type {import('next').NextConfig} */
const nextConfig = {
  // 为了调试本地 jpg 无法显示的问题，临时关闭优化管线，确认是否为 sharp/优化阶段导致
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'mywp.com' },
      { protocol: 'https', hostname: 'secure.gravatar.com' }
    ]
  }
};
module.exports = nextConfig;
