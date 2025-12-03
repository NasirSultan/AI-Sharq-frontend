"use client"
import Image from "next/image";
import { useEffect, useState } from "react"
import { FaSearch, FaCalendarAlt, FaArrowLeft,FaQrcode } from "react-icons/fa"
import DiscoverMoreSessions from "../../components/DiscoverMoreSessions"
import Link from "next/link"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"
import api from "@/config/api"


import { useRouter } from "next/navigation"

const filters = ["Daily", "Weekly", "10 Days", "90 Days", "All Time"]

const parseDuration = (duration: string) => {
  if (!duration) return { startTime: null, endTime: null, minutes: null }
  const parts = duration.split(" - ").map(p => p.trim())
  const start = new Date(parts[0])
  const end = new Date(parts[1])

  const minutes = !isNaN(start.getTime()) && !isNaN(end.getTime())
    ? Math.round((end.getTime() - start.getTime()) / 60000)
    : null
  return { startTime: isNaN(start.getTime()) ? null : start, endTime: isNaN(end.getTime()) ? null : end, minutes }
}

export default function MyAgendaPage() {
  const eventId = useSelector((state: RootState) => state.event.id)
  const [activeFilter, setActiveFilter] = useState("All Time")
  const [searchText, setSearchText] = useState("")
  const [sessions, setSessions] = useState<any[]>([])
  const [filteredSessions, setFilteredSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [emptyMessage, setEmptyMessage] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [showDatePicker, setShowDatePicker] = useState(false)
const router = useRouter()
const cacheKey = "cachedSessions"
const cacheTimeKey = "cachedSessionsTime"
const cacheLimitMinutes = 5

const reviveDates = data => {
  return data.map(item => {
    return {
      ...item,
      startTime: item.startTime ? new Date(item.startTime) : null,
      endTime: item.endTime ? new Date(item.endTime) : null
    }
  })
}

const fetchSessions = async () => {
  if (!eventId) {
    setEmptyMessage("Event not selected")
    setLoading(false)
    return
  }

  const saved = localStorage.getItem(cacheKey)
  const savedTime = localStorage.getItem(cacheTimeKey)

  if (saved && savedTime) {
    const time = new Date(savedTime)
    const now = new Date()
    const diff = (now.getTime() - time.getTime()) / 60000

    if (diff < cacheLimitMinutes) {
      const raw = JSON.parse(saved)
      const revived = reviveDates(raw)
      setSessions(revived)
      setFilteredSessions(revived)
      setLoading(false)
      return
    }
  }

  try {
    const res = await api.get(`/event/event-sessions/${eventId}`)
    const data = res.data
    const liveIds = (data.liveSessions || []).map(s => s.sessionId)
    const filteredAll = (data.allSessions || []).filter(s => !liveIds.includes(s.sessionId))
    const combined = [...(data.liveSessions || []), ...filteredAll]
    const transformed = combined.map(s => ({ ...s, ...parseDuration(s.duration || "") }))

    localStorage.setItem(cacheKey, JSON.stringify(transformed))
    localStorage.setItem(cacheTimeKey, new Date().toISOString())

    setSessions(transformed)
    setFilteredSessions(transformed)
    if (transformed.length === 0) setEmptyMessage("No sessions available")
  } catch {
    setEmptyMessage("Failed to load sessions")
    setSessions([])
    setFilteredSessions([])
  } finally {
    setLoading(false)
  }
}



  useEffect(() => {
    fetchSessions()
  }, [eventId])

  useEffect(() => {
    let filtered = [...sessions]
    const now = new Date()

    if (activeFilter === "Daily") {
      filtered = filtered.filter(s => s.startTime && s.startTime.toDateString() === now.toDateString())
    } else if (activeFilter === "Weekly") {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      filtered = filtered.filter(s => s.startTime && s.startTime >= weekStart && s.startTime <= weekEnd)
    } else if (activeFilter === "10 Days") {
      const start = new Date()
      const end = new Date()
      end.setDate(start.getDate() + 10)
      filtered = filtered.filter(s => s.startTime && s.startTime >= start && s.startTime <= end)
    } else if (activeFilter === "90 Days") {
      const start = new Date()
      const end = new Date()
      end.setDate(start.getDate() + 90)
      filtered = filtered.filter(s => s.startTime && s.startTime >= start && s.startTime <= end)
    }

    if (startDate) {
      const start = new Date(startDate)
      filtered = filtered.filter(s => s.startTime && s.startTime >= start)
    }
    if (endDate) {
      const end = new Date(endDate)
      filtered = filtered.filter(s => s.startTime && s.startTime <= end)
    }

    if (searchText) {
      filtered = filtered.filter(s => s.sessionTitle.toLowerCase().includes(searchText.toLowerCase()))
    }

    setFilteredSessions(filtered)
    if (filtered.length === 0) setEmptyMessage("No sessions found")
  }, [activeFilter, searchText, sessions, startDate, endDate])

  const getSessionStatus = (session: any) => {
    if (session.location?.toLowerCase() === "online") {
      return session.isLive ? "Live Now" : "Finished"
    } else {
      return `Upcoming`
    }
  }

  const handleApplyDateRange = () => {
    setShowDatePicker(false)
  }

  return (
<div className="container mx-auto max-w-6xl min-h-screen font-sans bg-gray-50 p-4 md:p-10">

      <div className="flex items-center gap-2 mb-6">
      <FaArrowLeft
        className="text-red-800 w-5 h-5 cursor-pointer"
        onClick={() => router.back()}
      />
      <h1 className="text-lg md:text-xl font-semibold text-black">All Sessions</h1>
    </div>

      <div className="flex flex-col sm:flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:gap-2 md:flex-1">
          <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 w-full sm:w-auto flex-1">
            <FaSearch className="text-red-900 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="outline-none text-sm w-full text-black"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => {
                setActiveFilter(f)
                setStartDate("")
                setEndDate("")
              }}
              className={`flex-shrink-0 px-4 py-1 rounded-xl text-sm font-medium transition
                ${activeFilter === f
                  ? "bg-[#86002B] text-white"
                  : "bg-white border border-gray-300 text-black hover:bg-gray-100"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative mt-2 sm:mt-0">
          <button
            onClick={() => setShowDatePicker(prev => !prev)}
            className="flex items-center border border-gray-300 bg-white px-3 py-2 rounded-md text-sm text-gray-700"
          >
            <FaCalendarAlt className="mr-2 text-gray-500" />
            {startDate && endDate ? `${startDate} - ${endDate}` : "Select Date Range"}
          </button>

          {showDatePicker && (
            <div className="absolute z-10 mt-2 p-4 bg-white border border-gray-300 rounded-md shadow-lg flex flex-col gap-2">
              <label className="flex flex-col text-sm text-gray-700">
                Start Date
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="mt-1 border border-gray-300 rounded px-2 py-1"
                />
              </label>
              <label className="flex flex-col text-sm text-gray-700">
                End Date
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="mt-1 border border-gray-300 rounded px-2 py-1"
                />
              </label>
              <button
                onClick={handleApplyDateRange}
                className="bg-[#86002B] text-white text-sm py-1 rounded mt-2"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-[#9B2033] rounded-full animate-spin"></div>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-black text-lg font-medium">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
          {filteredSessions.map((session, index) => (
            <div
              key={`${session?.sessionId || "session"}-${index}`}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col h-full hover:shadow-md transition-shadow duration-200"
            >

                
              <div className="flex items-start justify-between mb-3">
    <h2 className="text-lg font-semibold text-gray-900 leading-tight flex-1 pr-2">
      {session.sessionTitle || "No title"}
    </h2>

    <div
      className="cursor-pointer text-gray-700 hover:text-red-900"
      onClick={() => {
        localStorage.setItem("selectedSession", JSON.stringify(session))
        router.push("/registrationteam/Sessions/QRScanner")
      }}
    >
      <FaQrcode size={20} />
    </div>
  </div>
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <img
                    src={session.speakers?.[0]?.pic || "/images/img (9).png"}
                    className="w-8 h-8 rounded-full object-cover"
                    alt={session.speakers?.[0]?.fullName || "Unknown Speaker"}
                    onError={e => { e.currentTarget.src = "/images/img (9).png" }}
                  />
                  <span className="text-sm text-gray-700">{session.speakers?.[0]?.fullName || "Unknown Speaker"}</span>
                  {session.speakers?.length > 1 && (
                    <span className="text-sm text-gray-500">+{session.speakers.length - 1}</span>
                  )}
                </div>
              </div>

              <hr className="border-t border-gray-200 mb-4" />

              <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                {session.event?.eventDescription || "No description available"}
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

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration</span>
                  <span className="text-gray-900 font-medium">{session.minutes ? `${session.minutes} minutes` : "N/A"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Room</span>
                  <span className="text-gray-900 font-medium">{session.location || "Hall B"}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <Link href={session?.sessionId ? `/participants/SessionDetail1/${session.sessionId}` : "#"}>
                  <button className="w-full bg-[#9B2033] text-white py-3 text-sm font-medium rounded-lg hover:bg-red-800 transition-colors duration-200 shadow-sm cursor-pointer">
                    View Details
                  </button>
                </Link>

                <Link href={session?.sessionId ? `/participants/SessionDetail1/${session.sessionId}` : "#"}>
                  <button
                    className={`w-full py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 relative
                      ${session.location?.toLowerCase() === "online" && session.isLive
                        ? "bg-white text-red-900 hover:bg-red-900 hover:text-white font-bold cursor-pointer overflow-hidden"
                        : session.location?.toLowerCase() === "online" && !session.isLive
                          ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                          : "bg-blue-100 text-green-600 cursor-default"
                      }`}
                    disabled={session.location?.toLowerCase() === "online" && !session.isLive}
                  >
                    {getSessionStatus(session)}

                    {session.isLive && session.location?.toLowerCase() === "online" && (
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inset-0 rounded-full bg-white opacity-75 animate-ping pointer-events-none"></span>
                        <span className="relative rounded-full h-2 w-2 bg-red-900 pointer-events-none"></span>
                      </span>
                    )}
                  </button>
                </Link>
             
             
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10">
        <DiscoverMoreSessions />
      </div>

      <Image
        src="/images/line.png"
        alt="Line"
        width={1729}
        height={127}
        className="w-full h-auto mt-12"
      />
    </div>
  )
}
