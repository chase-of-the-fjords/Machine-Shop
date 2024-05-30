import "./globals.css";
import { Inter, Roboto_Mono } from "next/font/google";
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

export const metadata = {
	title: "Origin Golf Machine Shop",
	description: "A consistently updated representation of the machine shop",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body
				className={`${inter.variable} ${CastleTLig.variable} ${roboto_mono.variable}`}
			>
				{children}
			</body>
		</html>
	);
}
