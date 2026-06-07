'use client'
import React, { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, FileText, Wallet, Calendar } from 'lucide-react'

type Tagihan = {
  id: string
  invoiceNumber: string
  nama_penghuni: string
  kamar: string
  rincian: { name: string; value: number }[]
  total: number
  jatuh_tempo: string
  status: 'belum_bayar' | 'lunas' | 'verifikasi'
}

const tagihanData: Tagihan[] = [
  { id: '1', invoiceNumber: 'INV-001', nama_penghuni: 'Akbar Zaki', kamar: 'Kamar 101', rincian: [{ name: 'Kost', value: 350000 }, { name: 'Listrik', value: 100000 }, { name: 'Air', value: 50000 }], total: 500000, jatuh_tempo: '2024-07-10', status: 'belum_bayar' },
  { id: '2', invoiceNumber: 'INV-002', nama_penghuni: 'Siti Aminah', kamar: 'Kamar 102', rincian: [{ name: 'Kost', value: 350000 }, { name: 'Listrik', value: 100000 }, { name: 'Air', value: 50000 }], total: 500000, jatuh_tempo: '2024-07-10', status: 'lunas' },
  { id: '3', invoiceNumber: 'INV-003', nama_penghuni: 'Budi Santoso', kamar: 'Kamar 103', rincian: [{ name: 'Kost', value: 350000 }, { name: 'Listrik', value: 100000 }, { name: 'Air', value: 50000 }], total: 500000, jatuh_tempo: '2024-07-10', status: 'verifikasi' },
]

const fetchTagihanData = async (): Promise<Tagihan[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(tagihanData), 1000)
  })
}

const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`

const statusLabels: Record<string, string> = {
  lunas: 'Lunas',
  belum_bayar: 'Belum Bayar',
  verifikasi: 'Verifikasi',
}

const statusStyles: Record<string, string> = {
  lunas: 'text-emerald-600',
  belum_bayar: 'text-rose-600',
  verifikasi: 'text-amber-600',
}

export default function EditTagihan({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [namaPenghuni, setNamaPenghuni] = useState('')
  const [kamar, setKamar] = useState('')
  const [rincian, setRincian] = useState<{ name: string; value: number }[]>([])
  const [jatuhTempo, setJatuhTempo] = useState('')
  const [status, setStatus] = useState<'belum_bayar' | 'lunas' | 'verifikasi'>('belum_bayar')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const load = async () => {
      const all = await fetchTagihanData()
      const found = all.find((t) => t.id === id)
      if (found) {
        setInvoiceNumber(found.invoiceNumber)
        setNamaPenghuni(found.nama_penghuni)
        setKamar(found.kamar)
        setRincian(found.rincian.map(r => ({ ...r })))
        setJatuhTempo(found.jatuh_tempo)
        setStatus(found.status)
      } else {
        setNotFound(true)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const updateRincianValue = (index: number, value: string) => {
    const updated = [...rincian]
    updated[index].value = Number(value) || 0
    setRincian(updated)
  }

  const total = rincian.reduce((sum, item) => sum + item.value, 0)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!invoiceNumber.trim()) newErrors.invoiceNumber = 'Nomor invoice wajib diisi'
    if (!namaPenghuni.trim()) newErrors.namaPenghuni = 'Nama penghuni wajib diisi'
    if (!kamar.trim()) newErrors.kamar = 'Nomor kamar wajib diisi'
    if (total <= 0) newErrors.rincian = 'Total rincian harus lebih dari 0'
    if (!jatuhTempo) newErrors.jatuhTempo = 'Jatuh tempo wajib diisi'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const updatedTagihan = {
      id,
      invoiceNumber,
      nama_penghuni: namaPenghuni,
      kamar,
      rincian,
      total,
      jatuh_tempo: jatuhTempo,
      status,
    }
    console.log('Data tagihan updated:', updatedTagihan)
    router.push('/admin/dashboard/tagihan')
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

  if (notFound) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Data tagihan tidak ditemukan.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
        >
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:bg-gray-100 transition-all">
            <ArrowLeft className="h-4 w-4" />
          </span>
          Kembali
        </button>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Tagihan</h1>
          <p className="text-sm text-gray-500 mt-1">Perbarui informasi tagihan di bawah ini.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-400" />
                    Informasi Tagihan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="invoiceNumber" className="text-sm font-medium text-gray-700">
                        No. Invoice <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="invoiceNumber"
                        type="text"
                        placeholder="INV-001"
                        value={invoiceNumber}
                        onChange={(e) => { setInvoiceNumber(e.target.value); setErrors(prev => ({ ...prev, invoiceNumber: '' })) }}
                        className={`h-10 ${errors.invoiceNumber ? 'border-rose-500 focus-visible:ring-rose-500/50' : ''}`}
                      />
                      {errors.invoiceNumber && <p className="text-xs text-rose-500">{errors.invoiceNumber}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                        Status
                      </Label>
                      <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'belum_bayar' | 'lunas' | 'verifikasi')}
                        className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
                      >
                        <option value="belum_bayar">Belum Bayar</option>
                        <option value="verifikasi">Verifikasi</option>
                        <option value="lunas">Lunas</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nama_penghuni" className="text-sm font-medium text-gray-700">
                        Nama Penghuni <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="nama_penghuni"
                        type="text"
                        placeholder="Contoh: Akbar Zaki"
                        value={namaPenghuni}
                        onChange={(e) => { setNamaPenghuni(e.target.value); setErrors(prev => ({ ...prev, namaPenghuni: '' })) }}
                        className={`h-10 ${errors.namaPenghuni ? 'border-rose-500 focus-visible:ring-rose-500/50' : ''}`}
                      />
                      {errors.namaPenghuni && <p className="text-xs text-rose-500">{errors.namaPenghuni}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="kamar" className="text-sm font-medium text-gray-700">
                        Kamar <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="kamar"
                        type="text"
                        placeholder="Contoh: Kamar 101"
                        value={kamar}
                        onChange={(e) => { setKamar(e.target.value); setErrors(prev => ({ ...prev, kamar: '' })) }}
                        className={`h-10 ${errors.kamar ? 'border-rose-500 focus-visible:ring-rose-500/50' : ''}`}
                      />
                      {errors.kamar && <p className="text-xs text-rose-500">{errors.kamar}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-gray-400" />
                    Rincian Biaya
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {rincian.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="w-24 text-sm font-medium text-gray-700">{item.name}</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rp</span>
                        <Input
                          type="number"
                          value={item.value || ''}
                          onChange={(e) => updateRincianValue(index, e.target.value)}
                          className="h-10 pl-10"
                        />
                      </div>
                    </div>
                  ))}
                  {errors.rincian && <p className="text-xs text-rose-500">{errors.rincian}</p>}
                </CardContent>
              </Card>

              <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    Jatuh Tempo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="jatuh_tempo" className="text-sm font-medium text-gray-700">
                      Tanggal Jatuh Tempo <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="jatuh_tempo"
                      type="date"
                      value={jatuhTempo}
                      onChange={(e) => { setJatuhTempo(e.target.value); setErrors(prev => ({ ...prev, jatuhTempo: '' })) }}
                      className={`h-10 ${errors.jatuhTempo ? 'border-rose-500 focus-visible:ring-rose-500/50' : ''}`}
                    />
                    {errors.jatuhTempo && <p className="text-xs text-rose-500">{errors.jatuhTempo}</p>}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-5">
              <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-400" />
                    Ringkasan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Invoice</span>
                    <span className="font-mono font-semibold text-gray-900">{invoiceNumber || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Penghuni</span>
                    <span className="font-medium text-gray-900">{namaPenghuni || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Kamar</span>
                    <span className="font-medium text-gray-900">{kamar || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className={`font-medium ${statusStyles[status]}`}>{statusLabels[status]}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Rincian</span>
                    <span className="font-medium text-gray-900">{rincian.length} item</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Jatuh Tempo</span>
                    <span className="font-medium text-gray-900">{jatuhTempo || '-'}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Total</span>
                    <span className="text-lg font-bold text-emerald-600">
                      {total > 0 ? formatRupiah(total) : '-'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
                <CardContent className="pt-6 space-y-3">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                  >
                    Simpan Perubahan
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-700 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Batal
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
