'use client'

import React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { register } from "../../../lib/api/auth"


export default function Register() {

  const [nama, setNama] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
  const [noHp, setNoHp] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await register({ nama, username, email, password, password_confirmation: passwordConfirmation, no_hp: noHp });
      setSuccessMsg('Akun berhasil dibuat! Mengalihkan ke halaman login...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal mendaftar';
      setErrorMsg(message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-xl">
      <CardHeader className="block align-center text-center justify-center">
        <CardTitle className="block text-xl font-medium mt-2 mb-2">Daftar Akun Baru </CardTitle>
        <CardDescription className="mb-4">
            Kelola hunian anda dengan lebih mudah di Kost Pak Aji
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="flex flex-col gap-6">
            {errorMsg && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">{errorMsg}</div>
              </div>
            )}
            {successMsg && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-emerald-700">{successMsg}</div>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="nama">Nama</Label>
              <Input
                id="nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama anda"
                required
              />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="username">Nama Pengguna</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan Nama Pengguna"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan Email"
                  required
                />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="confirm_password">Konfirmasi Password</Label>
                </div>
                <Input
                  id="confirm_password"
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="no_hp">No. Hp</Label>
              <Input
                id="no_hp"
                type="text"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                placeholder="Masukkan Nomor Telepon"
                required
              />
            </div>

            <div className="flex-col gap-2">
              <Button type="submit" className="w-full pt-4 pb-4">
                Register
              </Button>
              <p className="text-sm text-muted-foreground mt-5 text-center">
                Sudah punya akun?{' '}
                <a href="/login" className="underline-offset-4 hover:underline text-black font-medium">
                  Login
                </a>
              </p>
            </div>
          </div>
       
        </form>
      </CardContent>
      </Card>
    </div>
  )
}
