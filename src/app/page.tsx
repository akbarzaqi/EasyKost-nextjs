'use client'

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Home, BedDouble, Wifi, Trash2, Wallet, MapPin, ChevronRight, LogIn, Loader2, Eye } from "lucide-react"
import { getPublicHunian } from "../lib/api/hunian"
import { useAuth } from "../lib/hooks/useAuth"

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

const formatPrice = (price: number) =>
    `Rp ${price.toLocaleString('id-ID')}`

export default function HomePage() {
    const router = useRouter()
    const { user } = useAuth()
    const [hunianList, setHunianList] = useState<Hunian[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const response = await getPublicHunian()
            if (!response.error && response.data) {
                const mapped = response.data.map((h: any) => ({
                    ...h,
                    total_price: h.biaya
                        ? Number(h.biaya.wifi) + Number(h.biaya.sampah) + Number(h.biaya.kost)
                        : 0,
                }))
                setHunianList(mapped)
            }
            setLoading(false)
        }
        fetchData()
    }, [])

    const availableRooms = hunianList.filter(
        (h) => h.status_harian.toLowerCase() === "kosong"
    )

    const handleBooking = (id: number) => {
        if (user) {
            router.push(`/sewa/${id}`)
        } else {
            router.push(`/login?redirect=/sewa/${id}`)
        }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">Kost Pak Aji</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {user ? (
                                <button
                                    onClick={() => router.push(user.role === 'admin' ? '/admin/dashboard' : '/users/dashboard')}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <LogIn className="h-4 w-4" />
                                    Dashboard
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => router.push('/login')}
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                                    >
                                        Masuk
                                    </button>
                                    <button
                                        onClick={() => router.push('/register')}
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        Daftar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative overflow-hidden bg-gray-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                            Temukan Hunian
                            <span className="text-gray-400"> Nyaman dan Terjangkau</span>
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                            Kost Pak Aji menyediakan berbagai pilihan kamar dengan fasilitas lengkap untuk menunjang aktivitas Anda.
                        </p>
                    </div>
                </div>
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gray-100/50" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-gray-100/30" />
            </section>

            {/* Available Rooms */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Kamar Tersedia</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {availableRooms.length} kamar tersedia untuk Anda
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                ) : availableRooms.length === 0 ? (
                    <div className="text-center py-20">
                        <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Belum ada kamar tersedia saat ini</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableRooms.map((hunian) => (
                            <div
                                key={hunian.id_hunian}
                                className="group rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-all duration-200"
                            >
                                <div className="relative h-48 bg-gray-100 overflow-hidden">
                                    {hunian.gambar_hunian ? (
                                        <img
                                            src={hunian.gambar_hunian}
                                            alt={hunian.nama_hunian}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Home className="h-12 w-12 text-gray-300" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        Tersedia
                                    </span>
                                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 text-gray-700 text-xs font-medium rounded-full backdrop-blur-sm">
                                        <BedDouble className="h-3 w-3" />
                                        {hunian.tipe_hunian}
                                    </span>
                                </div>

                                <div className="p-5">
                                    <Link href={`/hunian/${hunian.id_hunian}`}>
                                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                            {hunian.nama_hunian}
                                        </h3>
                                    </Link>

                                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                        {hunian.deskripsi_hunian || "Tidak ada deskripsi"}
                                    </p>

                                    <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                                        {hunian.biaya && (
                                            <>
                                                <span className="flex items-center gap-1">
                                                    <Wifi className="h-3 w-3" />
                                                    WiFi
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Trash2 className="h-3 w-3" />
                                                    Sampah
                                                </span>
                                            </>
                                        )}

                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500">Mulai dari</p>
                                            <p className="text-lg font-bold text-gray-900">
                                                {formatPrice(hunian.total_price)}
                                                <span className="text-xs font-normal text-gray-400">/bln</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/hunian/${hunian.id_hunian}`}
                                                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Detail
                                            </Link>
                                            <button
                                                onClick={() => handleBooking(hunian.id_hunian)}
                                                className="inline-flex items-center gap-1 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
                                            >
                                                Booking
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-100 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <p className="text-xs text-gray-400 text-center">&copy; 2026 Kost Pak Aji. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
