import {heroui} from '@heroui/theme';
import type { Config } from "tailwindcss"
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'


const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./node_modules/@heroui/theme/dist/components/(dropdown|menu|divider|popover|button|ripple|spinner).js"
  ],
  theme: {
    container: { center: true, padding: "1rem", screens: { xl: "1120px" } },
    extend: {
      colors: {
        brand: "rgb(var(--color-brand) / <alpha-value>)",
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        fg: "rgb(var(--color-fg) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        crimson: {
          DEFAULT: "rgb(var(--color-crimson) / <alpha-value>)",
          dark: "rgb(var(--color-crimson-dark) / <alpha-value>)",
        },
        beige: "rgb(var(--color-beige) / <alpha-value>)",
        darkgray: "rgb(var(--color-dark-gray) / <alpha-value>)",
        darkergray: "rgb(var(--color-darker-gray) / <alpha-value>)",
        lightergray: "rgb(var(--color-lighter-gray) / <alpha-value>)",
        forest: "rgb(var(--color-forest) / <alpha-value>)",
        dreamsicle: "rgb(var(--color-dreamsicle) / <alpha-value>)",
        white: "rgb(var(--color-white) / <alpha-value>)",
        black: "rgb(var(--color-black) / <alpha-value>)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        felix: ["var(--font-felix)", "serif"],
        roboto: ["Roboto", "ui-sans-serif", "system-ui"],
      },
      lineHeight: { normal: "var(--leading)" },
      width: {
        "2/12": "16.666667%",
        "5/12": "41.666667%",
      },
    },
  },
  plugins: [forms(),typography(),heroui()],
};
export default config;
