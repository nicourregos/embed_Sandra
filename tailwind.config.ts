import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lemon: {
          light: '#F6F4DF',
          DEFAULT: '#EEE9C1',
          dark: '#E5DD9F',
        },
        yellow: {
          light: '#F5D6A3',
          DEFAULT: '#F0C073',
          dark: '#EAA434',
        },
        red: {
          light: '#F5D6A3',
          DEFAULT: '#DE3F4A',
          dark: '#DE3F4A',
        },
        orange: {
          light: '#F5D6A3',
          DEFAULT: '#E16A49',
          dark: '#E16A49',
        },
        green: {
          light: '#F5D6A3',
          DEFAULT: '#22453B',
          dark: '#22453B',
        },
        blue: {
          light: '#F5D6A3',
          DEFAULT: '#39396A',
          dark: '#39396A',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
