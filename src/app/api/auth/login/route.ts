import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { encrypt } from '@/lib/session'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Login gagal' },
        { status: response.status }
      )
    }

    const sessionPayload = {
      token: data.token,
      user: data.user,
    }

    const encryptedSession = await encrypt(sessionPayload)

    const cookieStore = await cookies()
    cookieStore.set('session', encryptedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 86400,
    })

    return NextResponse.json({ user: data.user })
  } catch (error) {
    console.error('[api/auth/login] Error:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
