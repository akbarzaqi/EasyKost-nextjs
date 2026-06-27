'use client'
import React, { useEffect, useState } from "react"
import { Search, Loader2, Mail, Phone, MapPin, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getAllUsers, deleteUser } from "@/lib/api/user"

const roleStyles: Record<string, { label: string; bg: string }> = {
    admin: { label: 'Admin', bg: 'bg-gray-900 text-white border-gray-900' },
    user: { label: 'User', bg: 'bg-gray-100 text-gray-700 border-gray-200' },
}

export default function PenggunaPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [deletingId, setDeletingId] = useState<number | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const response = await getAllUsers()
            if (!response.error && response.data) {
                setUsers(response.data)
            }
            setLoading(false)
        }
        fetchData()
    }, [])

    const handleDelete = async (id: number, nama: string) => {
        if (!confirm(`Yakin ingin menghapus "${nama}"?`)) return
        setDeletingId(id)
        await deleteUser(id)
        setUsers((prev) => prev.filter((u) => u.id_users !== id))
        setDeletingId(null)
    }

    const filtered = searchQuery.trim()
        ? users.filter((u) =>
            u.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.no_hp?.includes(searchQuery)
          )
        : users

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
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Pengguna</h1>
                    <p className="text-sm text-gray-500 mt-1">Daftar seluruh pengguna sistem kost.</p>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Cari nama, email, no HP..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white"
                    />
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kontak</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Alamat</th>
                                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-12 text-center text-gray-500">
                                            Tidak ada pengguna ditemukan.
                                        </td>
                                    </tr>
                                )}
                                {filtered.map((u, i) => {
                                    const roleCfg = roleStyles[u.role] || roleStyles.user
                                    return (
                                        <tr key={u.id_users} className={`border-b border-gray-100 hover:bg-gray-50/60 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm flex-shrink-0">
                                                        {(u.nama || '?').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{u.nama || '-'}</p>
                                                        <p className="text-xs text-gray-500">@{u.username || '-'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-gray-600">
                                                        <Mail className="h-3.5 w-3.5" />
                                                        <span>{u.email || '-'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-gray-600">
                                                        <Phone className="h-3.5 w-3.5" />
                                                        <span>{u.no_hp || '-'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${roleCfg.bg}`}>
                                                    {roleCfg.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-start gap-1.5 text-gray-600">
                                                    <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm">
                                                        {[u.alamat, u.kecamatan, u.kabupaten, u.provinsi].filter(Boolean).join(', ') || '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(u.id_users, u.nama)}
                                                    disabled={deletingId === u.id_users}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
                                                >
                                                    {deletingId === u.id_users ? (
                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    )}
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Menampilkan {filtered.length} dari {users.length} pengguna
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
