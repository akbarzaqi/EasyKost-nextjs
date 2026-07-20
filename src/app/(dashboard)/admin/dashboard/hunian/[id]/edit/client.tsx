'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Upload, BedDouble, Wallet, FileText, ImagePlus } from 'lucide-react'
import { getHunianById, updateHunian } from '@/lib/api/hunian'
import { updateBiaya } from '@/lib/api/biaya'
import { getImageUrl } from '@/lib/image'

const statusLabel: Record<string, string> = {
  kosong: 'Kosong',
  full: 'Terisi',
}

const statusValue: Record<string, string> = {
  Kosong: 'kosong',
  Terisi: 'full',
}

const formatPrice = (price: number) => `Rp ${price.toLocaleString('id-ID')}`

export default function EditHunianClient({ id }: { id: string }) {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('Kosong')
  const [hargaKost, setHargaKost] = useState('')
  const [hargaWifi, setHargaWifi] = useState('')
  const [hargaAir, setHargaAir] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const load = async () => {
      const result = await getHunianById(id)
      if (result.error || !result.data) {
        setNotFound(true)
        setLoading(false)
        return
      }
      const h = result.data
      setName(h.nama_hunian || '')
      setType(h.tipe_hunian || '')
      setStatus(statusLabel[h.status_harian] || 'Kosong')
      setDescription(h.deskripsi_hunian || '')
      setPreviewImage(getImageUrl(h.gambar_hunian) || '')
      if (h.biaya) {
        setHargaKost(String(Number(h.biaya.kost) || 0))
        setHargaWifi(String(Number(h.biaya.wifi) || 0))
        setHargaAir(String(Number(h.biaya.sampah) || 0))
      }
      setLoading(false)
    }
    load()
  }, [id])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreviewImage(reader.result as string) // ini tetap, jangan diubah
      reader.readAsDataURL(file)
      setErrors(prev => ({ ...prev, image: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = 'Nama kamar wajib diisi'
    if (!type.trim()) newErrors.type = 'Tipe kamar wajib dipilih'
    if (!hargaKost || Number(hargaKost) < 0) newErrors.harga_kost = 'Harga kost harus diisi'
    if (!hargaWifi || Number(hargaWifi) < 0) newErrors.harga_wifi = 'Harga wifi harus diisi'
    if (!hargaAir || Number(hargaAir) < 0) newErrors.harga_air = 'Harga sampah harus diisi'
    if (!description.trim()) newErrors.description = 'Deskripsi wajib diisi'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)

    const hunianResult = await updateHunian(id, {
      nama_hunian: name.trim(),
      tipe_hunian: type.trim(),
      status_harian: statusValue[status] || 'kosong',
      gambar_hunian: imageFile,
      deskripsi_hunian: description.trim(),
    })

    if (hunianResult.error) {
      alert(hunianResult.message)
      setSaving(false)
      return
    }

    const biayaResult = await updateBiaya(id, {
      wifi: Number(hargaWifi),
      sampah: Number(hargaAir),
      kost: Number(hargaKost),
    })

    if (biayaResult.error) {
      alert('Hunian tersimpan, tetapi biaya gagal diperbarui: ' + biayaResult.message)
      setSaving(false)
      return
    }

    setSaving(false)
    router.push(`/admin/dashboard/hunian/${id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Memuat data...</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Hunian tidak ditemukan.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
        >
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:bg-gray-100 transition-all">
            <ArrowLeft className="h-4 w-4" />
          </span>
          Kembali
        </button>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Hunian</h1>
          <p className="text-sm text-gray-500 mt-1">Perbarui informasi hunian di bawah ini.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <BedDouble className="h-5 w-5 text-gray-400" />
                    Informasi Kamar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Nama Kamar <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Contoh: Kamar A1"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })) }}
                      className={`h-10 ${errors.name ? 'border-rose-500 focus-visible:ring-rose-500/50' : ''}`}
                    />
                    {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                        Tipe Kamar <span className="text-rose-500">*</span>
                      </Label>
                      <select
                        id="type"
                        value={type}
                        onChange={(e) => { setType(e.target.value); setErrors(prev => ({ ...prev, type: '' })) }}
                        className={`flex h-10 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 ${
                          errors.type ? 'border-rose-500 focus-visible:ring-rose-500/50' : 'border-input'
                        }`}
                      >
                        <option value="">Pilih tipe</option>
                        <option value="Premium Room">Premium Room</option>
                        <option value="Standard Room">Standard Room</option>
                        <option value="Economy Room">Economy Room</option>
                      </select>
                      {errors.type && <p className="text-xs text-rose-500">{errors.type}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                        Status
                      </Label>
                      <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
                      >
                        <option value="Kosong">Kosong</option>
                        <option value="Terisi">Terisi</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Rincian Harga per Bulan <span className="text-rose-500">*</span>
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="harga_kost" className="text-xs text-gray-500">Kost</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rp</span>
                          <Input
                            id="harga_kost"
                            type="number"
                            placeholder="0"
                            value={hargaKost}
                            onChange={(e) => { setHargaKost(e.target.value); setErrors(prev => ({ ...prev, harga_kost: '' })) }}
                            className={`h-10 pl-10 ${errors.harga_kost ? 'border-rose-500 focus-visible:ring-rose-500/50' : ''}`}
                          />
                        </div>
                        {errors.harga_kost && <p className="text-xs text-rose-500">{errors.harga_kost}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="harga_wifi" className="text-xs text-gray-500">WiFi</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rp</span>
                          <Input
                            id="harga_wifi"
                            type="number"
                            placeholder="0"
                            value={hargaWifi}
                            onChange={(e) => { setHargaWifi(e.target.value); setErrors(prev => ({ ...prev, harga_wifi: '' })) }}
                            className={`h-10 pl-10 ${errors.harga_wifi ? 'border-rose-500 focus-visible:ring-rose-500/50' : ''}`}
                          />
                        </div>
                        {errors.harga_wifi && <p className="text-xs text-rose-500">{errors.harga_wifi}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="harga_air" className="text-xs text-gray-500">Sampah</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rp</span>
                          <Input
                            id="harga_air"
                            type="number"
                            placeholder="0"
                            value={hargaAir}
                            onChange={(e) => { setHargaAir(e.target.value); setErrors(prev => ({ ...prev, harga_air: '' })) }}
                            className={`h-10 pl-10 ${errors.harga_air ? 'border-rose-500 focus-visible:ring-rose-500/50' : ''}`}
                          />
                        </div>
                        {errors.harga_air && <p className="text-xs text-rose-500">{errors.harga_air}</p>}
                      </div>
                    </div>
                    {hargaKost && hargaWifi && hargaAir && (
                      <p className="text-xs text-gray-400 mt-1">
                        Total: {formatPrice(Number(hargaKost) + Number(hargaWifi) + Number(hargaAir))} / bulan
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Deskripsi <span className="text-rose-500">*</span>
                    </Label>
                    <textarea
                      id="description"
                      rows={4}
                      placeholder="Deskripsikan fasilitas dan detail kamar..."
                      value={description}
                      onChange={(e) => { setDescription(e.target.value); setErrors(prev => ({ ...prev, description: '' })) }}
                      className={`flex w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 resize-none ${
                        errors.description ? 'border-rose-500 focus-visible:ring-rose-500/50' : 'border-input'
                      }`}
                    />
                    {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <ImagePlus className="h-5 w-5 text-gray-400" />
                    Foto Kamar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <label
                    htmlFor="image_upload"
                    className="mt-4 flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 cursor-pointer hover:border-gray-400 hover:bg-gray-100/50 transition-colors"
                  >
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 font-medium">Klik untuk upload gambar</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, maks. 5MB</p>
                      </>
                    )}
                  </label>
                  <input
                    id="image_upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {errors.image && <p className="text-xs text-rose-500 mt-2">{errors.image}</p>}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-5">
              <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-400" />
                    Ringkasan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Nama</span>
                    <span className="font-medium text-gray-900">{name || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Tipe</span>
                    <span className="font-medium text-gray-900">{type || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className={`font-medium ${status === 'Terisi' ? 'text-rose-600' : 'text-emerald-600'}`}>{status}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Kost</span>
                      <span className="font-medium text-gray-900">{hargaKost ? formatPrice(Number(hargaKost)) : '-'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">WiFi</span>
                      <span className="font-medium text-gray-900">{hargaWifi ? formatPrice(Number(hargaWifi)) : '-'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Sampah</span>
                      <span className="font-medium text-gray-900">{hargaAir ? formatPrice(Number(hargaAir)) : '-'}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">Total</span>
                      <span className="font-semibold text-emerald-600">
                        {hargaKost && hargaWifi && hargaAir ? formatPrice(Number(hargaKost) + Number(hargaWifi) + Number(hargaAir)) : '-'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
                <CardContent className="pt-6 space-y-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Wallet className="h-4 w-4" />
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-700 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Batal
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
