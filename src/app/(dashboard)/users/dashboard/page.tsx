"use client";

import { useEffect, useState } from "react";
import { Home, User, CheckCircle, Loader2, FileText, CreditCard } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/styles/components/ui/card";
import { Button } from "@/styles/components/ui/button";
import { Badge } from "@/styles/components/ui/badge";
import { useAuth } from "@/lib/hooks/useAuth";
import { getMySewa } from "@/lib/api/sewa";
import { getMyTagihan } from "@/lib/api/tagihan";
import { useRouter } from "next/navigation";

const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`;

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
};

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [sewa, setSewa] = useState<any>(null);
  const [tagihan, setTagihan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [sewaRes, tagihanRes] = await Promise.all([
        getMySewa(),
        getMyTagihan(),
      ]);
      if (!sewaRes.error && sewaRes.data) {
        setSewa(sewaRes.data);
      }
      if (!tagihanRes.error && tagihanRes.data) {
        setTagihan(tagihanRes.data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const activeSewa = sewa?.status === 'aktif' ? sewa : null;
  const hunian = activeSewa?.hunian;

  const hitungTotal = (t: any) => {
    const b = t.sewa?.hunian?.biaya;
    return (b ? Number(b.kost) + Number(b.wifi) + Number(b.sampah) : 0) + (Number(t.air) || 0);
  };

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const tagihanBulanIni = tagihan.find((t) => {
    const d = new Date(t.tgl_tagihan);
    return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
  });

  const paidTagihan = tagihan.filter((t) => t.status === 'paid');
  const lastPayment = paidTagihan.length > 0
    ? paidTagihan.reduce((latest, t) =>
        new Date(t.transaksi?.created_at || 0) > new Date(latest.transaksi?.created_at || 0) ? t : latest
      )
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Row - Two Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Card - Welcome Card */}
          <Card className="relative overflow-hidden border-gray-200 shadow-sm">
            <div className="absolute top-0 right-0 w-72 h-72 bg-gray-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2" aria-hidden="true" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {getGreeting()}, {user?.nama || 'Penghuni'}.
              </CardTitle>
              <p className="text-gray-500 mt-1 text-base">Informasi kamar Anda tetap terorganisir di sini.</p>
            </CardHeader>
            <CardContent className="relative z-10 mt-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <Home className="h-5 w-5 text-gray-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">KAMAR SAAT INI</p>
                  <p className="font-semibold text-gray-900 text-base">
                    {activeSewa
                      ? `${hunian?.nama_hunian || '-'}${activeSewa.tgl_mulai ? ` (sejak ${formatDate(activeSewa.tgl_mulai)})` : ''}`
                      : 'Tidak ada kamar aktif'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Card - Billing Card */}
          <Card className="relative overflow-hidden bg-black border-black shadow-lg">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2" aria-hidden="true" />
            <CardHeader className="relative z-10 pb-4">
              <p className="text-gray-400 text-sm uppercase tracking-wide">
                {tagihanBulanIni?.status === 'paid' ? 'Tagihan Bulan Ini' : 'Total Tagihan Bulan Ini'}
              </p>
              <div className="mt-3">
                <p className="text-5xl font-bold text-white tracking-tight">
                  {tagihanBulanIni?.status === 'paid' ? 'Rp 0' : tagihanBulanIni ? formatRupiah(hitungTotal(tagihanBulanIni)) : 'Rp 0'}
                </p>
              </div>
              <p className="mt-2 text-gray-500 text-sm">
                {tagihanBulanIni?.status === 'paid'
                  ? 'Tagihan bulan ini sudah lunas'
                  : tagihanBulanIni
                    ? `Jatuh tempo: ${formatDate(tagihanBulanIni.tgl_jatuhtempo)}`
                    : tagihan.length > 0 ? 'Tagihan bulan ini belum tersedia' : 'Belum ada tagihan'}
              </p>
            </CardHeader>
            <CardContent className="relative z-10 space-y-3 pt-0">
              {tagihanBulanIni?.status === 'paid' && (
                <div className="w-full py-3.5 text-center text-sm font-medium text-emerald-400 bg-emerald-900/20 rounded-xl">
                  ✓ Tagihan Lunas
                </div>
              )}
              {tagihanBulanIni?.status === 'notpaid' && (
                <Button
                  onClick={() => router.push(`/users/dashboard/tagihan/invoices/${tagihanBulanIni.id_tagihan}/bayar`)}
                  className="w-full bg-white text-black border border-white hover:bg-gray-100 font-medium py-3.5 text-base transition-colors cursor-pointer"
                >
                  Bayar Sekarang
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => router.push('/users/dashboard/tagihan')}
                className="w-full border border-white/30 text-white hover:bg-white/5 hover:border-white/50 hover:text-white font-medium py-3.5 text-base transition-colors cursor-pointer"
              >
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
              {lastPayment && (
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-3 py-1">
                  LUNAS
                </Badge>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              {lastPayment ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {new Date(lastPayment.tgl_tagihan).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                      </p>
                      <p className="font-semibold text-gray-900">Tagihan Bulanan</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-gray-900 whitespace-nowrap">
                    {formatRupiah(hitungTotal(lastPayment))}
                  </p>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 text-sm">
                  Belum ada riwayat pembayaran.
                </div>
              )}
            </CardContent>
            {lastPayment && (
              <CardFooter className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 italic">
                  Dibayar pada {formatDate(lastPayment.transaksi?.created_at)}
                </p>
              </CardFooter>
            )}
          </Card>

          {/* Right Card - Quick Actions */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => router.push('/users/dashboard/tagihan')}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center hover:border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="p-2 bg-white rounded-lg border border-gray-100 inline-flex mb-3">
                    <FileText className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  </div>
                  <p className="text-xs text-gray-500 mb-1">Tagihan</p>
                  <p className="font-semibold text-gray-900 text-sm">Lihat Tagihan</p>
                </button>
                <button
                  onClick={() => router.push('/users/dashboard/status')}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center hover:border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="p-2 bg-white rounded-lg border border-gray-100 inline-flex mb-3">
                    <CreditCard className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  </div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <p className="font-semibold text-gray-900 text-sm">Status Bayar</p>
                </button>
                <button
                  onClick={() => router.push('/users/dashboard/kamar-saya')}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center hover:border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="p-2 bg-white rounded-lg border border-gray-100 inline-flex mb-3">
                    <Home className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  </div>
                  <p className="text-xs text-gray-500 mb-1">Kamar</p>
                  <p className="font-semibold text-gray-900 text-sm">Kamar Saya</p>
                </button>
                <button
                  onClick={() => router.push('/users/dashboard/profile')}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center hover:border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="p-2 bg-white rounded-lg border border-gray-100 inline-flex mb-3">
                    <User className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  </div>
                  <p className="text-xs text-gray-500 mb-1">Profil</p>
                  <p className="font-semibold text-gray-900 text-sm">Edit Profil</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
