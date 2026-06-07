'use client'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Pencil, CheckCircle2, XCircle } from "lucide-react"

type Tagihan = {
    id: string,
    invoiceNumber: string,
    nama_penghuni: string,
    kamar: string,
    rincian: string[],
    total: number,
    jatuh_tempo: string,
    status: 'belum_bayar' | 'lunas' | 'verifikasi',
}

const parseStatus = (status: string) => {
    switch (status) {
        case "lunas":
            return "Lunas"
        case "belum_bayar":
            return "Belum Bayar"
        case "verifikasi":
            return "Verifikasi"
        default:
            return status
    }
}

const parseTotal = (total: number) => {
    return `Rp ${total.toLocaleString('id-ID')}`
}

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const statusStyles: Record<string, string> = {
    lunas: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    belum_bayar: 'bg-rose-50 text-rose-700 border border-rose-200',
    verifikasi: 'bg-amber-50 text-amber-700 border border-amber-200',
}

const statusDot: Record<string, string> = {
    lunas: 'bg-emerald-500',
    belum_bayar: 'bg-rose-500',
    verifikasi: 'bg-amber-500',
}

export const columns = [
    {
        id: 'invoiceNumber',
        header: 'Invoice',
        accessorKey: 'invoiceNumber',
        cell: ({ getValue }: any) => (
            <span className="font-mono text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                {getValue() as string}
            </span>
        )
    },
    {
        id: 'nama_penghuni',
        header: 'Nama Penghuni',
        accessorKey: 'nama_penghuni',
        cell: ({ getValue }: any) => (
            <span className="font-medium text-gray-900">{getValue() as string}</span>
        )
    },
    {
        id: 'kamar',
        header: 'Kamar',
        accessorKey: 'kamar',
        cell: ({ getValue }: any) => (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                {getValue() as string}
            </span>
        )
    },
    {
        id: 'rincian',
        header: 'Rincian',
        accessorKey: 'rincian',
        cell: ({ getValue }: any) => {
            const rincian = getValue() as string[]
            return (
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {rincian.map((item, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            )
        }
    },
    {
        id: 'total',
        header: 'Total',
        accessorKey: 'total',
        cell: ({ getValue }: any) => (
            <span className="font-semibold text-emerald-600">
                {parseTotal(getValue())}
            </span>
        )
    },
    {
        id: 'jatuh_tempo',
        header: 'Jatuh Tempo',
        accessorKey: 'jatuh_tempo',
        cell: ({ getValue }: any) => (
            <span className="text-gray-600 text-sm">{formatDate(getValue() as string)}</span>
        )
    },
    {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }: any) => {
            const status = getValue() as string
            return (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-700'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusDot[status] || 'bg-gray-500'}`} />
                    {parseStatus(status)}
                </span>
            )
        }
    },
    {
        id: 'actions',
        header: 'Aksi',
        accessorKey: 'actions',
        cell: ({ row }: any) => {
            const router = useRouter()
            const tagihan = row.original
            const status = tagihan.status
            return (
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs hover:bg-gray-100"
                        onClick={() => router.push(`/admin/dashboard/tagihan/${tagihan.id}/edit`)}
                    >
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                    </Button>
                    {status === 'verifikasi' && (
                        <>
                            <Button size="sm" className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Verifikasi
                            </Button>
                            <Button size="sm" variant="destructive" className="h-8 px-3 text-xs">
                                <XCircle className="h-3 w-3 mr-1" />
                                Tolak
                            </Button>
                        </>
                    )}
                    {status === 'belum_bayar' && (
                        <Button size="sm" variant="destructive" className="h-8 px-3 text-xs">
                            <XCircle className="h-3 w-3 mr-1" />
                            Tolak
                        </Button>
                    )}
                </div>
            )
        }
    }
]

export const data: Tagihan[] = [
    {
        id: '1',
        invoiceNumber: 'INV-001',
        nama_penghuni: 'Akbar Zaki',
        kamar: 'Kamar 101',
        rincian: ['Kost', 'Listrik', 'Air'],
        total: 500000,
        jatuh_tempo: '2024-07-10',
        status: 'belum_bayar',
    },
    {
        id: '2',
        invoiceNumber: 'INV-002',
        nama_penghuni: 'Siti Aminah',
        kamar: 'Kamar 102',
        rincian: ['Kost', 'Listrik', 'Air'],
        total: 500000,
        jatuh_tempo: '2024-07-10',
        status: 'lunas',
    },
    {
        id: '3',
        invoiceNumber: 'INV-003',
        nama_penghuni: 'Budi Santoso',
        kamar: 'Kamar 103',
        rincian: ['Kost', 'Listrik', 'Air'],
        total: 500000,
        jatuh_tempo: '2024-07-10',
        status: 'verifikasi',
    }
]
