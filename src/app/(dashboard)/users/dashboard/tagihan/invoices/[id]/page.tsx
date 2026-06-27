"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, Landmark, ArrowLeft, Loader2, Home } from "lucide-react";
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

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [tagihan, setTagihan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMyTagihan();
      if (!response.error && response.data) {
        const found = response.data.find((t: any) => String(t.id_tagihan) === params.id);
        setTagihan(found || null);
      }
      setLoading(false);
    };
    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] p-6 md:p-8 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!tagihan) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] p-6 md:p-8">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Home className="h-8 w-8 text-gray-300" />
          </div>
          <p className="text-gray-500">Tagihan tidak ditemukan</p>
          <Button variant="outline" onClick={() => router.back()} className="mt-4 cursor-pointer">
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  const biaya = tagihan.sewa?.hunian?.biaya;
  const biayaKost = biaya ? Number(biaya.kost) : 0;
  const biayaWifi = biaya ? Number(biaya.wifi) : 0;
  const biayaSampah = biaya ? Number(biaya.sampah) : 0;
  const biayaAir = Number(tagihan.air) || 0;
  const total = biayaKost + biayaWifi + biayaSampah + biayaAir;
  const isPaid = tagihan.status === "paid";
  const transaksi = tagihan.transaksi;

  const bulan = new Date(tagihan.tgl_tagihan).toLocaleDateString('id-ID', {
    month: 'long', year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-6 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </button>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">INVOIS</p>
                <CardTitle className="text-xl font-bold text-gray-900 mt-1">
                  {bulan}
                </CardTitle>
              </div>
              <Badge className={`gap-1.5 px-3 py-1 ${isPaid ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                <CheckCircle className="h-3.5 w-3.5" />
                {isPaid ? "Lunas" : "Belum Bayar"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-xs text-gray-500">ID Tagihan</p>
                <p className="font-semibold text-gray-900 mt-0.5">#{tagihan.id_tagihan}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tanggal Tagihan</p>
                <p className="font-semibold text-gray-900 mt-0.5">{formatDate(tagihan.tgl_tagihan)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Jatuh Tempo</p>
                <p className="font-semibold text-gray-900 mt-0.5">{formatDate(tagihan.tgl_jatuhtempo)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className={`font-semibold mt-0.5 ${isPaid ? "text-green-600" : "text-red-600"}`}>
                  {isPaid ? "Dibayar" : "Belum Dibayar"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">Rincian Tagihan</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Biaya Kost</span>
                <span className="font-medium text-gray-900">{formatRupiah(biayaKost)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">WiFi</span>
                <span className="font-medium text-gray-900">{formatRupiah(biayaWifi)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Kebersihan/Sampah</span>
                <span className="font-medium text-gray-900">{formatRupiah(biayaSampah)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Air</span>
                <span className="font-medium text-gray-900">{formatRupiah(biayaAir)}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Tagihan</span>
                <span className="text-xl font-bold text-gray-900">{formatRupiah(total)}</span>
              </div>
            </div>
          </CardContent>
          {isPaid && transaksi && (
            <CardFooter className="flex-col gap-3 border-t border-gray-100">
              <div className="flex items-center gap-3 w-full p-3 bg-gray-50 rounded-lg">
                <div className="p-1.5 bg-white rounded-lg border border-gray-100">
                  <Landmark className="h-4 w-4 text-gray-600" aria-hidden="true" />
                </div>
                <p className="text-sm text-gray-600">
                  Dibayar via <span className="font-semibold text-gray-900">Transfer Bank</span>
                  {transaksi.invoice && <> (Invoice: {transaksi.invoice})</>}
                </p>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
