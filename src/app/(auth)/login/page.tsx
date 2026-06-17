'use client'
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
import React from "react"
import { login, setLocalStorageItem } from "../../../lib/api/auth"
import { useAuth } from "../../../lib/hooks/useAuth"
import { useEffect } from "react"
import { useRouter } from "next/navigation";

export default function Login() {

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { user, isLoading, loginUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // penting banget

    if (user) {
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/users/dashboard');
      }
    }
  }, [user, isLoading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Implement login logic here, e.g., call the login API
    console.log('Logging in with:', { username, password });

    try {

      const response = await login({ username, password });
      console.log('Login successful:', response);

      if (response.error) {
        console.error('Login failed:', response.data.message);
        return;
      }

      loginUser(response.data.token, response.data.user);

      setLocalStorageItem('token', response.data.token);
      setLocalStorageItem('user', JSON.stringify(response.data.user));


    } catch (error) {
      console.error('Login failed:', error);
      // Handle login failure, e.g., show err or message
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
          {/* <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction> */}
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
                <Button type="submit" className="w-full pt-4 pb-4">
                  Login
                </Button>
                <p className="text-sm text-muted-foreground text-center mt-5">
                  Belum punya akun?{' '}
                  <a href="#" className="underline-offset-4 hover:underline text-black font-medium">
                    Daftar
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

}
