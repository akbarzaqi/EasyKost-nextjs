'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, FileText, Wallet, Calendar, Building2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { getAllSewa } from '@/lib/api/sewa'
import { getAllTagihan, generateTagihan } from '@/lib/api/tagihan'

const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`

export default function TambahTagihanClient() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [sewaList, setSewaList] = useState<any[]>([])
  const [existingTagihanIds, setExistingTagihanIds] = useState<Set<number>>(new Set())
  const [airValues, setAirValues] = useState<Record<number, number>>({})
  const [bulan, setBulan] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const now = new Date()
    setBulan(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const [sewaRes, tagihanRes] = await Promise.all([getAllSewa(), getAllTagihan()])

      if (!sewaRes.error && sewaRes.data) {
        const aktif = sewaRes.data.filter((s: any) => s.status === 'aktif')
        setSewaList(aktif)
      }

      if (!tagihanRes.error && tagihanRes.data) {
        const now = new Date()
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
        const ids = new Set<number>()
        tagihanRes.data.forEach((t: any) => {
          const tagihanMonth = t.tgl_tagihan?.substring(0, 7)
          if (tagihanMonth === currentMonth) {
            ids.add(t.id_sewa)
          }
        })
        setExistingTagihanIds(ids)
      }

      setLoading(false)
    }
    fetchData()
  }, [])

  const handleAirChange = (idSewa: number, value: string) => {
    setAirValues(prev => ({ ...prev, [idSewa]: Number(value) || 0 }))
  }

  const needsTagihan = (sewa: any) => !existingTagihanIds.has(sewa.id_sewa)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    const pending = sewaList.filter(needsTagihan)
    if (pending.length === 0) {
      newErrors.submit = 'Semua sewa sudah memiliki tagihan bulan ini'
    }
    if (!bulan) newErrors.bulan = 'Bulan wajib diisi'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const pending = sewaList.filter(needsTagihan)
    const data = pending.map((sewa: any) => ({
      id_sewa: sewa.id_sewa,
      air: airValues[sewa.id_sewa] || 0,
    }))

    setSubmitting(true)
    const response = await generateTagihan(bulan, data)
    setSubmitting(false)

    if (!response.error) {
      router.push('/admin/dashboard/tagihan')
    } else {
      setErrors({ submit: response.message || 'Gagal membuat tagihan' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

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
          Kembali
        </button>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tambah Tagihan</h1>
          <p className="text-sm text-gray-500 mt-1">Buat tagihan untuk penghuni yang belum memiliki tagihan bulan ini.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    Sewa Aktif
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                      <span className="font-semibold text-emerald-600">{sewaList.filter(s => !needsTagihan(s)).length}</span> sudah ada tagihan
                      {' / '}
                      <span className="font-semibold text-amber-600">{sewaList.filter(s => needsTagihan(s)).length}</span> perlu tagihan
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Bulan</label>
                      <Input
                        type="month"
                        value={bulan}
                        onChange={(e) => setBulan(e.target.value)}
                        className="h-9 w-40"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {sewaList.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">Tidak ada sewa aktif.</p>
                ) : (
                  <div className="space-y-3">
                    {sewaList.map((sewa: any) => {
                      const sudahAda = !needsTagihan(sewa)
                      const user = sewa.user || {}
                      const hunian = sewa.hunian || {}
                      const biaya = hunian.biaya || {}
                      const namaPenghuni = user.nama || user.nama_lengkap || '-'
                      const kamar = hunian.nama_hunian || '-'
                      const biayaKost = Number(biaya.kost) || 0
                      const biayaWifi = Number(biaya.wifi) || 0
                      const biayaSampah = Number(biaya.sampah) || 0
                      const totalBiaya = biayaKost + biayaWifi + biayaSampah

                      return (
                        <div
                          key={sewa.id_sewa}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            sudahAda
                              ? 'border-emerald-200 bg-emerald-50/50'
                              : 'border-amber-200 bg-amber-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900">{namaPenghuni}</span>
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{kamar}</span>
                                {sudahAda ? (
                                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Sudah Ada Tagihan
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                                    <AlertCircle className="h-3 w-3" />
                                    Perlu Tagihan
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                Jatuh tempo: <span className="font-medium text-gray-700">{sewa.tgl_jatuhtempo ? new Date(sewa.tgl_jatuhtempo).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>
                              </div>
                              {!sudahAda && (
                                <div className="mt-2 text-sm text-gray-600">
                                  Biaya: {formatRupiah(totalBiaya)}/bl + Air
                                </div>
                              )}
                            </div>
                            {!sudahAda && (
                              <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600">Air</label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={airValues[sewa.id_sewa] || ''}
                                  onChange={(e) => handleAirChange(sewa.id_sewa, e.target.value)}
                                  className="h-9 w-24"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {errors.submit && (
              <p className="text-sm text-rose-600 text-center">{errors.submit}</p>
            )}

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="h-10"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={submitting || sewaList.filter(needsTagihan).length === 0}
                className="h-10 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Membuat...</>
                ) : (
                  <>Buat Tagihan ({sewaList.filter(needsTagihan).length})</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
