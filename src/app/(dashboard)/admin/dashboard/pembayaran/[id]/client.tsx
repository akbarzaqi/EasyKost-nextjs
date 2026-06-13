'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, CheckCircle2, XCircle, FileImage } from 'lucide-react'

type Pembayaran = {
  id: number
  nama: string
  kamar: string
  invoice: string
  total: number
  cover_image_url: string
}

const data: Pembayaran[] = [
  { id: 1, nama: 'John Doe', kamar: 'A101', invoice: 'INV-001', total: 1500000, cover_image_url: 'https://kimi-web-img.moonshot.cn/img/upload.wikimedia.org/af3236d32d89bc8bfca86c80aa9f7e2ba2dbe654.jpg' },
  { id: 2, nama: 'Jane Smith', kamar: 'B202', invoice: 'INV-002', total: 2000000, cover_image_url: 'https://kimi-web-img.moonshot.cn/img/upload.wikimedia.org/af3236d32d89bc8bfca86c80aa9f7e2ba2dbe654.jpg' },
  { id: 3, nama: 'Michael Johnson', kamar: 'C303', invoice: 'INV-003', total: 2500000, cover_image_url: 'https://kimi-web-img.moonshot.cn/img/upload.wikimedia.org/af3236d32d89bc8bfca86c80aa9f7e2ba2dbe654.jpg' },
  { id: 4, nama: 'Emily Davis', kamar: 'D404', invoice: 'INV-004', total: 3000000, cover_image_url: 'https://kimi-web-img.moonshot.cn/img/upload.wikimedia.org/af3236d32d89bc8bfca86c80aa9f7e2ba2dbe654.jpg' },
]

const fetchData = async (): Promise<Pembayaran[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 500)
  })
}

export default function LihatBuktiClient({ id }: { id: string }) {
  const router = useRouter()
  const [pembayaran, setPembayaran] = useState<Pembayaran | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const all = await fetchData()
      const found = all.find((p) => p.id === Number(id)) || null
      setPembayaran(found)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Memuat bukti pembayaran...</p>
        </div>
      </div>
    )
  }

  if (!pembayaran) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Bukti pembayaran tidak ditemukan.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
        >
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:bg-gray-100 transition-all">
            <ArrowLeft className="h-4 w-4" />
          </span>
          Kembali ke antrean verifikasi
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FileImage className="h-5 w-5 text-gray-400" />
                  <h2 className="text-sm font-semibold text-gray-900">Bukti Pembayaran</h2>
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Unduh
                </Button>
              </div>
              <div className="bg-gray-100 flex items-center justify-center p-4">
                <img
                  src={pembayaran.cover_image_url}
                  alt="Bukti Pembayaran"
                  className="w-full max-h-[500px] object-contain rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl bg-white border border-gray-200 shadow-lg p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Detail Pembayaran</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Nama</span>
                  <span className="font-medium text-gray-900">{pembayaran.nama}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Kamar</span>
                  <span className="font-medium text-gray-900">{pembayaran.kamar}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Invoice</span>
                  <span className="font-mono font-semibold text-gray-900">#{pembayaran.invoice}</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Total</span>
                  <span className="text-xl font-bold text-emerald-600">
                    Rp {pembayaran.total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200 shadow-lg p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Aksi Verifikasi</h2>
              <div className="space-y-3">
                <button className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  Verifikasi Pembayaran
                </button>
                <button className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-700 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
                  <XCircle className="h-4 w-4" />
                  Tolak Pembayaran
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
