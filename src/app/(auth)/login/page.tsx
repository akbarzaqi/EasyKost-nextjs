'use client'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import React, { Suspense } from "react"
import { login } from "../../../lib/api/auth"
import { useAuth } from "../../../lib/hooks/useAuth"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');

  const { user, isLoading, loginUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      const redirect = searchParams.get('redirect');
      if (redirect) {
        router.push(redirect);
      } else if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/users/dashboard');
      }
    }
  }, [user, isLoading, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg('');

    try {
      const response = await login({ username, password });

      if (response.error) {
        setErrorMsg(response.message || 'Login gagal, coba lagi');
        return;
      }

      loginUser(response.data.user);
    } catch (error) {
      setErrorMsg('Terjadi kesalahan, coba lagi nanti');
    }
  }

  if(!isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-xl pl-8 pr-8">
        <CardHeader className="block align-center text-center justify-center">
          <CardTitle className="block text-xl font-medium mb-2 mt-2">Login</CardTitle>
          <CardDescription className="mb-4">
            Manajement Kost Pak Aji
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
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
                <Button type="submit" className="w-full pt-4 pb-4">
                  Login
                </Button>
                <p className="text-sm text-muted-foreground text-center mt-5">
                  Belum punya akun?{' '}
                  <Link href="/register" className="underline-offset-4 hover:underline text-black font-medium">
                    Daftar
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </CardContent>
        </Card>
      </div>
    )
  } 
}

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
