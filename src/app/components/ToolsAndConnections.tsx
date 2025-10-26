"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"
import api from "@/config/api"
import Link from "next/link"
import OptIn from "./opt-in"

import {
  FaQrcode,
  FaMapMarkedAlt,
  FaQuestionCircle,
  FaArrowRight,
} from "react-icons/fa"

const toolsSupport = [
  {
    title: "QR Code Pass",
    desc: "Entry & check-in",
    icon: <FaQrcode className="text-xl text-gray-500" />,
    Link: "",
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

  useEffect(() => {
    if (!eventId || !userId) return
    api
      .get(`/participant-directory-opt-in-out/opted-in-in-event/${eventId}?userId=${userId}`)
      .then((res) => setParticipants(res.data))
      .catch(() => showToast("Failed to load participants", "error"))
  }, [eventId, userId])

  const showToast = (message: string, type: Toast["type"]) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleConnect = (participantId: number) => {
    api
      .post(`/connections/send`, { senderId: userId, receiverId: participantId })
      .then(() => showToast("Connection request sent successfully", "success"))
      .catch((err) => {
        const msg =
          err?.response?.data?.message || "Failed to send connection request"
        if (msg.toLowerCase().includes("pending")) {
          showToast("Request already pending", "pending")
        } else {
          showToast(msg, "error")
        }
      })
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
  <h2 className="text-lg font-semibold text-[#1F2937] mb-5">Tools & Support</h2>

  <div className="flex flex-col gap-4">
    {toolsSupport.map((tool, index) => (
      <div
        key={index}
        className="flex items-center justify-between bg-[#F9FAFB] border border-gray-200 rounded-xl px-6 py-5 hover:bg-white hover:border-[#9B2033] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="text-[#9B2033] text-xl">{tool.icon}</div>
          <div>
            <p className="text-sm font-semibold text-[#111827]">{tool.title}</p>
            <p className="text-xs text-gray-500">{tool.desc}</p>
          </div>
        </div>
        <Link href={tool.Link}>
          <FaArrowRight className="text-[#9B2033] text-lg" />
        </Link>
      </div>
    ))}

    {/* OptIn card styled like others */}
    <div className="flex items-center justify-between bg-[#F9FAFB] border border-gray-200 rounded-xl px-6 py-5 hover:bg-white hover:border-[#9B2033] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="text-[#9B2033] text-xl">
          <FaQuestionCircle />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#111827]">Opt-in Settings</p>
          <p className="text-xs text-gray-500">Manage your preferences</p>
        </div>
      </div>
      <div>
        <OptIn />
      </div>
    </div>
  </div>
</section>


        {/* Opted-in Participants */}
        <section className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8 w-full">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-[#1F2937]">Opted-in Participants</h2>
          </div>

          <div className="flex flex-col gap-4">
            {participants.length > 0 ? (
              participants.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between bg-[#F9FAFB] border border-gray-200 rounded-xl px-5 py-4 hover:bg-white hover:border-[#9B2033] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    {p.file ? (
                      <img
                        src={`/files/${p.file}`}
                        alt={p.name}
                        className="w-12 h-12 rounded-full border border-gray-300 shadow-sm object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 shadow-sm">
                        {p.name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.role}</p>
                    </div>
                  </div>
                  <button
                    className="text-[#9B2033] text-sm font-semibold hover:underline"
                    onClick={() => handleConnect(p.id)}
                  >
                    Connect
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No participants found yet</p>
            )}
          </div>
        </section>
     
     
      </div>
    </div>
  )
}
