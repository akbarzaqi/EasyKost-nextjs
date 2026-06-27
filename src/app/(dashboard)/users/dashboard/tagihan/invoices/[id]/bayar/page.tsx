"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Landmark,
  CloudUpload,
  Send,
  Clock,
  ArrowLeft,
  Loader2,
  Home,
} from "lucide-react";
import { Card, CardContent } from "@/styles/components/ui/card";
import { Button } from "@/styles/components/ui/button";
import { getMyTagihan } from "@/lib/api/tagihan";
import { createTransaksi } from "@/lib/api/transaksi";
import { uploadPembayaran } from "@/lib/api/pembayaran";

const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`;

export default function UploadBuktiPage() {
  const params = useParams();
  const router = useRouter();
  const [tagihan, setTagihan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [senderName, setSenderName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMyTagihan();
      if (!response.error && response.data) {
        const found = response.data.find((t: any) => String(t.id_tagihan) === params.id);
        if (!found || found.status !== "notpaid") {
          setError(found?.status === "paid" ? "Tagihan ini sudah lunas" : "Tagihan tidak ditemukan");
        }
        setTagihan(found || null);
      }
      setLoading(false);
    };
    fetchData();
  }, [params.id]);

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

  const handleSubmit = async () => {
    if (!senderName.trim()) {
      setError("Nama pengirim harus diisi");
      return;
    }
    if (!file) {
      setError("Bukti pembayaran harus diupload");
      return;
    }
    setError("");
    setSubmitting(true);

    const transaksiRes = await createTransaksi(Number(params.id));
    if (transaksiRes.error) {
      setError(transaksiRes.message || "Gagal membuat transaksi");
      setSubmitting(false);
      return;
    }

    const invoice = transaksiRes.data.invoice;
    const today = new Date().toISOString().split("T")[0];

    const formData = new FormData();
    formData.append("invoice", invoice);
    formData.append("nama_pengirim", senderName.trim());
    formData.append("bukti_trf", file);
    formData.append("tgl_bayar", today);

    const uploadRes = await uploadPembayaran(formData);
    if (uploadRes.error) {
      setError(uploadRes.message || "Gagal mengupload bukti pembayaran");
      setSubmitting(false);
      return;
    }

    router.push("/users/dashboard/tagihan");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] p-6 md:p-8 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!tagihan || error && !tagihan) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] p-6 md:p-8">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Home className="h-8 w-8 text-gray-300" />
          </div>
          <p className="text-gray-500">{error || "Tagihan tidak ditemukan"}</p>
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

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Upload Bukti Bayar
          </h1>
          <p className="text-gray-500 mt-1.5 text-sm">
            Silakan unggah bukti transfer untuk verifikasi pesanan Anda.
          </p>
        </div>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 tracking-wider uppercase">ID TAGIHAN</p>
                <p className="font-bold text-gray-900 mt-0.5">#{tagihan.id_tagihan}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-500 tracking-wider uppercase">TOTAL TRANSFER</p>
                <p className="font-bold text-gray-900 mt-0.5">{formatRupiah(total)}</p>
              </div>
            </div>

            <div className="space-y-2 border-t border-gray-100 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Biaya Kost</span>
                <span className="text-gray-900">{formatRupiah(biayaKost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">WiFi</span>
                <span className="text-gray-900">{formatRupiah(biayaWifi)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Kebersihan/Sampah</span>
                <span className="text-gray-900">{formatRupiah(biayaSampah)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Air</span>
                <span className="text-gray-900">{formatRupiah(biayaAir)}</span>
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
                  <p className="text-xs text-gray-500 mt-0.5">PNG, JPG atau JPEG (Maks. 2MB)</p>
                </div>
              </>
            )}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 text-center">{error}</p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-black text-white hover:bg-gray-900 font-semibold py-3.5 gap-2 text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              Kirim Bukti Pembayaran
              <Send className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>

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
