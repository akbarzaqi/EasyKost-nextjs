"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CreditCard,
  FileText,
  Filter,
  ChevronDown,
  CheckCircle2,
  Clock,
  Loader2,
  Home,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/styles/components/ui/card";
import { Button } from "@/styles/components/ui/button";
import { Badge } from "@/styles/components/ui/badge";
import { getMyTagihan } from "@/lib/api/tagihan";

const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`;

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

function InvoiceCard({ tagihan, onBayar, onLihat }: { tagihan: any; onBayar: (id: number) => void; onLihat: (id: number) => void }) {
  const biaya = tagihan.sewa?.hunian?.biaya;
  const biayaKost = biaya ? Number(biaya.kost) : 0;
  const biayaWifi = biaya ? Number(biaya.wifi) : 0;
  const biayaSampah = biaya ? Number(biaya.sampah) : 0;
  const biayaAir = Number(tagihan.air) || 0;
  const total = biayaKost + biayaWifi + biayaSampah + biayaAir;
  const isUnpaid = tagihan.status === "notpaid";

  const bulan = new Date(tagihan.tgl_tagihan).toLocaleDateString('id-ID', {
    month: 'long', year: 'numeric'
  });

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-200 ${
        isUnpaid
          ? "border-gray-900 shadow-md hover:shadow-lg"
          : "border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300"
      }`}
    >
      {isUnpaid && (
        <div
          className="absolute top-0 right-0 w-48 h-48 bg-gray-900/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"
          aria-hidden="true"
        />
      )}

      <CardHeader className="relative z-10 pb-3 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              {bulan}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {isUnpaid
                ? `Jatuh tempo: ${formatDate(tagihan.tgl_jatuhtempo)}`
                : `Dibayar: ${tagihan.transaksi ? formatDate(tagihan.transaksi.created_at) : '-'}`
              }
            </p>
          </div>
          <Badge
            className={`gap-1.5 px-2.5 py-1 text-xs ${
              isUnpaid
                ? "bg-red-50 text-red-600 border-red-100"
                : "bg-gray-100 text-gray-600 border-gray-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isUnpaid ? "bg-red-500" : "bg-gray-400"
              }`}
              aria-hidden="true"
            />
            {isUnpaid ? "Belum Bayar" : "Lunas"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 pt-4 space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Biaya Kost</span>
            <span className="font-medium text-gray-900">{formatRupiah(biayaKost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">WiFi</span>
            <span className="font-medium text-gray-900">{formatRupiah(biayaWifi)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Air</span>
            <span className="font-medium text-gray-900">{formatRupiah(biayaAir)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Kebersihan/Sampah</span>
            <span className="font-medium text-gray-900">{formatRupiah(biayaSampah)}</span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="flex justify-between text-base">
            <span className="text-gray-500">Total Tagihan</span>
            <span className="font-bold text-gray-900">{formatRupiah(total)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="relative z-10 pt-4 border-t border-gray-100">
        {isUnpaid ? (
          <Button
            onClick={() => onBayar(tagihan.id_tagihan)}
            className="w-full bg-black text-white hover:bg-gray-900 font-medium py-3 gap-2 cursor-pointer"
          >
            <CreditCard className="h-4 w-4" aria-hidden="true" />
            Bayar Sekarang
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => onLihat(tagihan.id_tagihan)}
            className="w-full border-gray-900 text-gray-900 hover:bg-gray-50 font-medium py-3 gap-2 cursor-pointer"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Lihat Invois
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function TahunSelect({ availableYears, selected, onChange }: { availableYears: number[]; selected: number; onChange: (year: number) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full md:w-auto">
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-2 w-full md:w-auto h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Filter className="h-4 w-4 text-gray-500" aria-hidden="true" />
        Tahun {selected}
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-20 py-1">
          <div className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Pilih Tahun</div>
          {availableYears.map((year) => (
            <button
              key={year}
              onClick={() => { onChange(year); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                selected === year
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TagihanPage() {
  const router = useRouter();
  const [tagihanList, setTagihanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [allYears, setAllYears] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMyTagihan();
      if (!response.error && response.data) {
        const list = response.data;
        setTagihanList(list);
        const years = ([...new Set(list.map((t: any) => new Date(t.tgl_tagihan).getFullYear()))] as number[]).sort((a, b) => b - a);
        setAllYears(years);
        if (years.length > 0) setSelectedYear(years[0]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = tagihanList.filter((t) => {
    const year = new Date(t.tgl_tagihan).getFullYear();
    return year === selectedYear;
  });

  const totalSemua = tagihanList.reduce((sum, t) => {
    const biaya = t.sewa?.hunian?.biaya;
    const biayaKost = biaya ? Number(biaya.kost) : 0;
    const biayaWifi = biaya ? Number(biaya.wifi) : 0;
    const biayaSampah = biaya ? Number(biaya.sampah) : 0;
    const biayaAir = Number(t.air) || 0;
    return sum + biayaKost + biayaWifi + biayaSampah + biayaAir;
  }, 0);

  const totalLunas = tagihanList.filter((t) => t.status === "paid").length;
  const totalBelum = tagihanList.filter((t) => t.status === "notpaid").length;

  const totalBelumNominal = tagihanList
    .filter((t) => t.status === "notpaid")
    .reduce((sum, t) => {
      const biaya = t.sewa?.hunian?.biaya;
      const biayaKost = biaya ? Number(biaya.kost) : 0;
      const biayaWifi = biaya ? Number(biaya.wifi) : 0;
      const biayaSampah = biaya ? Number(biaya.sampah) : 0;
      const biayaAir = Number(t.air) || 0;
      return sum + biayaKost + biayaWifi + biayaSampah + biayaAir;
    }, 0);

  const handleBayar = (id: number) => {
    router.push(`/users/dashboard/tagihan/invoices/${id}/bayar`);
  };

  const handleLihat = (id: number) => {
    router.push(`/users/dashboard/tagihan/invoices/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (tagihanList.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Home className="h-8 w-8 text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Belum Ada Tagihan</h2>
          <p className="text-gray-500 mt-2">Belum ada tagihan yang tersedia untuk Anda.</p>
        </div>
      </div>
    );
  }

  const bulanMendatang = tagihanList.find((t) => t.status === "notpaid");

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Tagihan Saya
            </h1>
            <p className="text-gray-500 mt-1 text-base">
              Kelola pengeluaran hunian Anda dengan transparan.
            </p>
          </div>
          {allYears.length > 0 && (
            <TahunSelect availableYears={allYears} selected={selectedYear} onChange={setSelectedYear} />
          )}
        </div>

        {/* Status Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-gray-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Tagihan</p>
                <p className="text-lg font-bold text-gray-900">{formatRupiah(totalSemua)}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Lunas</p>
                <p className="text-lg font-bold text-gray-900">{totalLunas} tagihan</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Belum Dibayar</p>
                <p className="text-lg font-bold text-gray-900">{totalBelum} tagihan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Tunggakan */}
        {totalBelum > 0 && (
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                TOTAL TUNGGAKAN
              </p>
              <div className="mt-2">
                <p className="text-4xl font-bold text-gray-900">{formatRupiah(totalBelumNominal)}</p>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />
                </div>
                <p className="text-sm text-red-700 font-medium">
                  {bulanMendatang
                    ? `Harap segera melunasi tagihan ${new Date(bulanMendatang.tgl_tagihan).toLocaleDateString('id-ID', { month: 'long' })}`
                    : 'Tidak ada tagihan yang perlu dilunasi'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Invoice Cards Grid */}
        {filtered.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Riwayat Tagihan</h2>
              <span className="text-sm text-gray-500">
                {filtered.length} tagihan ditemukan
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((tagihan) => (
                <InvoiceCard key={tagihan.id_tagihan} tagihan={tagihan} onBayar={handleBayar} onLihat={handleLihat} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
