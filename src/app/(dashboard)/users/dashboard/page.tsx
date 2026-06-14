"use client";

import { Home, Wifi, Bolt, Droplet, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/styles/components/ui/card";
import { Button } from "@/styles/components/ui/button";
import { Badge } from "@/styles/components/ui/badge";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F7F7F7] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Row - Two Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Card - Welcome Card */}
          <Card className="relative overflow-hidden border-gray-200 shadow-sm">
            <div className="absolute top-0 right-0 w-72 h-72 bg-gray-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2" aria-hidden="true" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl font-bold text-gray-900">Selamat Pagi, Rizky.</CardTitle>
              <p className="text-gray-500 mt-1 text-base">Informasi kamar Anda tetap terorganisir di sini.</p>
            </CardHeader>
            <CardContent className="relative z-10 mt-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <Home className="h-5 w-5 text-gray-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">KAMAR SAAT INI</p>
                  <p className="font-semibold text-gray-900 text-base">Lantai 2, Room 204</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Card - Billing Card */}
          <Card className="relative overflow-hidden bg-black border-black shadow-lg">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2" aria-hidden="true" />
            <CardHeader className="relative z-10 pb-4">
              <p className="text-gray-400 text-sm uppercase tracking-wide">Total Tagihan Bulan Ini</p>
              <div className="mt-3">
                <p className="text-5xl font-bold text-white tracking-tight">Rp2.450k</p>
              </div>
              <p className="mt-2 text-gray-500 text-sm">Jatuh tempo: 28 Januari 2024</p>
            </CardHeader>
            <CardContent className="relative z-10 space-y-3 pt-0">
              <Button className="w-full bg-white text-black border border-white hover:bg-gray-100 font-medium py-3.5 text-base transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                Bayar Sekarang
              </Button>
              <Button variant="ghost" className="w-full border border-white/30 text-white hover:bg-white/5 hover:border-white/50 hover:text-white font-medium py-3.5 text-base transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                Lihat Tagihan
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row - Two Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Card - Last Payment History */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
              <CardTitle className="text-lg font-semibold text-gray-900">Pembayaran Terakhir</CardTitle>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200 text-xs px-3 py-1">
                TERBAYAR
              </Badge>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Januari 2024</p>
                    <p className="font-semibold text-gray-900">Tagihan Bulanan</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900 whitespace-nowrap">Rp2.450.000</p>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 italic">Dibayar pada 2 Jan 2024</p>
            </CardFooter>
          </Card>

          {/* Right Card - Service Summary */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Ringkasan Layanan</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-4">
                {/* WiFi Service */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center hover:border-gray-200 transition-colors">
                  <div className="p-2 bg-white rounded-lg border border-gray-100 inline-flex mb-3">
                    <Wifi className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  </div>
                  <p className="text-xs text-gray-500 mb-1">WiFi Status</p>
                  <p className="font-semibold text-gray-900 text-sm">Aktif</p>
                </div>

                {/* Electricity Service */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center hover:border-gray-200 transition-colors">
                  <div className="p-2 bg-white rounded-lg border border-gray-100 inline-flex mb-3">
                    <Bolt className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  </div>
                  <p className="text-xs text-gray-500 mb-1">Listrik</p>
                  <p className="font-semibold text-gray-900 text-sm">Token</p>
                </div>

                {/* Water Service */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center hover:border-gray-200 transition-colors">
                  <div className="p-2 bg-white rounded-lg border border-gray-100 inline-flex mb-3">
                    <Droplet className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  </div>
                  <p className="text-xs text-gray-500 mb-1">Air PAM</p>
                  <p className="font-semibold text-gray-900 text-sm">Normal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}