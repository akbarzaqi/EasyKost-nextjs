"use client";

import {
  MessageSquare,
  MapPin,
  CreditCard,
  History,
  ChevronRight,
  Wallet,
  BedDouble,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/styles/components/ui/card";
import { Button } from "@/styles/components/ui/button";
import { Badge } from "@/styles/components/ui/badge";

const contractInfo = [
  { label: "ID Kontrak", value: "#RR-2023-9812" },
  { label: "Tanggal Mulai", value: "12 Jan 2024" },
  { label: "Jatuh Tempo", value: "12 Feb 2024" },
  { label: "Metode Bayar", value: "Bank Transfer" },
];

const quickActions = [
  { icon: History, label: "Riwayat Pembayaran", rightIcon: ChevronRight },
];

export default function KamarSayaPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F7] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <span>Dashboard</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">Kamar Saya</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mt-1">
              Detail Kamar
            </h1>
          </div>
          <Button
            variant="outline"
            className="gap-2 border-gray-900 text-gray-900 hover:bg-gray-50 h-10"
          >
            <MessageSquare className="h-4 w-4" />
            Hubungi Pengelola
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Room Info & Amenities */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">
              {/* Image Banner */}
              <div className="relative h-56 md:h-72 bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyek0zNiAxNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Terhuni
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white/90 text-gray-700 backdrop-blur-sm">
                    <BedDouble className="h-3 w-3" />
                    Deluxe Suite
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white/90 text-gray-700 backdrop-blur-sm">
                    Lantai 1
                  </span>
                </div>
                {/* Room Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-sm">
                    Deluxe Suite &ndash; A102
                  </h1>
                  <p className="text-sm text-white/80 max-w-xl leading-relaxed mt-1">
                    Kamar dengan fasilitas lengkap dan nyaman untuk hunian jangka panjang.
                  </p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 border-t border-gray-100">
                <div className="p-5 md:border-r border-b md:border-b-0 border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-50">
                      <Wallet className="h-4 w-4 text-emerald-600" />
                    </span>
                    <span className="text-sm font-medium text-gray-500">Rincian Harga</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Kost</span>
                      <span className="font-medium text-gray-900">Rp 2.000.000</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">WiFi</span>
                      <span className="font-medium text-gray-900">Rp 350.000</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Sampah</span>
                      <span className="font-medium text-gray-900">Rp 100.000</span>
                    </div>
                    <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Total</span>
                      <span className="text-lg font-bold text-emerald-600">Rp 2.450.000</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 md:border-r border-b md:border-b-0 border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-blue-50">
                      <BedDouble className="h-4 w-4 text-blue-600" />
                    </span>
                    <span className="text-sm font-medium text-gray-500">Tipe Kamar</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">Deluxe Suite</p>
                  <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="text-sm">Lantai 1, Sayap Timur</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-50">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-sm font-medium text-gray-500">Status</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">Aktif</p>
                  <p className="text-sm text-gray-500 mt-1">Periode Okt 2024 - Sep 2025</p>
                </div>
              </div>


            </div>
          </div>

          {/* Right Column - Rental Info */}
          <div className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
                <CardTitle className="text-base font-semibold text-gray-900">Info Penyewaan</CardTitle>
                <Badge className="gap-1.5 bg-gray-100 text-gray-700 border-gray-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Aktif
                </Badge>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {contractInfo.map((item) => (
                  <div key={item.label} className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}

                <div className="border-t border-gray-100 pt-4">
                  <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-900 rounded-lg">
                        <CreditCard className="h-4 w-4 text-white" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Tagihan Berikutnya</p>
                        <p className="text-xs text-gray-500">Sisa 8 hari lagi</p>
                      </div>
                    </div>
                    <Button className="w-full bg-black text-white hover:bg-gray-900 font-medium py-2.5 text-sm">
                      Bayar Sekarang
                    </Button>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-1">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      className="flex items-center justify-between w-full py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <action.icon className="h-4 w-4 text-gray-500" aria-hidden="true" />
                        <span className="text-gray-700 font-medium">{action.label}</span>
                      </div>
                      <action.rightIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}