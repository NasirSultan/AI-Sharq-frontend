"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { FaSearch, FaCalendarAlt, FaArrowLeft } from "react-icons/fa"
import DiscoverMoreSessions from "../../components/DiscoverMoreSessions"
import Link from "next/link"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"
import api from "@/config/api"

const filtersList = ["Daily", "Weekly", "10 Days", "90 Days", "All Time"]

// Helper function to parse session duration into start and end times
const parseDuration = (duration: string) => {
  if (!duration) return { startTime: null, endTime: null, minutes: 0 }
  const parts = duration.split(" - ").map((p) => p.trim())
  const start = new Date(parts[0])
  const end = new Date(parts[1])
  const minutes =
    isNaN(start.getTime()) || isNaN(end.getTime())
      ? 0
      : Math.round((end.getTime() - start.getTime()) / 60000)
  return {
    startTime: isNaN(start.getTime()) ? null : start,
    endTime: isNaN(end.getTime()) ? null : end,
    minutes,
  }
}

export default function MyAgendaPage() {
  const eventId = useSelector((state: RootState) => state.event.id)
  const userId = useSelector((state: RootState) => state.user.userId)
  const [activeFilter, setActiveFilter] = useState("All Time")
  const [searchText, setSearchText] = useState("")
  const [allSessions, setAllSessions] = useState<any[]>([])
  const [filteredSessions, setFilteredSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [emptyMessage, setEmptyMessage] = useState("")

  const fetchSessions = async () => {
    if (!eventId || !userId) {
      setEmptyMessage("Event not selected")
      setLoading(false)
      return
    }
    try {
      const res = await api.get(
        `/participants/bookmarked-sessions/${userId}/${eventId}`
      )

      const liveSessions = res.data.liveSessions || []
      const allSessions = res.data.allSessions || []

      const filteredAllSessions = allSessions.filter(
        (session: any) =>
          !liveSessions.some((live: any) => live.sessionId === session.sessionId)
      )

      const data = [...liveSessions, ...filteredAllSessions]

      const sessions = data.map((s: any) => {
        const { startTime, endTime, minutes } = parseDuration(s.duration || "")
        return { ...s, startTime, endTime, minutes }
      })

      setAllSessions(sessions)
      setFilteredSessions(sessions)

      if (sessions.length === 0) setEmptyMessage("No bookmarked sessions")
    } catch {
      setEmptyMessage("Failed to load sessions")
      setAllSessions([])
      setFilteredSessions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [eventId])

  useEffect(() => {
    let filtered = [...allSessions]
    const now = new Date()

    if (activeFilter === "Daily") {
      filtered = filtered.filter(
        (s) => s.startTime && s.startTime.toDateString() === now.toDateString()
      )
    } else if (activeFilter === "Weekly") {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      filtered = filtered.filter(
        (s) => s.startTime && s.startTime >= weekStart && s.startTime <= weekEnd
      )
    } else if (activeFilter === "10 Days") {
      const start = new Date()
      const end = new Date()
      end.setDate(start.getDate() + 10)
      filtered = filtered.filter(
        (s) => s.startTime && s.startTime >= start && s.startTime <= end
      )
    } else if (activeFilter === "90 Days") {
      const start = new Date()
      const end = new Date()
      end.setDate(start.getDate() + 90)
      filtered = filtered.filter(
        (s) => s.startTime && s.startTime >= start && s.startTime <= end
      )
    }

    if (searchText) {
      filtered = filtered.filter((s) =>
        s.sessionTitle.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    setFilteredSessions(filtered)
    if (filtered.length === 0) setEmptyMessage("No sessions found")
  }, [activeFilter, searchText, allSessions])

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/participants/Home" className="flex-shrink-0">
            <FaArrowLeft className="text-red-800 w-5 h-5 cursor-pointer hover:text-red-600 transition" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">My Agenda</h1>
        </div>

        {/* Controls Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
          {/* Search - Takes full width on mobile, 5 cols on desktop */}
          <div className="lg:col-span-5">
            <div className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-3 hover:border-red-700 transition shadow-sm">
              <FaSearch className="text-red-900 mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search sessions..."
                className="outline-none text-base w-full text-gray-900 placeholder-gray-500"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          {/* Filters - Takes full width on mobile, 5 cols on desktop */}
          <div className="lg:col-span-5">
            <div className="flex flex-wrap gap-2">
              {filtersList.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeFilter === filter
                      ? "bg-[#86002B] text-white shadow-md"
                      : "bg-white border border-gray-300 text-gray-700 hover:border-red-700 hover:text-red-800 shadow-sm"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Date - Takes full width on mobile, 2 cols on desktop */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-center border border-gray-300 bg-white px-4 py-3 rounded-lg text-sm text-gray-700 hover:border-red-700 transition shadow-sm h-full">
              <FaCalendarAlt className="mr-2 text-gray-500 flex-shrink-0" />
              <span className="truncate">Jan 2024 - Dec 2024</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-[#9B2033] rounded-full animate-spin"></div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="flex justify-center items-center h-70 bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-600 text-lg font-medium">{emptyMessage}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
            {filteredSessions.map((session, index) => (
              <div
                key={`${session?.sessionId || "session"}-${index}`}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col h-full hover:shadow-md transition-shadow duration-200"
              >
                {/* Header with title and bookmark */}
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-900 leading-tight flex-1 pr-2">
                    {session.sessionTitle}
                  </h2>
                  <button className="flex-shrink-0 mt-1 hover:opacity-70 transition-opacity">
                    <svg
                      width="16"
                      height="18"
                      viewBox="0 0 12 16"
                      fill="#9B2033"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 1.5V15.2406C0 15.6594 0.340625 16 0.759375 16C0.915625 16 1.06875 15.9531 1.19687 15.8625L6 12.5L10.8031 15.8625C10.9313 15.9531 11.0844 16 11.2406 16C11.6594 16 12 15.6594 12 15.2406V1.5C12 0.671875 11.3281 0 10.5 0H1.5C0.671875 0 0 0.671875 0 1.5Z"
                        stroke="#9B2033"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>
                </div>

                {/* Speaker */}
               {/* Speakers - Handle multiple speakers */}
<div className="mb-5">
  <div className="flex items-center text-base text-gray-600 mb-3">

  </div>
  <div className="flex flex-wrap gap-3">
    {session.speakers?.length > 0 ? (
      session.speakers.map((speaker, speakerIndex) => (
        <div key={speakerIndex} className="flex items-center gap-2">
          <img
            src={speaker.pic || "/images/img (9).png"}
            className="w-8 h-8 rounded-full object-cover"
            alt={speaker.fullName}
            onError={(e) => {
              e.currentTarget.src = "/images/img (9).png"
            }}
          />
          <span className="text-sm text-gray-700">{speaker.fullName}</span>
        </div>
      ))
    ) : (
      <div className="flex items-center gap-2">
        <img
          src="/images/img (9).png"
          className="w-8 h-8 rounded-full object-cover"
          alt="Unknown Speaker"
        />
        <span className="text-sm text-gray-700">Unknown Speaker</span>
      </div>
    )}
  </div>
</div>

                <hr className="border-t border-gray-200 mb-4" />

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                  {session.event?.eventDescription ?? "No description available"}
                </p>

                {/* Time and Category */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FaCalendarAlt className="text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">
                      {session.startTime && session.endTime
                        ? `${session.startTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} - ${session.endTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : "Time TBD"}
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {session.category || "General"}
                  </span>
                </div>

                {/* Session Details */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="text-gray-900 font-medium">{session.minutes} minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Room</span>
                    <span className="text-gray-900 font-medium">{session.location || "Hall B"}</span>
                  </div>
                </div>

                {/* View Details Button */}
                <Link
                  href={session?.sessionId ? `/participants/SessionDetail1/${session.sessionId}` : "#"}
                  className="mt-auto"
                >
                  <button className="w-full bg-[#9B2033] text-white py-3 text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200 cursor-pointer shadow-sm">
                    View Details
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Discover More Sessions */}
      <div className="w-full">
        <DiscoverMoreSessions />
      </div>

      {/* Decorative Line */}
      <div className="w-full overflow-hidden">
        <Image
          src="/images/line.png"
          alt="Divider"
          width={1729}
          height={127}
          className="w-full object-cover"
        />
      </div>
    </div>
  )
}