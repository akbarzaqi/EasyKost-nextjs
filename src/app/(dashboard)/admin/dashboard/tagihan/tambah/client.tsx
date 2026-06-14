'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, FileText, Wallet, Calendar, Building2, Plus } from 'lucide-react'

type HunianSewa = {
  id: number
  name: string
  penghuni: string
  harga_kost: number
  harga_wifi: number
  harga_air: number
  total_price: number
  type: string
}

const occupiedUnits: HunianSewa[] = [
  { id: 1, name: 'Kamar A1', penghuni: 'Akbar Zaki', harga_kost: 800000, harga_wifi: 100000, harga_air: 100000, total_price: 1000000, type: 'Premium Room' },
  { id: 3, name: 'Kamar C3', penghuni: 'Budi Santoso', harga_kost: 300000, harga_wifi: 100000, harga_air: 100000, total_price: 500000, type: 'Economy Room' },
]

const existingInvoices = ['INV-001', 'INV-002', 'INV-003']

const generateInvoiceNumber = () => {
  const maxNum = existingInvoices.reduce((max, inv) => {
    const num = parseInt(inv.replace('INV-', ''), 10)
    return isNaN(num) ? max : Math.max(max, num)
  }, 0)
  const nextNum = String(maxNum + 1).padStart(3, '0')
  return `INV-${nextNum}`
}

const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`

export default function TambahTagihanClient() {
  const router = useRouter()

  const [selectedUnit, setSelectedUnit] = useState<HunianSewa | null>(null)
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [namaPenghuni, setNamaPenghuni] = useState('')
  const [hargaAir, setHargaAir] = useState(0)
  const [jatuhTempo, setJatuhTempo] = useState('')
  const [status, setStatus] = useState<'belum_bayar' | 'lunas' | 'verifikasi'>('belum_bayar')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setInvoiceNumber(generateInvoiceNumber())
  }, [])

  const selectUnit = (unit: HunianSewa) => {
    setSelectedUnit(unit)
    setNamaPenghuni(unit.penghuni)
    setHargaAir(0)
    setErrors({})
  }

  const staticTotal = selectedUnit
    ? selectedUnit.harga_kost + selectedUnit.harga_wifi + selectedUnit.harga_air
    : 0
  const total = staticTotal + hargaAir

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!selectedUnit) newErrors.unit = 'Pilih unit hunian terlebih dahulu'
    if (!invoiceNumber.trim()) newErrors.invoiceNumber = 'Nomor invoice wajib diisi'
    if (!namaPenghuni.trim()) newErrors.namaPenghuni = 'Nama penghuni wajib diisi'
    if (total <= 0) newErrors.rincian = 'Total rincian harus lebih dari 0'
    if (!jatuhTempo) newErrors.jatuhTempo = 'Jatuh tempo wajib diisi'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    console.log('Tagihan baru:', {
      invoiceNumber,
      nama_penghuni: namaPenghuni,
      kamar: selectedUnit?.name,
      rincian: [
        { name: 'Kost', value: selectedUnit!.harga_kost },
        { name: 'WiFi', value: selectedUnit!.harga_wifi },
        { name: 'Sampah', value: selectedUnit!.harga_air },
        { name: 'Air', value: hargaAir },
      ],
      total,
      jatuh_tempo: jatuhTempo,
      status,
    })
    router.push('/admin/dashboard/tagihan')
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tambah Tagihan</h1>
          <p className="text-sm text-gray-500 mt-1">Buat tagihan baru berdasarkan data sewa yang sudah ada.</p>
        </div>

        {/* Pilih Unit Sewa */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-400" />
            Pilih Kamar Terisi
          </h2>
          {errors.unit && <p className="text-xs text-rose-500 mb-2">{errors.unit}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {occupiedUnits.map((unit) => {
              const isSelected = selectedUnit?.id === unit.id
              return (
                <button
                  key={unit.id}
                  type="button"
                  onClick={() => selectUnit(unit)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-gray-900 bg-gray-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{unit.name}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{unit.type}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Biaya per bulan</span>
                    <span className="font-semibold text-emerald-600">{formatRupiah(unit.total_price)}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {selectedUnit && (
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
                        <Label className="text-sm font-medium text-gray-700">
                          Kamar
                        </Label>
                        <div className="h-10 flex items-center px-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200">
                          {selectedUnit.name}
                        </div>
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
                    <div className="flex items-center gap-3">
                      <span className="w-24 text-sm font-medium text-gray-700">Kost</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rp</span>
                        <div className="h-10 pl-10 flex items-center text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200">
                          {selectedUnit.harga_kost.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-24 text-sm font-medium text-gray-700">WiFi</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rp</span>
                        <div className="h-10 pl-10 flex items-center text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200">
                          {selectedUnit.harga_wifi.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-24 text-sm font-medium text-gray-700">Sampah</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rp</span>
                        <div className="h-10 pl-10 flex items-center text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200">
                          {selectedUnit.harga_air.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-3">
                        <span className="w-24 text-sm font-medium text-gray-700">Air</span>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rp</span>
                          <Input
                            type="number"
                            value={hargaAir || ''}
                            onChange={(e) => setHargaAir(Number(e.target.value) || 0)}
                            className="h-10 pl-10"
                          />
                        </div>
                      </div>
                    </div>
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
                      <span className="font-medium text-gray-900">{selectedUnit.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Status</span>
                      <span className={`font-medium ${status === 'lunas' ? 'text-emerald-600' : status === 'verifikasi' ? 'text-amber-600' : 'text-rose-600'}`}>
                        {status === 'lunas' ? 'Lunas' : status === 'verifikasi' ? 'Verifikasi' : 'Belum Bayar'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Rincian</span>
                      <span className="font-medium text-gray-900">4 item</span>
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
                      <Plus className="h-4 w-4" />
                      Buat Tagihan
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
        )}
      </div>
    </div>
  )
}
