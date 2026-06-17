'use client'

import React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { register } from "../../../lib/api/auth"


export default function Register() {

  const [nama, setNama] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
  const [noHp, setNoHp] = React.useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Register Data:', { nama, username, email, password, passwordConfirmation, noHp });

    try {
      const response = await register({ nama, username, email, password, password_confirmation: passwordConfirmation, no_hp: noHp });
      console.log('Registration successful:', response);
      
      if(!response) {
        console.error('Registration failed:', response.message);
      }
      // window.location.href = '/login';
    } catch (error) {
      console.error('Error during registration:', error);
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
        {/* <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction> */}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="flex flex-col gap-6">
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
              <p className="text-sm text-muted-foreground mt-5">
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
