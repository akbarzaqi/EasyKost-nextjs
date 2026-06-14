"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CreditCard,
  FileText,
  Filter,
  ChevronDown,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/styles/components/ui/card";
import { Button } from "@/styles/components/ui/button";
import { Badge } from "@/styles/components/ui/badge";

interface InvoiceItem {
  label: string;
  amount: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  month: string;
  year: number;
  status: "unpaid" | "paid";
  dueDate?: string;
  paidDate?: string;
  items: InvoiceItem[];
  total: string;
}

const invoices: Invoice[] = [
  {
    id: "oct-2024",
    invoiceNumber: "INV-202310882",
    month: "Oktober",
    year: 2024,
    status: "unpaid",
    dueDate: "10 Okt 2024",
    items: [
      { label: "Biaya Kost", amount: "Rp 2.000.000" },
      { label: "Listrik (Token)", amount: "Rp 350.000" },
      { label: "Air & Kebersihan", amount: "Rp 100.000" },
    ],
    total: "Rp 2.450.000",
  },
  {
    id: "sep-2024",
    invoiceNumber: "INV-202309764",
    month: "September",
    year: 2024,
    status: "paid",
    paidDate: "02 Sep 2024",
    items: [
      { label: "Biaya Kost", amount: "Rp 2.000.000" },
      { label: "Listrik (Token)", amount: "Rp 280.000" },
      { label: "Air & Kebersihan", amount: "Rp 100.000" },
    ],
    total: "Rp 2.380.000",
  },
  {
    id: "aug-2024",
    invoiceNumber: "INV-202308651",
    month: "Agustus",
    year: 2024,
    status: "paid",
    paidDate: "05 Ags 2024",
    items: [
      { label: "Biaya Kost", amount: "Rp 2.000.000" },
      { label: "Listrik (Token)", amount: "Rp 410.000" },
      { label: "Air & Kebersihan", amount: "Rp 100.000" },
    ],
    total: "Rp 2.510.000",
  },
];

function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const router = useRouter();
  const isUnpaid = invoice.status === "unpaid";

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
              {invoice.month} {invoice.year}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {isUnpaid ? `Jatuh tempo: ${invoice.dueDate}` : `Dibayar: ${invoice.paidDate}`}
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
          {invoice.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium text-gray-900">{item.amount}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="flex justify-between text-base">
            <span className="text-gray-500">Total Tagihan</span>
            <span className="font-bold text-gray-900">{invoice.total}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="relative z-10 pt-4 border-t border-gray-100">
        {isUnpaid ? (
          <Button
            onClick={() => router.push(`/users/dashboard/tagihan/invoices/${invoice.invoiceNumber}/bayar`)}
            className="w-full bg-black text-white hover:bg-gray-900 font-medium py-3 gap-2 cursor-pointer"
          >
            <CreditCard className="h-4 w-4" aria-hidden="true" />
            Bayar Sekarang
          </Button>
        ) : (
          <Button
            onClick={() => router.push(`/users/dashboard/tagihan/invoices/${invoice.invoiceNumber}`)}
            variant="outline"
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

const availableYears = [...new Set(invoices.map((inv) => inv.year))].sort((a, b) => b - a);

function TahunSelect({ selected, onChange }: { selected: number; onChange: (year: number) => void }) {
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
  const defaultYear = availableYears[0] ?? new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const filteredInvoices = invoices.filter((inv) => inv.year === selectedYear);

  const totalSemua = invoices.reduce((sum, inv) => {
    const num = parseInt(inv.total.replace(/\D/g, "")) || 0;
    return sum + num;
  }, 0);
  const totalLunas = invoices.filter((inv) => inv.status === "paid").length;
  const totalBelum = invoices.filter((inv) => inv.status === "unpaid").length;

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
          <TahunSelect selected={selectedYear} onChange={setSelectedYear} />
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
                <p className="text-lg font-bold text-gray-900">Rp {(totalSemua).toLocaleString("id-ID")}</p>
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

        {/* Top Section - Total Tunggakan */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-3 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              TOTAL TUNGGAKAN
            </p>
            <div className="mt-2">
              <p className="text-4xl font-bold text-gray-900">Rp 2.450.000</p>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />
              </div>
              <p className="text-sm text-red-700 font-medium">
                Harap segera melunasi tagihan bulan Oktober
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Section - Invoice Cards Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Riwayat Tagihan</h2>
            <span className="text-sm text-gray-500">
              {filteredInvoices.length} tagihan ditemukan
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}