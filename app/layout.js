import './globals.css'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local';

const inter = Inter({ subsets: ['latin'] })

const CastleTLig = localFont({
  src: '../public/fonts/CastleTLig.ttf',
  variable: '--font-castletlig'
})

export const metadata = {
  title: 'Origin Golf Machine Shop',
  description: 'A consistently updated representation of the machine shop',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${CastleTLig.variable}`}>{children}</body>
    </html>
  )
}
