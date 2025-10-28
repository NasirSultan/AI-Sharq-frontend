'use client'

import React, { useState, useEffect } from 'react'
import { FaArrowLeft, FaCalendar, FaClock, FaPlay, FaPlus } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import AddNewVenuePopup from '../../components/AddNewVenuePopup'
import api from '@/config/api'

// load the live location component on the client only
const LiveLoaction3 = dynamic(() => import('@/app/components/LiveLoaction3'), {
  ssr: false,
})

// load the edit event component client side and tell TypeScript it accepts eventId
// this avoids the mismatch where the imported component had props typed as AddNewVenuePopupProps
const EditEvent = dynamic(() => import('./editevent/page'), { ssr: false }) as unknown as React.ComponentType<{
  isOpen: boolean
  onClose: () => void
  eventId: number
}>

type EventType = {
  id: number
  name: string
  description: string
  googleMapLink: string
  totalSessions: number
}

type DataType = {
  totalSessions: number
  liveSessions: number
  scheduledSessions: number
  events: EventType[]
}

const VenueMaps: React.FC = () => {
  // popup states
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [editPopup, setEditPopup] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)

  // loading states
  const [loading, setLoading] = useState(true)
  const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null)

  // data state
  const [data, setData] = useState<DataType>({
    totalSessions: 0,
    liveSessions: 0,
    scheduledSessions: 0,
    events: [],
  })

  // fetch summary and events on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/event/summary/mapview')
        setData(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // delete an event and adjust totals locally
  const handleDelete = async (eventId: number) => {
    const eventToDelete = data.events.find((e) => e.id === eventId)
    if (!eventToDelete) return

    try {
      setDeleteLoadingId(eventId)
      await api.delete(`/event/${eventId}`)
      const updatedEvents = data.events.filter((e) => e.id !== eventId)
      setData({
        ...data,
        events: updatedEvents,
        totalSessions: data.totalSessions - eventToDelete.totalSessions,
      })
    } catch (err) {
      console.error(err)
    } finally {
      setDeleteLoadingId(null)
    }
  }

  // open edit popup for an event
  const handleEdit = (eventId: number) => {
    setSelectedEventId(eventId)
    setEditPopup(true)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-[500px]">Loading...</div>
  }

  return (
   <div className="flex flex-col items-center p-6 gap-8 w-full max-w-[1280px] mx-auto">
  {/* Header */}
  <div className="flex flex-row items-center gap-4 w-full">
    <Link href="/Organizer/Dashboard">
      <FaArrowLeft className="w-9 h-9 text-[#7e0505]" />
    </Link>
    <h1 className="font-medium text-4xl text-[#282828]">Venue Maps</h1>
  </div>

  {/* Stats */}
  <div className="flex flex-col sm:flex-row items-start gap-6 w-full">
    {[
      { icon: <FaCalendar className="w-5 h-7 text-[#2563EB]" />, label: 'Total Sessions', value: data.totalSessions, bg: 'bg-[#DBEAFE]' },
      { icon: <FaPlay className="w-5 h-7 text-[#16A34A]" />, label: 'Ongoing', value: data.liveSessions, bg: 'bg-[#DCFCE7]' },
      { icon: <FaClock className="w-5 h-7 text-[#CA8A04]" />, label: 'Scheduled', value: data.scheduledSessions, bg: 'bg-[#FEF9C3]' },
    ].map((stat, idx) => (
      <div key={idx} className="flex-1 flex items-center p-5 bg-white border border-[#E6E6E6] shadow rounded-3xl">
        <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
          {stat.icon}
        </div>
        <div className="flex flex-col ml-4">
          <span className="font-semibold text-6xl text-[rgba(0,0,0,0.7)]">{stat.value}</span>
          <span className="text-lg text-[#414141]">{stat.label}</span>
        </div>
      </div>
    ))}
  </div>

  <LiveLoaction3 />

  {/* Search */}
  <div className="w-full flex justify-center">
    <div className="flex items-center w-full max-w-[1280px] p-4 gap-3 border border-[#E8E8E8] rounded-2xl">
      <FiSearch className="w-6 h-6 text-red-500" />
      <span className="text-base text-[#706f6f]">Search Venue</span>
    </div>
  </div>

  {/* Add / View */}
  <div className="flex justify-between items-center w-full max-w-[1280px]">
    <div
      className="flex items-center gap-2 p-3 bg-[#9B2033] rounded-2xl cursor-pointer"
      onClick={() => setIsPopupOpen(true)}
    >
      <FaPlus className="w-3 h-3 text-white" />
      <span className="text-white text-sm">Add New Venue</span>
    </div>
    <span className="text-base font-medium text-[#282828]">View All</span>
  </div>

  {/* Venue Cards */}
  <div className="flex flex-col gap-6 w-full">
    {data.events.map((event) => (
      <div key={event.id} className="flex flex-col md:flex-row justify-between p-6 gap-6 w-full bg-white border border-[#D4D4D4] shadow rounded-3xl">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">EV</span>
          </div>
          <div className="flex flex-col justify-center gap-2">
            <span className="font-semibold text-lg text-[#282828]">{event.name}</span>
            <span className="text-sm text-[#424242]">{event.description}</span>
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-3">
          <span className="bg-[#F0F0F0] px-4 py-1 rounded-full font-semibold text-lg text-[#282828]">
            {event.totalSessions} Sessions
          </span>
          <div className="flex flex-wrap gap-3">
            <button
              className="px-8 py-1 bg-[#9B2033] text-white rounded-2xl"
              onClick={() => handleDelete(event.id)}
              disabled={deleteLoadingId === event.id}
            >
              {deleteLoadingId === event.id ? 'Deleting...' : 'Delete'}
            </button>
            <button
              className="px-8 py-1 border border-[#8C8C8C] rounded-2xl"
              onClick={() => handleEdit(event.id)}
            >
              Edit
            </button>
            <Link href={event.googleMapLink} className="px-8 py-1 border border-[#8C8C8C] rounded-2xl">
              View
            </Link>
          </div>
        </div>
      </div>
    ))}
  </div>

  <AddNewVenuePopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
  {editPopup && selectedEventId && <EditEvent isOpen={editPopup} onClose={() => setEditPopup(false)} eventId={selectedEventId} />}
</div>

  )
}

export default VenueMaps
