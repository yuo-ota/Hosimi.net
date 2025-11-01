import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*', // Railsサーバー
      },
    ];
  },

  webpack(config, { dev, isServer }) {
    if (!dev) {
      // 本番ビルドでは Storybook を外部化
      config.externals = config.externals || [];
      config.externals.push('@storybook/react', '@storybook/addon-essentials');
    }
    return config;
  },
};

export default nextConfig;

