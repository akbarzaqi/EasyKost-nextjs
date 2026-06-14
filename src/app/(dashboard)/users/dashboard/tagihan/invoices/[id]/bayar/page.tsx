"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Landmark,
  CloudUpload,
  Send,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/styles/components/ui/card";
import { Button } from "@/styles/components/ui/button";

interface InvoiceItem {
  label: string;
  amount: string;
}

const invoiceData: Record<string, { id: string; invoiceNumber: string; month: string; year: number; total: string; items: InvoiceItem[] }> = {
  "INV-202310882": {
    id: "oct-2024",
    invoiceNumber: "INV-202310882",
    month: "Oktober",
    year: 2024,
    total: "Rp 2.450.000",
    items: [
      { label: "Biaya Kost", amount: "Rp 2.000.000" },
      { label: "Listrik (Token)", amount: "Rp 350.000" },
      { label: "Air & Kebersihan", amount: "Rp 100.000" },
    ],
  },
  "INV-202309764": {
    id: "sep-2024",
    invoiceNumber: "INV-202309764",
    month: "September",
    year: 2024,
    total: "Rp 2.380.000",
    items: [],
  },
  "INV-202308651": {
    id: "aug-2024",
    invoiceNumber: "INV-202308651",
    month: "Agustus",
    year: 2024,
    total: "Rp 2.510.000",
    items: [],
  },
};

export default function UploadBuktiPage() {
  const params = useParams();
  const invoiceId = params.id as string;
  const invoice = invoiceData[invoiceId];

  const [senderName, setSenderName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  if (!invoice) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] p-6 md:p-8">
        <div className="max-w-2xl mx-auto text-center py-20">
          <p className="text-gray-500">Tagihan tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-6 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Upload Bukti Bayar
          </h1>
          <p className="text-gray-500 mt-1.5 text-sm">
            Silakan unggah bukti transfer untuk verifikasi pesanan Anda.
          </p>
        </div>

        {/* Invoice Info */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 tracking-wider uppercase">ID TAGIHAN</p>
                <p className="font-bold text-gray-900 mt-0.5">#{invoice.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-500 tracking-wider uppercase">TOTAL TRANSFER</p>
                <p className="font-bold text-gray-900 mt-0.5">{invoice.total}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gray-50 rounded-lg">
                  <Landmark className="h-5 w-5 text-gray-600" aria-hidden="true" />
                </div>
                <p className="text-sm text-gray-600">
                  Transfer ke <span className="font-semibold text-gray-900">BCA 1234567890</span> a/n PT RaaaR Management
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sender Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">
            Nama Pengirim
          </label>
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Sesuai nama di rekening"
            className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">
            Bukti Pembayaran
          </label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => inputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 py-10 px-6 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
              dragOver
                ? "border-gray-900 bg-gray-50"
                : file
                  ? "border-green-400 bg-green-50"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={handleFileSelect}
              className="hidden"
            />

            {file ? (
              <>
                <div className="p-2 bg-green-100 rounded-full">
                  <CloudUpload className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900 text-sm">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-2 bg-gray-50 rounded-full">
                  <CloudUpload className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900 text-sm">Klik atau seret gambar ke sini</p>
                  <p className="text-xs text-gray-500 mt-0.5">PNG, JPG atau JPEG (Maks. 5MB)</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          className="w-full bg-black text-white hover:bg-gray-900 font-semibold py-3.5 gap-2 text-base"
        >
          Kirim Bukti Pembayaran
          <Send className="h-4 w-4" aria-hidden="true" />
        </Button>

        {/* Footer Note */}
        <div className="flex items-center justify-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" aria-hidden="true" />
          <p className="text-sm text-gray-500 italic">
            Pembayaran akan diverifikasi admin dalam 1x24 jam
          </p>
        </div>
      </div>
    </div>
  );
}