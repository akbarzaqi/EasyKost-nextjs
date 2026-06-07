export const runtime = 'edge'

import SewaDetailClient from './client'

export default async function SewaDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <SewaDetailClient id={id} />
}
