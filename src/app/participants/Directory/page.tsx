"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"
import api from "@/config/api"
import { FaSpinner, FaSearch, FaArrowLeft } from "react-icons/fa"
import { FaArrowRight } from "react-icons/fa"
import { FaMessage } from "react-icons/fa6"
import Link from "next/link"

import { useRouter } from "next/navigation"
type Toast = {
    message: string
    type: "success" | "error" | "pending"
}

const CACHE_KEY = "participants_cache"
const CACHE_DURATION = 3 * 60 * 1000

export default function DashboardPage() {
    const eventId = useSelector((state: RootState) => state.event.id)
    const userId = useSelector((state: RootState) => state.user.userId)
    const [participants, setParticipants] = useState<any[]>([])
    const [connectingId, setConnectingId] = useState<number | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [showAll, setShowAll] = useState(true)
    const [toast, setToast] = useState<Toast | null>(null)

    useEffect(() => {
        if (!eventId || !userId) return

        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
            const { timestamp, data } = JSON.parse(cached)
            if (Date.now() - timestamp < CACHE_DURATION) {
                setParticipants(data)
                return
            }
        }

        api
            .get(`/participant-directory-opt-in-out/opted-in-in-event/${eventId}?userId=${userId}`)
            .then((res) => {
                const uniqueParticipants = Array.from(
                    new Map(res.data.map((p: any) => [p.id, p])).values()
                )
                setParticipants(uniqueParticipants)
                localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: uniqueParticipants }))
            })
    }, [eventId, userId])

    const showToast = (message: string, type: Toast["type"]) => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const toastColor = (type: Toast["type"]) => {
        switch (type) {
            case "success":
                return "bg-green-100 text-green-800"
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "error":
                return "bg-red-100 text-red-800"
            default:
                return ""
        }
    }

    const filteredParticipants = participants.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const displayedParticipants = showAll ? filteredParticipants : filteredParticipants.slice(0, 3)

    const handleConnect = (participantId: number) => {
        if (connectingId) return
        setConnectingId(participantId)

        api
            .post(`/connections/send`, { senderId: userId, receiverId: participantId })
            .then(() => {
                showToast("Connection request sent successfully", "success")
                setParticipants((prev) => prev.filter((p) => p.id !== participantId))
            })
            .catch((err) => {
                const msg = err?.response?.data?.message || "Failed to send connection request"
                if (msg.toLowerCase().includes("pending")) {
                    showToast("Request already pending", "pending")
                    setParticipants((prev) => prev.filter((p) => p.id !== participantId))
                } else {
                    showToast(msg, "error")
                }
            })
            .finally(() => setConnectingId(null))
    }
    const router = useRouter()
    return (
        <div className="w-full max-w-6xl mx-auto p-4 relative">
            {toast && (
                <div
                    className={`absolute top-4 right-4 px-4 py-2 rounded shadow text-sm font-medium ${toastColor(
                        toast.type
                    )}`}
                >
                    {toast.message}
                </div>
            )}

            <div className="mb-4">



                <div className="flex items-center gap-3 bg-[#FFEEEE] p-4 my-3 rounded-2xl shadow">
                    <div className="w-12 h-12 bg-[#FFBEBE] rounded-lg flex items-center justify-center">
                        <FaMessage className="text-[#9B2033] text-xl" />
                    </div>
                    <h2 className="text-lg font-semibold text-[#9B2033]">Chats List</h2>
                    <Link href="/participants/Masseges" className="ml-auto">
                        <FaArrowRight className="text-[#9B2033] text-2xl" />
                    </Link>
                </div>





                <div className="flex items-center gap-4 my-2">
                    <FaArrowLeft
                        onClick={() => router.back()}
                        className="text-red-800 w-5 h-5 cursor-pointer hover:text-red-900 transition"
                    />
                    <h1 className="text-2xl p-2 font-medium text-[#282828]">Networking</h1>
                </div>
                <div className="flex flex-wrap items-center gap-4">

                    <div className="flex gap-4 whitespace-nowrap w-full sm:w-auto">
                        <Link href="/participants/Networking">
                            <button className="bg-[#9B2033] text-white font-bold py-2 px-4 rounded-xl">
                                Directory
                            </button>
                        </Link>

                        <Link href="/participants/Networking">
                            <button className="border border-[#E8E8E8] text-[#282828] font-medium py-2 px-4 rounded-xl">
                                Requests
                            </button>
                        </Link>

                        <Link href="/participants/MyConnections">
                            <button className="border border-[#E8E8E8] text-[#282828] font-medium py-2 px-4 rounded-xl">
                                Connections
                            </button>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 border border-[#E8E8E8] rounded-xl px-3 py-2 w-full sm:flex-1 min-w-[200px]">
                        <FaSearch className="text-[#9B2033]" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 outline-none border-none text-sm text-[#575454]"
                        />
                    </div>

                </div>

            </div>

            <div className="flex flex-col gap-4">
                {displayedParticipants.length > 0 ? (
                    displayedParticipants.map((p) => (
                        <div
                            key={p.id}
                            className="flex items-center justify-between bg-[#F9FAFB] border border-gray-200 rounded-xl px-5 py-4"
                        >
                            <div className="flex items-center gap-4">
                                {p.file ? (
                                    <img
                                        src={p.file.startsWith("http") ? p.file : `/files/${p.file}`}
                                        alt={p.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
                                        {p.name[0]?.toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-semibold">{p.name}</p>
                                    <p className="text-xs text-gray-500">{p.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleConnect(p.id)}
                                disabled={connectingId === p.id}
                                className={`text-sm font-semibold ${connectingId === p.id ? "text-gray-400 cursor-not-allowed" : "text-[#9B2033] hover:underline"
                                    }`}
                            >
                                {connectingId === p.id ? (
                                    <FaSpinner className="animate-spin inline-block mr-2" />
                                ) : null}
                                {connectingId === p.id ? "Connecting..." : "Connect"}
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No participants found</p>
                )}
            </div>
        </div>
    )
}
