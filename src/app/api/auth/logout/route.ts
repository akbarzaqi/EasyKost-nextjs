import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('session')

    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    })

    return NextResponse.json({ message: 'Logout berhasil' })
  } catch (error) {
    console.error('[api/auth/logout] Error:', error)
    return NextResponse.json({ message: 'Logout berhasil' })
  }
}
