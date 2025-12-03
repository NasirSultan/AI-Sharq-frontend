'use client'

import React, { useEffect, useRef, useState } from 'react'

export default function EventLocationMap() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [mapLink, setMapLink] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = window.localStorage.getItem('eventLocation')
    if (saved) {
      setMapLink(saved)
    } else {
      setMapLink('https://maps.google.com/?q=31.5204,74.3587')
    }
  }, [])

  useEffect(() => {
    if (!mapLink || !mapRef.current) return

    const script = document.createElement('script')
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js'
    script.async = true

    const link = document.createElement('link')
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css'
    link.rel = 'stylesheet'

    document.head.appendChild(link)
    document.body.appendChild(script)

    script.onload = () => {
      initializeMap()
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [mapLink])

  const extractCoordinates = (link) => {
    const atMatch = link.match(/@([-\d.]+),([-\d.]+)/)
    if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) }

    const qMatch = link.match(/[?&]q=([-+\w\s%.,]+)/)
    if (qMatch) {
      const decoded = decodeURIComponent(qMatch[1])
      const coords = decoded.match(/([-\d.]+),([-\d.]+)/)
      if (coords) {
        return { lat: parseFloat(coords[1]), lng: parseFloat(coords[2]) }
      }
      return { query: decoded }
    }

    return null
  }

  const initializeMap = async () => {
    if (!window.mapboxgl) return



    const mapData = extractCoordinates(mapLink)
    if (!mapData) {
      setIsLoading(false)
      return
    }

    let center = [74.3587, 31.5204]

    if (mapData.lat && mapData.lng) {
      center = [mapData.lng, mapData.lat]
    }

    if (mapData.query) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            mapData.query
          )}.json?access_token=${window.mapboxgl.accessToken}`
        )
        const data = await response.json()
        if (data.features && data.features.length > 0) {
          center = data.features[0].center
        }
      } catch (error) {
        console.error('Geocoding error:', error)
      }
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
    }

    const map = new window.mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: 14,
    })

    new window.mapboxgl.Marker({ color: '#EF4444' })
      .setLngLat(center)
      .addTo(map)

    mapInstanceRef.current = map
    setIsLoading(false)
  }

  if (!mapLink) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center text-red-900 py-10">
          No location found
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto sm:p-6 md:p-0 sm:m-2">
      <div className="relative w-full h-83 rounded-2xl border border-gray-300 overflow-hidden bg-gray-100">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="text-gray-600">Loading map...</div>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />
      </div>

      <div className="mt-2 text-sm text-red-900">
        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  )
}
