export const runtime = 'edge'

import SewaDetailClient from './client'

export default function SewaDetail({ params }: { params: { id: string } }) {
  return <SewaDetailClient id={params.id} />
}
