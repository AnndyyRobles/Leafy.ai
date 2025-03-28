"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Home, FolderPlus, Folders, FileText, BookOpen, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

// Navigation items for the sidebar
const navigation = [
  {
    name: "Home",
    href: "/",
    icon: Home,
    description: "Discover plant posts from the community",
  },
  {
    name: "New Project",
    href: "/new-project",
    icon: FolderPlus,
    description: "Create a new gardening project",
  },
  {
    name: "My Projects",
    href: "/my-projects",
    icon: Folders,
    description: "View your saved projects",
  },
  {
    name: "My Posts",
    href: "/my-posts",
    icon: FileText,
    description: "Manage your posts",
  },
  {
    name: "Guides",
    href: "/guides",
    icon: BookOpen,
    description: "Plant care guides and information",
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="sidebar flex h-full flex-col bg-gradient-to-b from-leafy-green-forest via-leafy-green-dark to-leafy-green-olive-medium w-64 rounded-tr-xl rounded-br-xl">
      <div className="flex flex-1 flex-col px-4">
        {/* Logo and app name */}
        <div className="flex h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-leafy-beige-light/30 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🌿</span>
            </div>
            <span className="text-lg font-medium text-white">Leafy.ai</span>
          </Link>
        </div>

        {/* User profile section */}
        <div className="mt-6 flex flex-col items-center">
          <Link href="/user-profile" className="group">
            <div className="relative h-20 w-20">
              {/* Outer ring - thicker */}
              <div className="absolute inset-[-4px] rounded-full bg-leafy-beige-green-light animate-pulse" />
              {/* Inner ring - thinner */}
              <div className="absolute inset-[-2px] rounded-full bg-leafy-green-light" />
              <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-white/20">
                <img src="/placeholder.svg" alt="" className="h-full w-full object-cover" />
              </div>
            </div>
            <h2 className="mt-3 text-sm font-medium text-white">Plant Lover</h2>
          </Link>
          <p className="text-xs text-leafy-beige-light">#GreenThumb</p>
        </div>

        {/* Navigation links - positioned lower with mt-16 */}
        <nav className="mt-16 flex-1 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center w-full px-3 py-2 text-sm transition-all duration-200 rounded-md",
                pathname === item.href
                  ? "bg-gradient-to-r from-leafy-green-light to-leafy-beige-green-light text-leafy-green-forest font-semibold shadow-md"
                  : "text-leafy-beige-light hover:bg-gradient-to-r hover:from-leafy-green-olive-light/40 hover:to-leafy-green-olive/40 hover:text-white",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 mr-3 transition-transform group-hover:scale-110",
                  pathname === item.href ? "text-leafy-green-forest" : "text-leafy-beige-light group-hover:text-white",
                )}
              />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout button */}
      <div className="p-4">
        <Link
          href="/login"
          className="flex w-full items-center justify-center space-x-2 rounded-md bg-gradient-to-r from-leafy-green-light/30 to-leafy-beige-green-light/30 px-3 py-2 text-sm font-medium text-white hover:from-leafy-green-light/50 hover:to-leafy-beige-green-light/50 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Log out</span>
        </Link>
      </div>
    </div>
  )
}

