"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { FaArrowLeft, FaBookmark, FaCalendarAlt, FaPlay, FaRegListAlt, FaSearch } from 'react-icons/fa'
import api from '@/config/api'

const filters = ["Daily", "Weekly", "10 Days", "90 Days", "All Time"]

export default function Page() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState("All Time")
  const [participants, setParticipants] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState({
    totalParticipants: 0,
    totalBookmarks: 0,
    totalSessionRegistrations: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchParticipants()
  }, [])

  const fetchParticipants = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/users/participants')
      const data = res.data
      setParticipants(data.users || [])
      setStats({
        totalParticipants: data.totalParticipants || 0,
        totalBookmarks: data.totalBookmarks || 0,
        totalSessionRegistrations: data.totalSessionRegistrations || 0
      })
    } catch (error) {
      console.error('Failed to fetch participants', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBlock = async (user: any) => {
    const confirmAction = confirm(`Are you sure you want to ${user.isBlocked ? 'unblock' : 'block'} this user?`)
    if (!confirmAction) return
    try {
      await api.patch('/admin/users/block', {
        id: user.id,
        isBlocked: !user.isBlocked
      })
      setParticipants(prev =>
        prev.map(p => (p.id === user.id ? { ...p, isBlocked: !p.isBlocked } : p))
      )
    } catch (error) {
      console.error('Failed to block/unblock user', error)
      alert('Failed to update user status')
    }
  }

  const handleDelete = async (user: any) => {
    const confirmAction = confirm(`Are you sure you want to delete this user?`)
    if (!confirmAction) return
    try {
      await api.delete(`/admin/users/${user.id}`)
      setParticipants(prev => prev.filter(p => p.id !== user.id))
      alert('User deleted successfully')
    } catch (error) {
      console.error('Failed to delete user', error)
      alert('Failed to delete user')
    }
  }

  const handleView = (userId: number) => {
    router.push(`/Organizer/ManageParticipants/bookmark?userId=${userId}`)
  }

  const statsItems = [
    { label: "Total Participants", value: stats.totalParticipants, icon: <FaRegListAlt className="text-blue-600" />, iconBg: "bg-blue-100" },
    { label: "Total Sessions Bookmark", value: stats.totalBookmarks, icon: <FaBookmark className="text-yellow-600" />, iconBg: "bg-yellow-100" },
    { label: "Sessions Registration ", value: stats.totalSessionRegistrations, icon: <FaPlay className="text-green-600" />, iconBg: "bg-green-100" }
  ]

  const filteredParticipants = participants.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.organization?.toLowerCase().includes(searchTerm.toLowerCase())

    const createdDate = new Date(user.createdAt)
    const updatedDate = new Date(user.updatedAt)
    const now = new Date()

    const matchesFilter = (() => {
      if (activeFilter === "Daily") {
        const startOfToday = new Date(now)
        startOfToday.setHours(0, 0, 0, 0)
        const endOfToday = new Date(now)
        endOfToday.setHours(23, 59, 59, 999)
        return (createdDate >= startOfToday && createdDate <= endOfToday) ||
          (updatedDate >= startOfToday && updatedDate <= endOfToday)
      }
      if (activeFilter === "Weekly" || activeFilter === "Last 7 Days") {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(now.getDate() - 7)
        return (createdDate >= sevenDaysAgo && createdDate <= now) ||
          (updatedDate >= sevenDaysAgo && updatedDate <= now)
      }
      if (activeFilter === "10 Days") {
        const tenDaysAgo = new Date()
        tenDaysAgo.setDate(now.getDate() - 10)
        return (createdDate >= tenDaysAgo && createdDate <= now) ||
          (updatedDate >= tenDaysAgo && updatedDate <= now)
      }
      if (activeFilter === "90 Days") {
        const ninetyDaysAgo = new Date()
        ninetyDaysAgo.setDate(now.getDate() - 90)
        return (createdDate >= ninetyDaysAgo && createdDate <= now) ||
          (updatedDate >= ninetyDaysAgo && updatedDate <= now)
      }
      if (activeFilter === "All Time") {
        return true
      }
    })()

    return matchesSearch && matchesFilter
  })





  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 md:px-8 lg:px-10 py-6 space-y-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/Organizer/Dashboard">
          <FaArrowLeft className="text-red-800 w-5 h-5 cursor-pointer" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Manage Participants</h1>
      </div>

      {/* Filters/Search */}
      <div className="flex w-full gap-4">
        <div className="flex bg-white border border-gray-300 rounded-md px-3 py-2 flex-grow">
          <FaSearch className="text-red-900 mr-2 mt-1" />
          <input
            type="text"
            placeholder="Search sessions or participants"
            className="outline-none text-sm w-full text-black"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap flex-grow">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 px-4 py-1 rounded-full text-sm font-medium text-center ${activeFilter === filter ? "bg-[#86002B] text-white" : "bg-white border border-gray-300 text-gray-800"}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>



      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsItems.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition">
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

      {/* Participants List */}
      <div className="w-full max-w-full mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
  {loading ? (
    <p className="text-center text-gray-500">Loading participants...</p>
  ) : participants.length === 0 ? (
    <p className="text-center text-black">No participants found</p>
  ) : filteredParticipants.length === 0 ? (
    <p className="text-center text-black">No participants match your filter</p>
  ) : (
    filteredParticipants.map(user => (
      <div key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 rounded-md p-4 mb-4 shadow-sm gap-4 sm:gap-2">
        <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
          <img
            src={user.file ? user.file : "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"}
            alt={user.name}
            className="rounded-full object-cover w-10 h-10"
          />
          <div className="flex flex-col">
            <div className="flex items-baseline space-x-2">
              <h2 className="font-semibold text-gray-900">{user.name}</h2>
              <h3 className="text-gray-600 text-sm">{user.organization}</h3>
            </div>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <button
            onClick={() => handleDelete(user)}
            className="bg-red-800 text-white px-4 py-1 rounded-md hover:bg-red-900 transition cursor-pointer flex-1 sm:flex-none"
          >
            Delete Account
          </button>
          <button
            onClick={() => handleBlock(user)}
            className={`px-4 py-1 rounded-md border cursor-pointer flex-1 sm:flex-none transition ${user.isBlocked
              ? 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200'
              : 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'
            }`}
          >
            {user.isBlocked ? 'Suspended' : 'Active'}
          </button>
          <button
            onClick={() => {
              localStorage.setItem('participantId', user.id.toString())
              router.push('/Organizer/ManageParticipants/ParticipantProfile')
            }}
            className="border border-blue-600 text-blue-600 px-4 py-1 rounded-md cursor-pointer hover:bg-blue-50 transition flex-1 sm:flex-none"
          >
            View Profile
          </button>
          <button
            onClick={() => router.push(`/Organizer/ManageParticipants/bookmark?userId=${user.id}`)}
            className="border border-gray-300 px-4 py-1 rounded-md cursor-pointer text-black hover:bg-gray-100 transition flex-1 sm:flex-none"
          >
            View Bookmarks
          </button>
        </div>
      </div>
    ))
  )}
</div>

    </div>

  )
}
