'use client'
import { useRouter } from "next/navigation"
import { Search, TrendingUp, CheckCircle2, XCircle, Eye, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect, useMemo } from "react"
import { getAllPembayaran, verifikasiPembayaran } from "@/lib/api/pembayaran"

const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString("id-ID")}`

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  paid: { label: "Diterima", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  verif: { label: "Menunggu", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  notpaid: { label: "Ditolak", bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
}

export default function StatusPembayaranPage() {
  const router = useRouter()
  const [pembayaranList, setPembayaranList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [verifLoading, setVerifLoading] = useState<number | null>(null)

  const fetchData = async () => {
    setLoading(true)
    const response = await getAllPembayaran()
    if (!response.error && response.data) {
      setPembayaranList(response.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return pembayaranList
    return pembayaranList.filter((p) => {
      const nama = p.transaksi?.tagihan?.sewa?.user?.nama?.toLowerCase() || ''
      const invoice = p.invoice?.toLowerCase() || ''
      const kamar = p.transaksi?.tagihan?.sewa?.hunian?.nama_hunian?.toLowerCase() || ''
      return nama.includes(q) || invoice.includes(q) || kamar.includes(q)
    })
  }, [searchQuery, pembayaranList])

  const totalTagihan = pembayaranList.reduce((sum, p) => sum + (Number(p.transaksi?.total_bayar) || 0), 0)
  const menungguVerifikasi = pembayaranList.filter((p) => p.status === "verif").length
  const totalDiterima = pembayaranList.filter((p) => p.status === "paid").length

  const handleVerifikasi = async (id: number, status: 'paid' | 'notpaid') => {
    setVerifLoading(id)
    await verifikasiPembayaran(id, status)
    setVerifLoading(null)
    fetchData()
  }

  const getBulan = (item: any) => {
    const tgl = item.transaksi?.tagihan?.tgl_tagihan
    if (!tgl) return '-'
    return new Date(tgl).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

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
              Kelola dan verifikasi pembayaran dari penghuni.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari invoice/nama/kamar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">Total Pembayaran</p>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-2xl font-bold text-gray-900">{formatRupiah(totalTagihan)}</p>
              <Badge className="gap-1 bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                <TrendingUp className="h-3 w-3" />
                {pembayaranList.length} transaksi
              </Badge>
            </div>
          </div>
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">Menunggu Verifikasi</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-bold text-gray-900">{String(menungguVerifikasi).padStart(2, "0")}</p>
              {menungguVerifikasi > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-700">PERLU DICEK</span>
              )}
            </div>
          </div>
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">Diterima</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-bold text-emerald-600">{String(totalDiterima).padStart(2, "0")}</p>
              <span className="text-sm text-gray-500">pembayaran</span>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kamar</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bulan</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tgl Bayar</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-gray-500">
                      Tidak ada data pembayaran.
                    </td>
                  </tr>
                )}
                {filteredData.map((entry) => {
                  const cfg = statusConfig[entry.status] || statusConfig.notpaid
                  const user = entry.transaksi?.tagihan?.sewa?.user
                  const hunian = entry.transaksi?.tagihan?.sewa?.hunian
                  return (
                    <tr key={entry.id_pembayaran} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-gray-900">{user?.nama || '-'}</td>
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-gray-900">{entry.invoice}</td>
                      <td className="px-5 py-4 text-gray-700">{hunian?.nama_hunian || '-'}</td>
                      <td className="px-5 py-4 text-gray-700">{getBulan(entry)}</td>
                      <td className="px-5 py-4 font-medium text-gray-900">{formatRupiah(Number(entry.transaksi?.total_bayar) || 0)}</td>
                      <td className="px-5 py-4 text-gray-600">{formatDate(entry.tgl_bayar)}</td>
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
                              <button
                                onClick={() => handleVerifikasi(entry.id_pembayaran, 'paid')}
                                disabled={verifLoading === entry.id_pembayaran}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
                              >
                                {verifLoading === entry.id_pembayaran ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                )}
                                Terima
                              </button>
                              <button
                                onClick={() => handleVerifikasi(entry.id_pembayaran, 'notpaid')}
                                disabled={verifLoading === entry.id_pembayaran}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                Tolak
                              </button>
                              <button onClick={() => router.push(`/admin/dashboard/pembayaran/${entry.invoice}`)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                                <Eye className="h-3.5 w-3.5" />
                                Lihat
                              </button>
                            </>
                          )}
                          {entry.status === "paid" && (
                            <button onClick={() => router.push(`/admin/dashboard/pembayaran/${entry.invoice}`)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                              <Eye className="h-3.5 w-3.5" />
                              Lihat
                            </button>
                          )}
                          {entry.status === "notpaid" && (
                            <button onClick={() => router.push(`/admin/dashboard/pembayaran/${entry.invoice}`)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                              <Eye className="h-3.5 w-3.5" />
                              Lihat
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Menampilkan {filteredData.length} dari {pembayaranList.length} pembayaran
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
