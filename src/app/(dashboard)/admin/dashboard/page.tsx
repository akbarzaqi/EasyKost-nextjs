'use client'
import React, { useState, useMemo, useEffect } from "react"
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MdOutlineHomeWork, MdOutlinePersonOutline } from "react-icons/md"
import { CgNotes } from "react-icons/cg"
import { GoVerified } from "react-icons/go"
import { Plus, FileText, TrendingUp } from "lucide-react"

import { columns, data } from "./columns"
import { DataTable } from "./data-table"

import { useAuth } from "../../../../lib/hooks/useAuth"

const getData = async (): Promise<{ columns: any[], data: any[] }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ columns, data })
        }, 1000)
    })
}

type Stat = {
    title: string
    value: number
    suffix?: string
    icon: React.ReactNode
    iconBg: string
    iconColor: string
    description?: string
    highlight?: boolean
    delta?: {
        positive: boolean
        value: string
    }
}

export default function AdminDashboard() {
    const [columnsList, setColumnsList] = React.useState<any[] | null>(null)
    const [dataList, setDataList] = React.useState<any[] | null>(null)

    const { user } = useAuth()

    console.log('Authenticated user in AdminDashboard:', user)

    useEffect(() => {
        const fetchData = async () => {
            const { columns, data } = await getData()
            setColumnsList(columns)
            setDataList(data)
        }
        fetchData()
    }, [])

    const stats: Stat[] = useMemo(() => [
        {
            title: "Total Hunian",
            value: 10,
            icon: <MdOutlineHomeWork />,
            iconBg: "bg-indigo-50",
            iconColor: "text-indigo-600",
        },
        {
            title: "Penghuni Aktif",
            value: 10,
            icon: <MdOutlinePersonOutline />,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
        },
        {
            title: "Tagihan Bulan Ini",
            value: 10,
            icon: <CgNotes />,
            iconBg: "bg-sky-50",
            iconColor: "text-sky-600",
        },
        {
            title: "Menunggu Verifikasi",
            value: 3,
            icon: <GoVerified />,
            iconBg: "bg-rose-50",
            iconColor: "text-rose-600",
            description: "butuh verifikasi",
            highlight: true,
        },
    ], [])

    if (!columnsList || !dataList) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Memuat dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                            Dashboard
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Ringkasan aktivitas kost Anda hari ini.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white">
                            <Plus className="h-4 w-4" />
                            Generate Tagihan
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {stats.map((s) => (
                        <Card
                            key={s.title}
                            className={`group relative overflow-hidden border rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200 ${
                                s.highlight ? "border-rose-200 bg-gradient-to-br from-rose-50/60 to-white" : "border-gray-200"
                            }`}
                        >
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    {s.title}
                                </CardTitle>
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-xl ${s.iconBg} ${s.iconColor}`}>
                                    {s.icon}
                                </div>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <div className="flex items-baseline gap-1.5">
                                    <div className={`text-3xl font-bold tracking-tight ${
                                        s.highlight ? "text-rose-600" : "text-gray-900"
                                    }`}>
                                        {s.value}
                                    </div>
                                    {s.suffix && (
                                        <span className="text-sm text-gray-500">{s.suffix}</span>
                                    )}
                                </div>

                                {s.delta && (
                                    <div className="mt-2 flex items-center gap-1.5 text-xs">
                                        <span className={`inline-flex items-center gap-0.5 font-medium ${
                                            s.delta.positive ? "text-emerald-600" : "text-amber-600"
                                        }`}>
                                            <TrendingUp className={`h-3 w-3 ${s.delta.positive ? "" : "rotate-180"}`} />
                                            {s.delta.value}
                                        </span>
                                    </div>
                                )}

                                {s.description && (
                                    <p className="mt-2 text-xs text-rose-600 font-medium">
                                        {s.description}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <div>
                            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-500" />
                                Tagihan Terbaru
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Daftar tagihan yang baru saja dibuat.
                            </p>
                        </div>
                    </div>
                    <DataTable columns={columns} data={data} />
                </div>
            </div>
        </div>
    )
}
