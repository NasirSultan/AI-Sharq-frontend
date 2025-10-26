"use client"
import React, { useState, useEffect } from "react"
import { FaArrowRight, FaCalendar, FaCalendarAlt, FaClock, FaPlay, FaSearch, FaCalendar as FaCalendarIcon } from "react-icons/fa"
import { FaMessage } from "react-icons/fa6"
import Image from "next/image"
import Link from "next/link"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"
import api from "@/config/api"

const filters = ["Daily", "Weekly", "10 Days", "90 Days", "All Time"]

export default function SpeakerSessions() {
  const [activeFilter, setActiveFilter] = useState("Daily")
  const [events, setEvents] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    ongoing: 0,
    scheduled: 0
  })
  const userId = useSelector((state: RootState) => state.user.userId)

  useEffect(() => {
    if (!userId) return
    const fetchEvents = async () => {
      try {
        const res = await api.get(`/sessions/speaker/${userId}`)
        const data = Array.isArray(res.data.sessions) ? res.data.sessions : []
        setEvents(data)
        setStats({
          total: res.data.total || 0,
          ongoing: res.data.ongoing || 0,
          scheduled: res.data.scheduled || 0
        })
      } catch (err) {
        setEvents([])
        setStats({ total: 0, ongoing: 0, scheduled: 0 })
      }
    }
    fetchEvents()
  }, [userId])

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

  // Helper to format stats dynamically with small green "+N"
  const formatStat = (count: number) => {
    if (count <= 1) return <span>{count}</span>
    return (
      <span className="flex items-baseline gap-1">
        <span>{1}</span>
        <span className="text-sm text-green-600">+{count - 1}</span>
      </span>
    )
  }

  return (
   <>
   

    <div className="p-6 md:p-10 min-h-screen font-sans">
  
      {/* Header */}
      <div className="flex flex-col items-start p-6 gap-6 w-full max-w-7xl h-24 bg-[#FFEEEE] border border-[#D4D4D4] shadow-sm rounded-3xl mb-6">
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
              className={`px-4 py-2 rounded-xl text-sm font-medium ${activeFilter === filter ? "bg-[#86002B] text-white" : "bg-white border border-gray-300 text-black"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex items-center border border-gray-300 bg-white px-3 py-2 rounded-md text-sm text-gray-700">
          <FaCalendarAlt className="mr-2 text-red-500" />
          Jan 2024 - Dec 2024
        </div>

        <div>
          <img src="/images/Frame 1000004593.png" alt="" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Sessions */}
        <div className="flex flex-col items-start p-6 bg-white border border-[#E6E6E6] shadow rounded-3xl">
          <div className="flex flex-row items-center gap-4 w-full">
            <div className="w-12 h-12 bg-[#DBEAFE] rounded-2xl flex items-center justify-center">
              <FaCalendarIcon className="w-6 h-6 text-[#2563EB]" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-4xl text-gray-700">{formatStat(stats.total)}</span>
              <span className="font-normal text-lg text-gray-600">Total Sessions</span>
            </div>
          </div>
        </div>

        {/* Ongoing */}
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

        {/* Scheduled */}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between h-[380px]"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-black">{event.title}</h2>
            </div>

            {/* Speaker Section */}
            <div className="flex items-center space-x-2 mb-2">
              {event.speakers && event.speakers.length > 0 ? (
                <>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-2">
                      {event.speakers[0].file && (
                        <Image
                          src={`/uploads/${event.speakers[0].file}.png`}
                          alt=""
                          width={24}
                          height={24}
                          className="rounded-full object-cover"
                        />
                      )}
                      <span className="text-xs text-gray-600">{event.speakers[0].name}</span>
                    </div>
                    {event.speakers.length > 1 && (
                      <span className="text-xs text-gray-500">
                        +{event.speakers.length - 1}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <span className="text-xs text-gray-500">No speakers</span>
              )}
            </div>

            <p className="text-xs text-gray-500 mb-3">{event.description}</p>

            {/* Time and Category */}
            <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
              <div className="flex items-center text-xs text-gray-600">
                <svg
                  width="31"
                  height="31"
                  viewBox="0 0 31 31"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.4594 26.0046H6.0616C5.40605 26.0046 4.77735 25.7442 4.31381 25.2807C3.85026 24.8171 3.58984 24.1884 3.58984 23.5329V8.70231C3.58984 8.04676 3.85026 7.41806 4.31381 6.95451C4.77735 6.49097 5.40605 6.23055 6.0616 6.23055H20.8922C21.5477 6.23055 22.1764 6.49097 22.64 6.95451C23.1035 7.41806 23.3639 8.04676 23.3639 8.70231V13.6458H3.58984M22.128 17.3535V22.297H27.0716M22.128 17.3535C23.4392 17.3535 24.6966 17.8743 25.6236 18.8014C26.5507 19.7285 27.0716 20.9859 27.0716 22.297M22.128 17.3535C20.8169 17.3535 19.5595 17.8743 18.6325 18.8014C17.7054 19.7285 17.1845 20.9859 17.1845 22.297C17.1845 23.6081 17.7054 24.8655 18.6325 25.7926C19.5595 26.7197 20.8169 27.2405 22.128 27.2405C23.4392 27.2405 24.6966 26.7197 25.6236 25.7926C26.5507 24.8655 27.0716 23.6081 27.0716 22.297M18.4204 3.75879V8.70231M8.53337 3.75879V8.70231"
                    stroke="#2D7DD2"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
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

            <button className="w-full bg-[#9B2033] text-white py-2 text-sm rounded-md hover:bg-red-700 transition">
              <Link href={`/participants/SessionDetail/${event.id}`}>View Details</Link>
            </button>
          </div>
        ))}
      </div>

      <Image src="/images/line.png" alt="Line" width={1729} height={127} className="absolute" />
    </div>
   </>
  )
}
