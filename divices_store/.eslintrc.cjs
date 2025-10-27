module.exports = {
  extends: ["next/core-web-vitals", "next/typescript"],
  plugins: ["prisma"],
  overrides: [
    {
      files: ["**/prisma/**/*.prisma"],
      parser: "prisma-eslint-parser",
      rules: {
        "prisma/no-raw-query": "error",
        "prisma/require-where": "warn",
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/no-explicit-any": "off", 
  },
  ignorePatterns: ["node_modules/", ".next/"],
};
