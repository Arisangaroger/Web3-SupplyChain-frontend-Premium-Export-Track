/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1b4332",
          light: "#2d6a4f",
        },
        canvas: "#f0ece4",
        cream: "#f0ece4",
        inset: "#f9f7f4",
        chrome: "#f0ebe3",
        /** Coffee amber — status highlights & secondary actions (not Tailwind default amber) */
        amber: {
          DEFAULT: "#d4a373",
          50: "#faf7f2",
          100: "#f5ebe0",
          200: "#e8d4bc",
          300: "#d4a373",
          400: "#c8925a",
          500: "#b07d42",
          600: "#946835",
          700: "#735028",
          800: "#523819",
          900: "#352410",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-display)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-lg": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.03em" }],
        "display-md": ["1.5rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "display-sm": ["1.125rem", { lineHeight: "1.3", letterSpacing: "-0.02em" }],
      },
    },
  },
  plugins: [],
};
