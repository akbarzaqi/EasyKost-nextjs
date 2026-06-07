'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, User, Home, Calendar, FileText } from 'lucide-react'

type Sewa = {
  id: string
  name: string
  room: string
  startDate: string
  endDate: string
  status: 'aktif' | 'berakhir' | 'menunggu'
}

const sewaData: Sewa[] = [
  { id: '1', name: 'John Doe', room: 'A101', startDate: '2024-07-01', endDate: '2024-07-31', status: 'aktif' },
  { id: '2', name: 'Jane Smith', room: 'B202', startDate: '2024-07-05', endDate: '2024-07-25', status: 'menunggu' },
  { id: '3', name: 'Alice Johnson', room: 'C303', startDate: '2024-06-15', endDate: '2024-07-15', status: 'berakhir' },
]

const fetchSewaData = async (): Promise<Sewa[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(sewaData), 1000)
  })
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

const statusLabels: Record<string, string> = {
  aktif: 'Aktif',
  berakhir: 'Berakhir',
  menunggu: 'Menunggu',
}

const statusStyles: Record<string, string> = {
  aktif: 'text-emerald-600',
  berakhir: 'text-slate-600',
  menunggu: 'text-amber-600',
}

export default function EditSewaClient({ id }: { id: string }) {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState<'aktif' | 'berakhir' | 'menunggu'>('aktif')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const load = async () => {
      const all = await fetchSewaData()
      const found = all.find((s) => s.id === id)
      if (found) {
        setName(found.name)
        setRoom(found.room)
        setStartDate(found.startDate)
        setEndDate(found.endDate)
        setStatus(found.status)
      } else {
        setNotFound(true)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = 'Nama penghuni wajib diisi'
    if (!room.trim()) newErrors.room = 'Nomor kamar wajib diisi'
    if (!startDate) newErrors.startDate = 'Tanggal mulai wajib diisi'
    if (!endDate) newErrors.endDate = 'Tanggal akhir wajib diisi'
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = 'Tanggal akhir harus setelah tanggal mulai'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const updatedSewa = {
      id,
      name,
      room,
      startDate,
      endDate,
      status,
    }
    console.log('Data sewa updated:', updatedSewa)
    router.push('/admin/dashboard/sewa')
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
        <p className="text-gray-600">Data sewa tidak ditemukan.</p>
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Sewa</h1>
          <p className="text-sm text-gray-500 mt-1">Perbarui informasi sewa di bawah ini.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-400" />
                    Informasi Penghuni
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Nama Penghuni <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Contoh: John Doe"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })) }}
                      className={`h-10 ${errors.name ? 'border-rose-500 focus-visible:ring-rose-500/50' : ''}`}
                    />
                    {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room" className="text-sm font-medium text-gray-700">
                      Nomor Kamar <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="room"
                      type="text"
                      placeholder="Contoh: A101"
                      value={room}
                      onChange={(e) => { setRoom(e.target.value); setErrors(prev => ({ ...prev, room: '' })) }}
                      className={`h-10 ${errors.room ? 'border-rose-500 focus-visible:ring-rose-500/50' : ''}`}
                    />
                    {errors.room && <p className="text-xs text-rose-500">{errors.room}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                      Status
                    </Label>
                    <select
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'aktif' | 'berakhir' | 'menunggu')}
                      className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
                    >
                      <option value="aktif">Aktif</option>
                      <option value="menunggu">Menunggu</option>
                      <option value="berakhir">Berakhir</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    Periode Sewa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                        Tanggal Mulai <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => { setStartDate(e.target.value); setErrors(prev => ({ ...prev, startDate: '' })) }}
                        className={`h-10 ${errors.startDate ? 'border-rose-500 focus-visible:ring-rose-500/50' : ''}`}
                      />
                      {errors.startDate && <p className="text-xs text-rose-500">{errors.startDate}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                        Tanggal Akhir <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => { setEndDate(e.target.value); setErrors(prev => ({ ...prev, endDate: '' })) }}
                        className={`h-10 ${errors.endDate ? 'border-rose-500 focus-visible:ring-rose-500/50' : ''}`}
                      />
                      {errors.endDate && <p className="text-xs text-rose-500">{errors.endDate}</p>}
                    </div>
                  </div>
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
                    <span className="text-gray-500">Kamar</span>
                    <span className="font-medium text-gray-900">{room || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className={`font-medium ${statusStyles[status]}`}>{statusLabels[status]}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Mulai</span>
                    <span className="font-medium text-gray-900">{formatDate(startDate)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Akhir</span>
                    <span className="font-medium text-gray-900">{formatDate(endDate)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 rounded-xl bg-white shadow-sm">
                <CardContent className="pt-6 space-y-3">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                  >
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
