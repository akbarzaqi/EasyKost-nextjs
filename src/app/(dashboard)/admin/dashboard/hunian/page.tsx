'use client'
import React, { useEffect, useState, useMemo } from "react"

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Home, CheckCircle2, XCircle, Pencil, Eye, BedDouble, Wallet } from "lucide-react"
import Link from "next/link"
import { getAllHunian } from "../../../../../lib/api/hunian"
import { getBiaya } from "../../../../../lib/api/biaya"

type Hunian = {
    id_hunian: number,
    nama_hunian: string,
    total_price: number,
    tipe_hunian: string,
    status_harian: string,
    deskripsi_hunian: string,
    gambar_hunian: string,
}

const data: Hunian[] = []

const fetchBiayaData = async (id: string) => {
    try {
        const response = await getBiaya(id);
        console.log('[fetch data biaya] : ', response);

        if (response.error) {
            return null;
        }

        return response.data;
    }catch (error) {
        console.error(error);
        return null;
    }
}

const fetchHunianData = async (): Promise<Hunian[]> => {
    try {
        const response = await getAllHunian();

        if (response.error) {
            return [];
        }

        return response.data as Hunian[];
    } catch (error) {
        console.error(error);
        return [];
    }
}

type TabKey = "all" | "kosong" | "terisi"

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "Semua", icon: <Home className="h-4 w-4" /> },
    { key: "terisi", label: "Terisi", icon: <CheckCircle2 className="h-4 w-4" /> },
    { key: "kosong", label: "Kosong", icon: <XCircle className="h-4 w-4" /> },
]

const statusStyles: Record<string, { badge: string; dot: string }> = {
    full: { badge: 'bg-rose-50 text-rose-700 border border-rose-200', dot: 'bg-rose-500' },
    kosong: { badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' },
}

const formatPrice = (price: number) =>
    `Rp ${price.toLocaleString('id-ID')}`



export default function AdminHunian() {
    const [hunianList, setHunianList] = React.useState<Hunian[] | null>(null)
    const [activeTab, setActiveTab] = useState<TabKey>("all")
    const [searchQuery, setSearchQuery] = useState<string>("")

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchHunianData()
            // await Promise.all(data.map(async (hunian) => {
            //     const biayaData = await fetchBiayaData(hunian.id.toString())
            //     if (biayaData) {
            //         hunian.total_price = biayaData.wifi + biayaData.sampah + biayaData.kost
            //     }
            // }))
            const hunianList = response as Hunian[];

            await Promise.all(
                hunianList.map(async (hunian) => {
                    const biayaData = await fetchBiayaData(hunian.id_hunian.toString());

                    if (biayaData) {
                        hunian.total_price = Number(biayaData.wifi) + Number(biayaData.sampah) + Number(biayaData.kost);
                    }
                })
            );

            // setHunianList(hunianList);
            console.log('Fetched hunian data with biaya:', hunianList)
            setHunianList(hunianList)
        }
        fetchData()
    }, [])

    const filteredHunian = useMemo(() => {
        if (!hunianList) return []

        let result = [...hunianList]

        if (activeTab === "kosong") {
            result = result.filter(h => h.status_harian.toLowerCase() === "kosong")
        } else if (activeTab === "terisi") {
            result = result.filter(h => h.status_harian.toLowerCase() === "full")
        }

        const q = searchQuery.toLowerCase().trim()
        if (q) {
            result = result.filter(h =>
                h.nama_hunian.toLowerCase().includes(q) ||
                h.tipe_hunian.toLowerCase().includes(q)
            )
        }

        return result
    }, [hunianList, activeTab, searchQuery])

    const counts = useMemo(() => {
        if (!hunianList) return { all: 0, kosong: 0, terisi: 0 }
        return {
            all: hunianList.length,
            kosong: hunianList.filter(h => h.status_harian.toLowerCase() === "kosong").length,
            terisi: hunianList.filter(h => h.status_harian.toLowerCase() === "full").length,
        }
    }, [hunianList])

    // if (!hunianList) {
    //     return (
    //         <div className="flex items-center justify-center h-screen">
    //             <div className="flex flex-col items-center gap-2">
    //                 <div className="h-8 w-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
    //                 <p className="text-sm text-gray-500">Memuat data hunian...</p>
    //             </div>
    //         </div>
    //     )
    // }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                        Manajemen Hunian
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Kelola kamar dan status hunian kost Anda.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
                    <div className="flex flex-wrap gap-2">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.key
                            const count = counts[tab.key]
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                                        isActive
                                            ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                    <Badge
                                        variant="secondary"
                                        className={`ml-1 ${
                                            isActive
                                                ? "bg-white/20 text-white hover:bg-white/20"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        {count}
                                    </Badge>
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Cari nama atau tipe kamar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-white"
                            />
                        </div>
                        <Link href="/admin/dashboard/hunian/tambah">
                            <Button className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white">
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">Tambah Hunian</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {filteredHunian.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredHunian.map((hunian) => {
                            const style = statusStyles[hunian.status_harian.toLowerCase()] || { badge: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500' }
                            return (
                                <Card
                                    key={hunian.id_hunian}
                                    className="overflow-hidden border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200 pt-0"
                                >
                                    <CardHeader className="p-0">
                                        <div className="relative">
                                            <img
                                                src={hunian.gambar_hunian}
                                                alt={hunian.nama_hunian}
                                                className="w-full h-44 object-cover bg-gray-100"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                            <span className={`absolute top-3 right-3 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${style.badge}`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                                                {hunian.status_harian}
                                            </span>
                                            <Badge className="absolute top-3 left-3 bg-white/90 text-gray-700 hover:bg-white/90 backdrop-blur-sm border-0 text-xs">
                                                <BedDouble className="h-3 w-3 mr-1" />
                                                {hunian.tipe_hunian}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="px-5 pb-5">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <CardTitle className="text-lg font-semibold text-gray-900">
                                                {hunian.nama_hunian}
                                            </CardTitle>
                                        </div>

                                        <CardAction className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-300" />
                                            Lantai 1 • {hunian.tipe_hunian}
                                        </CardAction>

                                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                            {hunian.deskripsi_hunian}
                                        </p>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                            <div>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Wallet className="h-3 w-3" />
                                                    Harga
                                                </p>
                                                <p className="text-sm font-semibold text-emerald-600">
                                                    {formatPrice(hunian.total_price)}
                                                    <span className="text-xs text-gray-400 font-normal">/bln</span>
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link href={`/admin/dashboard/hunian/${hunian.id_hunian}/edit`}>
                                                    <Button size="sm" variant="outline" className="h-8 px-3 text-xs hover:bg-gray-100">
                                                        <Pencil className="h-3 w-3 mr-1" />
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/dashboard/hunian/${hunian.id_hunian}`}>
                                                    <Button size="sm" variant="outline" className="h-8 px-3 text-xs hover:bg-gray-100">
                                                        <Eye className="h-3 w-3 mr-1" />
                                                        Detail
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 text-sm text-gray-500 bg-white border border-dashed border-gray-200 rounded-xl">
                        Tidak ada hunian yang cocok dengan filter saat ini.
                    </div>
                )}
            </div>
        </div>
    )
}
