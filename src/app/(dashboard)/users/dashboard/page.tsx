import { MdOutlineMapsHomeWork } from "react-icons/md";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className=" lg:col-span-8 flex-row items-center gap-5 rounded-lg bg-white p-6 shadow-sm">
                        <div className="text-2xl font-medium">Selamat Datang, Akbar</div>
                        <div className="text-gray-600 text-sm">informasi kamar anda tetap terorganisir disini</div>
                        <div className="grid lg: grid-cols-12 gap-4 mt-4 p-2 bg-gray-100 rounded-lg">
                            <div className="lg: col-span-8 flex items-center gap-4">
                                <MdOutlineMapsHomeWork className="text-2xl" />
                                <div>
                                    <div className="text-gray-600 text-sm">Kamar saat ini </div>
                                    <div className="font-semibold">Lantai 2, Room 204</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        </div>
    )
}