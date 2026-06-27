'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ArrowLeft, User, Home, Calendar, FileText, Loader2, Check } from 'lucide-react'
import { getSewaById, updateSewa } from '@/lib/api/sewa'

type SewaDetail = {
    id_sewa: number
    id_users: number
    id_hunian: number
    tgl_jatuhtempo: string
    status: string
    created_at: string
    user: { nama: string; email: string; no_hp: string }
    hunian: { nama_hunian: string; tipe_hunian: string }
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

const statusOptions = [
    { value: 'aktif', label: 'Aktif' },
    { value: 'nonaktif', label: 'Nonaktif' },
    { value: 'pending', label: 'Pending' },
]

export default function EditSewaClient({ id }: { id: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const [status, setStatus] = useState('aktif')
    const [tglJatuhTempo, setTglJatuhTempo] = useState('')
    const [sewa, setSewa] = useState<SewaDetail | null>(null)

    useEffect(() => {
        const load = async () => {
            const response = await getSewaById(parseInt(id))
            if (!response.error && response.data) {
                setSewa(response.data)
                setStatus(response.data.status)
                setTglJatuhTempo(response.data.tgl_jatuhtempo || '')
            } else {
                setNotFound(true)
            }
            setLoading(false)
        }
        load()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        const response = await updateSewa(parseInt(id), { status, tgl_jatuhtempo: tglJatuhTempo })
        setSubmitting(false)
        if (!response.error) {
            router.push('/admin/dashboard/sewa')
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

    if (notFound || !sewa) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600">Data sewa tidak ditemukan.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
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
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Sewa</h1>
                    <p className="text-sm text-gray-500 mt-1">Perbarui status sewa kamar.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-5">
                            <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                        <User className="h-5 w-5 text-gray-400" />
                                        Informasi Sewa
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                                            {sewa.user.nama.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{sewa.user.nama}</p>
                                            <p className="text-xs text-gray-400">{sewa.user.email} • {sewa.user.no_hp || '-'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                        <Home className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{sewa.hunian.nama_hunian}</p>
                                            <p className="text-xs text-gray-400">{sewa.hunian.tipe_hunian}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-400">Jatuh Tempo</p>
                                            <p className="font-medium text-gray-900 text-sm">{formatDate(sewa.tgl_jatuhtempo)}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                                            Status
                                        </Label>
                                        <select
                                            id="status"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-gray-900/50"
                                        >
                                            {statusOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tglJatuhTempo" className="text-sm font-medium text-gray-700">
                                            Tanggal Jatuh Tempo
                                        </Label>
                                        <input
                                            id="tglJatuhTempo"
                                            type="date"
                                            value={tglJatuhTempo}
                                            onChange={(e) => setTglJatuhTempo(e.target.value)}
                                            className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-gray-900/50"
                                        />
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
                                        <span className="text-gray-500">Penyewa</span>
                                        <span className="font-medium text-gray-900">{sewa.user.nama}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Kamar</span>
                                        <span className="font-medium text-gray-900">{sewa.hunian.nama_hunian}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Status</span>
                                        <span className="font-medium text-gray-900">{status}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Jatuh Tempo</span>
                                        <span className="font-medium text-gray-900">{formatDate(tglJatuhTempo || sewa.tgl_jatuhtempo)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
                                <CardContent className="pt-6 space-y-3">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm"
                                    >
                                        {submitting ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Check className="h-4 w-4" />
                                        )}
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
