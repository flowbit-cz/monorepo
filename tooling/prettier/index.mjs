/** @type {import("prettier").Config} */
const config = {
    tabWidth: 4,
    printWidth: 120,
    semi: true,
    singleQuote: false,
    trailingComma: "all",
    plugins: ["prettier-plugin-tailwindcss"],
    // Tailwind class sorting also understands our class helpers.
    tailwindFunctions: ["cn", "cva", "clsx"],
    overrides: [{ files: ["*.json", "*.yml", "*.yaml", "*.md"], options: { tabWidth: 2 } }],
};

export default config;
