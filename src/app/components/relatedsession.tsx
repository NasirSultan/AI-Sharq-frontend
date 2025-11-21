"use client"
import useSWR from "swr"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"
import { FaCalendarAlt, FaLock, FaUnlock } from "react-icons/fa"
import Link from "next/link"
import api from "@/config/api"

const fetcher = (url: string) => api.get(url).then(res => res.data)

export default function MyAgendaPage() {
  const eventId = useSelector((state: RootState) => state.event.id)

  const { data, error, isLoading } = useSWR(
    eventId ? `/sessions/event/${eventId}/sessions` : null,
    fetcher,
    { revalidateOnFocus: false } // prevents reload on window focus
  )

  const sessions = data?.map((s: any) => {
    const start = new Date(s.startTime)
    const end = new Date(s.endTime)
    const minutes =
      isNaN(start.getTime()) || isNaN(end.getTime())
        ? 0
        : Math.round((end.getTime() - start.getTime()) / 60000)

    return {
      sessionId: s.id,
      sessionTitle: s.title,
      event: { eventDescription: s.description },
      startTime: isNaN(start.getTime()) ? null : start,
      endTime: isNaN(end.getTime()) ? null : end,
      minutes,
      location: s.location,
      category: s.category,
      registration: s.registration,
      speakers: (s.speakers || []).map((sp: any) => ({
        fullName: sp.name,
        pic: sp.file,
      })),
    }
  }) || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-[#9B2033] rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-black text-lg font-medium">Failed to load sessions</p>
      </div>
    )
  }

  if (!sessions.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-black text-lg font-medium">
          {eventId ? "No sessions found" : "Event not selected"}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {sessions.map((session, index) => (
        <div
          key={session?.sessionId ?? index}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between h-[380px]"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-black">{session.sessionTitle}</h2>
            {session.registration ? (
              <FaLock className="text-red-600 w-4 h-4" />
            ) : (
              <FaUnlock className="text-green-600 w-4 h-4" />
            )}
          </div>

          <div className="flex items-center text-xs text-gray-600 space-x-2">
            <img
              src={session.speakers[0]?.pic || "/images/img (9).png"}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span>{session.speakers[0]?.fullName ?? "Unknown"}</span>
          </div>

          <hr className="border-t border-gray-300" />

          <p className="text-xs text-gray-500 mb-3">
            {session.event?.eventDescription ?? "No description"}
          </p>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <FaCalendarAlt className="text-blue-700" />
                <span>
                  {session.startTime && session.endTime
                    ? `${session.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${session.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                    : "No time available"}
                </span>
              </div>
            </div>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold">
              {session.category || "No category"}
            </span>
          </div>

          <div className="flex text-xs text-gray-900 mb-2 items-center justify-between">
            <span>Duration</span>
            <span>{session.minutes} minutes</span>
          </div>
          <div className="flex text-xs text-gray-900 mb-2 items-center justify-between">
            <span>Room</span>
            <span>{session.location || "Hall B"}</span>
          </div>

          <Link
            href={session?.sessionId ? `/participants/SessionDetail1/${session.sessionId}` : "#"}
            className="w-full"
          >
            <button className="w-full bg-[#9B2033] text-white py-2 text-sm rounded-md hover:bg-red-700 transition cursor-pointer">
              View Details
            </button>
          </Link>
        </div>
      ))}
    </div>
  )
}
