import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/context/auth-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MTT-S CUSAT SB - v1",
  description: "Official website of IEEE Microwave Theory and Techniques Society CUSAT Student Branch",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            </ThemeProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
