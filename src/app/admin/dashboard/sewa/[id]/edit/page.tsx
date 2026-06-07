export const runtime = 'edge'

import EditSewaClient from './client'

export default async function EditSewa({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <EditSewaClient id={id} />
}
