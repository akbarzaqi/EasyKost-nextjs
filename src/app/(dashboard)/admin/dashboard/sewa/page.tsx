'use client'
import React, { useEffect, useState, useMemo } from "react"
import { DataTable } from "./data-table"
import { columns, data } from "./columns"
import { Search, Home, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const getData = async (): Promise<{ columns: any[], data: any[] }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ columns, data })
        }, 1000)
    })
}

type TabKey = "all" | "aktif" | "berakhir" | "menunggu"

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "Semua", icon: <Home className="h-4 w-4" /> },
    { key: "aktif", label: "Aktif", icon: <CheckCircle2 className="h-4 w-4" /> },
    { key: "menunggu", label: "Menunggu", icon: <Clock className="h-4 w-4" /> },
    { key: "berakhir", label: "Berakhir", icon: <XCircle className="h-4 w-4" /> },
]

export default function AdminSewa() {
    const [sewaList, setSewaList] = React.useState<any[] | null>(null)
    const [columnList, setColumns] = React.useState<any[] | null>(null)
    const [activeTab, setActiveTab] = useState<TabKey>("all")
    const [searchQuery, setSearchQuery] = useState<string>("")

    useEffect(() => {
        const fetchData = async () => {
            const { columns, data } = await getData()
            setColumns(columns)
            setSewaList(data)
        }
        fetchData()
    }, [])

    const filteredSewa = useMemo(() => {
        if (!sewaList) return []
        let result: any[] = sewaList

        if (activeTab !== "all") {
            result = result.filter(h => h.status === activeTab)
        }

        const q = searchQuery.toLowerCase().trim()
        if (q) {
            result = result.filter(h =>
                h.name.toLowerCase().includes(q) ||
                h.room.toLowerCase().includes(q) ||
                h.status.toLowerCase().includes(q)
            )
        }

        return result
    }, [sewaList, activeTab, searchQuery])

    const counts = useMemo(() => {
        if (!sewaList) return { all: 0, aktif: 0, berakhir: 0, menunggu: 0 }
        return {
            all: sewaList.length,
            aktif: sewaList.filter(h => h.status === "aktif").length,
            berakhir: sewaList.filter(h => h.status === "berakhir").length,
            menunggu: sewaList.filter(h => h.status === "menunggu").length,
        }
    }, [sewaList])

    if (!columnList || !sewaList) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Memuat data sewa...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                        Manajemen Sewa
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Pantau dan kelola kontrak sewa kamar penghuni kost.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
                    <div className="flex flex-wrap gap-2">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.key
                            const count = counts[tab.key]
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                                        isActive
                                            ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                    <Badge
                                        variant="secondary"
                                        className={`ml-1 ${
                                            isActive
                                                ? "bg-white/20 text-white hover:bg-white/20"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        {count}
                                    </Badge>
                                </button>
                            )
                        })}
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Cari nama, kamar, status..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-white"
                        />
                    </div>
                </div>

                {filteredSewa.length > 0 ? (
                    <DataTable columns={columnList} data={filteredSewa} />
                ) : (
                    <div className="text-center py-16 text-sm text-gray-500 bg-white border border-dashed border-gray-200 rounded-xl">
                        Tidak ada data sewa yang cocok dengan filter saat ini.
                    </div>
                )}
            </div>
        </div>
    )
}
