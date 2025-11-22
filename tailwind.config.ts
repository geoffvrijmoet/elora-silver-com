import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
        'muted-green-light': '#E6EAE6',
        'dark-green-text': '#2A4B2A',
			background: 'var(--background)',
			foreground: 'var(--foreground)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
		},
      boxShadow: {
        'bottom': '0 4px 6px -2px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        serif: ['Times New Roman', 'Times', 'serif'],
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;