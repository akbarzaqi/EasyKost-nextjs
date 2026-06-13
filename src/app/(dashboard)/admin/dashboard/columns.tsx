type Bill = {
    invoiceNumber: string;
    name: string;
    room: string;
    amount: number;
    dueDate: string;
    status: 'paid' | 'unpaid' | 'overdue';
}

const formatCurrency = (amount: number) =>
    `Rp ${amount.toLocaleString('id-ID')}`

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const statusStyles: Record<string, { badge: string; dot: string; label: string }> = {
    paid: { badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500', label: 'Lunas' },
    unpaid: { badge: 'bg-amber-50 text-amber-700 border border-amber-200', dot: 'bg-amber-500', label: 'Belum Bayar' },
    overdue: { badge: 'bg-rose-50 text-rose-700 border border-rose-200', dot: 'bg-rose-500', label: 'Jatuh Tempo' },
}

export const columns = [
    {
        id: 'invoiceNumber',
        header: 'Invoice',
        accessorKey: 'invoiceNumber',
        cell: ({ getValue }: any) => (
            <span className="font-mono text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                {getValue() as string}
            </span>
        )
    },
    {
        id: 'name',
        header: 'Nama',
        accessorKey: 'name',
        cell: ({ getValue }: any) => (
            <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-semibold text-xs flex-shrink-0">
                    {(getValue() as string).charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-900">{getValue() as string}</span>
            </div>
        )
    },
    {
        id: 'room',
        header: 'Kamar',
        accessorKey: 'room',
        cell: ({ getValue }: any) => (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {getValue() as string}
            </span>
        )
    },
    {
        id: 'amount',
        header: 'Jumlah',
        accessorKey: 'amount',
        cell: ({ getValue }: any) => (
            <span className="font-semibold text-emerald-600">
                {formatCurrency(getValue())}
            </span>
        )
    },
    {
        id: 'dueDate',
        header: 'Jatuh Tempo',
        accessorKey: 'dueDate',
        cell: ({ getValue }: any) => (
            <span className="text-sm text-gray-600">{formatDate(getValue() as string)}</span>
        )
    },
    {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }: any) => {
            const s = statusStyles[getValue() as string] || { badge: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500', label: getValue() as string }
            return (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.badge}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                </span>
            )
        }
    },
]

export const data: Bill[] = [
    {
        invoiceNumber: 'INV-001',
        name: 'John Doe',
        room: 'A101',
        amount: 500000,
        dueDate: '2024-07-10',
        status: 'unpaid',
    },
    {
        invoiceNumber: 'INV-002',
        name: 'Jane Smith',
        room: 'B202',
        amount: 750000,
        dueDate: '2024-07-15',
        status: 'paid',
    },
    {
        invoiceNumber: 'INV-003',
        name: 'Alice Johnson',
        room: 'C303',
        amount: 600000,
        dueDate: '2024-07-20',
        status: 'overdue',
    },
]
