'use client'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Pencil, X, Check, Eye, Calendar, User, Home, Loader2 } from "lucide-react"
import { updateSewa } from "@/lib/api/sewa"
import { useState } from "react"

type Sewa = {
    id_sewa: number,
    user: { nama: string, email: string, no_hp: string },
    hunian: { nama_hunian: string, tipe_hunian: string },
    tgl_jatuhtempo: string,
    created_at: string,
    status: string,
}

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const statusStyles: Record<string, string> = {
    aktif: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    nonaktif: 'bg-slate-50 text-slate-700 border border-slate-200',
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
}

const statusDot: Record<string, string> = {
    aktif: 'bg-emerald-500',
    nonaktif: 'bg-slate-500',
    pending: 'bg-amber-500',
}

const statusLabels: Record<string, string> = {
    aktif: 'Aktif',
    nonaktif: 'Berakhir',
    pending: 'Menunggu',
}

function ActionButtons({ sewa, onStatusChange }: { sewa: Sewa; onStatusChange: () => void }) {
    const router = useRouter()
    const [loading, setLoading] = useState<string | null>(null)

    const handleAction = async (status: string) => {
        setLoading(status)
        const response = await updateSewa(sewa.id_sewa, { status })
        setLoading(null)
        if (!response.error) {
            onStatusChange()
        } else {
            alert(response.message)
        }
    }

    if (sewa.status === 'pending') {
        return (
            <div className="flex items-center gap-1.5">
                <Button
                    size="sm"
                    className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleAction('aktif')}
                    disabled={loading !== null}
                >
                    {loading === 'aktif' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                </Button>
                <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 px-3 text-xs"
                    onClick={() => handleAction('nonaktif')}
                    disabled={loading !== null}
                >
                    {loading === 'nonaktif' ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-3 text-xs hover:bg-gray-100"
                    onClick={() => router.push(`/admin/dashboard/sewa/${sewa.id_sewa}`)}
                >
                    <Eye className="h-3 w-3" />
                </Button>
            </div>
        )
    }

    if (sewa.status === 'aktif') {
        return (
            <div className="flex items-center gap-1.5">
                <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-3 text-xs hover:bg-gray-100"
                    onClick={() => router.push(`/admin/dashboard/sewa/${sewa.id_sewa}/edit`)}
                >
                    <Pencil className="h-3 w-3" />
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-3 text-xs hover:bg-gray-100"
                    onClick={() => router.push(`/admin/dashboard/sewa/${sewa.id_sewa}`)}
                >
                    <Eye className="h-3 w-3" />
                </Button>
            </div>
        )
    }

    return (
        <Button
            size="sm"
            variant="outline"
            className="h-8 px-3 text-xs hover:bg-gray-100"
            onClick={() => router.push(`/admin/dashboard/sewa/${sewa.id_sewa}`)}
        >
            <Eye className="h-3 w-3 mr-1" />
            Detail
        </Button>
    )
}

export const columns = (onStatusChange: () => void) => [
    {
        id: 'user',
        header: 'Penyewa',
        accessorKey: 'user',
        cell: ({ getValue }: any) => {
            const user = getValue() as Sewa['user']
            return (
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-semibold text-sm flex-shrink-0">
                        {user.nama.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 text-sm">{user.nama}</p>
                        <p className="text-xs text-gray-400">{user.no_hp || '-'}</p>
                    </div>
                </div>
            )
        }
    },
    {
        id: 'hunian',
        header: 'Kamar',
        accessorKey: 'hunian',
        cell: ({ getValue }: any) => {
            const hunian = getValue() as Sewa['hunian']
            return (
                <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{hunian.nama_hunian}</span>
                    <span className="text-xs text-gray-400">({hunian.tipe_hunian})</span>
                </div>
            )
        }
    },
    {
        id: 'created_at',
        header: 'Tanggal Request',
        accessorKey: 'created_at',
        cell: ({ getValue }: any) => (
            <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span>{formatDate(getValue() as string)}</span>
            </div>
        )
    },
    {
        id: 'tgl_jatuhtempo',
        header: 'Jatuh Tempo',
        accessorKey: 'tgl_jatuhtempo',
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
        cell: ({ row }: any) => <ActionButtons sewa={row.original} onStatusChange={onStatusChange} />,
    },
]
