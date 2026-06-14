"use client";

import { CheckCircle2, Clock, AlertTriangle, CreditCard, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/styles/components/ui/badge";

interface StatusEntry {
  invoice: string;
  bulan: string;
  total: string;
  tglBayar: string;
  status: "paid" | "unpaid" | "verif";
}

const statusData: StatusEntry[] = [
  { invoice: "#INV-202310882", bulan: "Oktober 2024", total: "Rp 2.450.000", tglBayar: "—", status: "unpaid" },
  { invoice: "#INV-202309764", bulan: "September 2024", total: "Rp 2.380.000", tglBayar: "02 Sep 2024", status: "paid" },
  { invoice: "#INV-202308651", bulan: "Agustus 2024", total: "Rp 2.510.000", tglBayar: "05 Ags 2024", status: "paid" },
  { invoice: "#INV-202307540", bulan: "Juli 2024", total: "Rp 2.300.000", tglBayar: "25 Jul 2024", status: "paid" },
  { invoice: "#INV-202306439", bulan: "Juni 2024", total: "Rp 2.300.000", tglBayar: "15 Jun 2024", status: "verif" },
];

const statusConfig = {
  paid: { label: "Lunas", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  unpaid: { label: "Belum Bayar", bg: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500" },
  verif: { label: "Verifikasi", bg: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
};

export default function StatusPage() {
  const totalLunas = statusData.filter((s) => s.status === "paid").length;
  const totalBelum = statusData.filter((s) => s.status === "unpaid").length;
  const totalVerif = statusData.filter((s) => s.status === "verif").length;

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
            <div className="p-2 bg-rose-50 rounded-lg">
              <Clock className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Belum Dibayar</p>
              <p className="text-lg font-bold text-gray-900">{totalBelum} tagihan</p>
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
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bulan</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tgl Bayar</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {statusData.map((entry, index) => {
                  const cfg = statusConfig[entry.status];
                  return (
                    <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-gray-900">{entry.invoice}</td>
                      <td className="px-5 py-4 text-gray-700">{entry.bulan}</td>
                      <td className="px-5 py-4 font-medium text-gray-900">{entry.total}</td>
                      <td className="px-5 py-4 text-gray-600">{entry.tglBayar}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
            <p className="text-sm text-gray-500">Showing 1 to {statusData.length} of {statusData.length} entries</p>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}