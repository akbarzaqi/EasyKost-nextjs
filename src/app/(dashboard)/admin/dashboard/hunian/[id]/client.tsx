'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BedDouble, Wallet, ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { getHunianById, deleteHunian } from '@/lib/api/hunian'
import { getImageUrl } from '@/lib/image'

type Biaya = {
  wifi: number
  sampah: number
  kost: number
}

type Hunian = {
  id_hunian: number
  nama_hunian: string
  tipe_hunian: string
  status_harian: string
  deskripsi_hunian: string
  gambar_hunian: string
  biaya: Biaya | null
}

const statusLabel: Record<string, string> = {
  kosong: 'Kosong',
  full: 'Terisi',
}

const formatPrice = (price: number) => `Rp ${price.toLocaleString('id-ID')}`

export default function HunianDetailClient({ id }: { id: string }) {
  const router = useRouter()
  const [hunian, setHunian] = useState<Hunian | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const result = await getHunianById(id)
      if (result.error || !result.data) {
        setError('Gagal memuat data hunian')
        setLoading(false)
        return
      }
      setHunian(result.data)
      setLoading(false)
    }
    load()
  }, [id])

  const handleDelete = async () => {
    if (!hunian) return
    if (hunian.status_harian === 'full') {
      alert('Hunian yang sedang terisi tidak dapat dihapus!')
      return
    }
    if (!window.confirm('Apakah anda yakin ingin menghapus hunian ini?')) return
    setDeleting(true)
    const result = await deleteHunian(id)
    if (result.error) {
      alert(result.message)
      setDeleting(false)
      return
    }
    router.push('/admin/dashboard/hunian')
  }

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

  if (error || !hunian) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">{error || 'Tidak ada hunian dengan ID tersebut.'}</p>
      </div>
    )
  }

  const statusText = statusLabel[hunian.status_harian] || hunian.status_harian
  const isTerisi = hunian.status_harian === 'full'

  const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
    kosong: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    full: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  }
  const style = statusStyles[hunian.status_harian] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }

  const wifi = hunian.biaya ? Number(hunian.biaya.wifi) : 0
  const sampah = hunian.biaya ? Number(hunian.biaya.sampah) : 0
  const kost = hunian.biaya ? Number(hunian.biaya.kost) : 0
  const total = wifi + sampah + kost

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
        >
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:bg-gray-100 transition-all">
            <ArrowLeft className="h-4 w-4" />
          </span>
          Kembali ke daftar hunian
        </button>

        <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-lg">
          <div className="relative h-72 md:h-96">
            <img
              src={getImageUrl(hunian.gambar_hunian) || '/images/room1.jpg'}
              alt={hunian.nama_hunian}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${style.bg} ${style.text} border ${style.border}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isTerisi ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                  {statusText}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white/90 text-gray-700 backdrop-blur-sm">
                  <BedDouble className="h-3 w-3" />
                  {hunian.tipe_hunian}
                </span>

              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-sm">
                {hunian.nama_hunian}
              </h1>
              <p className="text-sm text-white/80 max-w-xl leading-relaxed">
                {hunian.deskripsi_hunian}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-gray-100">
            <div className="p-6 md:border-r border-b md:border-b-0 border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-50">
                  <Wallet className="h-4 w-4 text-emerald-600" />
                </span>
                <span className="text-sm font-medium text-gray-500">Rincian Harga</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Kost</span>
                  <span className="font-medium text-gray-900">{formatPrice(kost)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">WiFi</span>
                  <span className="font-medium text-gray-900">{formatPrice(wifi)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Sampah</span>
                    <span className="font-medium text-gray-900">{formatPrice(sampah)}</span>
                </div>
                <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total</span>
                  <span className="text-lg font-bold text-emerald-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <div className="p-6 md:border-r border-b md:border-b-0 border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-blue-50">
                  <BedDouble className="h-4 w-4 text-blue-600" />
                </span>
                <span className="text-sm font-medium text-gray-500">Tipe Kamar</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{hunian.tipe_hunian}</p>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center justify-center h-8 w-8 rounded-lg ${style.bg}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${isTerisi ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                </span>
                <span className="text-sm font-medium text-gray-500">Status</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{statusText}</p>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => router.push(`/admin/dashboard/hunian/${id}/edit`)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
              >
                <Pencil className="h-4 w-4" />
                Edit Hunian
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting || hunian.status_harian === 'full'}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-red-600 text-sm font-medium border border-red-200 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? 'Menghapus...' : hunian.status_harian === 'full' ? 'Tidak dapat dihapus (Terisi)' : 'Hapus Hunian'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
