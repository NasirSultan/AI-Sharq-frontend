"use client"

import React, { useState, useEffect } from "react"
import api from "@/config/api"
import QrCard from "./QrCard"
import Link from "next/link"
import { FaRegListAlt, FaBookmark, FaPlayCircle, FaUserCheck, FaClipboardCheck, FaPlay } from "react-icons/fa"
import { useRouter } from "next/navigation"
import { FaQrcode } from "react-icons/fa"
type User = {
  id: number
  name: string
  email: string
  bio: string
  file?: string
  createdAt: string
  updatedAt: string
}

export default function Page() {
  const [users, setUsers] = useState<User[]>([])
  const [selected, setSelected] = useState<User | null>(null)
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("All Time")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalParticipants: 0,
    totalBookmarks: 0,
    totalSessionRegistrations: 0
  })
  const router = useRouter()
  const filters = ["Daily", "Weekly", "10 Days", "90 Days", "All Time"]

  useEffect(() => {
    const cached = sessionStorage.getItem("participantsCache")
    if (cached) {
      const parsed = JSON.parse(cached)
      const now = new Date().getTime()
      const valid = now - parsed.time < 10 * 60 * 1000
      if (valid) {
        setUsers(parsed.users)
        setStats(parsed.stats)
        setLoading(false)
        return
      }
    }
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const res = await api.get("/admin/users/participants")
      const list = res.data.users || []
      const info = {
        totalParticipants: res.data.totalParticipants || 0,
        totalBookmarks: res.data.totalBookmarks || 0,
        totalSessionRegistrations: res.data.totalSessionRegistrations || 0
      }
      setUsers(list)
      setStats(info)
      const data = {
        users: list,
        stats: info,
        time: new Date().getTime()
      }
      sessionStorage.setItem("participantsCache", JSON.stringify(data))
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }




  const openQr = (user: User) => setSelected(user)
  const closeQr = () => setSelected(null)

  const statsItems = [
    { label: "Total Participants", value: stats.totalParticipants, icon: <FaRegListAlt className="text-blue-600" />, iconBg: "bg-blue-100" },
    { label: "Total Sessions Bookmark", value: stats.totalBookmarks, icon: <FaBookmark className="text-yellow-600" />, iconBg: "bg-yellow-100" },
    { label: "Sessions Registration", value: stats.totalSessionRegistrations, icon: <FaPlay className="text-green-600" />, iconBg: "bg-green-100" }
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase())
    const now = new Date()
    const createdDate = new Date(user.createdAt)
    const updatedDate = new Date(user.updatedAt)
    const matchesFilter = (() => {
      if (activeFilter === "Daily") {
        const start = new Date(now)
        start.setHours(0, 0, 0, 0)
        const end = new Date(now)
        end.setHours(23, 59, 59, 999)
        return (createdDate >= start && createdDate <= end) || (updatedDate >= start && updatedDate <= end)
      }
      if (activeFilter === "Weekly") {
        const weekAgo = new Date()
        weekAgo.setDate(now.getDate() - 7)
        return (createdDate >= weekAgo && createdDate <= now) || (updatedDate >= weekAgo && updatedDate <= now)
      }
      if (activeFilter === "10 Days") {
        const tenAgo = new Date()
        tenAgo.setDate(now.getDate() - 10)
        return (createdDate >= tenAgo && createdDate <= now) || (updatedDate >= tenAgo && updatedDate <= now)
      }
      if (activeFilter === "90 Days") {
        const ninetyAgo = new Date()
        ninetyAgo.setDate(now.getDate() - 90)
        return (createdDate >= ninetyAgo && createdDate <= now) || (updatedDate >= ninetyAgo && updatedDate <= now)
      }
      return true
    })()
    return matchesSearch && matchesFilter
  })
  useEffect(() => {
    const savedSearch = sessionStorage.getItem("participantsSearch")
    if (savedSearch) setSearch(savedSearch)
    const savedFilter = sessionStorage.getItem("participantsFilter")
    if (savedFilter) setActiveFilter(savedFilter)
  }, [])

  useEffect(() => {
    sessionStorage.setItem("participantsSearch", search)
  }, [search])

  useEffect(() => {
    sessionStorage.setItem("participantsFilter", activeFilter)
  }, [activeFilter])

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Participants list</h1>

      </div>


      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
        <div className="bg-white border border-gray-300 rounded-md px-3 py-2 flex items-center w-full sm:flex-1">
          <input
            type="text"
            placeholder="Search participants"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="outline-none text-sm sm:text-base w-full text-black"
          />
        </div>

       <div className="flex gap-2">
  {filters.map(filter => (
    <button
      key={filter}
      onClick={() => setActiveFilter(filter)}
      className={`px-3 sm:px-4 py-2 rounded-full font-medium text-xs sm:text-sm flex-shrink-0 ${activeFilter === filter
        ? "bg-[#86002B] text-white"
        : "bg-white border border-gray-300 text-gray-800"
        }`}
    >
      {filter}
    </button>
  ))}
</div>

      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/Organizer/QrScanner"
          className="flex items-center bg-white rounded-xl p-4 shadow-sm hover:shadow-md hover:border hover:border-red-900 transition"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded-full mr-3">
            <FaUserCheck size={20} className="text-red-900" />
          </div>
          <div className="flex-1">
            <h3 className="text-md font-bold text-black">Scan QR</h3>
            <p className="text-sm text-gray-600"> Check participant profile</p>
          </div>
        </Link>

        <Link
          href="/registrationteam/CheckEeventRegistration"
          className="flex items-center bg-white rounded-xl p-4 shadow-sm hover:shadow-md hover:border hover:border-blue-700 transition"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-3">
            <FaClipboardCheck size={20} className="text-blue-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-md font-bold text-black">Master Class Registration</h3>
            <p className="text-sm text-gray-600">Check if participant is registered</p>
          </div>
        </Link>

        <Link
          href="/registrationteam/Sessions"
          className="flex items-center bg-white rounded-xl p-4 shadow-sm hover:shadow-md hover:border hover:border-green-700 transition"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full mr-3">
            <FaPlayCircle size={20} className="text-green-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-md font-bold text-black">Session Check</h3>
            <p className="text-sm text-gray-600">Verify session registration</p>
          </div>
        </Link>
      </div>


      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {statsItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition w-full"
              >
                <div className={`w-10 h-10 rounded-md ${item.iconBg} flex items-center justify-center mr-3 sm:mr-4`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-lg sm:text-[22px] font-bold text-black leading-none">{item.value}</p>
                  <p className="text-sm text-gray-600">{item.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 mt-6">
            {filteredUsers.map(user => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-md shadow-sm gap-3 sm:gap-0 w-full"
              >
                <div className="flex items-center space-x-3 w-full sm:flex-1">
                  <img
                    src={user.file || "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm sm:text-base text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-3 flex-col sm:flex-row w-full sm:w-auto">
                  <button
                    onClick={() => openQr(user)}
                    className="border border-red-900 cursor-pointer text-red-900 px-4 py-1 rounded-md hover:bg-red-50 transition text-sm sm:text-base w-full sm:w-auto"
                  >
                    Generate QR Code
                  </button>

                  <Link
                    href={`/Organizer/ManageParticipants/ParticipantProfile`}
                    onClick={() => localStorage.setItem("participantId", user.id.toString())}
                    className="border border-red-900 text-center cursor-pointer bg-red-900 text-white px-4 py-1 rounded-md hover:bg-white hover:text-red-900 transition text-sm sm:text-base w-full sm:w-auto"
                  >
                    View Profile
                  </Link>
                </div>

              </div>
            ))}
            {filteredUsers.length === 0 && <p className="text-center text-gray-500 text-sm sm:text-base">No participants found</p>}
          </div>
        </>
      )}

      {selected && <QrCard user={selected} onClose={closeQr} />}
    </div>


  )
}
