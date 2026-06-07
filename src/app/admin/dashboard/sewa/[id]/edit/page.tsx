export const runtime = 'edge'

import EditSewaClient from './client'

export default function EditSewa({ params }: { params: { id: string } }) {
  return <EditSewaClient id={params.id} />
}
