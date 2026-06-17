'use client'

import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/styles/components/ui/sidebar"
import { AppSidebar } from "@/styles/components/ui/app-sidebar"
import { Plus, Bell, Settings } from "lucide-react"

import { usePathname, useRouter  } from 'next/navigation'
import { useAuth } from "../../../lib/hooks/useAuth"
import { useEffect } from "react"


export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const router = useRouter()

  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.push('/login')
    } else if (user.role !== 'admin') {
      router.push('/users/dashboard')
    }
  }, [user, isLoading, router])

  const getTitleFromPath = (path: string) => {
    const pathMap: Record<string, string> = {
      "/admin/dashboard": "Dashboard",
      "/admin/dashboard/hunian": "Hunian",
      "/admin/dashboard/sewa": "Sewa",
      "/admin/dashboard/tagihan": "Tagihan",
      "/admin/dashboard/pembayaran": "Pembayaran",
      "/admin/dashboard/pengguna": "Pengguna",
    }
    return pathMap[path] || "Dashboard"
  }
  
  if (isLoading) return null

  if (!user || user.role !== 'admin') return null
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
              <div className="flex items-center gap-3">
                <button
                  className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors duration-150 hover:text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
                </button>

                {/* Settings */}
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors duration-150 hover:text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  aria-label="Settings"
                >
                  <Settings className="h-5 w-5" />
                </button>

                {/* User Avatar */}
                <div className="ml-2 h-9 w-9 rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-white font-medium text-sm flex items-center justify-center cursor-pointer transition-all duration-150 hover:shadow-md hover:from-blue-600 hover:to-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  title="User Profile"
                  role="button"
                  tabIndex={0}
                >
                  A
                </div>
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