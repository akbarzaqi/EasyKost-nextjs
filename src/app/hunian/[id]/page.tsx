'use client'

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { getPublicHunian } from "../../../lib/api/hunian"
import { useAuth } from "../../../lib/hooks/useAuth"
import { Home, BedDouble, Wifi, Trash2, Wallet, MapPin, ArrowLeft, ChevronRight, Loader2 } from "lucide-react"

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

export default function DetailHunianPage() {
    const router = useRouter()
    const params = useParams<{ id: string }>()
    const { user } = useAuth()
    const [hunian, setHunian] = useState<Hunian | null>(null)
    const [loading, setLoading] = useState(true)

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

    const handleBooking = () => {
        if (user) {
            router.push(`/sewa/${params.id}`)
        } else {
            router.push(`/login?redirect=/sewa/${params.id}`)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
        )
    }

    if (!hunian) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                <div className="text-center">
                    <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-gray-900">Kamar Tidak Ditemukan</h2>
                    <p className="text-gray-500 mt-1">Kamar yang Anda cari tidak tersedia.</p>
                    <Link
                        href="/"
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Link>
                </div>
            </div>
        )
    }

    const isAvailable = hunian.status_harian.toLowerCase() === "kosong"

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push('/')}
                                className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali
                            </button>
                            <div className="h-6 w-px bg-gray-200" />
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">Kost Pak Aji</span>
                            </div>
                        </div>
                        {user ? (
                            <Link
                                href={user.role === 'admin' ? '/admin/dashboard' : '/users/dashboard'}
                                className="text-sm font-medium text-gray-700 hover:text-gray-900"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left: Image & Details */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
                            <div className="h-72 md:h-96 bg-gray-100">
                                {hunian.gambar_hunian ? (
                                    <img
                                        src={hunian.gambar_hunian}
                                        alt={hunian.nama_hunian}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Home className="h-20 w-20 text-gray-300" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{hunian.nama_hunian}</h1>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                                            <BedDouble className="h-4 w-4" />
                                            {hunian.tipe_hunian}
                                        </span>
                                        <span className="text-gray-300">|</span>
                                    </div>
                                </div>
                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border ${
                                        isAvailable
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            : "bg-rose-50 text-rose-700 border-rose-200"
                                    }`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-rose-500"}`}
                                    />
                                    {isAvailable ? "Tersedia" : "Penuh"}
                                </span>
                            </div>

                            <div className="mt-6">
                                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Deskripsi</h2>
                                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                    {hunian.deskripsi_hunian || "Tidak ada deskripsi"}
                                </p>
                            </div>

                            {hunian.biaya && (
                                <div className="mt-8">
                                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Rincian Biaya</h2>
                                    <div className="mt-4 space-y-3">
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600 flex items-center gap-2">
                                                <Wifi className="h-4 w-4 text-gray-400" />
                                                WiFi
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">{formatPrice(Number(hunian.biaya.wifi))}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600 flex items-center gap-2">
                                                <Trash2 className="h-4 w-4 text-gray-400" />
                                                Sampah
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">{formatPrice(Number(hunian.biaya.sampah))}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600 flex items-center gap-2">
                                                <Home className="h-4 w-4 text-gray-400" />
                                                Kost
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">{formatPrice(Number(hunian.biaya.kost))}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-sm font-semibold text-gray-900">Total</span>
                                            <span className="text-lg font-bold text-gray-900">{formatPrice(hunian.total_price)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Booking Card */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 sticky top-24">
                            <p className="text-xs text-gray-500">Harga</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {formatPrice(hunian.total_price)}
                                <span className="text-sm font-normal text-gray-400">/bln</span>
                            </p>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Status</span>
                                    <span className={`font-medium ${isAvailable ? "text-emerald-600" : "text-rose-600"}`}>
                                        {isAvailable ? "Tersedia" : "Penuh"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Tipe Kamar</span>
                                    <span className="font-medium text-gray-900">{hunian.tipe_hunian}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleBooking}
                                disabled={!isAvailable}
                                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isAvailable ? (
                                    <>
                                        Booking Sekarang
                                        <ChevronRight className="h-4 w-4" />
                                    </>
                                ) : (
                                    "Kamar Penuh"
                                )}
                            </button>

                            {!user && isAvailable && (
                                <p className="mt-3 text-xs text-gray-400 text-center">
                                    Anda akan diarahkan ke halaman login untuk melanjutkan booking.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
