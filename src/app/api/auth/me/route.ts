import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const payload = await decrypt(sessionCookie.value)

    if (!payload) {
      cookieStore.delete('session')
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({ user: payload.user })
  } catch (error) {
    console.error('[api/auth/me] Error:', error)
    return NextResponse.json({ user: null }, { status: 401 })
  }
}
