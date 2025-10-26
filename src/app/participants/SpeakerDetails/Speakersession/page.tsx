"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"
import { FaCalendarAlt } from "react-icons/fa"
import Image from "next/image"
import api from "@/config/api"

const parseDuration = (start: string, end: string) => {
  if (!start || !end) return { startTime: null, endTime: null, minutes: 0 }

  const startTime = new Date(start)
  const endTime = new Date(end)
  const minutes =
    isNaN(startTime.getTime()) || isNaN(endTime.getTime())
      ? 0
      : Math.round((endTime.getTime() - startTime.getTime()) / 60000)

  return { startTime, endTime, minutes }
}

export default function SpeakerSessions() {
  const speakerId = useSelector((state: RootState) => state.speaker.speakerId)
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [emptyMessage, setEmptyMessage] = useState("")

  const fetchSessions = async () => {
    if (!speakerId) {
      setEmptyMessage("Speaker not selected")
      setLoading(false)
      return
    }

    try {
      const res = await api.get(`/sessions/speaker/${speakerId}`)
      const data = res.data?.sessions || []

      const sessions = data.map((s: any) => {
        const { startTime, endTime, minutes } = parseDuration(s.startTime, s.endTime)
        return { ...s, startTime, endTime, minutes }
      })

      setSessions(sessions)
      if (sessions.length === 0) setEmptyMessage("No sessions found")
    } catch (err) {
      console.error("Error fetching sessions:", err)
      setEmptyMessage("Failed to load sessions")
      setSessions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [speakerId])

  return (
   <div className="font-sans w-full">
  <h1 className="text-lg md:text-xl font-semibold text-black mb-4">
    Speaker Related Sessions
  </h1>

  {loading ? (
    <div className="flex items-center justify-center h-[300px]">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-[#9B2033] rounded-full animate-spin"></div>
    </div>
  ) : sessions.length === 0 ? (
    <div className="flex justify-center items-center h-[300px]">
      <p className="text-gray-800 text-sm md:text-base font-medium">{emptyMessage}</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
      {sessions.map((session, index) => (
        <div
          key={session.id || index}
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition w-full"
        >
          <div>
            {/* Event Title */}
            <h2 className="text-sm md:text-base font-semibold text-[#9B2033] mb-1">
              {session.title}
            </h2>

            <p className="text-xs text-gray-500 mb-2 line-clamp-3">
              {session.description || "No description available"}
            </p>

            {/* Speaker Info */}
            {session.speakers && session.speakers.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <Image
                  src={session.speakers[0].file || "/images/default-avatar.png"}
                  alt="Speaker"
                  width={32}
                  height={32}
                  className="rounded-full object-cover w-8 h-8"
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium text-gray-900">
                    {session.speakers[0].name || "Unknown Speaker"}
                  </span>
                </div>
              </div>
            )}

            {/* Time and Category */}
            <div className="flex items-center justify-between text-xs text-gray-700 mb-2">
              <div className="flex items-center gap-1">
                <FaCalendarAlt className="text-[#9B2033]" />
                <span>
                  {session.startTime && session.endTime
                    ? `${session.startTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })} - ${session.endTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : "No time available"}
                </span>
              </div>
              <span className="px-2 py-0.5 bg-[#f4e6e8] text-[#9B2033] rounded-lg text-xs font-medium">
                {session.category || "No category"}
              </span>
            </div>

            {/* Duration and Room */}
            <div className="text-xs text-gray-800 space-y-1">
              <div className="flex justify-between">
                <span>Duration</span>
                <span>{session.minutes} min</span>
              </div>
              <div className="flex justify-between">
                <span>Room</span>
                <span>{session.location || "Unknown"}</span>
              </div>
            </div>
          </div>

          <Link
            href={session.id ? `/participants/SessionDetail1/${session.id}` : "#"}
            className="w-full mt-3"
          >
            <button className="w-full bg-[#9B2033] text-white py-2 text-sm rounded-md hover:bg-[#801c2a] transition">
              View Details
            </button>
          </Link>
        </div>
      ))}
    </div>
  )}
</div>

  )
}
