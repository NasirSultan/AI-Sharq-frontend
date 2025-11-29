"use client"
import React, { useEffect, useState, useMemo, useRef } from "react"
import { FaArrowLeft, FaUser, FaCalendarAlt, FaSearch } from "react-icons/fa"
import Link from "next/link"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"
import api from "@/config/api"
import { useRouter } from "next/navigation"

const filters = ["Daily", "Weekly", "10 Days", "90 Days", "All Time"]

export default function ConferenceSchedulePage() {
  const [activeFilter, setActiveFilter] = useState("All Time")
  const [search, setSearch] = useState("")
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusMap, setStatusMap] = useState<Record<string, { isRegistered: boolean; isBookmarked: boolean }>>({})

  const router = useRouter()
  const userId = useSelector((state: RootState) => state.user.userId)
  const eventId = useSelector((state: RootState) => state.event.id)

  const cacheRef = useRef<{ sessions: any[]; statusMap: any }>({ sessions: [], statusMap: {} })

  const fetchSessions = async () => {
    if (!userId || !eventId) return
    setLoading(true)
    try {
      const res = await api.get(`/participants-session/${userId}/registered-sessions?eventId=${eventId}`)
      const newSessions = res.data || []

      const newStatusMap: Record<string, { isRegistered: boolean; isBookmarked: boolean }> = {}
      newSessions.forEach((s) => {
        newStatusMap[s.sessionId] = { isRegistered: !!s.isRegistered, isBookmarked: !!s.isBookmarked }
      })

      const isSame =
        JSON.stringify(cacheRef.current.sessions) === JSON.stringify(newSessions) &&
        JSON.stringify(cacheRef.current.statusMap) === JSON.stringify(newStatusMap)

      if (!isSame) {
        cacheRef.current.sessions = newSessions
        cacheRef.current.statusMap = newStatusMap
        setSessions(newSessions)
        setStatusMap(newStatusMap)
      }
    } catch (err) {
      console.error("Failed to fetch sessions", err)
      setSessions([])
      setStatusMap({})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [userId, eventId])

  const getSessionStatus = (sessionId: string) => statusMap[sessionId] || { isRegistered: false, isBookmarked: false }

  const filteredSessions = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    return sessions
      .filter((s) => {
        const start = new Date(s.startTime)
        const end = new Date(s.endTime)
        const status = getSessionStatus(s.sessionId)

        const isToday = (start >= today && start < tomorrow) || (end >= today && end < tomorrow) || (start < today && end > tomorrow)

        if (!isToday) return false
        if (s.registrationRequired) return status.isRegistered
        return true
      })
      .filter((s) => !search.trim() || s.title.toLowerCase().includes(search.toLowerCase()))
  }, [sessions, statusMap, search])

  useEffect(() => {
    const now = new Date()
    const liveSessions = filteredSessions.filter((s) => {
      const start = new Date(s.startTime)
      const end = new Date(s.endTime)
      return start <= now && end >= now
    })
    localStorage.setItem("todayLiveSession", liveSessions.length.toString())
  }, [filteredSessions])

  return (
    <div className="p-6 md:p-10 min-h-screen font-sans max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/participants/Home">
          <FaArrowLeft className="text-red-800 w-[20px] h-[20px] cursor-pointer" />
        </Link>
        <h1 className="text-xl font-semibold text-black ml-4">Today Schedule Sessions</h1>
      </div>

      <div className="flex md:flex-nowrap justify-between mb-6 gap-3 flex-wrap">
   <div className="flex bg-white border border-gray-300 rounded-md px-3 py-2 w-full">
  <input
    type="text"
    placeholder="Search"
    className="outline-none text-sm w-full"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
  <button className="flex items-center bg-red-900 text-white px-3 py-1 rounded-md ml-2">
    <FaSearch className="mr-1" />
    Search
  </button>
</div>

        

        <div className="text-gray-600 text-xl cursor-pointer hover:text-gray-800">
          <img src="images/Frame 1000004593.png" alt="" />
        </div>
      </div>

      <div className="bg-red-900 text-white p-4 rounded-lg flex justify-between items-center mb-6">
<div>
  <p className="mt-2 text-lg font-medium">Schedule Sessions</p>
  <p className="text-sm text-gray-300">
    Here you can view all Today Schedule sessions, their timings, and join the ones that interest you.
  </p>
</div>

        
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
        <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>

        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">No sessions found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3">
          {filteredSessions.map((session, index) => {
            const status = getSessionStatus(session.sessionId)
            return (
              <div
                key={`${session.sessionId}-${index}`}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between h-[460px]"
              >
                <div className="flex items-center justify-between ">
                  <h2 className="text-sm font-semibold text-black">{session.title}</h2>
                </div>

                <p className="text-xs text-gray-500">
                  {session.description || "No description"}
                </p>
                <div className="border border-b-gray-300 "></div>

                {session.speakers && session.speakers.length > 0 ? (
                  session.speakers.map((sp: any, idx: number) => (
                    <div
                      key={`${sp.speakerId}-${idx}`}
                      className="flex items-center text-xs text-gray-600"
                    >
                      {sp.user.file ? (
                        <img
                          src={`https://al-sharq.fra1.digitaloceanspaces.com/${sp.user.file}`}
                          alt={sp.user.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <FaUser className="w-4 h-4 text-blue-500" />
                        </div>
                      )}
                      <span>{sp.user.name || "Unknown Speaker"}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center text-xs text-gray-600 ">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <FaUser className="w-4 h-4 text-blue-500" />
                    </div>
                    <span>Unknown Speaker</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-600">
                    <FaCalendarAlt className="text-blue-700" />
                    <span className="ml-1">
                      {new Date(session.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
                      -{" "}
                      {new Date(session.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <span className="rounded-xl text-xs font-semibold bg-blue-100 text-blue-700">
                    {session.category}
                  </span>
                </div>

                <div className="text-xs text-gray-900  flex justify-between">
                  <span>Duration:</span>
                  <span>
                    {Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000)} minutes
                  </span>
                </div>

                <div className="text-xs text-gray-900 flex justify-between">
                  <span>Room</span>
                  <span>{session.location || "Not specified"}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <Link href={`/participants/SessionDetail1/${session.sessionId}`} className="w-full">
                    <button className="w-full bg-[#9B2033] text-white py-2 text-sm rounded-md cursor-pointer hover:bg-red-800 transition">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
