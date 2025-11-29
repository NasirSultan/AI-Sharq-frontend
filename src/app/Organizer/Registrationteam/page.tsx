"use client"
import React, { useState, useEffect } from "react"
import { FaArrowLeft, FaSearch } from "react-icons/fa"
import { useRouter } from "next/navigation"
import api from "@/config/api"
import AddRegistrationTeam from "./AddRegistrationTeam"

type Member = {
  id: number
  name: string
  email: string
  phone?: string
  file?: string
  createdAt?: string
  updatedAt?: string
  organization?: string
}

const filters = ["Daily", "Weekly", "10 Days", "90 Days", "All Time"]

export default function RegistrationTeamPage() {
  const router = useRouter()
  const [team, setTeam] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("All Time")
  const [loading, setLoading] = useState(true)
  const [showAddPopup, setShowAddPopup] = useState(false)

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    setLoading(true)
    try {
      const res = await api.get("/admin/users/registrationteam")
      setTeam(res.data || [])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return
    try {
      await api.delete(`/admin/users/${id}`)
      setTeam(prev => prev.filter(member => member.id !== id))
      alert("Member deleted successfully")
    } catch {
      alert("Failed to delete member")
    }
  }

  const filteredTeam = team.filter(member => {
    const n = member.name || ""
    const e = member.email || ""
    const p = member.phone || ""
    const org = member.organization || ""
    const createdDate = member.createdAt ? new Date(member.createdAt) : null
    const updatedDate = member.updatedAt ? new Date(member.updatedAt) : null
    const now = new Date()

    const matchesSearch =
      n.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.includes(searchTerm) ||
      org.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = (() => {
      if (!createdDate || !updatedDate) return true
      if (activeFilter === "Daily") {
        const start = new Date(now)
        start.setHours(0, 0, 0, 0)
        const end = new Date(now)
        end.setHours(23, 59, 59, 999)
        return (createdDate >= start && createdDate <= end) || (updatedDate >= start && updatedDate <= end)
      }
      if (activeFilter === "Weekly" || activeFilter === "Last 7 Days") {
        const start = new Date()
        start.setDate(now.getDate() - 7)
        return (createdDate >= start && createdDate <= now) || (updatedDate >= start && updatedDate <= now)
      }
      if (activeFilter === "10 Days") {
        const start = new Date()
        start.setDate(now.getDate() - 10)
        return (createdDate >= start && createdDate <= now) || (updatedDate >= start && updatedDate <= now)
      }
      if (activeFilter === "90 Days") {
        const start = new Date()
        start.setDate(now.getDate() - 90)
        return (createdDate >= start && createdDate <= now) || (updatedDate >= start && updatedDate <= now)
      }
      if (activeFilter === "All Time") return true
      return true
    })()

    return matchesSearch && matchesFilter
  })

  return (
   <div className="min-h-screen bg-[#FAFAFA] px-4 md:px-8 lg:px-10 py-6 max-w-6xl mx-auto">
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 w-full">
    <div className="flex items-center gap-3 w-full sm:w-auto">
      <FaArrowLeft
        className="text-red-800 w-5 h-5 cursor-pointer"
        onClick={() => router.back()}
      />
      <h1 className="text-xl font-bold text-gray-900">Registration Team</h1>
    </div>
    <button
      onClick={() => setShowAddPopup(true)}
      className="mt-2 sm:mt-0 sm:ml-auto bg-red-900 cursor-pointer text-white px-4 py-1 rounded-md hover:bg-red-800"
    >
      Add Member
    </button>
  </div>

  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 mb-4 w-full">
    <div className="flex bg-white border border-gray-300 rounded-md px-3 py-2 flex-1 min-w-[200px]">
      <FaSearch className="text-red-900 mr-2 mt-1" />
      <input
        type="text"
        placeholder="Search members"
        className="outline-none text-sm w-full text-black"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
    </div>

    <div className="flex flex-wrap gap-2 w-full sm:w-auto mt-2 sm:mt-0">
      {filters.map(f => (
        <button
          key={f}
          onClick={() => setActiveFilter(f)}
          className={`px-4 py-1 rounded-md border ${
            activeFilter === f
              ? "bg-red-800 text-white border-red-800"
              : "bg-white text-black border-gray-300"
          } hover:bg-red-900 transition hover:text-white`}
        >
          {f}
        </button>
      ))}
    </div>
  </div>

  <div className="bg-white rounded-lg shadow-md p-4 w-full">
    {loading ? (
     <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>

    ) : filteredTeam.length === 0 ? (
      <p className="text-center text-black">No members found</p>
    ) : (
      filteredTeam.map(member => (
        <div
          key={member.id}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 p-3 gap-3"
        >
          <div className="flex items-center p-1 gap-3 w-full sm:w-auto">
            <img
              src={
                member.file ||
                "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"
              }
              alt={member.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900">{member.name}</p>
              <p className="text-sm text-gray-500">
                {member.email} 
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <button
              onClick={() => {
                localStorage.setItem("participantId", member.id.toString())
                router.push("/Organizer/ManageParticipants/ParticipantProfile")
              }}
              className="border border-blue-600 cursor-pointer text-blue-600 px-4 py-1 rounded-md cursor-pointer hover:bg-blue-50 transition flex-1 sm:flex-none"
            >
              View Profile
            </button>
            <button
              onClick={() => handleDelete(member.id)}
              className="bg-red-800 cursor-pointer text-white px-3 py-1 rounded-md hover:bg-red-900 flex-1 sm:flex-none"
            >
              Delete
            </button>
          </div>
        </div>
      ))
    )}
  </div>

  {showAddPopup && (
    <AddRegistrationTeam
      onAdded={member => {
        if (member) fetchTeam()
        setShowAddPopup(false)
      }}
    />
  )}
</div>

  )
}
