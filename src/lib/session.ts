import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'fallback-secret-min-32-chars-long!!'
)

export interface SessionPayload {
  token: string
  user: {
    id_user: string
    nama: string
    username: string
    email: string
    no_hp: string
    pekerjaan?: string
    provinsi?: string
    kabupaten?: string
    kecamatan?: string
    alamat?: string
    foto?: string
    role: 'admin' | 'user'
  }
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}
