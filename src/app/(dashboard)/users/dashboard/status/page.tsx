"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, AlertTriangle, CreditCard, Loader2, Home, FileText, XCircle } from "lucide-react";
import { Button } from "@/styles/components/ui/button";
import { getMyTagihan } from "@/lib/api/tagihan";
import { getMyPembayaran } from "@/lib/api/pembayaran";
import { useRouter } from "next/navigation";

const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`;

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const statusConfig: Record<string, { label: string; bg: string; dot: string }> = {
  paid: { label: "Lunas", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  notpaid: { label: "Belum Bayar", bg: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500" },
  verif: { label: "Verifikasi", bg: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
};

export default function StatusPage() {
  const router = useRouter();
  const [tagihanList, setTagihanList] = useState<any[]>([]);
  const [rejectedList, setRejectedList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [tagihanRes, pembayaranRes] = await Promise.all([
        getMyTagihan(),
        getMyPembayaran(),
      ]);
      if (!tagihanRes.error && tagihanRes.data) {
        setTagihanList(tagihanRes.data);
      }
      if (!pembayaranRes.error && pembayaranRes.data) {
        setRejectedList(pembayaranRes.data.filter((p: any) => p.status === 'notpaid'));
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalLunas = tagihanList.filter((t) => t.status === "paid").length;
  const totalBelum = tagihanList.filter((t) => t.status === "notpaid").length;
  const totalVerif = tagihanList.filter((t) => t.status === "verif").length;

  const hitungTotal = (t: any) => {
    const biaya = t.sewa?.hunian?.biaya;
    return (biaya ? Number(biaya.kost) + Number(biaya.wifi) + Number(biaya.sampah) : 0) + (Number(t.air) || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Status Pembayaran
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Pantau status pembayaran tagihan hunian Anda.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Lunas</p>
              <p className="text-lg font-bold text-gray-900">{totalLunas} tagihan</p>
            </div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Verifikasi</p>
              <p className="text-lg font-bold text-gray-900">{totalVerif} tagihan</p>
            </div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-rose-50 rounded-lg">
              <Clock className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Belum Dibayar</p>
              <p className="text-lg font-bold text-gray-900">{totalBelum} tagihan</p>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {tagihanList.length === 0 && (
          <div className="text-center py-20">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Home className="h-8 w-8 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Belum Ada Tagihan</h2>
            <p className="text-gray-500 mt-2">Belum ada tagihan yang tersedia untuk Anda.</p>
          </div>
        )}

        {/* Table */}
        {tagihanList.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bulan</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Jatuh Tempo</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {tagihanList.map((t) => {
                    const cfg = statusConfig[t.status] || statusConfig.notpaid;
                    const bulan = new Date(t.tgl_tagihan).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
                    return (
                      <tr key={t.id_tagihan} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4 font-mono text-xs font-semibold text-gray-900">
                          #{String(t.id_tagihan).padStart(6, '0')}
                        </td>
                        <td className="px-5 py-4 text-gray-700">{bulan}</td>
                        <td className="px-5 py-4 font-medium text-gray-900">{formatRupiah(hitungTotal(t))}</td>
                        <td className="px-5 py-4 text-gray-600">{formatDate(t.tgl_jatuhtempo)}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/users/dashboard/tagihan/invoices/${t.id_tagihan}`)}
                            className="gap-1.5 cursor-pointer"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            Detail
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rejected Payment History */}
        {rejectedList.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-gray-500" />
                <h2 className="text-base font-semibold text-gray-900">Riwayat Pembayaran Ditolak</h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tgl Bayar</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rejectedList.map((p) => {
                    const tagihanStatus = p.transaksi?.tagihan?.status;
                    const isResolved = tagihanStatus === 'paid' || tagihanStatus === 'verif';
                    return (
                      <tr key={p.id_pembayaran} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4 font-mono text-xs font-semibold text-gray-900">{p.invoice}</td>
                        <td className="px-5 py-4 font-medium text-gray-900">{formatRupiah(Number(p.transaksi?.total_bayar) || 0)}</td>
                        <td className="px-5 py-4 text-gray-600">{formatDate(p.tgl_bayar)}</td>
                        <td className="px-5 py-4">
                          {isResolved ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border-emerald-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Lunas
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border-rose-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                              Ditolak
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {!isResolved && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/users/dashboard/tagihan/invoices/${p.transaksi?.tagihan?.id_tagihan}/bayar`)}
                              className="gap-1.5 border-rose-200 text-rose-700 hover:bg-rose-50 cursor-pointer"
                            >
                              Upload Ulang
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
