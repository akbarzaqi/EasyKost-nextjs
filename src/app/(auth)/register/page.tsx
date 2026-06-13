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

export default function Register() {
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
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="fullname">Nama Lengkap</Label>
              <Input
                id="fullname"
                type="text"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="username">Nama Pengguna</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan Nama Pengguna"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
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
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="confirm_password">Konfirmasi Password</Label>
                </div>
                <Input id="confirm_password" type="password" required />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="no_hp">No. Hp</Label>
              <Input
                id="no_hp"
                type="text"
                placeholder="Masukkan Nomor Telepon"
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full pt-4 pb-4">
          Register
        </Button>
        <p className="text-sm text-muted-foreground mt-5">
          Sudah punya akun?{' '}
          <a href="#" className="underline-offset-4 hover:underline text-black font-medium">
            Login
          </a>
        </p>
      </CardFooter>
      </Card>
    </div>
  )
}
