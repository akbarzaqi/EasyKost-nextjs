export const runtime = 'edge'

import LihatBuktiClient from './client'

export default function LihatBukti({ params }: { params: { id: string } }) {
  return <LihatBuktiClient id={params.id} />
}
