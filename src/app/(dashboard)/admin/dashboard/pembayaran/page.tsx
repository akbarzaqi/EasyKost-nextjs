'use client'
import { useRouter } from "next/navigation"
import { Search, SlidersHorizontal, TrendingUp, CheckCircle2, XCircle, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useMemo } from "react"

type PaymentStatus = "paid" | "verif" | "notpaid"

interface PaymentEntry {
  id: string
  nama: string
  invoice: string
  bulan: string
  total: number
  tglBayar: string
  status: PaymentStatus
}

const paymentData: PaymentEntry[] = [
  { id: "1", nama: "Akbar Zaki", invoice: "#INV-2023-001", bulan: "Oktober 2023", total: 2500000, tglBayar: "12 Okt 2023", status: "paid" },
  { id: "2", nama: "Siti Aminah", invoice: "#INV-2023-002", bulan: "Oktober 2023", total: 1800000, tglBayar: "14 Okt 2023", status: "verif" },
  { id: "3", nama: "Budi Santoso", invoice: "#INV-2023-003", bulan: "Oktober 2023", total: 3200000, tglBayar: "—", status: "notpaid" },
  { id: "4", nama: "Dewi Lestari", invoice: "#INV-2023-004", bulan: "September 2023", total: 2500000, tglBayar: "02 Sep 2023", status: "paid" },
  { id: "5", nama: "Rizky Pratama", invoice: "#INV-2023-005", bulan: "September 2023", total: 2500000, tglBayar: "05 Sep 2023", status: "paid" },
]

const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString("id-ID")}`

const statusConfig: Record<PaymentStatus, { label: string; bg: string; text: string; dot: string }> = {
  paid: { label: "Paid", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  verif: { label: "Verif", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  notpaid: { label: "Notpaid", bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
}

export default function StatusPembayaranPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return paymentData
    return paymentData.filter((p) =>
      p.id.toLowerCase().includes(q) ||
      p.nama.toLowerCase().includes(q) ||
      p.invoice.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const totalBulanIni = paymentData
    .filter((p) => p.bulan === "Oktober 2023")
    .reduce((sum, p) => sum + p.total, 0)

  const menungguVerifikasi = paymentData.filter((p) => p.status === "verif").length
  const tunggakan = paymentData
    .filter((p) => p.status === "notpaid")
    .reduce((sum, p) => sum + p.total, 0)
  const tunggakanUnit = paymentData.filter((p) => p.status === "notpaid").length

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Status Pembayaran
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Kelola dan pantau riwayat transaksi seluruh unit hunian.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari invoice..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
            <Button variant="outline" className="gap-2 border-gray-200 h-10">
              <SlidersHorizontal className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">Total Tagihan Bulan Ini</p>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-2xl font-bold text-gray-900">{formatRupiah(totalBulanIni)}</p>
              <Badge className="gap-1 bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                <TrendingUp className="h-3 w-3" />
                12%
              </Badge>
            </div>
          </div>
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">Menunggu Verifikasi</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-bold text-gray-900">{String(menungguVerifikasi).padStart(2, "0")}</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-700">URGENT</span>
            </div>
          </div>
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">Tunggakan</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-bold text-red-600">{formatRupiah(tunggakan)}</p>
              <span className="text-sm text-gray-500">{tunggakanUnit} Unit</span>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bulan</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tgl Bayar</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((entry, index) => {
                  const cfg = statusConfig[entry.status]
                  return (
                    <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-gray-900">{entry.id}</td>
                      <td className="px-5 py-4 font-medium text-gray-900">{entry.nama}</td>
                      <td className="px-5 py-4 font-semibold text-gray-900">{entry.invoice}</td>
                      <td className="px-5 py-4 text-gray-700">{entry.bulan}</td>
                      <td className="px-5 py-4 font-medium text-gray-900">{formatRupiah(entry.total)}</td>
                      <td className="px-5 py-4 text-gray-600">{entry.tglBayar}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {entry.status === "verif" && (
                            <>
                              <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Verifikasi
                              </button>
                              <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors">
                                <XCircle className="h-3.5 w-3.5" />
                                Tolak
                              </button>
                              <button onClick={() => router.push(`/admin/dashboard/pembayaran/${entry.id}`)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                                <Eye className="h-3.5 w-3.5" />
                                Lihat
                              </button>
                            </>
                          )}
                          {entry.status === "paid" && (
                            <button onClick={() => router.push(`/admin/dashboard/pembayaran/${entry.id}`)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                              <Eye className="h-3.5 w-3.5" />
                              Lihat
                            </button>
                          )}
                          {entry.status === "notpaid" && (
                            <span className="text-gray-400 text-sm font-medium">&mdash;</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing 1 to {filteredData.length} of {paymentData.length} entries
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}