'use client'

import React, { useEffect, useState } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { updateProfile, updateFoto } from "@/lib/api/user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Camera, Loader2, CheckCircle, Image as ImageIcon } from "lucide-react"

export default function AdminProfilePage() {
    const { user, loginUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    const [form, setForm] = useState({
        nama: "",
        email: "",
        no_hp: "",
        pekerjaan: "",
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        alamat: "",
    })

    useEffect(() => {
        if (user) {
            setForm({
                nama: user.nama || "",
                email: user.email || "",
                no_hp: (user as any).no_hp || "",
                pekerjaan: (user as any).pekerjaan || "",
                provinsi: (user as any).provinsi || "",
                kabupaten: (user as any).kabupaten || "",
                kecamatan: (user as any).kecamatan || "",
                alamat: (user as any).alamat || "",
            })
        }
    }, [user])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setSuccess("")
        setError("")

        const response = await updateProfile(form)

        setLoading(false)

        if (response.error) {
            setError(response.message)
        } else {
            setSuccess("Profil berhasil diperbarui")
            if (response.data) {
                loginUser(
                    localStorage.getItem('token') || '',
                    response.data
                )
            }
        }
    }

    const handleKtp = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setLoading(true)
        setSuccess("")
        setError("")

        const response = await updateFoto(file)

        setLoading(false)

        if (response.error) {
            setError(response.message)
        } else {
            setSuccess("Foto KTP berhasil diperbarui")
            if (response.data) {
                loginUser(
                    localStorage.getItem('token') || '',
                    response.data
                )
            }
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Profil Saya</h1>
                <p className="text-sm text-gray-500 mt-1">Kelola data diri Anda</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Data Diri</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="nama">Nama Lengkap</Label>
                                <Input id="nama" name="nama" value={form.nama} onChange={handleChange} required />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="no_hp">No. HP</Label>
                                <Input id="no_hp" name="no_hp" value={form.no_hp} onChange={handleChange} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="pekerjaan">Pekerjaan</Label>
                                <Input id="pekerjaan" name="pekerjaan" value={form.pekerjaan} onChange={handleChange} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="provinsi">Provinsi</Label>
                                <Input id="provinsi" name="provinsi" value={form.provinsi} onChange={handleChange} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="kabupaten">Kabupaten</Label>
                                <Input id="kabupaten" name="kabupaten" value={form.kabupaten} onChange={handleChange} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="kecamatan">Kecamatan</Label>
                                <Input id="kecamatan" name="kecamatan" value={form.kecamatan} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="alamat">Alamat</Label>
                            <textarea
                                id="alamat"
                                name="alamat"
                                value={form.alamat}
                                onChange={handleChange}
                                rows={3}
                                className="block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                            />
                        </div>

                        {/* Foto KTP */}
                        <div className="pt-4 border-t border-gray-100">
                            <Label className="text-base font-medium">Foto KTP</Label>
                            <p className="text-sm text-gray-500 mt-1 mb-3">Upload foto KTP Anda untuk verifikasi data.</p>
                            <div className="flex items-start gap-4">
                                <div className="h-32 w-48 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {(user as any)?.foto ? (
                                        <img
                                            src={(user as any).foto}
                                            alt="KTP"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <ImageIcon className="h-8 w-8 text-gray-300 mx-auto" />
                                            <p className="text-xs text-gray-400 mt-1">Belum ada</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 cursor-pointer transition-colors">
                                        <Camera className="h-4 w-4" />
                                        {((user as any)?.foto) ? "Ganti Foto" : "Upload Foto"}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleKtp}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-xs text-gray-400">Format: JPG, PNG. Maks 2MB</p>
                                </div>
                            </div>
                        </div>

                        {success && (
                            <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 rounded-lg px-4 py-2.5">
                                <CheckCircle className="h-4 w-4" />
                                {success}
                            </div>
                        )}
                        {error && (
                            <div className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2.5">{error}</div>
                        )}

                        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                "Simpan Perubahan"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
