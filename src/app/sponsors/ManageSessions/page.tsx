"use client"
import React, { useState, useEffect, useMemo } from "react"
import { FaArrowRight, FaCalendarAlt, FaClock, FaPlay, FaUser, FaEdit, FaSearch, FaStar, FaLock, FaCopy } from "react-icons/fa"
import { FaMessage, FaCalendar as FaCalendarIcon } from "react-icons/fa6"
import Image from "next/image"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/lib/store/store"
import api from "@/config/api"
import { useRouter } from "next/navigation"
import { setEventId } from "@/lib/store/features/event/eventSlice"

const filters = ["Daily", "Weekly", "10 Days", "90 Days", "All Time"]
const cache: { [key: string]: any } = {}

export default function SpeakerSessions() {
  const router = useRouter()
  const dispatch = useDispatch()
  const sponsorId = useSelector((state: RootState) => state.sponsor.sponsorId)

  const [events, setEvents] = useState<any[]>([])
  const [filteredEvents, setFilteredEvents] = useState<any[]>([])
  const [searchText, setSearchText] = useState("")
  const [activeFilter, setActiveFilter] = useState("All Time")
  const [stats, setStats] = useState({ total: 0, ongoing: 0, scheduled: 0 })
  const [loading, setLoading] = useState(false)
  const [loadingCardId, setLoadingCardId] = useState<number | null>(null)

  const fetchEvents = async () => {
    if (!sponsorId) return
    setLoading(true)
    try {
      if (cache[sponsorId]) {
        setEvents(cache[sponsorId].sessions)
        setFilteredEvents(cache[sponsorId].sessions)
        setStats(cache[sponsorId].stats)
      } else {
        const res = await api.get(`/sponsors/sponsor/${sponsorId}/sessions`)
        const data = Array.isArray(res.data.sessions) ? res.data.sessions : []
        const statsData = {
          total: res.data.total || 0,
          ongoing: res.data.ongoing || 0,
          scheduled: res.data.scheduled || 0
        }
        setEvents(data)
        setFilteredEvents(data)
        setStats(statsData)
        cache[sponsorId] = { sessions: data, stats: statsData }
      }
    } catch (err) {
      setEvents([])
      setFilteredEvents([])
      setStats({ total: 0, ongoing: 0, scheduled: 0 })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEvents()
  }, [sponsorId])

  const filteredList = useMemo(() => {
    if (!events) return []

    let filtered = [...events]
    const now = new Date()

    if (searchText) {
      filtered = filtered.filter(ev => ev.title.toLowerCase().includes(searchText.toLowerCase()))
    }

    if (activeFilter === "Daily") {
      filtered = filtered.filter(ev => new Date(ev.startTime).toDateString() === now.toDateString())
    } else if (activeFilter === "Weekly") {
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      filtered = filtered.filter(ev => {
        const d = new Date(ev.startTime)
        return d >= startOfWeek && d <= endOfWeek
      })
    } else if (activeFilter === "10 Days") {
      const tenDaysAgo = new Date()
      tenDaysAgo.setDate(now.getDate() - 10)
      filtered = filtered.filter(ev => new Date(ev.startTime) >= tenDaysAgo)
    } else if (activeFilter === "90 Days") {
      const ninetyDaysAgo = new Date()
      ninetyDaysAgo.setDate(now.getDate() - 90)
      filtered = filtered.filter(ev => new Date(ev.startTime) >= ninetyDaysAgo)
    }

    return filtered
  }, [events, searchText, activeFilter])

  const formatTime = (time: string) => {
    const date = new Date(time)
    let hours = date.getHours()
    const ampm = hours >= 12 ? "PM" : "AM"
    hours = hours % 12
    if (hours === 0) hours = 12
    return `${hours}${ampm}`
  }

  const getDurationMinutes = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return Math.round((endDate.getTime() - startDate.getTime()) / 60000)
  }

  const handleViewAll = async (sessionId: number, eventId: number) => {
    setLoadingCardId(sessionId)
    dispatch(setEventId(eventId))
    setTimeout(() => {
      setLoadingCardId(null)
      router.push(`/participants/SessionDetail1/${sessionId}`)
    }, 500)
  }

  const handleSponsorClick = () => {
    router.push(`/participants/SponsorsDetailsScreen/${sponsorId}`)
  }

  return (
    <div className="p-6 md:p-10 min-h-screen font-sans max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div
          className="flex-1 flex items-center justify-between p-4 gap-3 h-24 bg-[#FFEEEE] border border-[#D4D4D4] shadow-sm rounded-3xl cursor-pointer"
          onClick={() => window.location.href = '/sponsors/edit'}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FFBEBE] rounded-lg flex items-center justify-center">
              <FaEdit className="text-[#9B2033] text-xl" />
            </div>
            <h2 className="text-lg font-semibold text-[#9B2033]">Edit Profile</h2>
          </div>
        </div>

        <div
          className="flex-1 flex items-center justify-between p-4 gap-3 h-24 bg-[#FFFAEE] border border-[#D4D4D4] shadow rounded-[20px] cursor-pointer"
          onClick={handleSponsorClick}
        >
          <div className="flex items-center gap-3">
            <div className="w-[45px] h-[45px] bg-[#FEF9C3] rounded-[7.5px] flex items-center justify-center">
              <FaStar className="text-[#CA8A04] text-lg" />
            </div>
            <h2 className="text-[18px] font-semibold text-[#9B2033]">Sponsor Detail</h2>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-4 mb-6">
        <div className="flex bg-white border border-gray-300 rounded-md px-3 py-2 flex-1 min-w-[200px]">
          <FaSearch className="text-red-900 mr-2" />
          <input
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="outline-none text-sm w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 justify-start sm:justify-end">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${activeFilter === filter ? "bg-[#86002B] text-white" : "bg-white border border-gray-300 text-black"}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map(event => {
            const now = new Date()
            const start = new Date(event.startTime)
            const end = new Date(event.endTime)
            let statusText = "Scheduled"
            let statusColor = "text-gray-600"
            if (now >= start && now <= end) {
              statusText = "Live"
              statusColor = "text-red-600"
            } else if (now > end) {
              statusText = "Completed"
              statusColor = "text-green-600"
            }
            const formattedDate = start.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
            return (
              <div key={event.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between h-[360px] relative">
                {loadingCardId === event.id && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center rounded-xl">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
                  </div>
                )}
                <div className={loadingCardId === event.id ? "opacity-30 flex flex-col h-full" : "opacity-100 flex flex-col h-full"}>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-sm font-semibold text-black">{event.title}</h2>
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                      {event.speakers && event.speakers.length > 0 ? (
                        <div className="flex items-center space-x-2">
                          {event.speakers[0].file ? (
                            <Image
                              src={event.speakers[0].file}
                              alt={event.speakers[0].name}
                              width={24}
                              height={24}
                              style={{ width: "24px", height: "24px" }}
                              className="rounded-full object-cover"
                            />

                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                              <FaUser className="w-4 h-4 text-blue-500" />
                            </div>
                          )}

                          <span className="text-xs text-gray-600">{event.speakers[0].name}</span>
                          {event.speakers.length > 1 && <span className="text-xs text-gray-500">+{event.speakers.length - 1}</span>}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">No speakers</span>
                      )}

                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mb-3 flex-1 overflow-auto">{event.description}</p>

                  <div>
                    <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
                      <div className="flex items-center text-xs text-gray-600">
                        <FaClock className="mr-1" />
                        <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                      </div>
                      <span className="px-2 py-1 rounded-xl text-xs font-semibold bg-blue-100 text-blue-700">{event.category}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-900 mb-2">
                      <span>Duration</span>
                      <span>{getDurationMinutes(event.startTime, event.endTime)} minutes</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-900 mb-2">
                      <span>Location</span>
                      <span>{event.location || "N/A"}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-900 mb-3">
                      <span>Status</span>
                      <div className={`text-xs font-semibold ${statusColor}`}>
                        {statusText === "Scheduled" ? `Scheduled for ${formattedDate}` : statusText}
                      </div>
                    </div>

                    <button
                      className="w-full bg-[#9B2033] text-white py-1.5 text-xs rounded-md hover:bg-red-900 transition cursor-pointer"
                      onClick={() => handleViewAll(event.id, event.eventId)}
                      disabled={loadingCardId === event.id}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
