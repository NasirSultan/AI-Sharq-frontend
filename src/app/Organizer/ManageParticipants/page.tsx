"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { FaArrowLeft, FaBookmark, FaCalendarAlt, FaPlay, FaRegListAlt, FaSearch } from 'react-icons/fa'
import api from '@/config/api'

const filters = ["Daily", "Weekly", "10 Days", "90 Days", "All Time"]

export default function Page() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState("Daily")
  const [participants, setParticipants] = useState<any[]>([])
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
    { label: "Total Bookmarks", value: stats.totalBookmarks, icon: <FaBookmark className="text-yellow-600" />, iconBg: "bg-yellow-100" },
    { label: "Registrations Requests", value: stats.totalSessionRegistrations, icon: <FaPlay className="text-green-600" />, iconBg: "bg-green-100" }
  ]

  return (
<div className="min-h-screen bg-[#FAFAFA] px-4 md:px-8 lg:px-10 py-6 space-y-8">
  {/* Header */}
  <div className="flex items-center gap-3">
    <Link href="/Organizer/Dashboard">
      <FaArrowLeft className="text-red-800 w-5 h-5 cursor-pointer" />
    </Link>
    <h1 className="text-xl font-bold text-gray-900 ml-2 sm:ml-5">Manage Participants</h1>
  </div>

  {/* Filters/Search */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div className="flex bg-white border border-gray-300 rounded-md px-3 py-2 w-full md:w-[300px]">
      <FaSearch className="text-red-900 mr-2 mt-1" />
      <input type="text" placeholder="Search sessions or speakers" className="outline-none text-sm w-full" />
    </div>

    <div className="flex gap-2 flex-wrap md:flex-nowrap">
      {filters.map(filter => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-4 py-1 rounded-full text-sm font-medium ${activeFilter === filter ? "bg-[#86002B] text-white" : "bg-white border border-gray-300 text-gray-800"}`}
        >
          {filter}
        </button>
      ))}
    </div>

    <div className="flex items-center border border-gray-300 bg-white px-3 py-2 rounded-md text-sm text-gray-700 mt-2 md:mt-0">
      <FaCalendarAlt className="mr-2 text-gray-500" />
      Jan 2024 - Dec 2024
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
      <p className="text-center text-gray-500">No participants found</p>
    ) : (
      participants.map(user => (
        <div key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 rounded-md p-4 mb-4 shadow-sm gap-4 sm:gap-2">
          <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
            <img
              src={user.file ? user.file : "/Images/default-user.png"}
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
              className="bg-red-800 text-white px-4 py-1 rounded-md hover:bg-red-900 transition flex-1 sm:flex-none"
            >
              Delete Account
            </button>
            <button
              onClick={() => handleBlock(user)}
              className={`px-4 py-1 rounded-md border flex-1 sm:flex-none transition ${
                user.isBlocked
                  ? 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200'
                  : 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'
              }`}
            >
              {user.isBlocked ? 'Suspended' : 'Active'}
            </button>
            <button
              onClick={() => router.push(`/Organizer/ManageParticipants/bookmark?userId=${user.id}`)}
              className="border border-gray-300 px-4 py-1 rounded-md text-black hover:bg-gray-100 transition flex-1 sm:flex-none"
            >
              View
            </button>
          </div>
        </div>
      ))
    )}
  </div>
</div>

  )
}
