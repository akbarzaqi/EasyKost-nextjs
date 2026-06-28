'use client'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getImageUrl } from "@/lib/image"

type Pembayaran = {
    id: number
    nama: string
    kamar: string
    invoice: string
    total: number
    cover_image_url: string
}

export default function CardItem({ pembayaran }: { pembayaran: Pembayaran }) {
    const router = useRouter()
    return (
        <div className="p-5 border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-6 flex-wrap">
                <div className="relative w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img
                        src={getImageUrl(pembayaran.cover_image_url) || ''}
                        alt={pembayaran.nama}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1 min-w-[120px]">
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Nama Penghuni</h2>
                    <p className="text-sm font-medium text-gray-900">{pembayaran.nama}</p>
                </div>

                <Separator orientation="vertical" className="h-12 hidden md:block" />

                <div className="flex-1 min-w-[100px]">
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Kamar</h2>
                    <p className="text-sm font-medium text-gray-900">{pembayaran.kamar}</p>
                </div>

                <Separator orientation="vertical" className="h-12 hidden md:block" />

                <div className="flex-1 min-w-[120px]">
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Invoice</h2>
                    <p className="text-sm font-medium text-gray-900">#{pembayaran.invoice}</p>
                </div>

                <Separator orientation="vertical" className="h-12 hidden md:block" />

                <div className="flex-1 min-w-[140px]">
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Total</h2>
                    <p className="text-sm font-semibold text-emerald-600">
                        Rp {pembayaran.total.toLocaleString("id-ID")}
                    </p>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-gray-50"
                        onClick={() => router.push(`/admin/dashboard/pembayaran/${pembayaran.id}`)}
                    >
                        Lihat Bukti
                    </Button>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        Verifikasi
                    </Button>
                </div>
            </div>
        </div>
    )
}
