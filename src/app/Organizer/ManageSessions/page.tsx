"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaArrowLeft, FaSearch, FaPlay, FaRegListAlt, FaLock, FaUnlock, FaQrcode } from 'react-icons/fa'
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
  const [activeFilter, setActiveFilter] = useState('Daily')
  const [sessions, setSessions] = useState<Session[]>([])
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null)
  const [viewSessionId, setViewSessionId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
    const dispatch = useDispatch()
  const stats: Stat[] = [
    { label: 'Total Sessions', value: 24, change: '+2', percent: '2.5%', icon: <FaRegListAlt className="text-blue-600" />, iconBg: 'bg-blue-100' },
    { label: 'Ongoing', value: 5, change: '+1', percent: '1.2%', icon: <FaPlay className="text-green-600" />, iconBg: 'bg-green-100' },
    { label: 'Registered', value: 12, change: '+3', percent: '0.8%', icon: <FaLock className="text-yellow-600" />, iconBg: 'bg-yellow-100' },
  ]

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get('/sessions/all')
        if (Array.isArray(res.data)) setSessions(res.data)
      } catch (err) {
        console.error('Failed to fetch sessions', err)
        setSessions([])
      }
    }
    fetchSessions()
  }, [])

  const formatTime = (iso: string) => {
    const date = new Date(iso)
    let hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    if (hours === 0) hours = 12
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`
  }

  const getDurationMinutes = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return Math.round((endDate.getTime() - startDate.getTime()) / 60000)
  }

  const handleDelete = async (id: number) => {
    setLoadingDelete(id)
    try {
      await api.delete(`/sessions/${id}`)
      setSessions(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      console.error('Failed to delete session', err)
    } finally {
      setLoadingDelete(null)
    }
  }
const handleView = (session: Session) => {
  localStorage.setItem('sessionId', session.id.toString())
  dispatch(setEventId(session.eventId))
  router.push('/Organizer/ManageSessions/sessiondetail')
}


  return (
    <div className="p-6 md:p-10 min-h-screen font-sans bg-[#FAFAFA]">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/Organizer/Dashboard">
          <FaArrowLeft className="text-red-800 w-[20px] h-[20px] cursor-pointer" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900 ml-5">Sessions Schedule</h1>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex bg-white border border-gray-300 rounded-md px-3 py-2 w-full md:w-[300px]">
          <FaSearch className="text-red-900 mr-2 mt-1" />
          <input type="text" placeholder="Search sessions or speakers" className="outline-none text-sm w-full" />
        </div>
        <div className="flex gap-3 flex-wrap">
          {filters.map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1 rounded-full text-sm font-medium ${activeFilter === filter ? 'bg-[#86002B] text-white' : 'bg-white border border-gray-300 text-gray-800'}`}>
              {filter}
            </button>
          ))}
        </div>
      </div>

      <button
        className="bg-[#9B2033] hover:bg-[#7c062a] transition text-white text-sm px-5 py-2 rounded-md font-medium"
        onClick={() => setIsModalOpen(true)}
      >
        + Create New Session
      </button>

      {isModalOpen && <AddSession onClose={() => setIsModalOpen(false)} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 md:px-10 py-6">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-10 py-6">
        {sessions.map((s) => {
          const speaker = s.speakers[0]
          return (
            <div key={s.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between h-[380px]">
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
                  <svg width="20" height="20" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14.4594 26.0046H6.0616C5.40605 26.0046 4.77735 25.7442 4.31381 25.2807C3.85026 24.8171 3.58984 24.1884 3.58984 23.5329V8.70231C3.58984 8.04676 3.85026 7.41806 4.31381 6.95451C4.77735 6.49097 5.40605 6.23055 6.0616 6.23055H20.8922C21.5477 6.23055 22.1764 6.49097 22.64 6.95451C23.1035 7.41806 23.3639 8.04676 23.3639 8.70231V13.6458H3.58984M22.128 17.3535V22.297H27.0716M22.128 17.3535C23.4392 17.3535 24.6966 17.8743 25.6236 18.8014C26.5507 19.7285 27.0716 20.9859 27.0716 22.297M22.128 17.3535C20.8169 17.3535 19.5595 17.8743 18.6325 18.8014C17.7054 19.7285 17.1845 20.9859 17.1845 22.297C17.1845 23.6081 17.7054 24.8655 18.6325 25.7926C19.5595 26.7197 20.8169 27.2405 22.128 27.2405C23.4392 27.2405 24.6966 26.7197 25.6236 25.7926C26.5507 24.8655 27.0716 23.6081 27.0716 22.297M18.4204 3.75879V8.70231M8.53337 3.75879V8.70231"
                      stroke="#2D7DD2"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{formatTime(s.startTime)} - {formatTime(s.endTime)}</span>
                </div>
                {s.category && <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800 font-semibold">{s.category}</span>}
              </div>

              <div className="flex text-xs text-gray-900 mb-2 items-center justify-between">
                <span>Duration:</span>
                <span>{getDurationMinutes(s.startTime, s.endTime)} min</span>
              </div>
              <div className="flex text-xs text-gray-900 mb-2 items-center justify-between">
                <span>Location:</span>
                <span>{s.location}</span>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => setViewSessionId(s.id)}
                  className="bg-[#9B2033] hover:bg-[#7c062a] text-white text-sm px-4 py-2 rounded-md w-full">
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(s.id)}
                  className={`border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm px-4 py-2 rounded-md w-full ${loadingDelete === s.id ? 'bg-red-200 text-red-800' : ''}`}>
                  {loadingDelete === s.id ? 'Deleting...' : 'Delete'}
                </button>
               <button
  onClick={() => handleView(s)}
  className="border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm px-4 py-2 rounded-md w-full">
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
