export const runtime = 'edge'

import EditTagihanClient from './client'

export default function EditTagihan({ params }: { params: { id: string } }) {
  return <EditTagihanClient id={params.id} />
}
