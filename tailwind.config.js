/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,jsx}",
		"./components/**/*.{js,jsx}",
		"./app/**/*.{js,jsx}",
		"./src/**/*.{js,jsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				"red-vivid": {
					50: "#FFE3E3",
					100: "#FFBDBD",
					200: "#FF9B9B",
					300: "#F86A6A",
					400: "#EF4E4E",
					500: "#E12D39",
					600: "#CF1124",
					700: "#AB091E",
					800: "#8A041A",
					900: "#610316",
				},
				yellow: {
					50: "#FFFAEB",
					100: "#FCEFC7",
					200: "#F8E3A3",
					300: "#F9DA8B",
					400: "#F7D070",
					500: "#E9B949",
					600: "#C99A2E",
					700: "#A27C1A",
					800: "#7C5E10",
					900: "#513C06",
				},
				"cool-grey": {
					50: "#F5F7FA",
					100: "#E4E7EB",
					200: "#CBD2D9",
					300: "#9AA5B1",
					400: "#7B8794",
					500: "#616E7C",
					600: "#52606D",
					700: "#3E4C59",
					800: "#323F4B",
					900: "#1F2933",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
			fontFamily: {
				Courier: ["courier-std", "monospace"],
				inter: ["var(--font-inter)"],
				RobotoMono: ["var(--font-roboto-mono)"],
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
