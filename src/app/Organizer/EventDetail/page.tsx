'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaMapMarkerAlt, FaBuilding, FaUsers, FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import api from '@/config/api'
import EventLocationMap from '../../components/EventLocationMap'
import { RootState } from '@/store'

interface Sponsor {
  id: number
  name: string
  description: string
  Pic_url?: string
}

interface Exhibitor {
  id: number
  name: string
  description: string
  picUrl?: string
}

interface Event {
  id: number
  title: string
  description: string
  location: string
  sponsors: Sponsor[]
  exhibitors: Exhibitor[]
}

export default function EventDetail() {
  const router = useRouter()
  const eventId = useSelector((state: RootState) => state.event.id)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (eventId) fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    try {
      const response = await api.get<Event>(`/event/${eventId}`)
      setEvent(response.data)
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!event) {
    return <div className="p-6 text-center text-lg">Event not found</div>
  }

  const renderImage = (url: string | undefined, type: 'sponsor' | 'exhibitor') => {
    const isValid = url?.startsWith('https://al-sharq.fra1.digitaloceanspaces.com/')
    if (isValid) {
      return (
        <img
          src={url}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      )
    }
    return type === 'sponsor'
      ? <FaUsers className="text-blue-500 text-2xl" />
      : <FaBuilding className="text-green-500 text-2xl" />
  }

  return (
    <div className="min-h-screen w-full px-4 md:px-8 py-8 max-w-6xl mx-auto space-y-6">

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-3 text-red-900 font-semibold mb-4 text-xl cursor-pointer"
      >
        <FaArrowLeft className="w-6 h-6" /> Venue Detail
      </button>

      {/* Event Info */}
      <div className="bg-white shadow rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-3">
          <h1 className="text-3xl font-semibold text-red-900">{event.title}</h1>
          <p className="text-lg text-[#333]">{event.description}</p>
         <p className="text-base text-[#555] flex items-center gap-2">
  <FaMapMarkerAlt className="text-red-900" /> {event.location}
</p>

        </div>
      </div>

      {/* Map */}
      <EventLocationMap />

      {/* Sponsors */}
      <div className="space-y-2 mt-4">
        <h2 className="text-2xl font-semibold text-black flex items-center gap-2">
        Sponsors
        </h2>
        <div className="flex flex-wrap -mx-2">
          {event.sponsors.map((item) => (
            <div key={item.id} className="w-full sm:w-full md:w-1/2 px-2 mb-4">
              <div className="bg-white border border-[#D4D4D4] rounded-2xl shadow p-4 flex items-center gap-4 w-full">
                <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center border-2 border-red-900 transition-all hover:border-red-700">
                  {renderImage(item.Pic_url, 'sponsor')}
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-lg font-semibold text-[#282828]">{item.name}</p>
                  <p className="text-sm text-[#555]">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exhibitors */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-black flex items-center gap-2">
          Exhibitors
        </h2>
        <div className="flex flex-wrap -mx-2">
          {event.exhibitors.map((item) => (
            <div key={item.id} className="w-full sm:w-full md:w-1/2 px-2 mb-4">
              <div className="bg-white border border-[#D4D4D4] rounded-2xl shadow p-4 flex items-center gap-4 w-full">
                <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center border-2 border-red-900 transition-all hover:border-red-700">
                  {renderImage(item.picUrl, 'exhibitor')}
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-lg font-semibold text-[#282828]">{item.name}</p>
                  <p className="text-sm text-[#555]">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
