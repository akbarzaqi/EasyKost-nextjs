export const runtime = 'edge'

import HunianDetailClient from './client'

export default function HunianDetail({ params }: { params: { id: string } }) {
  return <HunianDetailClient id={params.id} />
}
