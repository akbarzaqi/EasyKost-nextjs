export const runtime = 'edge'

import EditHunianClient from './client'

export default function EditHunian({ params }: { params: { id: string } }) {
  return <EditHunianClient id={params.id} />
}
