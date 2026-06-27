'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, User, Home, Calendar, Clock, FileText, Pencil, Wallet, CheckCircle2, XCircle, AlertCircle, Loader2, Phone, Mail, MapPin, Building2, Check, X, Briefcase, Receipt, Eye } from 'lucide-react'
import { getSewaById, updateSewa } from '@/lib/api/sewa'
import { getAllTagihan } from '@/lib/api/tagihan'

const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)

type SewaDetail = {
    id_sewa: number
    id_users: number
    id_hunian: number
    tgl_jatuhtempo: string
    status: string
    created_at: string
    user: {
        id_users: number
        nama: string
        email: string
        no_hp: string
        pekerjaan: string
        provinsi: string
        kabupaten: string
        kecamatan: string
        alamat: string
        foto: string | null
    }
    hunian: {
        id_hunian: number
        nama_hunian: string
        tipe_hunian: string
        status_harian: string
        gambar_hunian: string
        deskripsi_hunian: string
    }
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
    aktif: { label: 'Aktif', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    nonaktif: { label: 'Berakhir', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-500' },
    pending: { label: 'Menunggu', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
}

const tagihanStatus: Record<string, { label: string; bg: string; text: string }> = {
    notpaid: { label: 'Belum Bayar', bg: 'bg-red-50', text: 'text-red-700' },
    verif: { label: 'Verifikasi', bg: 'bg-amber-50', text: 'text-amber-700' },
    paid: { label: 'Lunas', bg: 'bg-emerald-50', text: 'text-emerald-700' },
}

const hitungTotal = (t: any) => {
    const biaya = t.sewa?.hunian?.biaya
    return (biaya ? Number(biaya.kost) + Number(biaya.wifi) + Number(biaya.sampah) : 0) + (Number(t.air) || 0)
}

export default function SewaDetailClient({ id }: { id: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [sewa, setSewa] = useState<SewaDetail | null>(null)
    const [tagihanList, setTagihanList] = useState<any[]>([])

    const fetchData = async () => {
        setLoading(true)
        const [sewaRes, tagihanRes] = await Promise.all([
            getSewaById(parseInt(id)),
            getAllTagihan(),
        ])
        if (!sewaRes.error && sewaRes.data) {
            setSewa(sewaRes.data)
            const filtered = (tagihanRes.data || []).filter(
                (t: any) => t.id_sewa === sewaRes.data.id_sewa
            )
            setTagihanList(filtered)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [id])

    const handleAction = async (status: string) => {
        setActionLoading(status)
        const response = await updateSewa(parseInt(id), { status })
        setActionLoading(null)
        if (!response.error) {
            fetchData()
        } else {
            alert(response.message)
        }
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

    if (!sewa) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-gray-600 font-medium">Data sewa tidak ditemukan.</p>
                    <button
                        onClick={() => router.push('/admin/dashboard/sewa')}
                        className="mt-4 text-sm text-gray-500 hover:text-gray-900 underline"
                    >
                        Kembali ke daftar sewa
                    </button>
                </div>
            </div>
        )
    }

    const style = statusConfig[sewa.status] || statusConfig.aktif
    const user = sewa.user
    const hunian = sewa.hunian

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
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

                {/* Header Card */}
                <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">
                    <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <span className="text-4xl font-bold text-white">{user.nama.charAt(0)}</span>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${style.bg} ${style.text} border ${style.border}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                                    {style.label}
                                </span>
                                {sewa.status === 'pending' && (
                                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                        <Clock className="h-3 w-3" />
                                        Perlu Verifikasi
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl font-bold text-white drop-shadow-sm">{user.nama}</h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 border-t border-gray-100">
                        <div className="p-6 md:border-r border-b md:border-b-0 border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-50">
                                    <Home className="h-4 w-4 text-indigo-600" />
                                </span>
                                <span className="text-sm font-medium text-gray-500">Kamar</span>
                            </div>
                            <p className="text-xl font-bold text-gray-900">{hunian.nama_hunian}</p>
                            <p className="text-sm text-gray-400">{hunian.tipe_hunian}</p>
                        </div>
                        <div className="p-6 md:border-r border-b md:border-b-0 border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-50">
                                    <Calendar className="h-4 w-4 text-emerald-600" />
                                </span>
                                <span className="text-sm font-medium text-gray-500">Tanggal Request</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">{formatDate(sewa.created_at)}</p>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-rose-50">
                                    <Clock className="h-4 w-4 text-rose-600" />
                                </span>
                                <span className="text-sm font-medium text-gray-500">Jatuh Tempo</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">{formatDate(sewa.tgl_jatuhtempo)}</p>
                        </div>
                    </div>
                </div>

                {/* Data Penyewa */}
                <div className="mt-6 rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-50">
                                <User className="h-5 w-5 text-indigo-600" />
                            </span>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Data Penyewa</h2>
                                <p className="text-sm text-gray-500">Informasi lengkap penyewa kamar.</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Nama</p>
                                    <p className="text-sm font-medium text-gray-900">{user.nama}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Email</p>
                                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">No. HP</p>
                                    <p className="text-sm font-medium text-gray-900">{user.no_hp || '-'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <Briefcase className="h-5 w-5 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Pekerjaan</p>
                                    <p className="text-sm font-medium text-gray-900">{user.pekerjaan || '-'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex items-start gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Alamat</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {[user.alamat, user.kecamatan, user.kabupaten, user.provinsi]
                                        .filter(Boolean)
                                        .join(', ') || '-'}
                                </p>
                            </div>
                        </div>
                        {user.foto && (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <p className="text-xs text-gray-400 mb-2">Foto KTP</p>
                                <div className="flex items-start gap-4">
                                    <img src={user.foto} alt="KTP" className="max-w-xs rounded-lg border border-gray-200" />
                                    <a
                                        href={user.foto}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                        Lihat KTP
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Riwayat Tagihan */}
                <div className="mt-6 rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-50">
                                <Receipt className="h-5 w-5 text-indigo-600" />
                            </span>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Riwayat Tagihan</h2>
                                <p className="text-sm text-gray-500">Daftar tagihan dan status pembayaran.</p>
                            </div>
                        </div>
                    </div>
                    {tagihanList.length === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-400">Belum ada tagihan.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="text-left px-5 py-3 font-medium text-gray-500">Periode</th>
                                        <th className="text-left px-5 py-3 font-medium text-gray-500">Tagihan</th>
                                        <th className="text-left px-5 py-3 font-medium text-gray-500">Jatuh Tempo</th>
                                        <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tagihanList.map((t: any) => {
                                        const ts = tagihanStatus[t.status] || tagihanStatus.notpaid
                                        const bulan = t.tgl_tagihan
                                            ? new Date(t.tgl_tagihan).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
                                            : '-'
                                        return (
                                            <tr key={t.id_tagihan} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="px-5 py-4 text-gray-900 font-medium">{bulan}</td>
                                                <td className="px-5 py-4 text-gray-900">{formatRupiah(hitungTotal(t))}</td>
                                                <td className="px-5 py-4 text-gray-600">{formatDate(t.tgl_jatuhtempo)}</td>
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${ts.bg} ${ts.text}`}>
                                                        {ts.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-6 rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {sewa.status === 'pending' && (
                            <>
                                <button
                                    onClick={() => handleAction('aktif')}
                                    disabled={actionLoading !== null}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
                                >
                                    {actionLoading === 'aktif' ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Check className="h-4 w-4" />
                                    )}
                                    Setujui Sewa
                                </button>
                                <button
                                    onClick={() => handleAction('nonaktif')}
                                    disabled={actionLoading !== null}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 disabled:opacity-50 transition-colors shadow-sm"
                                >
                                    {actionLoading === 'nonaktif' ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <X className="h-4 w-4" />
                                    )}
                                    Tolak Sewa
                                </button>
                            </>
                        )}
                        {sewa.status === 'aktif' && (
                            <button
                                onClick={() => router.push(`/admin/dashboard/sewa/${sewa.id_sewa}/edit`)}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                            >
                                <Pencil className="h-4 w-4" />
                                Edit Sewa
                            </button>
                        )}
                        <button
                            onClick={() => router.push('/admin/dashboard/sewa')}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-700 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Kembali ke Daftar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
