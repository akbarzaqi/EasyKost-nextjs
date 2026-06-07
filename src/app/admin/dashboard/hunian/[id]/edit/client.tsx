'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Upload, BedDouble, Wallet, FileText, ImagePlus } from 'lucide-react'

type Hunian = {
  id: number
  name: string
  total_price: number
  type: string
  status: string
  description: string
  image_url: string
}

const data: Hunian[] = [
  {
    id: 1,
    name: 'Kamar A1',
    total_price: 1000000,
    type: 'Premium Room',
    status: 'Terisi',
    description: 'Kamar dengan fasilitas lengkap dan nyaman untuk hunian jangka panjang.',
    image_url: '/images/room1.jpg',
  },
  {
    id: 2,
    name: 'Kamar B2',
    total_price: 750000,
    type: 'Standard Room',
    status: 'Kosong',
    description: 'Kamar dengan fasilitas standar yang cocok untuk hunian sementara.',
    image_url: '/images/room1.jpg',
  },
  {
    id: 3,
    name: 'Kamar C3',
    total_price: 500000,
    type: 'Economy Room',
    status: 'Terisi',
    description: 'Kamar dengan fasilitas dasar yang cocok untuk hunian dengan budget terbatas.',
    image_url: '/images/room1.jpg',
  },
]

const fetchHunianData = async (): Promise<Hunian[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, 1000)
  })
}

const formatPrice = (price: number) => `Rp ${price.toLocaleString('id-ID')}`

export default function EditHunianClient({ id }: { id: string }) {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('Kosong')
  const [totalPrice, setTotalPrice] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const load = async () => {
      const all = await fetchHunianData()
      const found = all.find((h) => h.id === Number(id))
      if (found) {
        setName(found.name)
        setType(found.type)
        setStatus(found.status)
        setTotalPrice(String(found.total_price))
        setDescription(found.description)
        setPreviewImage(found.image_url)
      } else {
        setNotFound(true)
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
      reader.onloadend = () => setPreviewImage(reader.result as string)
      reader.readAsDataURL(file)
      setErrors(prev => ({ ...prev, image: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = 'Nama kamar wajib diisi'
    if (!type.trim()) newErrors.type = 'Tipe kamar wajib dipilih'
    if (!totalPrice || Number(totalPrice) <= 0) newErrors.total_price = 'Harga harus lebih dari 0'
    if (!description.trim()) newErrors.description = 'Deskripsi wajib diisi'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const updatedHunian = {
      id: Number(id),
      name,
      type,
      status,
      total_price: Number(totalPrice),
      description,
      image_url: previewImage,
    }
    console.log('Data hunian updated:', updatedHunian)
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

                  <div className="space-y-2">
                    <Label htmlFor="total_price" className="text-sm font-medium text-gray-700">
                      Harga per Bulan <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rp</span>
                      <Input
                        id="total_price"
                        type="number"
                        placeholder="0"
                        value={totalPrice}
                        onChange={(e) => { setTotalPrice(e.target.value); setErrors(prev => ({ ...prev, total_price: '' })) }}
                        className={`h-10 pl-10 ${errors.total_price ? 'border-rose-500 focus-visible:ring-rose-500/50' : ''}`}
                      />
                    </div>
                    {totalPrice && Number(totalPrice) > 0 && (
                      <p className="text-xs text-gray-400">{formatPrice(Number(totalPrice))} / bulan</p>
                    )}
                    {errors.total_price && <p className="text-xs text-rose-500">{errors.total_price}</p>}
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
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Harga</span>
                    <span className="font-medium text-emerald-600">
                      {totalPrice && Number(totalPrice) > 0 ? formatPrice(Number(totalPrice)) : '-'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
                <CardContent className="pt-6 space-y-3">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                  >
                    <Wallet className="h-4 w-4" />
                    Simpan Perubahan
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
