'use client'
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState, useMemo } from "react"
import CardItem from "./card-item"

const data = [
    {
        id: 1,
        nama: "John Doe",
        kamar: "A101",
        invoice: "INV-001",
        total: 1500000,
        cover_image_url: "https://kimi-web-img.moonshot.cn/img/upload.wikimedia.org/af3236d32d89bc8bfca86c80aa9f7e2ba2dbe654.jpg"
    },
    {
        id: 2,
        nama: "Jane Smith",
        kamar: "B202",
        invoice: "INV-002",
        total: 2000000,
        cover_image_url: "https://kimi-web-img.moonshot.cn/img/upload.wikimedia.org/af3236d32d89bc8bfca86c80aa9f7e2ba2dbe654.jpg"
    },
    {
        id: 3,
        nama: "Michael Johnson",
        kamar: "C303",
        invoice: "INV-003",
        total: 2500000,
        cover_image_url: "https://kimi-web-img.moonshot.cn/img/upload.wikimedia.org/af3236d32d89bc8bfca86c80aa9f7e2ba2dbe654.jpg"
    },
    {
        id: 4,
        nama: "Emily Davis",
        kamar: "D404",
        invoice: "INV-004",
        total: 3000000,
        cover_image_url: "https://kimi-web-img.moonshot.cn/img/upload.wikimedia.org/af3236d32d89bc8bfca86c80aa9f7e2ba2dbe654.jpg"
    },
]

export default function AdminPembayaran() {
    const [searchQuery, setSearchQuery] = useState<string>("")

    const filteredData = useMemo(() => {
        const q = searchQuery.toLowerCase().trim()
        if (!q) return data
        return data.filter(
            (p) =>
                p.nama.toLowerCase().includes(q) ||
                p.kamar.toLowerCase().includes(q) ||
                p.invoice.toLowerCase().includes(q)
        )
    }, [searchQuery])

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                            Antrean Verifikasi Pembayaran
                        </h1>
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                            {data.length} pending
                        </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                        Periksa dan verifikasi bukti pembayaran penghuni kost.
                    </p>
                </div>

                <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Cari nama, kamar, atau invoice..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-white"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {filteredData.length > 0 ? (
                        filteredData.map((pembayaran) => (
                            <CardItem key={pembayaran.id} pembayaran={pembayaran} />
                        ))
                    ) : (
                        <div className="text-center py-12 text-sm text-gray-500 bg-white border border-dashed border-gray-200 rounded-xl">
                            Tidak ada pembayaran yang cocok dengan pencarian.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
