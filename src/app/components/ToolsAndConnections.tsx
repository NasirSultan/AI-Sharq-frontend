"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"
import api from "@/config/api"
import Link from "next/link"
import OptIn from "./opt-in"
import SessionRegistraion from "./SessionRegistraion"
import {
  FaQrcode,
  FaMapMarkedAlt,
  FaQuestionCircle,
  FaArrowRight,
  FaSpinner,
  FaClipboardCheck
} from "react-icons/fa"
import { CalendarCheck, CheckCircle, ClipboardCheck } from "lucide-react"

const toolsSupport = [
  {
    title: "Event Sessions",
    desc: "View all sessions available for this event and check details",
    icon: <FaClipboardCheck className="text-xl text-gray-500" />,
    Link: "/participants/ViewAllSessions",
  },
  {
    title: "FAQ & Support",
    desc: "Help & guidance",
    icon: <FaQuestionCircle className="text-xl text-yellow-500" />,
    Link: "/participants/Faqs&Support",
  },
]

type Toast = {
  message: string
  type: "success" | "error" | "pending"
}

export default function DashboardPage() {
  const eventId = useSelector((state: RootState) => state.event.id)
  const userId = useSelector((state: RootState) => state.user.userId)
  const [participants, setParticipants] = useState<any[]>([])
  const [toast, setToast] = useState<Toast | null>(null)
  const [loadingParticipants, setLoadingParticipants] = useState(false)
  const [connectingId, setConnectingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (!eventId || !userId) return
    setLoadingParticipants(true)

    api
      .get(
        `/participant-directory-opt-in-out/opted-in-in-event/${eventId}?userId=${userId}`
      )
      .then((res) => {

        const uniqueParticipants = Array.from(
          new Map(res.data.map((p: any) => [p.id, p])).values()
        )
        setParticipants(uniqueParticipants)
      })
      .catch(() => showToast("Failed to load participants", "error"))
      .finally(() => setLoadingParticipants(false))
  }, [eventId, userId])

  const showToast = (message: string, type: Toast["type"]) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
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
        const msg =
          err?.response?.data?.message || "Failed to send connection request"
        if (msg.toLowerCase().includes("pending")) {
          showToast("Request already pending", "pending")
          setParticipants((prev) => prev.filter((p) => p.id !== participantId))
        } else {
          showToast(msg, "error")
        }
      })
      .finally(() => setConnectingId(null))
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

  return (
    <div className="relative w-full">
      {toast && (
        <div
          className={`absolute top-4 right-4 px-4 py-2 rounded shadow text-sm font-medium ${toastColor(
            toast.type
          )}`}
        >
          {toast.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-4">
        {/* Tools & Support */}
        <section className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8 w-full">
          <h2 className="text-lg font-semibold text-[#1F2937] mb-5">
            Tools & Support
          </h2>

          <div className="flex flex-col gap-4">
            {toolsSupport.map((tool, index) => (
              <Link
                href={tool.Link}
                key={index}
                className="flex items-center justify-between bg-[#F9FAFB] border border-gray-200 rounded-xl px-6 py-5 hover:bg-white hover:border-[#9B2033] transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="text-[#9B2033] text-xl">{tool.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">
                      {tool.title}
                    </p>
                    <p className="text-xs text-gray-500">{tool.desc}</p>
                  </div>
                </div>
                <FaArrowRight className="text-[#9B2033] text-lg" />
              </Link>
            ))}

            {/* OptIn card */}
            <div className="flex items-center justify-between bg-[#F9FAFB] border border-gray-200 rounded-xl px-6 py-5 hover:bg-white hover:border-[#9B2033] transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="text-[#9B2033] text-xl">
                  <FaQuestionCircle />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">
                    Profile Visibility
                  </p>
                  <p className="text-xs text-gray-500">
                    Control who can view your profile in this venue
                  </p>
                </div>
              </div>
              <OptIn />
            </div>
            <div className="flex items-center justify-between bg-[#F9FAFB] border border-gray-200 rounded-xl px-6 py-5 hover:bg-white hover:border-[#9B2033] transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="text-[#9B2033] text-xl">
                  <ClipboardCheck />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">
                    Event Registration
                  </p>
                  <p className="text-xs text-gray-500">
                    Manage your registration status for this event
                  </p>

                </div>
              </div>
              <SessionRegistraion />
            </div>
          </div>
        </section>

        {/* Opted-in Participants */}
        <section className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8 w-full">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-black">Opted-in Participants</h2>
            <input
              type="text"
              placeholder="Search participants"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-full px-3 py-1 text-sm transition-all duration-300 hover:border-red-900"
            />
          </div>

          {loadingParticipants ? (
            <div className="flex justify-center py-10">
              <FaSpinner className="animate-spin text-[#9B2033] text-2xl" />
            </div>
          ) : (

            <div className="flex flex-col gap-4">
              {(showAll ? filteredParticipants : filteredParticipants.slice(0, 4)).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between bg-[#F9FAFB] border border-gray-200 rounded-xl px-5 py-4 hover:bg-white hover:border-[#9B2033] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    {p.file ? (
                      <img
                        src={p.file.startsWith("http") ? p.file : `/files/${p.file}`}
                        alt={p.name}
                        className="w-10 h-10 rounded-full border border-gray-300 shadow-sm object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 shadow-sm">
                        {p.name[0]?.toUpperCase()}
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-semibold text-[#111827]">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.role}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleConnect(p.id)}
                    disabled={connectingId === p.id}
                    className={`text-sm font-semibold ${connectingId === p.id
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#9B2033] hover:underline cursor-pointer"
                      }`}
                  >
                    {connectingId === p.id ? (
                      <FaSpinner className="animate-spin inline-block mr-2" />
                    ) : null}
                    {connectingId === p.id ? "Connecting..." : "Connect"}
                  </button>
                </div>
              ))}

              {filteredParticipants.length > 3 && !showAll && (
                <Link href="/participants/Directory">
                  <div className="text-sm text-[#9B2033] font-semibold text-center mt-2 hover:underline cursor-pointer">
                    Show All
                  </div>
                </Link>
              )}
            </div>

          )}
        </section>

      </div>
    </div>
  )
}
