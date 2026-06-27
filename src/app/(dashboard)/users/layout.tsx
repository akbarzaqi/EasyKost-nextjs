'use client'

import { useState } from "react"
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/styles/components/ui/sidebar"
import { AppSidebar } from "@/styles/components/ui/app-sidebar"
import { LogOut, User } from "lucide-react"
import Link from "next/link"

import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from "../../../lib/hooks/useAuth"
import { useEffect } from "react"


export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, isLoading, logout } = useAuth()

  const getTitleFromPath = (path: string) => {
    const pathMap: Record<string, string> = {
      "/user/dashboard": "Dashboard",
      "/user/dashboard/profile": "Profil Saya",
      "/user/dashboard/kamar-saya": "Kamar Saya",
      "/user/dashboard/tagihan": "Tagihan",
      "/user/dashboard/status": "Status",
    }
    return pathMap[path] || "Dashboard"
  }

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.push('/login')
    } else if(user.role !== 'user') {
      router.push('/admin/dashboard')
    }
  }, [user, isLoading, router])

  if (isLoading) return null
  if (!user || user.role !== 'user') return null
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        
        {/* Premium Navbar */}
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
          <div className="flex h-16 items-center justify-between px-6 lg:px-8">
            {/* Left: Sidebar Trigger + Title */}
            <div className="flex items-center gap-4 flex-1">
              <SidebarTrigger className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" />
              <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
                {getTitleFromPath(pathname)}
              </h1>
            </div>

              {/* Right: Action Controls */}
              <div className="relative flex items-center gap-3">
                {/* User Avatar Dropdown */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                  className="h-9 w-9 rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-white font-medium text-sm flex items-center justify-center cursor-pointer transition-all duration-150 hover:shadow-md hover:from-blue-600 hover:to-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  title="Menu"
                >
                  {user?.nama?.charAt(0)?.toUpperCase() || 'U'}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-12 w-48 rounded-xl border border-gray-200 bg-white shadow-lg z-50 py-2">
                    <Link
                      href="/users/dashboard/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-4 w-4 text-gray-500" />
                      Profil Saya
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}