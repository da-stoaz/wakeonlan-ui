// app/layout.jsx (or .js/.tsx depending on your project)
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

export const metadata = {
  title: "Wake-On-LAN UI",
  description: "Next.js dashboard designed to wake computers",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        sizes: "192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        sizes: "512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        <main>
          {children}
        </main>
        <Toaster position="top-center" richColors={true} />
      </body>
    </html>
  )
}
