'use client'

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Home, 
  BedDouble, 
  Wifi, 
  Trash2, 
  Wallet, 
  MapPin, 
  ChevronRight, 
  LogIn, 
  Loader2, 
  Check,
  Building2,
  Shield,
  Star,
  Menu,
  X
} from "lucide-react"
import { getImageUrl } from "../lib/image"
import { getPublicHunian } from "../lib/api/hunian"
import { useAuth } from "../lib/hooks/useAuth"
import { Carousel } from "@/styles/components/ui/carousel"

type Biaya = {
  id_biaya: number
  wifi: string
  sampah: string
  kost: string
}

type Hunian = {
  id_hunian: number
  nama_hunian: string
  tipe_hunian: string
  status_harian: string
  gambar_hunian: string
  deskripsi_hunian: string
  total_price: number
  biaya: Biaya
}

const formatPrice = (price: number) =>
  `Rp ${price.toLocaleString('id-ID')}`

const navLinks = [
  { href: '#home', label: 'Beranda' },
  { href: '#rooms', label: 'Kamar' },
  { href: '#facilities', label: 'Fasilitas' },
  { href: '#about', label: 'Tentang' },
]

const features = [
  { icon: Wifi, title: 'WiFi High-Speed', desc: 'Internet cepat untuk kerja dan belajar' },
  { icon: Shield, title: 'Keamanan CCTV 24 Jam', desc: 'Pengawasan berkelanjutan untuk keamanan Anda' },
]

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [hunianList, setHunianList] = useState<Hunian[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPublicHunian()
      if (!response.error && response.data) {
        const mapped = response.data.map((h: any) => ({
          ...h,
          total_price: h.biaya
            ? Number(h.biaya.wifi) + Number(h.biaya.sampah) + Number(h.biaya.kost)
            : 0,
        }))
        setHunianList(mapped)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const availableRooms = hunianList.filter(
    (h) => h.status_harian.toLowerCase() === "kosong"
  )

  const handleBooking = (id: number) => {
    if (user) {
      router.push(`/sewa/${id}`)
    } else {
      router.push(`/login?redirect=/sewa/${id}`)
    }
  }

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
<nav id="home" className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="#home" className="flex items-center gap-2 text-black font-bold text-xl lg:text-2xl">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span>Kost Pak Aji</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                  className="text-sm font-medium text-black hover:text-gray-900 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => router.push('/login')}
                className="px-5 py-2 text-sm font-medium text-black hover:text-gray-900 transition-colors"
              >
                Masuk
              </button>
              <button
                onClick={() => router.push('/register')}
                className="px-5 py-2 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
              >
                Daftar
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-black hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 animate-slide-down">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                    className="text-base font-medium text-black hover:text-gray-900 transition-colors px-2"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => { router.push('/login'); setMobileMenuOpen(false); }}
                    className="px-4 py-2 text-base font-medium text-black hover:text-gray-900 text-left"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => { router.push('/register'); setMobileMenuOpen(false); }}
                    className="px-4 py-2 text-base font-medium text-white bg-black rounded-xl"
                  >
                    Daftar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

{/* Hero Section */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-navy-100/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-50/50 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="relative z-10">

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-900 leading-tight tracking-tight">
                Temukan Kamar Kost Nyaman dan
                <br />
                <span className="text-blue-600">Terjangkau</span>
              </h1>

              <p className="mt-6 text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
                Kamar nyaman dengan fasilitas lengkap, lokasi strategis dekat berbagai kebutuhan, serta harga bulanan yang terjangkau. Nikmati lingkungan yang bersih, aman, dan nyaman untuk mendukung aktivitas belajar maupun bekerja setiap hari.
              </p>

{/* Features */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <feature.icon className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">{feature.title}</h3>
                      <p className="text-sm text-gray-600 mt-0.5">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Image with Floating Cards */}
            <div className="relative z-10">
              <div className="relative">
                {/* Main Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-100 aspect-[4/3] lg:aspect-[5/4]">
                  <img
                    src="/images/1.jpeg"
                    alt="Gedung Kost Pak Aji"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/20 via-transparent to-transparent" />
                </div>

                {/* Floating Card 1 - Price */}
                <div className="absolute -bottom-6 left-6 lg:-bottom-8 lg:left-8 w-64 lg:w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-5 border border-gray-100 animate-float">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl lg:text-4xl font-bold text-navy-900">Rp850.000</span>
                    <span className="text-gray-500">/bulan</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Harga mulai</p>
                </div>

                {/* Floating Card 2 - Available */}
                <div className="absolute bottom-8 right-6 lg:bottom-10 lg:right-8 w-52 lg:w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-5 border border-gray-100 animate-float-delayed">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Check className="h-5 w-5" />
                    <span className="font-semibold text-navy-900">{availableRooms.length} Kamar Tersedia</span>
                  </div>
                  <p className="text-sm text-gray-500">Siap dihuni</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="py-16 lg:py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
            {[
              { value: hunianList.length, label: 'Kamar' },
              { value: hunianList.length - availableRooms.length, label: 'Terisi' },
              { value: availableRooms.length, label: 'Tersedia' },
            ].map((stat, index) => (
              <div
                key={index}
                className="relative w-40 lg:w-48 p-6 lg:p-8 bg-white rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all duration-300"
              >
                {index < 2 && (
                  <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-gray-100 to-transparent" />
                )}
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl lg:text-4xl font-bold text-navy-900">{stat.value}</span>
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Rooms Section */}
      <section id="rooms" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-black rounded-full text-sm font-medium mb-4">
              Semua Kamar
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-black leading-tight">
              Daftar Kamar
            </h2>
            <p className="mt-4 text-lg text-black">
              {hunianList.length} kamar dengan fasilitas lengkap
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-100" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-100 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="h-4 bg-gray-100 rounded w-5/6" />
                    <div className="h-8 bg-gray-100 rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : hunianList.length === 0 ? (
            <div className="text-center py-20">
              <Home className="h-16 w-16 text-black mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-black mb-2">Belum Ada Kamar</h3>
              <p className="text-black">Belum ada kamar yang tersedia saat ini.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {hunianList.map((hunian) => {
                const isAvailable = hunian.status_harian.toLowerCase() === "kosong"
                return (
                <article
                  key={hunian.id_hunian}
                  className={`group bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${isAvailable ? 'border-gray-100 hover:shadow-xl hover:border-blue-100' : 'border-rose-100 bg-rose-50/30 opacity-75'}`}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className={`relative ${isAvailable ? 'md:w-72 h-48' : 'w-full h-32'} bg-gray-100 overflow-hidden flex-shrink-0`}>
                      {hunian.gambar_hunian ? (
                        <img
                          src={getImageUrl(hunian.gambar_hunian) || ''}
                          alt={hunian.nama_hunian}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                          <BedDouble className="h-14 w-14 text-blue-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 right-3 flex justify-between">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 backdrop-blur-sm text-white text-xs font-medium rounded-full ${isAvailable ? 'bg-emerald-500/90' : 'bg-rose-500/90'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${isAvailable ? 'bg-emerald-300' : 'bg-rose-300'}`} />
                          {isAvailable ? 'Tersedia' : 'Penuh'}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur-sm text-navy-900 text-xs font-medium rounded-full">
                          <BedDouble className="h-3 w-3" />
                          {hunian.tipe_hunian}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 md:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <Link href={`/hunian/${hunian.id_hunian}`} className="block">
                          <h3 className="text-lg font-semibold text-black transition-colors">
                            {hunian.nama_hunian}
                          </h3>
                        </Link>

                        <p className="mt-1 text-sm text-black line-clamp-2">
                          {hunian.deskripsi_hunian || "Kamar nyaman dengan fasilitas lengkap untuk kebutuhan sehari-hari Anda."}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {hunian.biaya && (
                            <>
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                                <Wifi className="h-3 w-3" />
                                WiFi Termasuk
                              </span>
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-lg">
                                <Trash2 className="h-3 w-3" />
                                Layanan Kebersihan
                              </span>
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-lg">
                                <Shield className="h-3 w-3" />
                                Keamanan 24 Jam
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Mulai dari</p>
                          <p className="text-2xl font-bold text-black">
                            {formatPrice(hunian.total_price)}
                            <span className="text-base font-normal text-gray-400">/bulan</span>
                          </p>
                        </div>
                        <button
                          onClick={() => handleBooking(hunian.id_hunian)}
                          disabled={!isAvailable}
                          className={`inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium rounded-xl shadow-sm transition-colors ${isAvailable ? 'bg-black text-white hover:bg-gray-800 hover:shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                        >
                          {isAvailable ? 'Pesan Sekarang' : 'Penuh'}
                          {isAvailable && <ChevronRight className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )})}
            </div>
          )}
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-black rounded-full text-sm font-medium mb-4">
              Fasilitas Kami
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-black leading-tight">
              Fasilitas Lengkap untuk Kenyamanan Anda
            </h2>
            <p className="mt-4 text-lg text-black">
              Semua yang Anda butuhkan untuk tinggal nyaman dan tenang
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto">
            {[
              { icon: Wifi, title: 'WiFi High-Speed', desc: 'Internet cepat untuk kerja dan belajar' },
              { icon: Shield, title: 'Keamanan CCTV 24 Jam', desc: 'Pengawasan berkelanjutan untuk keamanan Anda' },
            ].map((facility, index) => (
              <div
                key={index}
                className="group p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:bg-white transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all duration-300">
                  <facility.icon className="h-6 w-6 text-blue-600 group-hover:text-blue-700 transition-colors" />
                </div>
                <h3 className="font-semibold text-black mb-2">{facility.title}</h3>
                <p className="text-sm text-black leading-relaxed">{facility.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-100 aspect-[4/3]">
              <img
                src="/images/room1.jpg"
                alt="Interior Kost Pak Aji"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-black rounded-full text-sm font-medium mb-4">
                Tentang Kami
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-black leading-tight mb-6">
                Rumah Kedua yang Nyaman
              </h2>
              <div className="space-y-4 text-black leading-relaxed">
                <p>
                  Kost Pak Aji hadir sebagai pilihan hunian yang nyaman, aman, dan terjangkau bagi mahasiswa maupun profesional muda. Berlokasi strategis dengan akses yang mudah ke kampus, tempat kerja, serta berbagai fasilitas umum, kami berkomitmen memberikan pengalaman tinggal yang praktis dan menyenangkan.
                </p>
                <p>
                  Setiap kamar dirancang untuk memberikan kenyamanan maksimal dengan fasilitas yang lengkap, mulai dari tempat tidur yang nyaman, ruang penyimpanan yang memadai, akses internet berkecepatan tinggi, hingga lingkungan yang bersih dan terawat. Didukung sistem keamanan yang baik dan suasana yang tenang, Anda dapat beristirahat, belajar, maupun bekerja dengan lebih fokus.
                </p>
                <p className="font-medium text-black">
                  Lebih dari sekadar tempat tinggal, Kost Pak Aji adalah tempat untuk membangun kenyamanan dan menjalani aktivitas sehari-hari dengan tenang. Bergabunglah bersama para penghuni yang telah mempercayakan Kost Pak Aji sebagai rumah kedua mereka.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="lg:col-span-1">
              <Link href="#home" className="flex items-center gap-2 text-black font-bold text-xl lg:text-2xl mb-4">
                <Building2 className="h-8 w-8 text-black" />
                <span>Kost Pak Aji</span>
              </Link>
              <p className="text-black text-sm leading-relaxed mb-6">
                Kamar kost nyaman dan terjangkau dengan fasilitas lengkap.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Building2, href: '#', label: 'Facebook' },
                  { icon: Wifi, href: '#', label: 'Instagram' },
                  { icon: MapPin, href: '#', label: 'Maps' },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-black mb-4">Tautan Cepat</h4>
              <nav className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                    className="block text-gray-700 hover:text-black text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h4 className="font-semibold text-black mb-4">Fasilitas</h4>
              <nav className="space-y-2">
                {['WiFi High-Speed', 'Keamanan 24/7'].map((facility, index) => (
                  <Link
                    key={index}
                    href="#facilities"
                    onClick={(e) => { e.preventDefault(); scrollToSection('#facilities'); }}
                    className="block text-gray-700 hover:text-black text-sm transition-colors"
                  >
                    {facility}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h4 className="font-semibold text-black mb-4">Informasi Kontak</h4>
              <address className="text-gray-700 text-sm not-italic space-y-2">
                <p>-</p>
                <p>-</p>
                <p className="mt-4">-</p>
                <p>-</p>
              </address>
            </div>
          </div>

          <div className="mt-12 lg:mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} Kost Pak Aji. Hak cipta dilindungi.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="#" className="hover:text-black transition-colors">Kebijakan Privasi</Link>
              <Link href="#" className="hover:text-black transition-colors">Syarat & Ketentuan</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}