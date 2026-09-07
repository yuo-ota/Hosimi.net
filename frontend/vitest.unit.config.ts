import { defineConfig } from "vitest/config";

// three.js の座標計算など、ブラウザを必要としない純粋なロジックのテスト。
// vitest.config.ts は Storybook のブラウザテスト専用のため、こちらに分けている。
export default defineConfig({
  test: {
    name: "unit",
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
