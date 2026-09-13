import type { NextConfig } from "next";

// 開発時にAPIをどこへ転送するか。素の `npm run dev` ならホスト側の :3001、
// Docker(docker-compose.dev.yml)なら rails サービスを指すよう上書きする。
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN ?? 'http://localhost:3001';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_ORIGIN}/api/:path*`, // Railsサーバー
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

