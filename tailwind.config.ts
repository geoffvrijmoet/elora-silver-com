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
        'brand-primary': '#3A7D7C', // A professional, calming teal
        'brand-secondary': '#F0F5F4', // A very light, complementary green
  			background: 'var(--background)',
			foreground: 'var(--foreground)',
        'muted-green': '#A3B8A3',
        'warm-peach': '#F2D4C2',
        'dusty-purple': '#C4B2C4',
        'light-terracotta': '#E0AFA0',
        'soft-gray': '#D3D3D3',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
