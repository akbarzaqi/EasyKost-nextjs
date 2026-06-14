"use client";

import { useParams, useRouter } from "next/navigation";
import { CheckCircle, Landmark, ArrowLeft, Download, Printer } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/styles/components/ui/card";
import { Button } from "@/styles/components/ui/button";
import { Badge } from "@/styles/components/ui/badge";

interface InvoiceItem {
  label: string;
  amount: string;
}

const invoiceData: Record<string, {
  invoiceNumber: string;
  month: string;
  year: number;
  status: "paid";
  paidDate: string;
  items: InvoiceItem[];
  total: string;
  paymentMethod: string;
}> = {
  "INV-202309764": {
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
    paymentMethod: "Bank Transfer BCA **** 1234",
  },
  "INV-202308651": {
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
    paymentMethod: "Bank Transfer BCA **** 1234",
  },
};

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoice = invoiceData[params.id as string];

  if (!invoice) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] p-6 md:p-8">
        <div className="max-w-2xl mx-auto text-center py-20">
          <p className="text-gray-500">Tagihan tidak ditemukan</p>
          <Button variant="outline" onClick={() => router.back()} className="mt-4">
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-6 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </button>

        {/* Header */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">INVOIS</p>
                <CardTitle className="text-xl font-bold text-gray-900 mt-1">
                  {invoice.month} {invoice.year}
                </CardTitle>
              </div>
              <Badge className="gap-1.5 px-3 py-1 bg-green-50 text-green-700 border-green-100">
                <CheckCircle className="h-3.5 w-3.5" />
                Lunas
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-xs text-gray-500">ID Tagihan</p>
                <p className="font-semibold text-gray-900 mt-0.5">#{invoice.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tanggal Bayar</p>
                <p className="font-semibold text-gray-900 mt-0.5">{invoice.paidDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Metode Pembayaran</p>
                <p className="font-semibold text-gray-900 mt-0.5">{invoice.paymentMethod}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="font-semibold text-green-600 mt-0.5">Dibayar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rincian Tagihan */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">Rincian Tagihan</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="space-y-3">
              {invoice.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium text-gray-900">{item.amount}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Tagihan</span>
                <span className="text-xl font-bold text-gray-900">{invoice.total}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3 border-t border-gray-100">
            <div className="flex items-center gap-3 w-full p-3 bg-gray-50 rounded-lg">
              <div className="p-1.5 bg-white rounded-lg border border-gray-100">
                <Landmark className="h-4 w-4 text-gray-600" aria-hidden="true" />
              </div>
              <p className="text-sm text-gray-600">
                Dibayar via <span className="font-semibold text-gray-900">{invoice.paymentMethod}</span>
              </p>
            </div>
          </CardFooter>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 gap-2 border-gray-200">
            <Printer className="h-4 w-4" />
            Cetak
          </Button>
          <Button variant="outline" className="flex-1 gap-2 border-gray-200">
            <Download className="h-4 w-4" />
            Unduh PDF
          </Button>
        </div>
      </div>
    </div>
  );
}