export const runtime = 'edge'

import HunianDetailClient from './client'

export default async function HunianDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <HunianDetailClient id={id} />
}
