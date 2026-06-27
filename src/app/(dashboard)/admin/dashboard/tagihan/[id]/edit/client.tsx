'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, FileText, Wallet, Calendar, Loader2 } from 'lucide-react'
import { getTagihanById, updateTagihan } from '@/lib/api/tagihan'

const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`

export default function EditTagihanClient({ id }: { id: string }) {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [tagihan, setTagihan] = useState<any>(null)

  const [hargaAir, setHargaAir] = useState(0)
  const [hargaWifi, setHargaWifi] = useState(0)
  const [jatuhTempo, setJatuhTempo] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const load = async () => {
      const response = await getTagihanById(Number(id))
      if (!response.error && response.data) {
        const item = response.data
        setTagihan(item)
        setHargaAir(Number(item.air) || 0)
        setHargaWifi(Number(item.wifi) || 0)
        setJatuhTempo(item.tgl_jatuhtempo || '')
      } else {
        setNotFound(true)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const biaya = tagihan?.sewa?.hunian?.biaya
  const biayaKost = biaya ? Number(biaya.kost) : 0
  const biayaSampah = biaya ? Number(biaya.sampah) : 0
  const total = biayaKost + hargaWifi + biayaSampah + hargaAir

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (total <= 0) newErrors.rincian = 'Total rincian harus lebih dari 0'
    if (!jatuhTempo) newErrors.jatuhTempo = 'Jatuh tempo wajib diisi'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    const response = await updateTagihan(Number(id), {
      air: hargaAir,
      wifi: hargaWifi,
      tgl_jatuhtempo: jatuhTempo,
    })
    setSubmitting(false)

    if (!response.error) {
      router.push('/admin/dashboard/tagihan')
    } else {
      setErrors({ submit: response.message || 'Gagal menyimpan' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (notFound || !tagihan) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Data tagihan tidak ditemukan.</p>
      </div>
    )
  }

  const namaPenghuni = tagihan.sewa?.user?.nama || tagihan.sewa?.user?.nama_lengkap || '-'
  const kamar = tagihan.sewa?.hunian?.nama_hunian || '-'

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
                      <Label className="text-sm font-medium text-gray-700">ID Tagihan</Label>
                      <div className="h-10 flex items-center px-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200">
                        #{tagihan.id_tagihan}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Nama Penghuni</Label>
                      <div className="h-10 flex items-center px-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200">
                        {namaPenghuni}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Kamar</Label>
                      <div className="h-10 flex items-center px-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200">
                        {kamar}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Status</Label>
                      <div className="h-10 flex items-center px-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200">
                        {tagihan.status === 'paid' ? 'Lunas' : tagihan.status === 'verif' ? 'Verifikasi' : 'Belum Bayar'}
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
                        {biayaKost.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-24 text-sm font-medium text-gray-700">WiFi</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rp</span>
                      <Input
                        type="number"
                        value={hargaWifi || ''}
                        onChange={(e) => setHargaWifi(Number(e.target.value) || 0)}
                        className="h-10 pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-24 text-sm font-medium text-gray-700">Sampah</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rp</span>
                      <div className="h-10 pl-10 flex items-center text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200">
                        {biayaSampah.toLocaleString('id-ID')}
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
                    <span className="text-gray-500">ID Tagihan</span>
                    <span className="font-mono font-semibold text-gray-900">#{tagihan.id_tagihan}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Penghuni</span>
                    <span className="font-medium text-gray-900">{namaPenghuni}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Kamar</span>
                    <span className="font-medium text-gray-900">{kamar}</span>
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

              {errors.submit && (
                <p className="text-sm text-rose-600 text-center">{errors.submit}</p>
              )}

              <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
                <CardContent className="pt-6 space-y-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</>
                    ) : (
                      'Simpan Perubahan'
                    )}
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
