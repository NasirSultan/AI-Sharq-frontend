'use client'
import React, { useState, useEffect } from 'react'
import { FaArrowLeft, FaCalendar, FaClock, FaPlay, FaPlus } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import AddNewVenuePopup from '../../components/AddNewVenuePopup'
import api from '@/config/api'
import EventLocationMap from '../../components/EventLocationMap'
const LiveLoaction3 = dynamic(() => import('@/app/components/LiveLoaction3'), { ssr: false })
const EditEvent = dynamic(() => import('./editevent/page'), { ssr: false }) as unknown as React.ComponentType<{ isOpen: boolean; onClose: () => void; eventId: number }>
import { useRouter } from 'next/router'

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
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [editPopup, setEditPopup] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)

  const [loading, setLoading] = useState(true)
  const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null)

  const [data, setData] = useState<DataType>({ totalSessions: 0, liveSessions: 0, scheduledSessions: 0, events: [] })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/event/summary/mapview')
        setData(res.data)
        if (res.data.events.length > 0) {
          localStorage.setItem("eventLocation", res.data.events[0].googleMapLink)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDelete = async (eventId: number) => {
    const eventToDelete = data.events.find((e) => e.id === eventId)
    if (!eventToDelete) return
    try {
      setDeleteLoadingId(eventId)
      await api.delete(`/event/${eventId}`)
      const updatedEvents = data.events.filter((e) => e.id !== eventId)
      setData({ ...data, events: updatedEvents, totalSessions: data.totalSessions - eventToDelete.totalSessions })
    } catch (err) {
      console.error(err)
    } finally {
      setDeleteLoadingId(null)
    }
  }

  const handleEdit = (eventId: number) => {
    setSelectedEventId(eventId)
    setEditPopup(true)
  }

  if (loading) {
    <div className="flex justify-center items-center h-64">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
    </div>
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 md:px-8 lg:px-12 py-6 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full">
        <Link href="/Organizer/Dashboard">
          <FaArrowLeft className="w-8 h-8 text-[#7e0505] cursor-pointer" />
        </Link>
        <h1 className="font-semibold text-3xl sm:text-4xl text-[#282828]">Venue Maps</h1>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full">
        {[
          { icon: <FaCalendar className="w-5 h-7 text-[#2563EB]" />, label: 'Total Sessions', value: data.totalSessions, bg: 'bg-[#DBEAFE]' },
          { icon: <FaPlay className="w-5 h-7 text-[#16A34A]" />, label: 'Ongoing', value: data.liveSessions, bg: 'bg-[#DCFCE7]' },
          { icon: <FaClock className="w-5 h-7 text-[#CA8A04]" />, label: 'Scheduled', value: data.scheduledSessions, bg: 'bg-[#FEF9C3]' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="w-full sm:flex-1 flex items-center p-4 sm:p-5 bg-white border border-[#E6E6E6] shadow rounded-2xl cursor-pointer"
          >
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div className="flex flex-col ml-3 sm:ml-4">
              <span className="font-semibold text-2xl sm:text-3xl text-[rgba(0,0,0,0.7)]">
                {stat.value}
              </span>
              <span className="text-sm sm:text-base text-[#414141]">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>


      <EventLocationMap />

      <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-[1280px] gap-4">
        <div className="flex flex-col items-start space-y-2">
          <div
            className="flex items-center gap-2 px-4 py-2 bg-[#9B2033] rounded-2xl cursor-pointer hover:bg-[#7e0505] transition"
            onClick={() => setIsPopupOpen(true)}
          >
            <FaPlus className="w-3 h-3 text-white" />
            <span className="text-white text-sm">Add New Venue</span>
          </div>

          <p className="text-sm text-gray-600">
            Please make sure the current event record is complete. Only one event can exist at a time and a new event will replace the previous one.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full">
        {data.events.map((event) => (
          <div key={event.id} className="flex flex-col md:flex-row justify-between p-4 sm:p-6 gap-4 md:gap-6 w-full bg-white border border-[#D4D4D4] shadow rounded-2xl cursor-pointer">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-green-500 to-green-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm font-medium">EV</span>
              </div>
              <div className="flex flex-col justify-center gap-1 sm:gap-2">
                <span className="font-semibold text-lg sm:text-xl text-[#282828]">{event.name}</span>
                <span className="text-sm sm:text-base text-[#424242] truncate max-w-[250px] sm:max-w-[400px]">{event.description}</span>
              </div>
            </div>

            <div className="flex flex-col md:items-end gap-2 sm:gap-3 mt-3 md:mt-0">
              <span className="bg-[#F0F0F0] px-3 sm:px-4 py-1 rounded-full font-semibold text-base sm:text-lg text-[#282828]">{event.totalSessions} Sessions</span>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  className="px-4 sm:px-8 py-1 bg-[#9B2033] text-white rounded-2xl hover:bg-[#7e0505] transition cursor-pointer"
                  onClick={() => handleDelete(event.id)}
                  disabled={deleteLoadingId === event.id}
                >
                  {deleteLoadingId === event.id ? 'Deleting...' : 'Delete'}
                </button>

                <button
                  className="px-4 sm:px-8 py-1 border border-[#8C8C8C] rounded-2xl hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => handleEdit(event.id)}
                >
                  Edit
                </button>

              <Link
  href="/Organizer/EventDetail"
  className="px-4 sm:px-8 py-1 border border-[#8C8C8C] rounded-2xl hover:bg-gray-50 transition cursor-pointer"
>
  View Detail
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
