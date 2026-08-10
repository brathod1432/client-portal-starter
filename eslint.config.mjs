import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Turn off ESLint rules that conflict with Prettier formatting.
  prettier,
  {
    rules: {
      // The React Compiler flags the standard SSR "mounted" hydration guard
      // (setState in a mount effect). It is safe and intentional here, so we
      // surface it as a warning rather than an error.
      "react-hooks/set-state-in-effect": "warn",
      // TanStack Table's useReactTable returns non-memoizable functions by
      // design; the compiler simply skips optimizing it. Not an error.
      "react-hooks/incompatible-library": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
