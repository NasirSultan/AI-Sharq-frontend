"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaCrown, FaMedal } from 'react-icons/fa'
import { FaMapLocationDot, FaShop } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import { RootState } from "@/lib/store/store"
import api from '@/config/api'
import Image from 'next/image'
import { useMemo } from 'react'

interface SponsorExhibitor {
  id: number
  name: string
  category: string | null
  description: string
  logoUrl?: string
  hall?: string
  link?: string
  location?: string
}

const SponsorsExhibitorsPage: React.FC = () => {
  const eventId = useSelector((state: RootState) => state.event.id)
  const [data, setData] = useState<{ sponsors: SponsorExhibitor[]; exhibitors: SponsorExhibitor[] }>({
    sponsors: [],
    exhibitors: []
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!eventId) return

    let isMounted = true

    // Check if cached data exists
    const cachedData = localStorage.getItem(`sponsorsExhibitors-${eventId}`)
    if (cachedData) {
      setData(JSON.parse(cachedData))
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/event/eventsrelatedsponsers/${eventId}`)

        const sponsors = res.data.sponsors.map((s: SponsorExhibitor) => ({
          ...s,
          category: s.category?.toLowerCase() === 'gold' ? 'Gold Sponsor' : 'Silver Sponsor'
        }))

        const fetchedData = { sponsors, exhibitors: res.data.exhibitors }
        if (!isMounted) return
        setData(fetchedData)

        // Cache for future navigations
        localStorage.setItem(`sponsorsExhibitors-${eventId}`, JSON.stringify(fetchedData))
      } catch (err) {
        console.error(err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchData()
    return () => { isMounted = false }
  }, [eventId])


  const filteredSponsors = useMemo(() => {
    return data.sponsors.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [data.sponsors, selectedCategory, searchTerm])
  const goldSponsors = useMemo(() => filteredSponsors.filter(item => item.category === 'Gold Sponsor'), [filteredSponsors])
  const silverSponsors = useMemo(() => filteredSponsors.filter(item => item.category === 'Silver Sponsor'), [filteredSponsors])
  const exhibitors = useMemo(() => data.exhibitors.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())), [data.exhibitors, searchTerm])
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <>
    <div className="p-4 md:p-6 max-w-6xl mx-auto relative">
      {/* Header */}
      <div className="flex flex-col mb-6 gap-3">
        {/* Header with back button */}
        <div className="flex items-center gap-3">
          <Link href="/participants/Home">
            <FaArrowLeft className="text-red-900 w-5 h-5 cursor-pointer" />
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-black">Sponsors & Exhibitors</h1>
        </div>

        {/* Search input row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3 w-full">
          {/* Search input */}
          <div className="flex-1">
            <div className="flex items-center border border-gray-300 rounded-lg px-2 py-2 gap-2 w-full">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="outline-none text-black w-full text-sm"
              />
            </div>
          </div>

          {/* Category buttons */}
          <div className="flex flex-wrap gap-2 md:gap-3 mt-2 md:mt-0 md:ml-4">
            {['All', 'Gold Sponsor', 'Silver Sponsor', 'Exhibitor'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 md:px-5 py-1 md:py-2 rounded-lg font-medium text-sm whitespace-nowrap ${selectedCategory === cat ? 'bg-red-900 text-white' : 'border border-gray-300 text-black'
                  }`}
              >
                {cat === 'Gold Sponsor' ? 'Gold Sponsors' : cat === 'Silver Sponsor' ? 'Silver Sponsors' : cat}
              </button>
            ))}
          </div>
        </div>

      </div>


      {/* Gold Sponsors */}
      {goldSponsors.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FaCrown className="text-yellow-500 w-5 h-5" />
            <h2 className="text-lg md:text-xl font-bold text-black">Gold Sponsors</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {goldSponsors.map((sponsor, index) => (
              <Link href={`/participants/SponsorsDetailsScreen/${sponsor.id}`} key={sponsor.id}>
                <div className="bg-white border border-gray-300 rounded-2xl p-3 sm:p-4 shadow-sm grid grid-cols-[auto_1fr] gap-4 items-center cursor-pointer hover:shadow-md transition">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 ${index === 0
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                      : 'bg-gradient-to-r from-purple-500 to-purple-600'
                      } rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white font-bold text-lg">{sponsor.name.charAt(0)}</span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-md md:text-lg font-semibold text-black">{sponsor.name}</h3>
                    <p className="text-black text-sm md:text-sm">{sponsor.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {silverSponsors.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FaMedal className="text-gray-400 w-5 h-5" />
            <h2 className="text-lg md:text-xl font-bold text-black">Silver Sponsors</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {silverSponsors.map((sponsor, index) => (
              <Link href={`/participants/SponsorsDetailsScreen/${sponsor.id}`} key={sponsor.id}>
                <div className="bg-white border border-gray-300 rounded-2xl p-3 sm:p-4 shadow-sm grid grid-cols-[auto_1fr] gap-4 items-center cursor-pointer hover:shadow-md transition">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 ${index === 0
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600'
                      } rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white font-bold text-lg">{sponsor.name.charAt(0)}</span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-md md:text-lg font-semibold text-black">{sponsor.name}</h3>
                    <p className="text-black text-sm md:text-sm">{sponsor.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}


      {/* Exhibitors */}
      {exhibitors.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FaShop className="text-green-500 w-5 h-5" />
            <h2 className="text-lg md:text-xl font-bold text-black">Exhibitors</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exhibitors.map((exhibitor, index) => {
              const colors = ['bg-[#FF8A65]', 'bg-[#4DB6AC]', 'bg-[#9575CD]', 'bg-[#EC4899]']
              const colorClass = colors[index % colors.length]
              return (
                <Link href={`/participants/ExhibitorsDetailsScreen/${exhibitor.id}`} key={exhibitor.id}>
                  <div className="w-full bg-white border border-gray-300 rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col h-full">

                    {/* Top row: circle + name on left, description on right */}
                   <div className="flex flex-col mb-2">
  {/* Top row: circle + name */}
  <div className="flex items-center gap-2">
    <div className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center flex-shrink-0`}>
      <span className="text-white font-bold text-md">{exhibitor.name.charAt(0)}</span>
    </div>
    <h3 className="text-sm md:text-md font-semibold text-black">{exhibitor.name}</h3>
  </div>

  {/* Second row: location */}
  <div className="flex items-center gap-1 mt-1 text-xs md:text-sm">
    <FaMapLocationDot className="text-red-500" />
    <span className="font-semibold text-black">{exhibitor.location}</span>
  </div>
</div>


                    {/* Location below */}
                    <div className="flex items-center gap-1 text-xs md:text-sm">
                      <p className="text-xs md:text-sm text-black max-w-[50%] text-right">{exhibitor.description}</p>
                    </div>

                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      
    </div>
 <div className="mt-6">
        <Image src="/images/line.png" alt="Line" width={1760} height={127} className="w-full" />
      </div>
</>
)
}

export default SponsorsExhibitorsPage
