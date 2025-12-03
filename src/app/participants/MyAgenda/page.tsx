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
  const [loadingSession, setLoadingSession] = useState<string | null>(null)

  const fetchSessions = async () => {
    const cached = localStorage.getItem(`sessions-${userId}-${eventId}`)
    if (cached) {
      const cachedData = JSON.parse(cached).map((s: any) => ({
        ...s,
        startTime: s.startTime ? new Date(s.startTime) : null,
        endTime: s.endTime ? new Date(s.endTime) : null,
      }))
      setAllSessions(cachedData)
      setFilteredSessions(cachedData)
      setLoading(false)
      return
    }

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
      localStorage.setItem(`sessions-${userId}-${eventId}`, JSON.stringify(sessions))
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

  const handleViewDetails = (sessionId: string) => {
    setLoadingSession(sessionId)
    setTimeout(() => setLoadingSession(null), 1000)
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto font-sans bg-gray-50 px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/participants/Home">
          <FaArrowLeft className="text-red-800 w-5 h-5 cursor-pointer hover:text-red-600 transition" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">My Agenda</h1>
      </div>

<div className="w-full mb-8 flex items-center gap-2">
  <div className="flex items-center bg-white border border-gray-300 rounded-md px-2 py-2 flex-grow">
    <FaSearch className="text-red-900 mr-3" />
    <input
      type="text"
      placeholder="Search sessions or participants"
      className="outline-none text-base w-full text-gray-900 placeholder-gray-500"
      value={searchText}
      onChange={e => setSearchText(e.target.value)}
    />
  </div>

  <div className="flex flex-wrap gap-2">
    {filtersList.map(filter => (
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
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col h-full hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-900 leading-tight flex-1 pr-2">
                  {session.sessionTitle}
                </h2>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {session.speakers?.length > 0 ? (
                  session.speakers.map((speaker, speakerIndex) => (
                    <div key={speakerIndex} className="flex items-center gap-2">
                      <Image
                        src={speaker.pic || "/images/img (9).png"}
                        width={28}
                        height={28}
                        className="rounded-full object-cover"
                        alt={speaker.fullName}
                        unoptimized
                      />
                      <span className="text-sm text-gray-700">{speaker.fullName}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2">
                    <Image
                      src="/images/img (9).png"
                      width={28}
                      height={28}
                      className="rounded-full object-cover"
                      alt="Unknown Speaker"
                      unoptimized
                    />
                    <span className="text-sm text-gray-700">Unknown Speaker</span>
                  </div>
                )}
              </div>

              <hr className="border-t border-gray-200 mb-4" />
              <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                {session.event?.eventDescription ?? "No description available"}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <FaCalendarAlt className="text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    {session.startTime && session.endTime
                      ? `${session.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${session.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                      : "Time TBD"}
                  </span>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  {session.category || "General"}
                </span>
              </div>

              <div className="space-y-2 mb-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-black">Duration</span>
                  <span className="text-black font-medium">{session.minutes} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Room</span>
                  <span className="text-black font-medium">{session.location || "Hall B"}</span>
                </div>
              </div>

              <Link href={session?.sessionId ? `/participants/SessionDetail1/${session.sessionId}` : "#"}>
                <button
                  onClick={() => handleViewDetails(session.sessionId)}
                  disabled={loadingSession === session.sessionId}
                  className={`w-full py-2 text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm ${loadingSession === session.sessionId
                      ? "bg-red-900 cursor-not-allowed text-white"
                      : "bg-[#9B2033] text-white hover:bg-red-900 cursor-pointer"
                    }`}
                >
                  {loadingSession === session.sessionId ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    "View Details"
                  )}
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="w-full mt-10">
        <DiscoverMoreSessions />
      </div>

      <div className="w-full overflow-hidden mt-10">
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
