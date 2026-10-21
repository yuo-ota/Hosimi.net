// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  // next lint が暗黙に除外していたビルド生成物。
  // Next.js 16 で next lint が廃止され eslint を直接呼ぶようになったため明示する。
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "storybook-static/**",
      "coverage/**",
      "next-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  // eslint-config-next 16 で追加された新ルール。既存コードの修正は別途行うため警告に留める
  { rules: { "react-hooks/set-state-in-effect": "warn" } },
  ...storybook.configs["flat/recommended"]
];

export default eslintConfig;
