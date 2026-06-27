'use client'

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const statusStyles: Record<string, string> = {
  paid: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  notpaid: 'bg-rose-50 text-rose-700 border border-rose-200',
  verif: 'bg-amber-50 text-amber-700 border border-amber-200',
}

const statusDot: Record<string, string> = {
  paid: 'bg-emerald-500',
  notpaid: 'bg-rose-500',
  verif: 'bg-amber-500',
}

const statusLabel: Record<string, string> = {
  paid: 'Lunas',
  notpaid: 'Belum Bayar',
  verif: 'Verifikasi',
}

export const columns = [
  {
    id: 'id_tagihan',
    header: 'ID',
    accessorKey: 'id_tagihan',
    cell: ({ getValue }: any) => (
      <span className="font-mono text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
        #{getValue() as number}
      </span>
    )
  },
  {
    id: 'nama_penghuni',
    header: 'Nama Penghuni',
    accessorKey: 'nama_penghuni',
    cell: ({ getValue }: any) => (
      <span className="font-medium text-gray-900">{getValue() as string}</span>
    )
  },
  {
    id: 'kamar',
    header: 'Kamar',
    accessorKey: 'kamar',
    cell: ({ getValue }: any) => (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
        {getValue() as string}
      </span>
    )
  },
  {
    id: 'rincian',
    header: 'Rincian',
    accessorKey: 'rincian',
    cell: ({ getValue }: any) => {
      const rincian = getValue() as string[]
      return (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {rincian.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
            >
              {item}
            </span>
          ))}
        </div>
      )
    }
  },
  {
    id: 'total',
    header: 'Total',
    accessorKey: 'total',
    cell: ({ getValue }: any) => {
      const total = getValue() as number
      return (
        <span className="font-semibold text-emerald-600">
          Rp {total.toLocaleString('id-ID')}
        </span>
      )
    }
  },
  {
    id: 'jatuh_tempo',
    header: 'Jatuh Tempo',
    accessorKey: 'tgl_jatuhtempo',
    cell: ({ getValue }: any) => (
      <span className="text-gray-600 text-sm">{formatDate(getValue() as string)}</span>
    )
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: ({ getValue }: any) => {
      const status = getValue() as string
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-700'}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${statusDot[status] || 'bg-gray-500'}`} />
          {statusLabel[status] || status}
        </span>
      )
    }
  },
  {
    id: 'actions',
    header: 'Aksi',
    accessorKey: 'actions',
    cell: () => null
  }
]
