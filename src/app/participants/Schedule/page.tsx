"use client"
import React, { useEffect, useState, useMemo } from "react"
import { FaArrowLeft, FaCalendarAlt, FaSearch } from "react-icons/fa"
import Image from "next/image"
import Link from "next/link"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"
import api from "@/config/api"

const filters = ["Daily", "Weekly", "10 Days", "90 Days", "All Time"]

export default function ConferenceSchedulePage() {
  const [activeFilter, setActiveFilter] = useState("Daily")
  const [search, setSearch] = useState("")
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const userId = useSelector((state: RootState) => state.user.userId)
  const eventId = useSelector((state: RootState) => state.event.id)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get(
          `/participants-session/${userId}/registered-sessions?eventId=${eventId}`
        )
        setSessions(res.data || [])
      } catch (err) {
        console.error("Failed to fetch sessions", err)
        setSessions([])
      } finally {
        setLoading(false)
      }
    }
    if (userId && eventId) fetchSessions()
  }, [userId, eventId])

  // filter + search logic
  const filteredSessions = useMemo(() => {
    let data = [...sessions]

    // simple search by title
    if (search.trim()) {
      data = data.filter((s) =>
        s.title.toLowerCase().includes(search.toLowerCase())
      )
    }

    // filter by activeFilter
    if (activeFilter === "Daily") {
      const today = new Date().toDateString()
      data = data.filter(
        (s) => new Date(s.startTime).toDateString() === today
      )
    } else if (activeFilter === "Weekly") {
      const now = new Date()
      const nextWeek = new Date()
      nextWeek.setDate(now.getDate() + 7)
      data = data.filter(
        (s) => new Date(s.startTime) >= now && new Date(s.startTime) <= nextWeek
      )
    } else if (activeFilter === "10 Days") {
      const now = new Date()
      const nextTen = new Date()
      nextTen.setDate(now.getDate() + 10)
      data = data.filter(
        (s) => new Date(s.startTime) >= now && new Date(s.startTime) <= nextTen
      )
    } else if (activeFilter === "90 Days") {
      const now = new Date()
      const nextNinety = new Date()
      nextNinety.setDate(now.getDate() + 90)
      data = data.filter(
        (s) =>
          new Date(s.startTime) >= now && new Date(s.startTime) <= nextNinety
      )
    }
    // "All Time" returns everything
    return data
  }, [sessions, search, activeFilter])

  return (
    <>
      <div className="p-6 md:p-10 min-h-screen font-sans">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/participants/Home">
            <FaArrowLeft className="text-red-800 w-[20px] h-[20px] cursor-pointer" />
          </Link>
          <h1 className="text-xl font-semibold text-black ml-4">
            Conference Schedule
          </h1>
        </div>

        {/* Search, Filters, Date, Icon */}
        <div className="flex md:flex-nowrap justify-between mb-6 gap-3 flex-wrap">
          <div className="flex bg-white border border-gray-300 rounded-md px-3 py-2 w-[385px]">
            <FaSearch className="text-red-900 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="outline-none text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1 rounded-xl text-sm font-medium ${
                  activeFilter === filter
                    ? "bg-[#86002B] text-white"
                    : "bg-white border border-gray-300 text-black"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center border border-gray-300 bg-white px-3 py-2 rounded-md text-sm text-gray-700">
            <FaCalendarAlt className="mr-2 text-gray-500" />
            Jan 2024 - Dec 2024
          </div>

          <div className="text-gray-600 text-xl cursor-pointer hover:text-gray-800">
            <img src="images/Frame 1000004593.png" alt="" />
          </div>
        </div>

        {/* Banner */}
        <div className="bg-red-900 text-white p-4 rounded-lg flex justify-between items-center mb-6">
          <div>
            <p className="mt-2 text-lg font-medium">My Agenda</p>
            <p className="text-sm text-gray-300">
              {filteredSessions.length} sessions bookmarked
            </p>
          </div>
          <button className="text-white text-xl">
            <svg
              width="30"
              height="26"
              viewBox="0 0 30 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M29.3722 11.4704C30.2093 12.3164 30.2093 13.6904 29.3722 14.5364L18.6573 25.3655C17.8202 26.2115 16.4607 26.2115 15.6236 25.3655C14.7865 24.5195 14.7865 23.1455 15.6236 22.2995L22.6888 15.1658H2.14298C0.957643 15.1658 0 14.198 0 13C0 11.802 0.957643 10.8342 2.14298 10.8342H22.6821L15.6303 3.70051C14.7932 2.85448 14.7932 1.48054 15.6303 0.634518C16.4674 -0.211506 17.8269 -0.211506 18.664 0.634518L29.3789 11.4636L29.3722 11.4704Z"
                fill="white"
              />
            </svg>
          </button>
        </div>

        {/* Agenda Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading sessions...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">No sessions found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredSessions.map((session, index) => (
              <div
                key={`${session.sessionId}-${index}`}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between h-[420px]"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-black">
                    {session.title}
                  </h2>
                </div>

                <p className="text-xs text-gray-500 mb-3">
                  {session.description || "No description"}
                </p>
                <div className="border border-b-gray-300"></div>

                {session.speakers && session.speakers.length > 0 ? (
                  session.speakers.map((sp: any, idx: number) => (
                    <div
                      key={`${sp.speakerId}-${idx}`}
                      className="flex items-center text-xs text-gray-600 mb-1 space-x-2"
                    >
                      <img
                        src={`/uploads/${sp.user.file}`}
                        alt={sp.user.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span>{sp.user.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center text-xs text-gray-600 mb-1 space-x-2">
                    <img
                      src="/images/img (9).png"
                      alt="Speaker"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span>Unknown Speaker</span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-xs text-gray-600">
                    <FaCalendarAlt className="text-blue-700" />
                    <span className="ml-1">
                      {new Date(session.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(session.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <span className="px-2 py-2 rounded-xl text-xs font-semibold bg-blue-100 text-blue-700">
                    {session.category}
                  </span>
                </div>

                <div className="flex text-xs text-gray-900 mb-2 items-center justify-between">
                  <span>Duration:</span>
                  <span>
                    {Math.round(
                      (new Date(session.endTime).getTime() -
                        new Date(session.startTime).getTime()) /
                        60000
                    )}{" "}
                    minutes
                  </span>
                </div>
                <div className="flex text-xs text-gray-900 mb-2 items-center justify-between">
                  <span>Room:</span>
                  <span>{session.location || "Not specified"}</span>
                </div>

                <div className="text-xs text-gray-600 mb-2">
                  <span className="font-semibold">Event: </span>
                  {session.event?.title}
                </div>

                <Link
                  href={`/participants/SessionDetail/${session.sessionId}`}
                  className="w-full"
                >
                  <button className="w-full bg-[#9B2033] text-white py-2 text-sm rounded-md hover:bg-red-700 transition">
                    View Details
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <Image
        src="/images/line.png"
        alt="Logo"
        width={1729}
        height={127}
        className="absolute"
      />
    </>
  )
}
