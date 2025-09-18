// app/layout.jsx (or .js/.tsx depending on your project)
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        <main>
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}
