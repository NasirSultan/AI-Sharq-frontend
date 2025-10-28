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
    <div className="min-h-screen font-sans bg-gray-50">
      <div className="container mx-auto px-4 md:px-10 py-6">

        {/* Header */}
        <div className="flex flex-col items-start p-6 gap-6 w-full bg-[#FFEEEE] border border-[#D4D4D4] shadow-sm rounded-3xl mb-6">
          <div className="flex flex-row items-center gap-3 w-full">
            <div className="w-12 h-12 bg-[#FFBEBE] rounded-lg flex items-center justify-center">
              <FaMessage className="text-[#9B2033] text-xl" />
            </div>
            <h2 className="text-lg font-semibold text-[#9B2033]">Chats List</h2>
            <Link href="/speakers/Messages" className="ml-auto">
              <FaArrowRight className="text-[#9B2033] text-2xl" />
            </Link>
          </div>
        </div>

        {/* Filters, Search, Date */}
        <div className="flex flex-col md:flex-row md:flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex bg-white border border-gray-300 rounded-md px-3 py-2 w-full md:w-96">
            <FaSearch className="text-red-900 mr-2" />
            <input type="text" placeholder="Search" className="outline-none text-sm w-full" />
          </div>

          <div className="flex flex-wrap gap-2 md:gap-5">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-sm font-medium ${activeFilter === filter ? "bg-[#86002B] text-white" : "bg-white border border-gray-300 text-black"}`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center border border-gray-300 bg-white px-3 py-2 rounded-md text-sm text-gray-700">
            <FaCalendarAlt className="mr-2 text-red-500" />
            Jan 2024 - Dec 2024
          </div>

          <div className="w-full md:w-auto">
            <img src="/images/Frame 1000004593.png" alt="" className="w-full md:w-auto" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col items-start p-6 bg-white border border-[#E6E6E6] shadow rounded-3xl">
            <div className="flex flex-row items-center gap-4 w-full">
              <div className="w-12 h-12 bg-[#DBEAFE] rounded-2xl flex items-center justify-center">
                <FaCalendarAlt className="w-6 h-6 text-[#2563EB]" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-semibold text-4xl text-gray-700">{formatStat(stats.total)}</span>
                <span className="font-normal text-lg text-gray-600">Total Sessions</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start p-6 bg-white border border-[#E6E6E6] shadow rounded-3xl">
            <div className="flex flex-row items-center gap-4 w-full">
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
            <div className="flex flex-row items-center gap-4 w-full">
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

        {/* Sessions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between min-h-[350px]">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-black">{event.title}</h2>
              </div>

              <div className="flex items-center space-x-2 mb-2">
                {event.speakers && event.speakers.length > 0 ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 relative flex-shrink-0">
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

              <p className="text-xs text-gray-500 mb-3">{event.description}</p>

              <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
                <div className="flex items-center text-xs text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="#2D7DD2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
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

            <Link
  href={`/participants/SessionDetail1/${event.id}`}
  onClick={() => handleViewDetails(event.eventId)}
  className="w-full bg-[#9B2033] text-white py-2 text-sm rounded-md hover:bg-red-700 transition text-center"
>
  View Details
</Link>

            </div>
          ))}
        </div>

        <Image src="/images/line.png" alt="Line" width={1729} height={127} className="w-full mt-6" />

      </div>
    </div>
  )
}
