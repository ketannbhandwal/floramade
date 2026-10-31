/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        accent: "var(--accent)",
        highlight: "var(--highlight)",
        muted: "var(--muted)",
        border: "var(--border)",
        navy: {
          DEFAULT: "#142B49",
          dark: "#0E1F36",
          light: "#1F3D66",
        },
        pearl: {
          DEFAULT: "#F7F9FC",
          blue: "#D9E5F3",
          border: "#C5D5E8",
          dark: "#A8BDD5",
        },
        gold: {
          DEFAULT: "#D9A441",
          hover: "#C48F2E",
          light: "#F5E4BE",
        },
        sage: {
          DEFAULT: "#E7EFD8",
          light: "#F2F7EB",
          dark: "#BDD19E",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", '"DM Sans"', "sans-serif"],
        display: ["var(--font-dm-sans)", '"DM Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
}
