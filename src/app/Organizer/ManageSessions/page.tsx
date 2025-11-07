'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaArrowLeft, FaSearch, FaPlay, FaRegListAlt, FaLock, FaUnlock, FaQrcode, FaCalendarAlt } from 'react-icons/fa'
import api from '@/config/api'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { setEventId } from "@/lib/store/features/event/eventSlice"
import ViewSession from './viewsession/page'
import AddSession from './addsession/page'

const filters = ['Daily', 'Weekly', '10 Days', '90 Days', 'All Time']

type Speaker = {
  name: string
  file?: string | null
}

type Session = {
  id: number
  eventId: number
  title: string
  description: string
  speakers: Speaker[]
  startTime: string
  endTime: string
  location: string
  category?: string
  registrationRequired: boolean
  registered: boolean
  joinToken?: string
  tag?: string
  tagColor?: string
}

type Stat = {
  label: string
  value: number
  change: string
  percent: string
  icon: JSX.Element
  iconBg: string
}

export default function SessionsSchedule() {
  const [activeFilter, setActiveFilter] = useState('All Time')
  const [sessions, setSessions] = useState<Session[]>([])
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([])
  const [stats, setStats] = useState<Stat[]>([])
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null)
  const [viewSessionId, setViewSessionId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [btnLoading, setBtnLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)

  const router = useRouter()
  const dispatch = useDispatch()

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const res = await api.get('/sessions/all')
      const data: Session[] = Array.isArray(res.data) ? res.data : []
      setSessions(data)
      setFilteredSessions(data)

      // Calculate stats
      const totalSessions = data.length
      const now = new Date()
      const ongoing = data.filter(s => new Date(s.startTime) <= now && new Date(s.endTime) >= now).length
      const registered = data.filter(s => s.registrationRequired).length

      setStats([
        { label: 'Total Sessions', value: totalSessions, change: '+0', percent: '0%', icon: <FaRegListAlt className="text-blue-600" />, iconBg: 'bg-blue-100' },
        { label: 'Ongoing', value: ongoing, change: '+0', percent: '0%', icon: <FaPlay className="text-green-600" />, iconBg: 'bg-green-100' },
        { label: 'Registered', value: registered, change: '+0', percent: '0%', icon: <FaLock className="text-yellow-600" />, iconBg: 'bg-yellow-100' },
      ])
    } catch (err) {
      console.error('Failed to fetch sessions', err)
      setSessions([])
      setFilteredSessions([])
      setStats([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  useEffect(() => {
    let filtered = [...sessions]
    const now = new Date()

    filtered = filtered.filter(s => {
      const start = new Date(s.startTime)
      const end = new Date(s.endTime)
      return end >= now || start >= now
    })

    if (activeFilter === "Daily") {
      filtered = filtered.filter(s => new Date(s.startTime).toDateString() === now.toDateString())
    } else if (activeFilter === "Weekly") {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      filtered = filtered.filter(s => {
        const start = new Date(s.startTime)
        return start >= weekStart && start <= weekEnd
      })
    } else if (activeFilter === "10 Days") {
      const start = new Date()
      const end = new Date()
      end.setDate(start.getDate() + 10)
      filtered = filtered.filter(s => {
        const startTime = new Date(s.startTime)
        return startTime >= start && startTime <= end
      })
    } else if (activeFilter === "90 Days") {
      const start = new Date()
      const end = new Date()
      end.setDate(start.getDate() + 90)
      filtered = filtered.filter(s => {
        const startTime = new Date(s.startTime)
        return startTime >= start && startTime <= end
      })
    }

    if (startDate) {
      const start = new Date(startDate)
      filtered = filtered.filter(s => new Date(s.startTime) >= start)
    }
    if (endDate) {
      const end = new Date(endDate)
      filtered = filtered.filter(s => new Date(s.startTime) <= end)
    }

    if (searchText) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchText.toLowerCase()) ||
        s.speakers.some(sp => sp.name.toLowerCase().includes(searchText.toLowerCase()))
      )
    }

    setFilteredSessions(filtered)
  }, [activeFilter, searchText, sessions, startDate, endDate])

  const handleDelete = async (id: number) => {
    setLoadingDelete(id)
    try {
      await api.delete(`/sessions/${id}`)
      fetchSessions()
    } catch (err) {
      console.error('Failed to delete session', err)
    } finally {
      setLoadingDelete(null)
    }
  }

const handleView = (s: Session) => {
  setBtnLoading(true)
  localStorage.setItem('sessionId', s.id.toString())
  dispatch(setEventId(s.eventId))
  router.push(`/participants/SessionDetail1/${s.id}`)
  setBtnLoading(false)
}


  const handleCreate = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    fetchSessions()
  }

  const handleApplyDateRange = () => {
    setShowDatePicker(false)
  }

  const formatTime = (iso: string) => {
    const date = new Date(iso)
    let hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    if (hours === 0) hours = 12
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 min-h-screen bg-[#FAFAFA] max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/Organizer/Dashboard">
          <FaArrowLeft className="text-red-800 w-5 h-5 cursor-pointer" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900 ml-5">Sessions Schedule</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-0 md:px-0 py-4 mb-6">
        {stats.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className={`w-10 h-10 rounded-md ${item.iconBg} flex items-center justify-center mr-4`}>{item.icon}</div>
            <div className="flex-1">
              <p className="text-[22px] font-bold text-black leading-none">{item.value}<span className="text-green-600 text-sm font-semibold ml-1">{item.change}</span></p>
              <p className="text-sm text-gray-600">{item.label}</p>
            </div>
            <div className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">▲ {item.percent}</div>
          </div>
        ))}
      </div>

      {/* Filters, search, date picker */}
      <div className="flex flex-col sm:flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:gap-2 md:flex-1">
          <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 w-full sm:w-auto flex-1">
            <FaSearch className="text-red-900 mr-2" />
            <input
              type="text"
              placeholder="Search sessions or speakers"
              className="outline-none text-sm w-full text-black"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => {
                setActiveFilter(f)
                setStartDate("")
                setEndDate("")
              }}
              className={`flex-shrink-0 px-4 py-1 rounded-xl text-sm font-medium transition
                ${activeFilter === f
                  ? "bg-[#86002B] text-white"
                  : "bg-white border border-gray-300 text-black hover:bg-gray-100"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative mt-2 sm:mt-0">
          <button
            onClick={() => setShowDatePicker(prev => !prev)}
            className="flex items-center border border-gray-300 bg-white px-3 py-2 rounded-md text-sm text-gray-700"
          >
            <FaCalendarAlt className="mr-2 text-gray-500" />
            {startDate && endDate
              ? `${startDate} - ${endDate}`
              : "Select Date Range"}
          </button>

          {showDatePicker && (
            <div className="absolute z-10 mt-2 p-4 bg-white border border-gray-300 rounded-md shadow-lg flex flex-col gap-2">
              <label className="flex flex-col text-sm text-gray-700">
                Start Date
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="mt-1 border border-gray-300 rounded px-2 py-1"
                />
              </label>
              <label className="flex flex-col text-sm text-gray-700">
                End Date
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="mt-1 border border-gray-300 rounded px-2 py-1"
                />
              </label>
              <button
                onClick={handleApplyDateRange}
                className="bg-[#86002B] text-white text-sm py-1 rounded mt-2"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleCreate}
        disabled={btnLoading}
        className="bg-[#9B2033] hover:bg-[#7c062a] transition text-white text-sm px-5 py-2 rounded-md font-medium flex items-center justify-center mb-6"
      >
        {btnLoading ? <div className="w-5 h-5 border-2 border-gray-300 border-t-red-700 rounded-full animate-spin"></div> : '+ Create New Session'}
      </button>

      {isModalOpen && <AddSession onClose={handleModalClose} />}

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map(s => {
          const speaker = s.speakers[0]
          return (
            <div key={s.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between w-full">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-black">{s.title}</h2>
                {s.registrationRequired ? (
                  s.registered ? <FaLock className="text-gray-600" /> : <FaUnlock className="text-green-600" />
                ) : (
                  <a href={`/join/${s.joinToken}`} target="_blank" className="text-green-600">
                    <FaQrcode size={18} />
                  </a>
                )}
              </div>

              <p className="text-xs text-gray-500 mb-3">{s.description}</p>

              {speaker && (
                <div className="flex items-center text-xs text-gray-600 mb-1 space-x-2">
                  {speaker.file && <img src={speaker.file} alt={speaker.name} className="w-6 h-6 rounded-full object-cover" />}
                  <span>{speaker.name}</span>
                </div>
              )}

              <div className="flex items-center justify-between mb-2 text-xs">
                <div className="flex items-center text-gray-600 gap-2">
                  <span>{formatTime(s.startTime)} - {formatTime(s.endTime)}</span>
                </div>
                {s.category && <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800 font-semibold">{s.category}</span>}
              </div>

              <div className="flex text-xs text-gray-900 mb-2 items-center justify-between">
                <span>Location:</span>
                <span>{s.location}</span>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => setViewSessionId(s.id)}
                  disabled={btnLoading}
                  className="bg-[#9B2033] hover:bg-[#7c062a] text-white text-sm px-4 py-2 rounded-md w-full flex justify-center items-center"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(s.id)}
                  disabled={loadingDelete === s.id}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm px-4 py-2 rounded-md w-full flex justify-center items-center"
                >
                  {loadingDelete === s.id ? <div className="w-5 h-5 border-2 border-gray-300 border-t-red-700 rounded-full animate-spin"></div> : 'Delete'}
                </button>

                <button
                  onClick={() => handleView(s)}
                  disabled={btnLoading}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm px-4 py-2 rounded-md w-full flex justify-center items-center"
                >
                  View
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {viewSessionId && (
        <ViewSession sessionId={viewSessionId} onClose={() => setViewSessionId(null)} />
      )}
    </div>
  )
}
