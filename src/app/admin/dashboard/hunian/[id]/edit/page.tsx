export const runtime = 'edge'

import EditHunianClient from './client'

export default async function EditHunian({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <EditHunianClient id={id} />
}
