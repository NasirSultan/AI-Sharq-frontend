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
  file?: string | null
  photo?: string | null
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

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const { data } = await api.get("/admin/users/dashboard")

        const dynamicStats: Stat[] = [
          {
            label: "Total Registrations",
            value: data.countTotalRegistration,
            percent: "2.3%",
            change: `+${data.countTotalRegistration - 1}`,
            icon: <FaUserPlus className="text-blue-500 text-xl" />,
          },
          {
            label: "Checked In Today",
            value: data.totalCheckin,
            percent: "1.5%",
            change: `+${data.totalCheckin - 0}`,
            icon: <FaCheckCircle className="text-green-500 text-xl" />,
          },
          {
            label: "Active Sessions",
            value: data.totalActiveSession,
            percent: "0.5%",
            change: `+${data.totalActiveSession - 1}`,
            icon: <FaTv className="text-purple-500 text-xl" />,
          },
          {
            label: "Total Speakers",
            value: data.totalSpeaker,
            percent: "3.0%",
            change: `+${data.totalSpeaker - 1}`,
            icon: <FaMicrophone className="text-red-500 text-xl" />,
          },
          {
            label: "Total Sponsors",
            value: data.totalSponsor,
            percent: "4.2%",
            change: `+${data.totalSponsor - 1}`,
            icon: <FaHandshake className="text-yellow-500 text-xl" />,
          },
          {
            label: "Total Participants",
            value: data.totalExhibitor,
            percent: "2.8%",
            change: `+${data.totalExhibitor - 1}`,
            icon: <FaUsers className="text-orange-500 text-xl" />,
          },
        ]
        setStats(dynamicStats)

        const chartData = [
          { name: "Speakers", value: data.totalSpeaker || 0, color: "#9B2033" },
          { name: "Participants", value: data.totalExhibitor || 0, color: "rgba(173, 11, 8, 0.78)ff" },
          { name: "Sponsors", value: data.totalSponsor || 0, color: "#f30f0fff" },
          { name: "Registrations", value: data.countTotalRegistration || 0, color: "#920805ff" },
        ]
        setEngagementData(chartData)
        setLatestParticipants(data.recentUsers || [])
      } catch (err) {
        console.error(err)
      }
    }

    async function fetchAttendanceAndSessions() {
      try {
        const { data } = await api.get("/admin/users/weekly-attendance")
        setDailyAttendance(
          data.dailyAttendance.map((item: any) => ({
            day: new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }),
            attendees: item.count,
          }))
        )
        setTopSessions(data.topSessions)
      } catch (err) {
        console.error(err)
      }
    }

    fetchDashboard()
    fetchAttendanceAndSessions()
  }, [])

  const filteredParticipants = latestParticipants.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        Participants: latestParticipants.map((p) => ({
          Name: p.name,
          Email: p.email,
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
    <div className="p-2 space-y-8 bg-[#F9F9F9] min-h-screen">
      <div className="w-full px-3 sm:px-6 md:px-9">
        <div className="flex flex-col sm:flex-row items-center mt-4 justify-between gap-3 sm:gap-4 flex-wrap">
          <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 w-full sm:w-[240px] md:w-[280px]">
            <FaSearch className="text-red-900 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="outline-none text-sm w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
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
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="outline-none w-full text-sm text-gray-700"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-6 md:px-9">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="relative bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center">
                {item.icon}
              </div>
              <div className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                ▲ {item.percent}
              </div>
            </div>
            <p className="text-xl sm:text-[22px] font-bold text-black mb-1">
              {item.value}
              <span className="text-green-600 text-sm font-semibold ml-1">{item.change}</span>
            </p>
            <p className="text-sm text-gray-600">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-300 shadow-sm rounded-xl w-[95%] h-[300px] sm:h-[400px] lg:h-[470px] flex flex-col mx-auto">
        <div className="p-4 sm:p-6">
          <h2 className="text-black font-semibold text-lg leading-[150%]">Daily Attendance</h2>
        </div>
        <div className="px-4 sm:px-6 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#282828" }} />
              <YAxis tick={{ fontSize: 12, fill: "#282828" }} />
              <Tooltip contentStyle={{ backgroundColor: "#FFF", border: "1px solid #F3F4F6" }} />
              <Line dataKey="attendees" stroke="#9B2033" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <div className="flex flex-col lg:flex-row items-stretch gap-6 sm:gap-8 w-[95%] mx-auto">
          <div className="flex flex-col justify-between p-6 sm:p-8 bg-white border border-gray-300 rounded-2xl shadow-sm flex-1">
            <h2 className="text-black font-semibold text-lg leading-[150%] mb-4">Most Popular Sessions</h2>
            <div className="flex-1 flex flex-col justify-between">
              {topSessions.slice(0, 3).map((session, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center w-full border-b border-gray-100 pb-2 mb-2"
                >
                  <div>
                    <p className="text-black font-medium">{session.title}</p>
                    <p className="text-gray-600 text-sm">{session.speakers.join(", ")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-700 font-semibold text-lg">{session.totalRegistrations}</p>
                    <p className="text-gray-600 text-sm">Attendees</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-8 bg-white border border-gray-300 rounded-2xl shadow-sm flex-1">
            <h2 className="text-black font-semibold text-lg leading-[150%] mb-4">Engagement Metrics</h2>
            <div className="flex-1 flex flex-col justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              {engagementData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <section className="w-[95%] p-4 sm:p-6 bg-white border border-gray-300 rounded-2xl shadow-sm">
          <h2 className="text-black font-semibold text-lg mb-4">Latest Participants</h2>
          <div className="space-y-3">
            {filteredParticipants.slice(0, 5).map((participant) => (
              <div
                key={participant.id}
                className="flex items-center space-x-4 border border-gray-200 rounded-full p-3"
              >
                <Image
                  src={
                    participant.photo ||
                    (participant.file ? `/uploads/${participant.file}` : "/default-avatar.png")
                  }
                  alt={participant.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                  <h3 className="font-semibold text-black text-sm sm:text-base">{participant.name}</h3>
                  <p className="text-gray-600 text-sm truncate">{participant.email}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="w-full flex justify-center">
        <div className="w-[95%] bg-white rounded-2xl sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-black font-semibold text-lg mb-1 flex items-center gap-2">
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
              <p className="text-gray-600 text-sm">Complete Report List</p>
            </div>

            <button
              onClick={handleDownloadCSV}
              className="text-red-700 text-sm font-medium px-5 py-2 rounded-lg hover:bg-red-700 hover:text-white transition-colors duration-200"
            >
              Download CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
