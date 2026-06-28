'use client'

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "../../../lib/hooks/useAuth"
import { getPublicHunian } from "../../../lib/api/hunian"
import { createSewa } from "../../../lib/api/sewa"
import { Home, BedDouble, Wifi, Trash2, Wallet, ArrowLeft, Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import { getImageUrl } from "../../../lib/image"

const formatPrice = (price: number) =>
    `Rp ${price.toLocaleString('id-ID')}`

type Biaya = {
    id_biaya: number
    wifi: string
    sampah: string
    kost: string
}

type Hunian = {
    id_hunian: number
    nama_hunian: string
    tipe_hunian: string
    status_harian: string
    gambar_hunian: string
    deskripsi_hunian: string
    total_price: number
    biaya: Biaya
}

export default function BookingPage() {
    const router = useRouter()
    const params = useParams<{ id: string }>()
    const { user, isLoading } = useAuth()
    const [hunian, setHunian] = useState<Hunian | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")
    const [periode, setPeriode] = useState<"bulan" | "tahun">("bulan")

    const tglJatuhTempo = React.useMemo(() => {
        const now = new Date()
        if (periode === "tahun") {
            now.setFullYear(now.getFullYear() + 1)
        } else {
            now.setMonth(now.getMonth() + 1)
        }
        return now.toISOString().split('T')[0]
    }, [periode])

    useEffect(() => {
        if (!isLoading && !user) {
            router.push(`/login?redirect=/sewa/${params.id}`)
            return
        }
    }, [user, isLoading, router, params.id])

    const requiredFields = ["nama", "email", "no_hp", "pekerjaan", "provinsi", "kabupaten", "kecamatan", "alamat"] as const
    const profileComplete = user
        ? requiredFields.every((f) => {
            const val = (user as any)[f]
            return val && val.trim() !== ""
          })
        : false

    useEffect(() => {
        const fetchHunian = async () => {
            const response = await getPublicHunian()
            if (!response.error && response.data) {
                const found = response.data.find(
                    (h: any) => h.id_hunian === parseInt(params.id)
                )
                if (found) {
                    setHunian({
                        ...found,
                        total_price: found.biaya
                            ? Number(found.biaya.wifi) + Number(found.biaya.sampah) + Number(found.biaya.kost)
                            : 0,
                    })
                }
            }
            setLoading(false)
        }
        fetchHunian()
    }, [params.id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setSubmitting(true)
        setError("")

        const response = await createSewa({
            id_hunian: parseInt(params.id),
            tgl_jatuhtempo: tglJatuhTempo,
        })

        setSubmitting(false)

        if (response.error) {
            setError(response.message)
        } else {
            setSuccess(true)
        }
    }

    if (isLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
        )
    }

    if (!user) return null

    if (!profileComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                <div className="max-w-md w-full text-center">
                    <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="h-8 w-8 text-amber-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Lengkapi Data Diri</h1>
                    <p className="text-gray-500 mt-2">
                        Sebelum melakukan booking, Anda harus melengkapi data diri terlebih dahulu.
                    </p>
                    <button
                        onClick={() => router.push(`/users/dashboard/profile`)}
                        className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        Lengkapi Data Diri
                    </button>
                </div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                <div className="max-w-md w-full text-center">
                    <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Berhasil Diajukan!</h1>
                    <p className="text-gray-500 mt-2">
                        Sewa Anda telah diajukan dan menunggu persetujuan admin.
                    </p>
                    <button
                        onClick={() => router.push('/users/dashboard')}
                        className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        Ke Dashboard
                    </button>
                </div>
            </div>
        )
    }

    if (!hunian) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                <div className="text-center">
                    <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Kamar tidak ditemukan</p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </button>
                </div>
            </div>
        )
    }

    if (hunian.status_harian.toLowerCase() !== "kosong") {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                <div className="text-center">
                    <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-gray-900">Kamar Tidak Tersedia</h2>
                    <p className="text-gray-500 mt-1">Maaf, kamar ini sudah penuh.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Cari Kamar Lain
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 py-8">
                <button
                    onClick={() => router.push('/')}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                </button>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Room Info */}
                    <div className="md:col-span-3">
                        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
                            <div className="h-56 bg-gray-100">
                                {hunian.gambar_hunian ? (
                                    <img
                                        src={getImageUrl(hunian.gambar_hunian) || ''}
                                        alt={hunian.nama_hunian}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Home className="h-16 w-16 text-gray-300" />
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h1 className="text-xl font-bold text-gray-900">{hunian.nama_hunian}</h1>
                                        <p className="text-sm text-gray-500 mt-1">{hunian.tipe_hunian}</p>
                                    </div>
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        Tersedia
                                    </span>
                                </div>
                                <p className="mt-4 text-sm text-gray-600">{hunian.deskripsi_hunian || "Tidak ada deskripsi"}</p>

                                {hunian.biaya && (
                                    <div className="mt-6">
                                        <h3 className="text-sm font-semibold text-gray-900">Rincian Biaya</h3>
                                        <div className="mt-3 space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600 flex items-center gap-2">
                                                    <Wifi className="h-4 w-4 text-gray-400" />
                                                    WiFi
                                                </span>
                                                <span className="font-medium">{formatPrice(Number(hunian.biaya.wifi))}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600 flex items-center gap-2">
                                                    <Trash2 className="h-4 w-4 text-gray-400" />
                                                    Sampah
                                                </span>
                                                <span className="font-medium">{formatPrice(Number(hunian.biaya.sampah))}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600 flex items-center gap-2">
                                                    <Home className="h-4 w-4 text-gray-400" />
                                                    Kost
                                                </span>
                                                <span className="font-medium">{formatPrice(Number(hunian.biaya.kost))}</span>
                                            </div>
                                            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-sm font-semibold">
                                                <span className="text-gray-900">Total</span>
                                                <span className="text-gray-900">{formatPrice(hunian.total_price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="md:col-span-2">
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 sticky top-8">
                            <h2 className="text-lg font-semibold text-gray-900">Ajukan Sewa</h2>
                            <p className="text-sm text-gray-500 mt-1">Isi tanggal jatuh tempo pembayaran</p>

                            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Periode Sewa
                                    </label>
                                    <div className="mt-2 grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setPeriode("bulan")}
                                            className={`px-4 py-3 text-sm font-medium rounded-xl border transition-all ${
                                                periode === "bulan"
                                                    ? "bg-gray-900 text-white border-gray-900"
                                                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            Per Bulan
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPeriode("tahun")}
                                            className={`px-4 py-3 text-sm font-medium rounded-xl border transition-all ${
                                                periode === "tahun"
                                                    ? "bg-gray-900 text-white border-gray-900"
                                                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            Per Tahun
                                        </button>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-400">
                                        Jatuh tempo:{' '}
                                        <span className="font-medium text-gray-600">
                                            {new Date(tglJatuhTempo).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </span>
                                    </p>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="text-xs text-gray-500">Total yang harus dibayar</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {formatPrice(hunian.total_price)}
                                        <span className="text-sm font-normal text-gray-400">/bln</span>
                                    </p>
                                </div>

                                {error && (
                                    <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        'Ajukan Sewa'
                                    )}
                                </button>

                                <p className="text-xs text-gray-400 text-center">
                                    Setelah diajukan, admin akan memverifikasi permohonan Anda.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
