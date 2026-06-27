"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  GridIcon,
  HomeIcon,
  FileTextIcon,
  CreditCardIcon,
  UsersIcon,
  Building2,
  UserCircle,
} from "lucide-react"
import { useAuth } from "../../../lib/hooks/useAuth"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/styles/components/ui/sidebar"
import { cn } from "@/styles/lib/utils"
import { GoVerified } from "react-icons/go"

const menuAdminItems = [
  { href: "/admin/dashboard", icon: GridIcon, label: "Dashboard" },
  { href: "/admin/dashboard/hunian", icon: HomeIcon, label: "Hunian" },
  { href: "/admin/dashboard/sewa", icon: FileTextIcon, label: "Sewa" },
  { href: "/admin/dashboard/tagihan", icon: FileTextIcon, label: "Tagihan" },
  { href: "/admin/dashboard/pembayaran", icon: CreditCardIcon, label: "Pembayaran" },
  { href: "/admin/dashboard/pengguna", icon: UsersIcon, label: "Pengguna" },
  { href: "/admin/dashboard/profile", icon: UserCircle, label: "Profil" },
]

const menuUserItems = [
  { href: "/users/dashboard", icon: GridIcon, label: "Dashboard" },
  { href: "/users/dashboard/kamar-saya", icon: HomeIcon, label: "Kamar Saya" },
  { href: "/users/dashboard/tagihan", icon: FileTextIcon, label: "Tagihan" },
  { href: "/users/dashboard/status", icon: GoVerified, label: "Status" },
  { href: "/users/dashboard/profile", icon: UserCircle, label: "Profil" },
]


export function AppSidebar() {
  const pathname = usePathname()
  const { user, isLoading } = useAuth()

  const isUserPage = pathname.startsWith("/users/")
  const isAdminPage = pathname.startsWith("/admin/")


  const isActive = (href: string) => {
    if (href === pathname) return true;
    if (href === "/admin/dashboard" || href === "/users/dashboard") {
      return false;
    }
    return pathname.startsWith(href);
  }

  return (
    <Sidebar className="border-r border-gray-200 bg-gray-50">
      {/* Branding Header */}
      <SidebarHeader className="border-b border-gray-200 bg-white px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-blue-700 text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900">Kost Pak Aji</span>
            <span className="text-xs text-gray-500">Management</span>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation Menu */}
      <SidebarContent className="bg-gray-50 px-3 py-5">
        <SidebarMenu className="gap-1">
          {isAdminPage && menuAdminItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <SidebarMenuItem key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
                  )}
                >
                  {/* Left Indicator Bar */}
                  {active && (
                    <div className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gray-900 transition-all" />
                  )}

                  {/* Icon */}
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors duration-200",
                      active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                    )}
                  />

                  {/* Label */}
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              </SidebarMenuItem>
            )
          })}
          {isUserPage && menuUserItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <SidebarMenuItem key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
                  )}
                >
                  {/* Left Indicator Bar */}
                  {active && (
                    <div className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gray-900 transition-all" />
                  )}

                  {/* Icon */}
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors duration-200",
                      active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                    )}
                  />

                  {/* Label */}
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-semibold text-gray-600">AKUN</div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.nama?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-900 truncate">{user?.nama || 'User'}</div>
              <div className="text-xs text-gray-500 truncate">{user?.email || ''}</div>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}