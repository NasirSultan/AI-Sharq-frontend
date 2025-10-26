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
    <div className="flex flex-col items-end p-0 gap-8 w-full max-w-[1280px] h-auto absolute left-20 top-38">
      <div className="flex flex-row items-center p-0 gap-8 w-[1280px] h-6">
        <Link href="/Organizer/Dashboard">
          <FaArrowLeft className="w-9 h-9 text-[#7e0505]" />
        </Link>
        <h1 className="font-medium text-4xl leading-6 text-[#282828]">Venue Maps</h1>
      </div>

      <div className="flex flex-row items-start p-0 gap-6 w-[1280px] h-[103px]">
        <div className="flex flex-col items-start p-5 gap-8 w-[410.67px] h-[103px] bg-white border border-[#E6E6E6] shadow rounded-3xl">
          <div className="flex flex-row items-center p-0 gap-8 w-[356.67px] h-[63px]">
            <div className="w-12 h-12 bg-[#DBEAFE] rounded-2xl flex items-center justify-center">
              <FaCalendar className="w-5 h-7 text-[#2563EB]" />
            </div>
            <div className="flex flex-col items-start p-0 gap-4">
              <span className="font-semibold text-6xl leading-[50%] text-[rgba(0,0,0,0.7)]">{data.totalSessions}</span>
              <span className="font-normal text-lg leading-[140%] text-[#414141]">Total Sessions</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start p-5 gap-8 w-[410.67px] h-[103px] bg-white border border-[#E6E6E6] shadow rounded-3xl">
          <div className="flex flex-row items-center p-0 gap-8 w-[356.67px] h-[63px]">
            <div className="w-12 h-12 bg-[#DCFCE7] rounded-2xl flex items-center justify-center">
              <FaPlay className="w-5 h-7 text-[#16A34A]" />
            </div>
            <div className="flex flex-col items-start p-0 gap-4">
              <span className="font-semibold text-6xl leading-[50%] text-[rgba(0,0,0,0.7)]">{data.liveSessions}</span>
              <span className="font-normal text-lg leading-[140%] text-[#414141]">Ongoing</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start p-5 gap-8 w-[410.67px] h-[103px] bg-white border border-[#E6E6E6] shadow rounded-3xl">
          <div className="flex flex-row items-center p-0 gap-8 w-[356.67px] h-[63px]">
            <div className="w-12 h-12 bg-[#FEF9C3] rounded-2xl flex items-center justify-center">
              <FaClock className="w-5 h-7 text-[#CA8A04]" />
            </div>
            <div className="flex flex-col items-start p-0 gap-4">
              <span className="font-semibold text-6xl leading-[50%] text-[rgba(0,0,0,0.7)]">{data.scheduledSessions}</span>
              <span className="font-normal text-lg leading-[140%] text-[#414141]">Scheduled</span>
            </div>
          </div>
        </div>
      </div>

      <LiveLoaction3 />

      <div className="flex flex-row items-center p-0 gap-4 w-[1280px] h-11">
        <div className="flex flex-col justify-center items-center p-4 gap-2.5 w-[1280px] h-11 border border-[#E8E8E8] rounded-2xl">
          <div className="flex flex-row items-center p-0 gap-3 w-[1240px] h-6">
            <FiSearch className="w-6 h-6 text-red-500" />
            <span className="font-normal text-base leading-[140%] text-[#706f6f]">Search Venue</span>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center gap-8 w-[1280px] h-11">
        <div className="flex flex-row items-center gap-[1000px] w-[1282px] h-11">
          <div
            className="flex flex-col justify-center items-center p-4 w-[205px] h-11 bg-[#9B2033] border border-[#9B2033] rounded-2xl cursor-pointer"
            onClick={() => setIsPopupOpen(true)}
          >
            <div className="flex flex-row justify-center items-start gap-3">
              <FaPlus className="w-3 h-3 text-white" />
              <span className="font-normal text-sm text-white">Add New Venue</span>
            </div>
          </div>
          <span className="font-medium text-base leading-6 text-[#282828]">View All</span>
        </div>
      </div>

      <div className="flex flex-col items-start p-0 gap-6 w-[1280px] h-auto">
        {data.events.map((event) => (
          <div
            key={event.id}
            className="flex flex-row justify-between p-6 gap-6 w-[1280px] h-[213px] bg-white border border-[#D4D4D4] shadow rounded-3xl"
          >
            <div className="flex flex-row items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">EV</span>
              </div>
              <div className="flex flex-col justify-center gap-2">
                <span className="font-semibold text-lg text-[#282828]">{event.name}</span>
                <span className="font-normal text-sm text-[#424242]">{event.description}</span>
              </div>
            </div>

            <div className="flex flex-col justify-between items-end">
              <span className="bg-[#F0F0F0] px-4 py-1 rounded-full font-semibold text-lg text-[#282828]">
                {event.totalSessions} Sessions
              </span>
              <div className="flex flex-row gap-3">
                <button
                  className="flex justify-center items-center px-8 py-1 bg-[#9B2033] border border-[#9B2033] rounded-2xl text-white"
                  onClick={() => handleDelete(event.id)}
                  disabled={deleteLoadingId === event.id}
                >
                  {deleteLoadingId === event.id ? 'Deleting...' : 'Delete'}
                </button>

                <button
                  className="flex justify-center items-center px-8 py-1 border border-[#8C8C8C] rounded-2xl"
                  onClick={() => handleEdit(event.id)}
                >
                  <span className="font-bold text-sm text-[#282828]">Edit</span>
                </button>

                <Link
                  href={event.googleMapLink}
                  className="flex justify-center items-center px-8 py-1 border border-[#8C8C8C] rounded-2xl"
                >
                  <span className="font-bold text-sm text-[#282828]">View</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add new venue popup, no eventId passed here */}
      <AddNewVenuePopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />

      {/* Edit event popup, eventId passed only to the edit component */}
      {editPopup && selectedEventId && (
        <EditEvent isOpen={editPopup} onClose={() => setEditPopup(false)} eventId={selectedEventId} />
      )}
    </div>
  )
}

export default VenueMaps
