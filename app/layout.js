import "./globals.css";
import { Inter, Roboto_Mono, Poppins } from "next/font/google";
import localFont from "next/font/local";

const CastleTLig = localFont({
	src: "../public/fonts/CastleTLig.ttf",
	variable: "--font-castletlig",
});

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

const roboto_mono = Roboto_Mono({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-roboto-mono",
});

const poppins = Poppins({
	subsets: ["latin"],
	display: "swap",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-poppins",
});

export const metadata = {
	title: "Origin Golf Machine Shop",
	description: "A consistently updated representation of the machine shop",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${inter.className}`}>{children}</body>
		</html>
	);
}
