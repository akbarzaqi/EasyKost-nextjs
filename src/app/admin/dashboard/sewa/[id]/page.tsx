'use client'
import React, { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, User, Home, Calendar, Clock, FileText, Pencil, Wallet, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

type Sewa = {
  id: string
  name: string
  room: string
  startDate: string
  endDate: string
  status: 'aktif' | 'berakhir' | 'menunggu'
}

const sewaData: Sewa[] = [
  { id: '1', name: 'John Doe', room: 'A101', startDate: '2024-07-01', endDate: '2024-07-31', status: 'aktif' },
  { id: '2', name: 'Jane Smith', room: 'B202', startDate: '2024-07-05', endDate: '2024-07-25', status: 'menunggu' },
  { id: '3', name: 'Alice Johnson', room: 'C303', startDate: '2024-06-15', endDate: '2024-07-15', status: 'berakhir' },
]

const fetchSewaData = async (): Promise<Sewa[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(sewaData), 1000)
  })
}

type Pembayaran = {
  id: string
  tanggal: string
  bulan: string
  jumlah: number
  status: 'lunas' | 'belum' | 'terlambat'
  metode: string
}

const pembayaranData: Record<string, Pembayaran[]> = {
  '1': [
    { id: 'P001', tanggal: '2024-07-01', bulan: 'Juli 2024', jumlah: 1500000, status: 'lunas', metode: 'Transfer Bank' },
    { id: 'P002', tanggal: '2024-06-01', bulan: 'Juni 2024', jumlah: 1500000, status: 'lunas', metode: 'E-Wallet' },
    { id: 'P003', tanggal: '2024-05-03', bulan: 'Mei 2024', jumlah: 1500000, status: 'lunas', metode: 'Transfer Bank' },
  ],
  '2': [
    { id: 'P004', tanggal: '2024-07-05', bulan: 'Juli 2024', jumlah: 1200000, status: 'belum', metode: '-' },
  ],
  '3': [
    { id: 'P005', tanggal: '2024-06-15', bulan: 'Juni 2024', jumlah: 1000000, status: 'lunas', metode: 'Transfer Bank' },
    { id: 'P006', tanggal: '2024-05-02', bulan: 'Mei 2024', jumlah: 1000000, status: 'terlambat', metode: 'Tunai' },
  ],
}

const pembayaranStatusStyles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  lunas: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  belum: { bg: 'bg-amber-50', text: 'text-amber-700', icon: <AlertCircle className="h-3.5 w-3.5" /> },
  terlambat: { bg: 'bg-rose-50', text: 'text-rose-700', icon: <XCircle className="h-3.5 w-3.5" /> },
}

const pembayaranStatusLabels: Record<string, string> = {
  lunas: 'Lunas',
  belum: 'Belum Bayar',
  terlambat: 'Terlambat',
}

const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

const statusLabels: Record<string, string> = {
  aktif: 'Aktif',
  berakhir: 'Berakhir',
  menunggu: 'Menunggu',
}

const statusStyles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  aktif: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  berakhir: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-500' },
  menunggu: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
}

export default function SewaDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [sewa, setSewa] = useState<Sewa | null>(null)

  useEffect(() => {
    const load = async () => {
      const all = await fetchSewaData()
      const found = all.find((s) => s.id === id) || null
      setSewa(found)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Memuat data...</p>
        </div>
      </div>
    )
  }

  if (!sewa) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Data sewa tidak ditemukan.</p>
      </div>
    )
  }

  const style = statusStyles[sewa.status] || statusStyles.aktif
  const pembayaran = pembayaranData[sewa.id] || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
        >
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:bg-gray-100 transition-all">
            <ArrowLeft className="h-4 w-4" />
          </span>
          Kembali ke daftar sewa
        </button>

        <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-lg">
          <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-4xl font-bold text-white">{sewa.name.charAt(0)}</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${style.bg} ${style.text} border ${style.border}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                  {statusLabels[sewa.status]}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white drop-shadow-sm">{sewa.name}</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-gray-100">
            <div className="p-6 md:border-r border-b md:border-b-0 border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-50">
                  <Home className="h-4 w-4 text-indigo-600" />
                </span>
                <span className="text-sm font-medium text-gray-500">Nomor Kamar</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{sewa.room}</p>
            </div>

            <div className="p-6 md:border-r border-b md:border-b-0 border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-50">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                </span>
                <span className="text-sm font-medium text-gray-500">Tanggal Mulai</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{formatDate(sewa.startDate)}</p>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-rose-50">
                  <Clock className="h-4 w-4 text-rose-600" />
                </span>
                <span className="text-sm font-medium text-gray-500">Jatuh Tempo</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{formatDate(sewa.endDate)}</p>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {sewa.status === 'aktif' && (
                <button
                  onClick={() => router.push(`/admin/dashboard/sewa/${sewa.id}/edit`)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Sewa
                </button>
              )}
              <button
                onClick={() => router.back()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-700 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-lg">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-50">
                <Wallet className="h-5 w-5 text-indigo-600" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-gray-900">History Pembayaran</h2>
                <p className="text-sm text-gray-500">Riwayat pembayaran sewa dari penyewa ini.</p>
              </div>
            </div>
          </div>

          {pembayaran.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {pembayaran.map((item) => {
                const pStyle = pembayaranStatusStyles[item.status]
                return (
                  <div key={item.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${pStyle.bg} ${pStyle.text}`}>
                          {pStyle.icon}
                          {pembayaranStatusLabels[item.status]}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{item.bulan}</p>
                          <p className="text-xs text-gray-500">{formatDate(item.tanggal)} &middot; {item.metode}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-900 sm:text-right">
                        {formatRupiah(item.jumlah)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Wallet className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Belum ada riwayat pembayaran.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
