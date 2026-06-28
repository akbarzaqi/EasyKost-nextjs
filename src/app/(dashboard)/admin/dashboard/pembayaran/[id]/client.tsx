'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, CheckCircle2, XCircle, FileImage, Loader2 } from 'lucide-react'
import { getPembayaranByInvoice, verifikasiPembayaran } from '@/lib/api/pembayaran'
import { getImageUrl } from '@/lib/image'

const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const statusLabel: Record<string, { label: string; bg: string }> = {
  paid: { label: 'Lunas', bg: 'bg-emerald-50 text-emerald-700' },
  verif: { label: 'Verifikasi', bg: 'bg-blue-50 text-blue-700' },
  notpaid: { label: 'Ditolak', bg: 'bg-rose-50 text-rose-700' },
}

const statusDot: Record<string, string> = {
  paid: 'bg-emerald-500',
  verif: 'bg-blue-500',
  notpaid: 'bg-rose-500',
}

export default function LihatBuktiClient({ id }: { id: string }) {
  const router = useRouter()
  const [pembayaran, setPembayaran] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const response = await getPembayaranByInvoice(id)
    if (!response.error && response.data) {
      setPembayaran(response.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [id])

  const handleVerifikasi = async (status: 'paid' | 'notpaid') => {
    if (!pembayaran) return
    setActionLoading(true)
    await verifikasiPembayaran(pembayaran.id_pembayaran, status)
    setActionLoading(false)
    load()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
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

  const user = pembayaran.transaksi?.tagihan?.sewa?.user
  const hunian = pembayaran.transaksi?.tagihan?.sewa?.hunian
  const totalBayar = Number(pembayaran.transaksi?.total_bayar) || 0
  const cfg = statusLabel[pembayaran.status] || statusLabel.notpaid
  const dot = statusDot[pembayaran.status] || statusDot.notpaid

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
                <a
                  href={getImageUrl(pembayaran.bukti_trf) || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <Button variant="outline" size="sm" className="h-8 text-xs cursor-pointer">
                    <Download className="h-3 w-3 mr-1" />
                    Unduh
                  </Button>
                </a>
              </div>
              <div className="bg-gray-100 flex items-center justify-center p-4">
                <img
                  src={getImageUrl(pembayaran.bukti_trf) || ''}
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
                  <span className="font-medium text-gray-900">{user?.nama || '-'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Kamar</span>
                  <span className="font-medium text-gray-900">{hunian?.nama_hunian || '-'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Pengirim</span>
                  <span className="font-medium text-gray-900">{pembayaran.nama_pengirim || '-'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Invoice</span>
                  <span className="font-mono font-semibold text-gray-900">{pembayaran.invoice}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Tgl Bayar</span>
                  <span className="font-medium text-gray-900">{formatDate(pembayaran.tgl_bayar)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Jatuh Tempo</span>
                  <span className="font-medium text-gray-900">{formatDate(pembayaran.tgl_jatuhtempo)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                    {cfg.label}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Total</span>
                  <span className="text-xl font-bold text-emerald-600">
                    {formatRupiah(totalBayar)}
                  </span>
                </div>
              </div>
            </div>

            {pembayaran.status === 'verif' && (
              <div className="rounded-2xl bg-white border border-gray-200 shadow-lg p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Aksi Verifikasi</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => handleVerifikasi('paid')}
                    disabled={actionLoading}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    Verifikasi Pembayaran
                  </button>
                  <button
                    onClick={() => handleVerifikasi('notpaid')}
                    disabled={actionLoading}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-700 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <XCircle className="h-4 w-4" />
                    Tolak Pembayaran
                  </button>
                </div>
              </div>
            )}
            {pembayaran.status === 'paid' && (
              <div className="rounded-2xl bg-white border border-gray-200 shadow-lg p-5">
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="p-3 bg-emerald-50 rounded-full">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="text-sm font-semibold text-emerald-700">Pembayaran telah diverifikasi</p>
                </div>
              </div>
            )}
            {pembayaran.status === 'notpaid' && (
              <div className="rounded-2xl bg-white border border-gray-200 shadow-lg p-5">
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="p-3 bg-rose-50 rounded-full">
                    <XCircle className="h-8 w-8 text-rose-600" />
                  </div>
                  <p className="text-sm font-semibold text-rose-700">Pembayaran ditolak</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
