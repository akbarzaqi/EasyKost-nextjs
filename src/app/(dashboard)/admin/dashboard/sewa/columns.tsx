'use client'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Pencil, X, Check, Eye, Calendar } from "lucide-react"

type Sewa = {
    id: string,
    name: string,
    room: string,
    startDate: string,
    endDate: string,
    status: 'aktif' | 'berakhir' | 'menunggu',
}

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const statusStyles: Record<string, string> = {
    aktif: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    berakhir: 'bg-slate-50 text-slate-700 border border-slate-200',
    menunggu: 'bg-amber-50 text-amber-700 border border-amber-200',
}

const statusDot: Record<string, string> = {
    aktif: 'bg-emerald-500',
    berakhir: 'bg-slate-500',
    menunggu: 'bg-amber-500',
}

const statusLabels: Record<string, string> = {
    aktif: 'Aktif',
    berakhir: 'Berakhir',
    menunggu: 'Menunggu',
}

const actionConfig = {
    aktif: {
        label: { edit: 'Edit', akhiri: 'Akhiri' },
    },
    menunggu: {
        label: { disetujui: 'Setujui', tolak: 'Tolak' },
    },
    berakhir: {
        label: 'Lihat Detail',
    },
} as const

export const columns = [
    {
        id: 'name',
        header: 'Nama Penghuni',
        accessorKey: 'name',
        cell: ({ getValue }: any) => (
            <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-semibold text-sm flex-shrink-0">
                    {(getValue() as string).charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-900">{getValue() as string}</span>
            </div>
        )
    },
    {
        id: 'room',
        header: 'Kamar',
        accessorKey: 'room',
        cell: ({ getValue }: any) => (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {getValue() as string}
            </span>
        )
    },
    {
        id: 'startDate',
        header: 'Tanggal Mulai',
        accessorKey: 'startDate',
        cell: ({ getValue }: any) => (
            <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span>{formatDate(getValue() as string)}</span>
            </div>
        )
    },
    {
        id: 'endDate',
        header: 'Jatuh Tempo',
        accessorKey: 'endDate',
        cell: ({ getValue }: any) => (
            <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span>{formatDate(getValue() as string)}</span>
            </div>
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
                    {statusLabels[status] || status}
                </span>
            )
        }
    },
    {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }: any) => {
            const router = useRouter()
            const sewa = row.original
            return (
                <div className="flex items-center gap-2">
                    {sewa.status === 'aktif' && (
                        <>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-[105px] justify-center text-xs hover:bg-gray-100"
                                onClick={() => router.push(`/admin/dashboard/sewa/${sewa.id}/edit`)}
                            >
                                <Pencil className="h-3 w-3 mr-1" />
                                {actionConfig.aktif.label.edit}
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                className="h-8 w-[105px] justify-center text-xs"
                            >
                                <X className="h-3 w-3 mr-1" />
                                {actionConfig.aktif.label.akhiri}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-[80px] justify-center text-xs hover:bg-gray-100"
                                onClick={() => router.push(`/admin/dashboard/sewa/${sewa.id}`)}
                            >
                                <Eye className="h-3 w-3 mr-1" />
                                Detail
                            </Button>
                        </>
                    )}

                    {sewa.status === 'menunggu' && (
                        <>
                            <Button size="sm" className="h-8 w-[105px] justify-center text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                                <Check className="h-3 w-3 mr-1" />
                                {actionConfig.menunggu.label.disetujui}
                            </Button>
                            <Button size="sm" variant="destructive" className="h-8 w-[105px] justify-center text-xs">
                                <X className="h-3 w-3 mr-1" />
                                {actionConfig.menunggu.label.tolak}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-[80px] justify-center text-xs hover:bg-gray-100"
                                onClick={() => router.push(`/admin/dashboard/sewa/${sewa.id}`)}
                            >
                                <Eye className="h-3 w-3 mr-1" />
                                Detail
                            </Button>
                        </>
                    )}

                    {sewa.status === 'berakhir' && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-[105px] justify-center text-xs hover:bg-gray-100"
                            onClick={() => router.push(`/admin/dashboard/sewa/${sewa.id}`)}
                        >
                            <Eye className="h-3 w-3 mr-1" />
                            {actionConfig.berakhir.label}
                        </Button>
                    )}
                </div>
            )
        },
    },
]

export const data: Sewa[] = [
    {
        id: '1',
        name: 'John Doe',
        room: 'A101',
        startDate: '2024-07-01',
        endDate: '2024-07-31',
        status: 'aktif',
    },
    {
        id: '2',
        name: 'Jane Smith',
        room: 'B202',
        startDate: '2024-07-05',
        endDate: '2024-07-25',
        status: 'menunggu',
    },
    {
        id: '3',
        name: 'Alice Johnson',
        room: 'C303',
        startDate: '2024-06-15',
        endDate: '2024-07-15',
        status: 'berakhir',
    },
]
