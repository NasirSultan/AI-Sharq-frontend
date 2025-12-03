"use client"
import React, { useState, useEffect } from "react"
import { FaArrowRight, FaCalendarAlt, FaClock, FaPlay, FaSearch, FaStar, FaLock, FaCopy } from "react-icons/fa"
import { FaMessage, FaCalendar as FaCalendarIcon } from "react-icons/fa6"
import Image from "next/image"
import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/lib/store/store"
import { setEventId } from "@/lib/store/features/event/eventSlice"
import api from "@/config/api"
import { useRouter } from "next/navigation"

const filters = ["Daily", "Weekly", "10 Days", "90 Days", "All Time"]

export default function SpeakerSessions() {
  const router = useRouter()
  const dispatch = useDispatch()
  const exhibitorId = useSelector((state: RootState) => state.exhibitor.exhibitorId)

  const [events, setEvents] = useState<any[]>([])
  const [filteredEvents, setFilteredEvents] = useState<any[]>([])
  const [searchText, setSearchText] = useState("")
  const [activeFilter, setActiveFilter] = useState("All Time")
  const [stats, setStats] = useState({ total: 0, ongoing: 0, scheduled: 0 })

  useEffect(() => {
    if (!exhibitorId) return
    const fetchEvents = async () => {
      try {
        const res = await api.get(`/exhibiteros/${exhibitorId}/sessions`)
        const data = Array.isArray(res.data.sessions) ? res.data.sessions : []
        setEvents(data)
        setFilteredEvents(data)
        setStats({
          total: res.data.total || 0,
          ongoing: res.data.ongoing || 0,
          scheduled: res.data.scheduled || 0,
        })
      } catch {
        setEvents([])
        setFilteredEvents([])
        setStats({ total: 0, ongoing: 0, scheduled: 0 })
      }
    }
    fetchEvents()
  }, [exhibitorId])

  useEffect(() => {
    let filtered = [...events]
    if (searchText) {
      filtered = filtered.filter(ev =>
        ev.title?.toLowerCase().includes(searchText.toLowerCase())
      )
    }
    const now = new Date()
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
    setFilteredEvents(filtered)
  }, [activeFilter, searchText, events])

  const formatTime = (time: string) => {
    if (!time) return ""
    const date = new Date(time)
    let hours = date.getHours()
    const ampm = hours >= 12 ? "PM" : "AM"
    hours = hours % 12
    if (hours === 0) hours = 12
    return `${hours}${ampm}`
  }

  const getDurationMinutes = (start: string, end: string) => {
    if (!start || !end) return 0
    const startDate = new Date(start)
    const endDate = new Date(end)
    return Math.round((endDate.getTime() - startDate.getTime()) / 60000)
  }

  const formatStat = (count: number) => {
    if (count <= 1) return <span>{count}</span>
    return (
      <span className="flex items-baseline gap-1">
        <span>1</span>
        <span className="text-sm text-green-600">+{count - 1}</span>
      </span>
    )
  }

  const handleViewAll = (event: any) => {
    dispatch(setEventId(event.eventId || event.id))
    router.push(`/participants/SessionDetail1/${event.id}`)
  }

  const handleSponsorClick = () => {
    router.push("/Exhibitors/detail")
  }

  return (
   <div className="p-6 md:p-10 min-h-screen font-sans max-w-6xl mx-auto">
  <div className="flex flex-col md:flex-row gap-4 mb-6">
    <div className="flex-1 flex items-center justify-between p-6 gap-3 h-24 bg-[#FFEEEE] border border-[#D4D4D4] shadow-sm rounded-3xl">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#FFBEBE] rounded-lg flex items-center justify-center">
          <FaMessage className="text-[#9B2033] text-xl" />
        </div>
        <h2 className="text-lg font-semibold text-[#9B2033]">Booth</h2>
      </div>
      <Link href="/Exhibitors/booth">
        <FaArrowRight className="text-[#9B2033] text-2xl" />
      </Link>
    </div>

    <div
      className="flex-1 flex items-center justify-between p-6 gap-3 h-24 bg-[#FFFAEE] border border-[#D4D4D4] shadow-[0px_4px_110.3px_rgba(68,68,68,0.05)] rounded-[20px] cursor-pointer"
      onClick={handleSponsorClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-[45px] h-[45px] bg-[#FEF9C3] rounded-[7.5px] flex items-center justify-center">
          <FaStar className="text-[#CA8A04] text-lg" />
        </div>
        <h2 className="text-[18px] font-semibold text-[#9B2033]">Exhibitor Detail</h2>
      </div>
      <FaArrowRight className="text-[#9B2033] text-[30px] w-[30px] h-[26px]" />
    </div>
  </div>

  <div className="flex flex-col md:flex-row md:flex-wrap justify-between items-center gap-4 mb-6">
   <div className="flex flex-col w-full gap-4 md:flex-row md:items-center md:gap-2">
  <div className="flex w-full md:w-1/3 bg-white border border-gray-300 rounded-md px-3 py-2">
    <FaSearch className="text-red-900 mr-2" />
    <input
      type="text"
      placeholder="Search"
      value={searchText}
      onChange={e => setSearchText(e.target.value)}
      className="outline-none text-sm w-full"
    />
  </div>

  <div className="flex w-full md:w-2/3 gap-2">
    {filters.map(filter => (
      <button
        key={filter}
        onClick={() => setActiveFilter(filter)}
        className={`flex-1 text-center px-4 py-2 rounded-xl text-sm font-medium ${
          activeFilter === filter
            ? "bg-[#86002B] text-white"
            : "bg-white border border-gray-300 text-black"
        }`}
      >
        {filter}
      </button>
    ))}
  </div>
</div>


    
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <div className="flex flex-col items-start p-6 bg-white border border-[#E6E6E6] shadow rounded-3xl">
      <div className="flex items-center gap-4 w-full">
        <div className="w-12 h-12 bg-[#DBEAFE] rounded-2xl flex items-center justify-center">
          <FaCalendarIcon className="w-6 h-6 text-[#2563EB]" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-4xl text-gray-700">{formatStat(stats.total)}</span>
          <span className="font-normal text-lg text-gray-600">Total Sessions</span>
        </div>
      </div>
    </div>

    <div className="flex flex-col items-start p-6 bg-white border border-[#E6E6E6] shadow rounded-3xl">
      <div className="flex items-center gap-4 w-full">
        <div className="w-12 h-12 bg-[#DCFCE7] rounded-2xl flex items-center justify-center">
          <FaPlay className="w-6 h-6 text-[#16A34A]" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-4xl text-gray-700">{formatStat(stats.ongoing)}</span>
          <span className="font-normal text-lg text-gray-600">Ongoing</span>
        </div>
      </div>
    </div>

    <div className="flex flex-col items-start p-6 bg-white border border-[#E6E6E6] shadow rounded-3xl">
      <div className="flex items-center gap-4 w-full">
        <div className="w-12 h-12 bg-[#FEF9C3] rounded-2xl flex items-center justify-center">
          <FaClock className="w-6 h-6 text-[#CA8A04]" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-4xl text-gray-700">{formatStat(stats.scheduled)}</span>
          <span className="font-normal text-lg text-gray-600">Scheduled</span>
        </div>
      </div>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredEvents.map((event, index) => {
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
      const formattedDate = start.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })

      return (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between h-[380px]"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-black">{event.title}</h2>
            {event.registrationRequired ? (
              <FaLock className="text-gray-400" />
            ) : (
              <FaCopy
                className="text-blue-500 cursor-pointer"
                onClick={() => navigator.clipboard.writeText(event.joinToken)}
              />
            )}
          </div>

          <div className={`text-xs font-semibold mb-2 ${statusColor}`}>
            {statusText === "Scheduled" ? `Scheduled for ${formattedDate}` : statusText}
          </div>

          <div className="flex items-center space-x-2 mb-2">
            {event.speakers && event.speakers.length > 0 ? (
              <div className="flex items-center space-x-2">
                {event.speakers[0].file && (
                  <Image
                    src={event.speakers[0].file.startsWith("http") ? event.speakers[0].file : `/uploads/${event.speakers[0].file}.png`}
                    alt=""
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                  />
                )}
                <span className="text-xs text-gray-600">{event.speakers[0].name}</span>
                {event.speakers.length > 1 && (
                  <span className="text-xs text-gray-500">+{event.speakers.length - 1}</span>
                )}
              </div>
            ) : (
              <span className="text-xs text-gray-500">No speakers</span>
            )}
          </div>

          <p className="text-xs text-gray-500 mb-3">{event.description}</p>

          <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
            <div className="flex items-center text-xs text-gray-600">
              <FaClock className="mr-1" />
              <span>
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </span>
            </div>
            <span className="px-2 py-1 rounded-xl text-xs font-semibold bg-blue-100 text-blue-700">
              {event.category}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-900 mb-2">
            <span>Duration</span>
            <span>{getDurationMinutes(event.startTime, event.endTime)} minutes</span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-900 mb-2">
            <span>Location</span>
            <span>{event.location || "N/A"}</span>
          </div>

          <button
            className="w-full bg-[#9B2033] text-white py-2 text-sm rounded-md hover:bg-red-700 transition"
            onClick={() => handleViewAll(event)}
          >
            View Details
          </button>
        </div>
      )
    })}
  </div>

  <Image src="/images/line.png" alt="Line" width={1729} height={127} className="absolute" />
</div>

  )
}
