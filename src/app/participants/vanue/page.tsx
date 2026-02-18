'use client'

import React, { useState, useEffect, useRef } from 'react'
import { FaCalendar, FaClock, FaPlay } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import api from '@/config/api'
import { setEventId } from '@/lib/store/features/event/eventSlice'

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
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DataType>({
    totalSessions: 0,
    liveSessions: 0,
    scheduledSessions: 0,
    events: [],
  })
  const [searchText, setSearchText] = useState('')

  // Fetch API (with localStorage caching)
  useEffect(() => {
    const cached = localStorage.getItem('eventSummary')
    if (cached) {
      setData(JSON.parse(cached))
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const res = await api.get('/event/summary/mapview')
        setData(res.data)
        localStorage.setItem('eventSummary', JSON.stringify(res.data))
        if (res.data.events?.length) {
          localStorage.setItem('eventLocation', res.data.events[0].googleMapLink)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Extract coordinates from Google Maps link
  const extractCoordinates = (link: string) => {
    let match = link.match(/@([\d.-]+),([\d.-]+)/)
    if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) }
    match = link.match(/[?&]q=([\d.-]+),([\d.-]+)/)
    if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) }
    match = link.match(/ll=([\d.-]+),([\d.-]+)/)
    if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) }
    return null
  }

  // Lazy load Mapbox (only first event)
  useEffect(() => {
    if (!mapRef.current || data.events.length === 0) return

    const loadMapbox = async () => {
      if (!(window as any).mapboxgl) {
        const script = document.createElement('script')
        script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js'
        script.async = true
        document.body.appendChild(script)

        const link = document.createElement('link')
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css'
        link.rel = 'stylesheet'
        document.head.appendChild(link)

        await new Promise(resolve => (script.onload = resolve))
      }

      const mapboxgl = (window as any).mapboxgl
      mapboxgl.accessToken = 'pk.eyJ1Ijoicml6aWVhZ2xpbmVzIiwiYSI6ImNtaGc3aGt4bjBlb2YycnNjbDBldnh3ejUifQ.sAY7q13HBaq80LoOUAT0oQ'

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }

      const firstEvent = data.events[0]
      const coords = extractCoordinates(firstEvent.googleMapLink) || { lat: 31.5204, lng: 74.3587 }

      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [coords.lng, coords.lat],
        zoom: 12,
      })

      // Marker for first event
      const marker = new mapboxgl.Marker({ color: '#EF4444' })
        .setLngLat([coords.lng, coords.lat])
        .addTo(map)

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false,
        className: 'permanent-popup',
      })
        .setLngLat([coords.lng, coords.lat])
        .setHTML(`<div style="font-weight:600;cursor:pointer;font-size:14px;">${firstEvent.name}</div>`)
        .setMaxWidth('200px')
        .addTo(map)

      const handleClick = () => {
        localStorage.setItem('eventLocation', firstEvent.googleMapLink)
        localStorage.setItem('eventId', String(firstEvent.id))
        dispatch(setEventId(firstEvent.id))
        router.push('/participants/Home')
      }

      marker.getElement().addEventListener('click', handleClick)
      const popupElement = popup.getElement()
      if (popupElement) popupElement.addEventListener('click', handleClick)

      mapInstanceRef.current = map
    }

    loadMapbox()

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
        } catch {}
        mapInstanceRef.current = null
      }
    }
  }, [data, dispatch, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    )
  }

  const filteredEvents = data.events.filter(event =>
    event.name.toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <div className="flex flex-col items-center w-full max-w-[1080px] mx-auto px-4 py-8 gap-8">
      {/* Stats Cards */}
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

      {/* Map */}
      <div ref={mapRef} className="w-full h-[500px] rounded-2xl border border-gray-300" />

      {/* Search */}
      <div className="w-full">
        <div className="flex items-center p-3 border border-[#E8E8E8] rounded-2xl bg-white">
          <FiSearch className="w-6 h-6 text-red-500 mr-3" />
          <input
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="Search Venue by Name"
            className="w-full border-none outline-none text-[#706f6f] text-base"
          />
        </div>
      </div>

      {/* Event List */}
      <div className="flex flex-col gap-6 w-full">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div
              key={event.id}
              onClick={() => {
                localStorage.setItem('eventLocation', event.googleMapLink)
                localStorage.setItem('eventId', String(event.id))
                dispatch(setEventId(event.id))
                router.push('/participants/Home')
              }}
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
