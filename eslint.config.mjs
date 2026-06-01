import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// eslint-config-next 16 ships native flat configs, so we spread them directly
// instead of going through the FlatCompat shim (which crashed the validator).
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // The block renderer maps over heterogeneous Sanity block-content objects
    // whose fields vary per `_type`; `any` is the pragmatic contract here.
    files: ["src/components/blocks/**/*.tsx"],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // Generated — never hand-linted.
      "src/sanity/sanity.types.ts",
      // Separate packages / design-system source with their own tooling.
      "studio/**",
      "bxrs-design/**",
    ],
  },
];

export default eslintConfig;
