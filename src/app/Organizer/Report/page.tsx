"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaHandshake,
  FaMicrophone,
  FaTv,
  FaUserPlus,
  FaUsers,
  FaSearch,
  FaBan,
  FaUser,
} from "react-icons/fa"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import api from "@/config/api"
import Papa from "papaparse"

const filters = ["Daily", "Weekly", "10 Days", "90 Days", "All Time"]

type Stat = {
  label: string
  value: number | string
  percent: string
  change: string
  icon: React.ReactNode
}

type DailyAttendance = {
  date: string
  count: number
}

type TopSession = {
  id: number
  title: string
  totalRegistrations: number
  speakers: string[]
}

type Participant = {
  id: number
  name: string
  email: string
  phone?: string | null
  role: string
  organization?: string | null
  file?: string | null
  photo?: string | null
  isBlocked: boolean
  createdAt: string
  bio?: string | null
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All Time")
  const [dateRange, setDateRange] = useState("Jan 2024 - Dec 2024")
  const [stats, setStats] = useState<Stat[]>([])
  const [dailyAttendance, setDailyAttendance] = useState<any[]>([])
  const [topSessions, setTopSessions] = useState<TopSession[]>([])
  const [engagementData, setEngagementData] = useState<
    { name: string; value: number; color: string }[]
  >([])
  const [latestParticipants, setLatestParticipants] = useState<Participant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState("All")

  // Mock data for initial UI display
  const mockStats: Stat[] = [
    {
      label: "Total Registrations",
      value: "1,245",
      percent: "2.3%",
      change: "+45",
      icon: <FaUserPlus className="text-blue-500 text-xl" />,
    },
    {
      label: "Checked In Today",
      value: "892",
      percent: "1.5%",
      change: "+32",
      icon: <FaCheckCircle className="text-green-500 text-xl" />,
    },
    {
      label: "Active Sessions",
      value: "12",
      percent: "0.5%",
      change: "+2",
      icon: <FaTv className="text-purple-500 text-xl" />,
    },
    {
      label: "Total Speakers",
      value: "48",
      percent: "3.0%",
      change: "+8",
      icon: <FaMicrophone className="text-red-500 text-xl" />,
    },
    {
      label: "Total Sponsors",
      value: "23",
      percent: "4.2%",
      change: "+5",
      icon: <FaHandshake className="text-yellow-500 text-xl" />,
    },
    {
      label: "Total Participants",
      value: "1,156",
      percent: "2.8%",
      change: "+28",
      icon: <FaUsers className="text-orange-500 text-xl" />,
    },
  ]

  const mockDailyAttendance = [
    { day: "Mon", attendees: 120 },
    { day: "Tue", attendees: 190 },
    { day: "Wed", attendees: 160 },
    { day: "Thu", attendees: 210 },
    { day: "Fri", attendees: 180 },
    { day: "Sat", attendees: 250 },
    { day: "Sun", attendees: 220 },
  ]

  const mockTopSessions: TopSession[] = [
    {
      id: 1,
      title: "AI in Modern Development",
      totalRegistrations: 345,
      speakers: ["Dr. Sarah Johnson", "Mark Wilson"],
    },
    {
      id: 2,
      title: "Cloud Infrastructure 2024",
      totalRegistrations: 298,
      speakers: ["Alex Chen", "Priya Patel"],
    },
    {
      id: 3,
      title: "Web3 and Blockchain",
      totalRegistrations: 267,
      speakers: ["James Miller", "Lisa Zhang"],
    },
  ]

  const mockEngagementData = [
    { name: "Speakers", value: 48, color: "#9B2033" },
    { name: "Participants", value: 1156, color: "rgba(173, 11, 8, 0.78)" },
    { name: "Sponsors", value: 23, color: "#f30f0f" },
    { name: "Registrations", value: 1245, color: "#920805" },
  ]

  // Process API data to match our Participant type
  const processApiParticipants = (users: any[]): Participant[] => {
    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      organization: user.organization,
      file: user.file,
      photo: user.photo,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
      bio: user.bio
    }))
  }

  useEffect(() => {
    // Set mock data first for immediate UI display
    setStats(mockStats)
    setDailyAttendance(mockDailyAttendance)
    setTopSessions(mockTopSessions)
    setEngagementData(mockEngagementData)

    async function fetchDashboard() {
      try {
        setIsLoading(true)
        const { data } = await api.get("/admin/users/dashboard")

        console.log("API Response:", data) // Debug log

        // Process the API data for stats
        const dynamicStats: Stat[] = [
          {
            label: "Total Registrations",
            value: data.countTotalRegistration || 26,
            percent: "2.3%",
            change: `+${(data.countTotalRegistration || 26) - 25}`,
            icon: <FaUserPlus className="text-blue-500 text-xl" />,
          },
          {
            label: "Checked In Today",
            value: data.totalCheckin || 2,
            percent: "1.5%",
            change: `+${(data.totalCheckin || 2) - 1}`,
            icon: <FaCheckCircle className="text-green-500 text-xl" />,
          },
          {
            label: "Active Sessions",
            value: data.totalActiveSession || 0,
            percent: "0.5%",
            change: `+${data.totalActiveSession || 0}`,
            icon: <FaTv className="text-purple-500 text-xl" />,
          },
          {
            label: "Total Speakers",
            value: data.totalSpeaker || 3,
            percent: "3.0%",
            change: `+${(data.totalSpeaker || 3) - 2}`,
            icon: <FaMicrophone className="text-red-500 text-xl" />,
          },
          {
            label: "Total Sponsors",
            value: data.totalSponsor || 3,
            percent: "4.2%",
            change: `+${(data.totalSponsor || 3) - 2}`,
            icon: <FaHandshake className="text-yellow-500 text-xl" />,
          },
          {
            label: "Total Participants",
            value: data.totalExhibitor || 3,
            percent: "2.8%",
            change: `+${(data.totalExhibitor || 3) - 2}`,
            icon: <FaUsers className="text-orange-500 text-xl" />,
          },
        ]
        setStats(dynamicStats)

        // Process engagement data from API
        const chartData = [
          { name: "Speakers", value: data.totalSpeaker || 3, color: "#9B2033" },
          { name: "Participants", value: data.totalExhibitor || 3, color: "rgba(173, 11, 8, 0.78)" },
          { name: "Sponsors", value: data.totalSponsor || 3, color: "#f30f0f" },
          { name: "Registrations", value: data.countTotalRegistration || 26, color: "#920805" },
        ]
        setEngagementData(chartData)

        // Process and set participants from API
        if (data.recentUsers && Array.isArray(data.recentUsers)) {
          const processedParticipants = processApiParticipants(data.recentUsers)
          setLatestParticipants(processedParticipants)
          console.log("Processed Participants:", processedParticipants) // Debug log
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err)
        // Keep mock data if API fails
      } finally {
        setIsLoading(false)
      }
    }

    async function fetchAttendanceAndSessions() {
      try {
        const { data } = await api.get("/admin/users/weekly-attendance")
        if (data.dailyAttendance) {
          setDailyAttendance(
            data.dailyAttendance.map((item: any) => ({
              day: new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }),
              attendees: item.count,
            }))
          )
        }
        if (data.topSessions) {
          setTopSessions(data.topSessions)
        }
      } catch (err) {
        console.error("Error fetching attendance:", err)
        // Keep mock data if API fails
      }
    }

    // Simulate API call with delay to show loading state
    setTimeout(() => {
      fetchDashboard()
      fetchAttendanceAndSessions()
    }, 1000)
  }, [])

  // Filter participants based on search query and role filter
  const filteredParticipants = latestParticipants.filter((participant) => {
    const matchesSearch = 
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (participant.phone && participant.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (participant.organization && participant.organization.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesRole = 
      roleFilter === "All" || 
      participant.role.toLowerCase() === roleFilter.toLowerCase()

    return matchesSearch && matchesRole
  })

  // Get unique roles for filter
  const uniqueRoles = ["All", ...new Set(latestParticipants.map(p => p.role))]

  // Function to get user avatar
  const getUserAvatar = (participant: Participant) => {
    if (participant.photo) {
      return participant.photo
    }
    if (participant.file) {
      return participant.file
    }
    return "/default-avatar.png"
  }

  // Function to format role display
  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
  }

  // Function to get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'speaker':
        return 'bg-purple-100 text-purple-800'
      case 'sponsor':
        return 'bg-yellow-100 text-yellow-800'
      case 'participant':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDownloadCSV = () => {
    try {
      const exportData = {
        Stats: stats.map((s) => ({
          Label: s.label,
          Value: s.value,
          Percent: s.percent,
          Change: s.change,
        })),
        TopSessions: topSessions.map((t) => ({
          Title: t.title,
          Registrations: t.totalRegistrations,
          Speakers: t.speakers.join(", "),
        })),
        Participants: filteredParticipants.map((p) => ({
          Name: p.name,
          Email: p.email,
          Phone: p.phone || 'N/A',
          Role: p.role,
          Organization: p.organization || 'N/A',
          Status: p.isBlocked ? 'Blocked' : 'Active',
          'Registered Date': new Date(p.createdAt).toLocaleDateString(),
        })),
      }

      const csvStats = Papa.unparse(exportData.Stats)
      const csvSessions = Papa.unparse(exportData.TopSessions)
      const csvParticipants = Papa.unparse(exportData.Participants)

      const csvContent =
        "DASHBOARD STATISTICS\n\n" +
        csvStats +
        "\n\nTOP SESSIONS\n\n" +
        csvSessions +
        "\n\nLATEST PARTICIPANTS\n\n" +
        csvParticipants

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "dashboard_report.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Error exporting CSV", err)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-4 sm:py-6 lg:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header with Search, Filters, and Date Range */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Event Dashboard</h1>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>Last updated: Just now</span>
              {isLoading && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or organization..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeFilter === filter
                      ? "bg-[#86002B] text-white shadow-md"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Date Range */}
            <div className="flex items-center border border-gray-300 bg-white px-3 py-2 rounded-lg text-sm text-gray-700 min-w-[200px]">
              <FaCalendarAlt className="mr-2 text-gray-500 flex-shrink-0" />
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="outline-none w-full text-sm text-gray-700 bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="relative bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                  ▲ {item.percent}
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {item.value}
                <span className="text-green-600 text-sm font-semibold ml-2">{item.change}</span>
              </p>
              <p className="text-sm text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Daily Attendance Chart */}
          <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Daily Attendance</h2>
              <p className="text-sm text-gray-600 mt-1">Attendance trends over the past week</p>
            </div>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyAttendance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#fff", 
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="attendees" 
                    stroke="#9B2033" 
                    strokeWidth={3}
                    dot={{ fill: "#9B2033", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#86002B" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Engagement Metrics</h2>
              <p className="text-sm text-gray-600 mt-1">Distribution of event participants</p>
            </div>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [value, "Count"]}
                    contentStyle={{ 
                      backgroundColor: "#fff", 
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sessions and Participants Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Most Popular Sessions */}
          <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Most Popular Sessions</h2>
              <p className="text-sm text-gray-600 mt-1">Top sessions by registration count</p>
            </div>
            <div className="space-y-4">
              {topSessions.slice(0, 3).map((session, index) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 bg-red-100 text-red-700 rounded-full text-xs flex items-center justify-center font-semibold">
                        {index + 1}
                      </span>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {session.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {session.speakers.join(", ")}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-red-700 font-bold text-lg">{session.totalRegistrations}</p>
                    <p className="text-xs text-gray-500">Attendees</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Participants */}
          <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Latest Participants</h2>
                  <p className="text-sm text-gray-600 mt-1">Recently registered attendees</p>
                </div>
                
                {/* Role Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 whitespace-nowrap">Filter by role:</label>
                  <select 
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {uniqueRoles.map(role => (
                      <option key={role} value={role}>
                        {formatRole(role)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Results Info */}
              <div className="flex items-center justify-between mb-4">
                {searchQuery && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {filteredParticipants.length} results for "{searchQuery}"
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  Showing {filteredParticipants.length} of {latestParticipants.length} participants
                </span>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredParticipants.slice(0, 10).map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-shrink-0 relative">
<img
  src={getUserAvatar(participant) || "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"}
  alt={participant.name || "Default Avatar"}
  className="rounded-full object-cover w-10 h-10 border border-gray-300"
  onError={(e) => {
    e.currentTarget.src = "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"
  }}
/>


                    {participant.isBlocked && (
                      <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
                        <FaBan className="text-white text-xs" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {participant.name}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(participant.role)}`}>
                        {formatRole(participant.role)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate mb-1">{participant.email}</p>
               
                    
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      participant.isBlocked 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {participant.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </div>
                </div>
              ))}
              
              {filteredParticipants.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FaSearch className="mx-auto text-2xl mb-2 opacity-50" />
                  <p>No participants found</p>
                  <p className="text-sm">Try adjusting your search terms or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-red-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                  />
                </svg>
                Export Report
              </h2>
              <p className="text-gray-600 text-sm">
                Download complete dashboard data in CSV format for further analysis
              </p>
            </div>
            <button
              onClick={handleDownloadCSV}
              className="w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                />
              </svg>
              Download CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}