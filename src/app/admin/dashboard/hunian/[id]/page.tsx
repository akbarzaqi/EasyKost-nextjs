'use client'
import React, { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BedDouble, Wallet, ArrowLeft, Pencil } from 'lucide-react'

type Hunian = {
  id: number
  name: string
  total_price: number
  type: string
  status: string
  description: string
  image_url: string
}

const data: Hunian[] = [
  {
    id: 1,
    name: 'Kamar A1',
    total_price: 1000000,
    type: 'Premium Room',
    status: 'Terisi',
    description: 'Kamar dengan fasilitas lengkap dan nyaman untuk hunian jangka panjang.',
    image_url: '/images/room1.jpg',
  },
  {
    id: 2,
    name: 'Kamar B2',
    total_price: 750000,
    type: 'Standard Room',
    status: 'Kosong',
    description: 'Kamar dengan fasilitas standar yang cocok untuk hunian sementara.',
    image_url: '/images/room1.jpg',
  },
  {
    id: 3,
    name: 'Kamar C3',
    total_price: 500000,
    type: 'Economy Room',
    status: 'Terisi',
    description: 'Kamar dengan fasilitas dasar yang cocok untuk hunian dengan budget terbatas.',
    image_url: '/images/room1.jpg',
  },
]

const fetchHunianData = async (): Promise<Hunian[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, 1000)
  })
}

const formatPrice = (price: number) => `Rp ${price.toLocaleString('id-ID')}`

export default function HunianDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [hunian, setHunian] = useState<Hunian | null>(null)
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const load = async () => {
      const all = await fetchHunianData()
      const found = all.find((h) => h.id === Number(id)) || null
      setHunian(found)
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

  if (!hunian) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Tidak ada hunian dengan ID tersebut.</p>
      </div>
    )
  }

  const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
    Terisi: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    Kosong: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  }
  const style = statusStyles[hunian.status] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }

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
            <img src={hunian.image_url} alt={hunian.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${style.bg} ${style.text} border ${style.border}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${style.text === 'text-rose-700' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                  {hunian.status}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white/90 text-gray-700 backdrop-blur-sm">
                  <BedDouble className="h-3 w-3" />
                  {hunian.type}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white/90 text-gray-700 backdrop-blur-sm">
                  Lantai 1
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-sm">
                {hunian.name}
              </h1>
              <p className="text-sm text-white/80 max-w-xl leading-relaxed">
                {hunian.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-gray-100">
            <div className="p-6 md:border-r border-b md:border-b-0 border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-50">
                  <Wallet className="h-4 w-4 text-emerald-600" />
                </span>
                <span className="text-sm font-medium text-gray-500">Harga / Bulan</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600">
                {formatPrice(hunian.total_price)}
              </p>
            </div>

            <div className="p-6 md:border-r border-b md:border-b-0 border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-blue-50">
                  <BedDouble className="h-4 w-4 text-blue-600" />
                </span>
                <span className="text-sm font-medium text-gray-500">Tipe Kamar</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{hunian.type}</p>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center justify-center h-8 w-8 rounded-lg ${style.bg}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${style.text === 'text-rose-700' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                </span>
                <span className="text-sm font-medium text-gray-500">Status</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{hunian.status}</p>
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
              <button className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-700 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
                Hapus Hunian
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
