'use client'
import React, { useState, useMemo, useEffect } from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MdOutlineHomeWork, MdOutlinePersonOutline } from "react-icons/md"
import { CgNotes } from "react-icons/cg"
import { GoVerified } from "react-icons/go"
import { Plus, FileText, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { getAllHunian } from "@/lib/api/hunian"
import { getAllSewa } from "@/lib/api/sewa"
import { getAllTagihan } from "@/lib/api/tagihan"
import { getAllPembayaran } from "@/lib/api/pembayaran"

type Stat = {
    title: string
    value: number
    suffix?: string
    icon: React.ReactNode
    iconBg: string
    iconColor: string
    description?: string
    highlight?: boolean
}

const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`

const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function AdminDashboard() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [hunianCount, setHunianCount] = useState(0)
    const [aktifCount, setAktifCount] = useState(0)
    const [tagihanBulanIni, setTagihanBulanIni] = useState<any[]>([])
    const [verifCount, setVerifCount] = useState(0)
    const [recentTagihan, setRecentTagihan] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const [hunianRes, sewaRes, tagihanRes, pembayaranRes] = await Promise.all([
                getAllHunian(),
                getAllSewa(),
                getAllTagihan(),
                getAllPembayaran(),
            ])

            if (!hunianRes.error && hunianRes.data) {
                setHunianCount(hunianRes.data.length)
            }
            if (!sewaRes.error && sewaRes.data) {
                setAktifCount(sewaRes.data.filter((s: any) => s.status === 'aktif').length)
            }
            if (!tagihanRes.error && tagihanRes.data) {
                const now = new Date()
                const bulanIni = tagihanRes.data.filter((t: any) => {
                    const d = new Date(t.tgl_tagihan)
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
                })
                setTagihanBulanIni(bulanIni)

                const sorted = [...tagihanRes.data].sort(
                    (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )
                setRecentTagihan(sorted.slice(0, 10))
            }
            if (!pembayaranRes.error && pembayaranRes.data) {
                setVerifCount(pembayaranRes.data.filter((p: any) => p.status === 'verif').length)
            }
            setLoading(false)
        }
        fetchData()
    }, [])

    const totalTagihanBulanIni = useMemo(() => {
        return tagihanBulanIni.reduce((sum, t) => {
            const biaya = t.sewa?.hunian?.biaya
            const total = (biaya ? Number(biaya.kost) + Number(biaya.wifi) + Number(biaya.sampah) : 0) + (Number(t.air) || 0)
            return sum + total
        }, 0)
    }, [tagihanBulanIni])

    const stats: Stat[] = useMemo(() => [
        {
            title: "Total Hunian",
            value: hunianCount,
            icon: <MdOutlineHomeWork />,
            iconBg: "bg-indigo-50",
            iconColor: "text-indigo-600",
        },
        {
            title: "Penghuni Aktif",
            value: aktifCount,
            icon: <MdOutlinePersonOutline />,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
        },
        {
            title: "Tagihan Bulan Ini",
            value: tagihanBulanIni.length,
            suffix: `(${formatRupiah(totalTagihanBulanIni)})`,
            icon: <CgNotes />,
            iconBg: "bg-sky-50",
            iconColor: "text-sky-600",
        },
        {
            title: "Menunggu Verifikasi",
            value: verifCount,
            icon: <GoVerified />,
            iconBg: "bg-rose-50",
            iconColor: "text-rose-600",
            description: verifCount > 0 ? "butuh verifikasi" : undefined,
            highlight: verifCount > 0,
        },
    ], [hunianCount, aktifCount, tagihanBulanIni, totalTagihanBulanIni, verifCount])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                            Dashboard
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Ringkasan aktivitas kost Anda hari ini.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => router.push('/admin/dashboard/tagihan/tambah')}
                            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
                        >
                            <Plus className="h-4 w-4" />
                            Generate Tagihan
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {stats.map((s) => (
                        <Card
                            key={s.title}
                            className={`group relative overflow-hidden border rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200 ${
                                s.highlight ? "border-rose-200 bg-gradient-to-br from-rose-50/60 to-white" : "border-gray-200"
                            }`}
                        >
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    {s.title}
                                </CardTitle>
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-xl ${s.iconBg} ${s.iconColor}`}>
                                    {s.icon}
                                </div>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <div className="flex items-baseline gap-1.5">
                                    <div className={`text-3xl font-bold tracking-tight ${
                                        s.highlight ? "text-rose-600" : "text-gray-900"
                                    }`}>
                                        {s.value}
                                    </div>
                                    {s.suffix && (
                                        <span className="text-sm text-gray-500 truncate">{s.suffix}</span>
                                    )}
                                </div>
                                {s.description && (
                                    <p className="mt-2 text-xs text-rose-600 font-medium">
                                        {s.description}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Tagihan Table */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            Tagihan Terbaru
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Daftar tagihan yang baru saja dibuat.
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-200">
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Penghuni</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kamar</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bulan</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Jatuh Tempo</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTagihan.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                                            Belum ada tagihan.
                                        </td>
                                    </tr>
                                )}
                                {recentTagihan.map((t: any, i: number) => {
                                    const user = t.sewa?.user
                                    const hunian = t.sewa?.hunian
                                    const biaya = hunian?.biaya
                                    const total = (biaya ? Number(biaya.kost) + Number(biaya.wifi) + Number(biaya.sampah) : 0) + (Number(t.air) || 0)
                                    const bulan = new Date(t.tgl_tagihan).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
                                    const now = new Date()
                                    const jatuhTempo = new Date(t.tgl_jatuhtempo)
                                    const isOverdue = t.status === 'notpaid' && jatuhTempo < now
                                    const statusLabel = t.status === 'paid' ? 'Lunas' : isOverdue ? 'Jatuh Tempo' : 'Belum Bayar'
                                    const statusBg = t.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : isOverdue ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                    const statusDot = t.status === 'paid' ? 'bg-emerald-500' : isOverdue ? 'bg-rose-500' : 'bg-amber-500'
                                    return (
                                        <tr key={t.id_tagihan || i} className={`border-b border-gray-100 hover:bg-gray-50/60 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-xs flex-shrink-0">
                                                        {(user?.nama || '?').charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-gray-900">{user?.nama || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                                                    {hunian?.nama_hunian || '-'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-gray-700">{bulan}</td>
                                            <td className="px-5 py-4 font-semibold text-gray-900">{formatRupiah(total)}</td>
                                            <td className="px-5 py-4 text-gray-600">{formatDate(t.tgl_jatuhtempo)}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusBg}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
                                                    {statusLabel}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
