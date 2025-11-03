"use client"
import React, { useState, useEffect } from "react"
import { FaArrowRight, FaCalendarAlt, FaClock, FaPlay, FaSearch } from "react-icons/fa"
import { FaMessage } from "react-icons/fa6"
import Image from "next/image"
import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/lib/store/store"
import api from "@/config/api"
import { setEventId } from "@/lib/store/features/event/eventSlice"

const filters = ["Daily", "Weekly", "10 Days", "90 Days", "All Time"]

export default function SpeakerSessions() {
  const [activeFilter, setActiveFilter] = useState("All Time")
  const [events, setEvents] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, ongoing: 0, scheduled: 0 })
  const speakerId = useSelector((state: RootState) => state.speaker.speakerId)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!speakerId) return
    const fetchEvents = async () => {
      try {
        const res = await api.get(`/sessions/speaker/${speakerId}`)
        const data = Array.isArray(res.data.sessions) ? res.data.sessions : []
        setEvents(data)
        setStats({
          total: res.data.total || 0,
          ongoing: res.data.ongoing || 0,
          scheduled: res.data.scheduled || 0
        })
      } catch {
        setEvents([])
        setStats({ total: 0, ongoing: 0, scheduled: 0 })
      }
    }
    fetchEvents()
  }, [speakerId])

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
    const diffMs = endDate.getTime() - startDate.getTime()
    return Math.round(diffMs / 60000)
  }

  const formatStat = (count: number) => {
    if (count <= 1) return <span>{count}</span>
    return (
      <span className="flex items-baseline gap-1">
        <span>{1}</span>
        <span className="text-sm text-green-600">+{count - 1}</span>
      </span>
    )
  }

  const handleViewDetails = (eventId: number) => {
    dispatch(setEventId(eventId))
  }

  return (
<div className="min-h-screen font-sans bg-gray-50 flex justify-center">
  <div className="w-full max-w-6xl px-4 md:px-6 py-4">

    {/* Header */}
    <div className="flex flex-col items-start p-4 gap-4 w-full bg-[#FFEEEE] border border-[#D4D4D4] shadow-sm rounded-2xl mb-4">
      <div className="flex flex-row items-center gap-2 w-full">
        <div className="w-10 h-10 bg-[#FFBEBE] rounded-lg flex items-center justify-center">
          <FaMessage className="text-[#9B2033] text-lg" />
        </div>
        <h2 className="text-base font-semibold text-[#9B2033]">Chats List</h2>
        <Link href="/participants/MyConnections" className="ml-auto">
          <FaArrowRight className="text-[#9B2033] text-xl" />
        </Link>
      </div>
    </div>

    {/* Filters, Search, Date */}
    <div className="flex flex-col md:flex-row md:flex-wrap justify-between items-center gap-3 mb-4">
      <div className="flex bg-white border border-gray-300 rounded-md px-2 py-1 w-full md:w-80">
        <FaSearch className="text-red-900 mr-2" />
        <input type="text" placeholder="Search" className="outline-none text-sm w-full" />
      </div>

      <div className="flex flex-wrap gap-2 md:gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${activeFilter === filter ? "bg-[#86002B] text-white" : "bg-white border border-gray-300 text-black"}`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="flex items-center border border-gray-300 bg-white px-2 py-1 rounded-md text-xs text-gray-700">
        <FaCalendarAlt className="mr-1 text-red-500" />
        Jan 2024 - Dec 2024
      </div>

      <div className="w-full md:w-auto">
        <img src="/images/Frame 1000004593.png" alt="" className="w-full md:w-auto" />
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="flex flex-col items-start p-4 bg-white border border-[#E6E6E6] shadow rounded-2xl">
        <div className="flex flex-row items-center gap-3 w-full">
          <div className="w-10 h-10 bg-[#DBEAFE] rounded-xl flex items-center justify-center">
            <FaCalendarAlt className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-2xl text-gray-700">{formatStat(stats.total)}</span>
            <span className="font-normal text-sm text-gray-600">Total Sessions</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start p-4 bg-white border border-[#E6E6E6] shadow rounded-2xl">
        <div className="flex flex-row items-center gap-3 w-full">
          <div className="w-10 h-10 bg-[#DCFCE7] rounded-xl flex items-center justify-center">
            <FaPlay className="w-5 h-5 text-[#16A34A]" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-2xl text-gray-700">{formatStat(stats.ongoing)}</span>
            <span className="font-normal text-sm text-gray-600">Ongoing</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start p-4 bg-white border border-[#E6E6E6] shadow rounded-2xl">
        <div className="flex flex-row items-center gap-3 w-full">
          <div className="w-10 h-10 bg-[#FEF9C3] rounded-xl flex items-center justify-center">
            <FaClock className="w-5 h-5 text-[#CA8A04]" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-2xl text-gray-700">{formatStat(stats.scheduled)}</span>
            <span className="font-normal text-sm text-gray-600">Scheduled</span>
          </div>
        </div>
      </div>
    </div>

    {/* Sessions */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <div key={event.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between min-h-[300px]">
          <div className="flex items-center justify-between mb-1.5">
            <h2 className="text-sm font-semibold text-black">{event.title}</h2>
          </div>

          <div className="flex items-center space-x-1.5 mb-1.5">
            {event.speakers && event.speakers.length > 0 ? (
              <div className="flex items-center space-x-1.5">
                <div className="w-8 h-8 relative flex-shrink-0">
                  <Image
                    src={event.speakers[0].file || "/images/placeholder.png"}
                    alt={event.speakers[0].name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <span className="text-xs text-gray-600">{event.speakers[0].name}</span>
                {event.speakers.length > 1 && (
                  <span className="text-xs text-gray-500">+{event.speakers.length - 1}</span>
                )}
              </div>
            ) : (
              <span className="text-xs text-gray-500">No speakers</span>
            )}
          </div>

          <p className="text-xs text-gray-500 mb-2">{event.description}</p>

          <div className="flex items-center justify-between mb-1.5 text-xs text-gray-600">
            <div className="flex items-center text-xs text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="#2D7DD2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
            </div>

            <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700">{event.category}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-900 mb-1.5">
            <span>Duration</span>
            <span>{getDurationMinutes(event.startTime, event.endTime)} minutes</span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-900 mb-1.5">
            <span>Location</span>
            <span>{event.location || "N/A"}</span>
          </div>

          <Link
            href={`/participants/SessionDetail1/${event.id}`}
            onClick={() => handleViewDetails(event.eventId)}
            className="w-full bg-[#9B2033] text-white py-1.5 text-xs rounded-md hover:bg-red-700 transition text-center"
          >
            View Details
          </Link>

        </div>
      ))}
    </div>

    <Image
      src="/images/line.png"
      alt="Line"
      width={1729}
      height={127}
      className="w-full mt-4"
    />

  </div>
</div>

  )
}
