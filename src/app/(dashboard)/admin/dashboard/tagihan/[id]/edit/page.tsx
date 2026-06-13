export const runtime = 'edge'

import EditTagihanClient from './client'

export default async function EditTagihan({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <EditTagihanClient id={id} />
}
