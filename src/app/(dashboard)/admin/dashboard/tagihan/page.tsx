'use client'
import React, { useEffect, useState, useMemo } from "react"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { useRouter } from "next/navigation"
import { Search, FileText, CheckCircle2, Clock, AlertCircle, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getAllTagihan } from "@/lib/api/tagihan"

type TabKey = "all" | "paid" | "notpaid" | "verif"

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "Semua", icon: <FileText className="h-4 w-4" /> },
  { key: "paid", label: "Lunas", icon: <CheckCircle2 className="h-4 w-4" /> },
  { key: "notpaid", label: "Belum Bayar", icon: <AlertCircle className="h-4 w-4" /> },
  { key: "verif", label: "Verifikasi", icon: <Clock className="h-4 w-4" /> },
]

const statusLabel: Record<string, string> = {
  paid: 'Lunas',
  notpaid: 'Belum Bayar',
  verif: 'Verifikasi',
}

function transformTagihan(item: any) {
  const biaya = item.sewa?.hunian?.biaya
  const biayaKost = biaya ? Number(biaya.kost) : 0
  const biayaWifi = biaya ? Number(biaya.wifi) : 0
  const biayaSampah = biaya ? Number(biaya.sampah) : 0
  const biayaAir = Number(item.air) || 0
  const total = biayaKost + biayaWifi + biayaSampah + biayaAir

  const rincian = []
  if (biayaKost > 0) rincian.push('Kost')
  if (biayaWifi > 0) rincian.push('WiFi')
  if (biayaSampah > 0) rincian.push('Sampah')
  if (biayaAir > 0) rincian.push('Air')

  return {
    id_tagihan: item.id_tagihan,
    nama_penghuni: item.sewa?.user?.nama || item.sewa?.user?.nama_lengkap || '-',
    kamar: item.sewa?.hunian?.nama_hunian || '-',
    rincian,
    total,
    tgl_jatuhtempo: item.tgl_jatuhtempo,
    status: item.status,
    sewa: item.sewa,
  }
}

export default function TagihanPage() {
  const router = useRouter()
  const [tableData, setTableData] = useState<any[] | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllTagihan()
      if (!response.error && response.data) {
        setTableData(response.data.map(transformTagihan))
      }
    }
    fetchData()
  }, [])

  const filteredData = useMemo(() => {
    if (!tableData) return []

    let filtered = tableData

    if (activeTab !== "all") {
      filtered = filtered.filter((item: any) => item.status === activeTab)
    }

    const q = searchQuery.toLowerCase().trim()
    if (q) {
      filtered = filtered.filter(
        (item: any) =>
          item.nama_penghuni?.toLowerCase().includes(q) ||
          String(item.id_tagihan).includes(q) ||
          item.kamar?.toLowerCase().includes(q)
      )
    }

    return filtered
  }, [tableData, activeTab, searchQuery])

  const counts = useMemo(() => {
    if (!tableData) return { all: 0, paid: 0, notpaid: 0, verif: 0 }
    return {
      all: tableData.length,
      paid: tableData.filter((d: any) => d.status === "paid").length,
      notpaid: tableData.filter((d: any) => d.status === "notpaid").length,
      verif: tableData.filter((d: any) => d.status === "verif").length,
    }
  }, [tableData])

  if (!tableData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Memuat data tagihan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Manajemen Tagihan
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola dan pantau seluruh tagihan penghuni kost.
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex flex-wrap gap-2 mb-5">
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

        {/* Search & Action */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari ID, nama, kamar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <button
            onClick={() => router.push('/admin/dashboard/tagihan/tambah')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors shadow-sm whitespace-nowrap cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Tambah Tagihan
          </button>
        </div>

        {filteredData.length > 0 ? (
          <DataTable columns={columns} data={filteredData} />
        ) : (
          <div className="text-center py-16 text-sm text-gray-500 bg-white border border-dashed border-gray-200 rounded-xl">
            Tidak ada tagihan yang cocok dengan filter saat ini.
          </div>
        )}
      </div>
    </div>
  )
}
