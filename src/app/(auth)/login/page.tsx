import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-xl pl-8 pr-8">
      <CardHeader className="block align-center text-center justify-center">
        <CardTitle className="block text-xl font-medium mb-2 mt-2">Login</CardTitle>
        <CardDescription className="mb-4">
          Manajement Kost Pak Aji
        </CardDescription>
        {/* <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction> */}
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full pt-4 pb-4">
          Login
        </Button>
        <p className="text-sm text-muted-foreground mt-5">
          Belum punya akun?{' '}
          <a href="#" className="underline-offset-4 hover:underline text-black font-medium">
            Daftar
          </a>
        </p>
      </CardFooter>
      </Card>
    </div>
  )
}
