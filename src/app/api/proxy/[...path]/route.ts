import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function handleProxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const pathStr = path.join('/')
  const search = request.nextUrl.search

  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')

  if (!sessionCookie) {
    return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 })
  }

  const payload = await decrypt(sessionCookie.value)

  if (!payload) {
    cookieStore.delete('session')
    return NextResponse.json({ message: 'Sesi tidak valid' }, { status: 401 })
  }

  const url = `${API_URL}/${pathStr}${search}`

  const headers: Record<string, string> = {
    Accept: 'application/json',
    Authorization: `Bearer ${payload.token}`,
  }

  const contentType = request.headers.get('content-type')
  if (contentType && !contentType.includes('multipart/form-data')) {
    headers['Content-Type'] = contentType
  }

  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    if (contentType && contentType.includes('multipart/form-data')) {
      fetchOptions.body = await request.formData()
    } else {
      const text = await request.text()
      if (text) fetchOptions.body = text
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    redirect: 'manual',
  } as RequestInit)

  if (response.status === 401 || response.status === 302) {
    cookieStore.delete('session')
  }

  const responseBody = await response.text()

  let parsedBody: unknown
  try {
    parsedBody = JSON.parse(responseBody)
  } catch {
    parsedBody = responseBody
  }

  return NextResponse.json(parsedBody, { status: response.status })
}

export const GET = handleProxy
export const POST = handleProxy
export const PUT = handleProxy
export const PATCH = handleProxy
export const DELETE = handleProxy
