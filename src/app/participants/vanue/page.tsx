'use client'

import React, { useState, useEffect } from 'react'
import { FaArrowLeft, FaCalendar, FaClock, FaPlay } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import api from '@/config/api'
import { setEventId } from '@/lib/store/features/event/eventSlice'

const LiveLoaction3 = dynamic(() => import('@/app/components/LiveLoaction3'), { ssr: false })

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
  const dispatch = useDispatch()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DataType>({
    totalSessions: 0,
    liveSessions: 0,
    scheduledSessions: 0,
    events: [],
  })
  const [searchText, setSearchText] = useState('')

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

  if (loading) {
    return <div className="flex justify-center items-center h-[500px]">Loading...</div>
  }

  const handleCardClick = (eId: number) => {
    dispatch(setEventId(eId))
    router.push('/participants/Home')
  }

  const filteredEvents = data.events.filter((event) =>
    event.name.toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <div className="flex flex-col items-center w-full max-w-[1280px] mx-auto px-4 py-8 gap-8">

      <div className="grid xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 w-full">
        <div className="flex flex-col items-start p-5 gap-4 bg-white border border-[#E6E6E6] shadow rounded-2xl w-full">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-[#DBEAFE] rounded-2xl flex items-center justify-center">
              <FaCalendar className="w-5 h-7 text-[#2563EB]" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-4xl text-[rgba(0,0,0,0.7)]">{data.totalSessions}</span>
              <span className="text-base text-[#414141]">Total Sessions</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start p-5 gap-4 bg-white border border-[#E6E6E6] shadow rounded-2xl w-full">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-[#DCFCE7] rounded-2xl flex items-center justify-center">
              <FaPlay className="w-5 h-7 text-[#16A34A]" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-4xl text-[rgba(0,0,0,0.7)]">{data.liveSessions}</span>
              <span className="text-base text-[#414141]">Ongoing</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start p-5 gap-4 bg-white border border-[#E6E6E6] shadow rounded-2xl w-full">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-[#FEF9C3] rounded-2xl flex items-center justify-center">
              <FaClock className="w-5 h-7 text-[#CA8A04]" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-4xl text-[rgba(0,0,0,0.7)]">{data.scheduledSessions}</span>
              <span className="text-base text-[#414141]">Scheduled</span>
            </div>
          </div>
        </div>
      </div>

      <LiveLoaction3 />

      <div className="w-full">
        <div className="flex items-center p-3 border border-[#E8E8E8] rounded-2xl bg-white">
          <FiSearch className="w-6 h-6 text-red-500 mr-3" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search Venue by Name"
            className="w-full border-none outline-none text-[#706f6f] text-base"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => handleCardClick(event.id)}
              className="flex flex-row justify-between items-center p-6 bg-white border border-[#D4D4D4] shadow rounded-2xl cursor-pointer hover:bg-gray-50 transition w-full"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">EV</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-lg text-[#282828]">{event.name}</span>
                  <span className="text-sm text-[#424242]">{event.description}</span>
                </div>
              </div>
              <span className="bg-[#F0F0F0] px-4 py-1 rounded-full font-semibold text-sm text-[#282828]">
                {event.totalSessions} Sessions
              </span>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">No events found</div>
        )}
      </div>
    </div>
  )
}

export default VenueMaps
