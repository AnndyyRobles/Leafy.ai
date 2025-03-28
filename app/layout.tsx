import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Leafy.ai - Plant Community & Project Builder",
  description: "Connect with plant lovers and create your own gardening projects",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex h-screen bg-leafy-beige-light overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
              <Sidebar />
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-auto">{children}</div>

            {/* Toaster for notifications */}
            <Toaster />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'