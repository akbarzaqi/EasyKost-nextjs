"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  MapPin,
  CreditCard,
  History,
  ChevronRight,
  Wallet,
  BedDouble,
  Home,
  Loader2,
  Calendar,
  Wifi,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/styles/components/ui/card";
import { Button } from "@/styles/components/ui/button";
import { Badge } from "@/styles/components/ui/badge";
import { getMySewa } from "@/lib/api/sewa";
import { getImageUrl } from "@/lib/image";

const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`;

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};

export default function KamarSayaPage() {
  const router = useRouter();
  const [sewa, setSewa] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMySewa();
      if (!response.error && response.data) {
        setSewa(response.data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!sewa || !sewa.hunian) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Home className="h-8 w-8 text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Belum Ada Sewa Aktif</h2>
          <p className="text-gray-500 mt-2 max-w-sm">
            Anda belum memiliki kamar yang disewa. Silakan booking kamar terlebih dahulu.
          </p>
          <Button
            onClick={() => router.push('/')}
            className="mt-6 bg-gray-900 text-white hover:bg-gray-800"
          >
            Cari Kamar
          </Button>
        </div>
      </div>
    );
  }

  const hunian = sewa.hunian;
  const biaya = hunian.biaya;
  const totalPrice = biaya
    ? Number(biaya.wifi) + Number(biaya.sampah) + Number(biaya.kost)
    : 0;

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">
              {/* Image */}
              <div className="relative h-56 md:h-72 bg-gray-200">
                {hunian.gambar_hunian ? (
                  <img
                    src={getImageUrl(hunian.gambar_hunian) || ''}
                    alt={hunian.nama_hunian}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                    <Home className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Terhuni
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white/90 text-gray-700 backdrop-blur-sm">
                    <BedDouble className="h-3 w-3" />
                    {hunian.tipe_hunian}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-sm">
                    {hunian.nama_hunian}
                  </h1>
                  <p className="text-sm text-white/80 max-w-xl leading-relaxed mt-1">
                    {hunian.deskripsi_hunian || 'Kamar dengan fasilitas lengkap.'}
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
                    {biaya && (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Kost</span>
                          <span className="font-medium text-gray-900">{formatRupiah(Number(biaya.kost))}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">WiFi</span>
                          <span className="font-medium text-gray-900">{formatRupiah(Number(biaya.wifi))}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Sampah</span>
                          <span className="font-medium text-gray-900">{formatRupiah(Number(biaya.sampah))}</span>
                        </div>
                      </>
                    )}
                    <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Total</span>
                      <span className="text-lg font-bold text-emerald-600">{formatRupiah(totalPrice)}</span>
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
                  <p className="text-lg font-semibold text-gray-900">{hunian.tipe_hunian}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="text-sm">{hunian.nama_hunian}</span>
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
                  <p className="text-sm text-gray-500 mt-1">
                    Jatuh tempo: {formatDate(sewa.tgl_jatuhtempo)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
                <CardTitle className="text-base font-semibold text-gray-900">Info Penyewaan</CardTitle>
                <Badge className="gap-1.5 bg-emerald-100 text-emerald-700 border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Aktif
                </Badge>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">ID Sewa</span>
                  <span className="font-semibold text-gray-900">#{sewa.id_sewa}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Kamar</span>
                  <span className="font-semibold text-gray-900">{hunian.nama_hunian}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Tanggal Request</span>
                  <span className="font-semibold text-gray-900">{formatDate(sewa.created_at)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Jatuh Tempo</span>
                  <span className="font-semibold text-gray-900">{formatDate(sewa.tgl_jatuhtempo)}</span>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-900 rounded-lg">
                        <CreditCard className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Tagihan</p>
                        <p className="text-xs text-gray-500">{formatRupiah(totalPrice)} / bulan</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push('/users/dashboard/tagihan')}
                      className="w-full bg-black text-white hover:bg-gray-900 font-medium py-2.5 text-sm"
                    >
                      Lihat Tagihan
                    </Button>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-1">
                  <button
                    onClick={() => router.push('/users/dashboard/tagihan')}
                    className="flex items-center justify-between w-full py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <History className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700 font-medium">Riwayat Pembayaran</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
