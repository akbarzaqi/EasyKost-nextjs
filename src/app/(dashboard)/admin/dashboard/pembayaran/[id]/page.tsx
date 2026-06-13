export const runtime = 'edge'

import LihatBuktiClient from './client'

export default async function LihatBukti({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <LihatBuktiClient id={id} />
}
