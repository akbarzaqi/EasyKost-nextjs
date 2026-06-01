"use client"

import { Plus, Bell, Settings, Search } from "lucide-react"
import { Button } from "@/styles/components/ui/button"
import { cn } from "@/styles/lib/utils"

interface NavbarProps {
  title?: string
  className?: string
}

export function DashboardNavbar({ title = "Dashboard", className }: NavbarProps) {
  return (
    <nav
      className={cn(
        "flex h-18 w-full items-center justify-between border-b border-gray-200 bg-white px-6 py-4 lg:px-8",
        className
      )}
    >
      {/* Left Side - Title */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-4">
        {/* Search Button (Hidden on mobile) */}
        <button
          className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Plus Icon Button */}
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-label="Add new"
        >
          <Plus className="h-5 w-5" />
        </button>

        {/* Generate Button */}
        <button
          className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-lg"
          aria-label="Generate"
        >
          Generate
        </button>

        {/* Notification Bell */}
        <button
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {/* Notification Indicator Dot */}
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Settings Icon */}
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </button>

        {/* User Avatar */}
        <div className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-white font-semibold cursor-pointer transition-all duration-200 hover:shadow-md hover:from-blue-600 hover:to-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          title="User Profile"
          role="button"
          tabIndex={0}
        >
          A
        </div>
      </div>
    </nav>
  )
}
