"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaCrown, FaMedal } from 'react-icons/fa'
import { FaMapLocationDot, FaShop } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import { RootState } from "@/lib/store/store"
import api from '@/config/api'
import Image from 'next/image'

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/event/eventsrelatedsponsers/${eventId}`)
        const sponsors = res.data.sponsors.map((s: SponsorExhibitor) => ({
          ...s,
          category: s.category?.toLowerCase() === 'gold' ? 'Gold Sponsor' : 'Silver Sponsor'
        }))
        setData({ sponsors, exhibitors: res.data.exhibitors })
      } catch (err) {
        console.error(err)
      }
    }
    if (eventId) fetchData()
  }, [eventId])

  const filteredSponsors = data.sponsors.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const goldSponsors = filteredSponsors.filter(item => item.category === 'Gold Sponsor')
  const silverSponsors = filteredSponsors.filter(item => item.category === 'Silver Sponsor')
  const exhibitors = data.exhibitors.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto relative">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <div className="flex items-center gap-3">
          <Link href="/participants/Home">
            <FaArrowLeft className="text-red-800 w-5 h-5 cursor-pointer" />
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-black">Sponsors & Exhibitors</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="flex items-center border border-gray-300 rounded-lg px-2 py-1 gap-2 w-full sm:w-56 md:w-64">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none text-black w-full text-sm"
            />
          </div>
          {['All', 'Gold Sponsor', 'Silver Sponsor', 'Exhibitor'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 md:px-5 py-1 md:py-2 rounded-lg font-medium text-sm ${
                selectedCategory === cat ? 'bg-red-600 text-white' : 'border border-gray-300 text-black'
              }`}
            >
              {cat === 'Gold Sponsor' ? 'Gold Sponsors' : cat === 'Silver Sponsor' ? 'Silver Sponsors' : cat}
            </button>
          ))}
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
                <div className="bg-white border border-gray-300 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row gap-3 sm:gap-4 h-full cursor-pointer hover:shadow-md transition">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 ${
                      index === 0
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                        : 'bg-gradient-to-r from-purple-500 to-purple-600'
                    } rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white font-bold text-lg">{sponsor.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <h3 className="text-md md:text-lg font-semibold mb-1 text-black">{sponsor.name}</h3>
                    <p className="text-black text-sm md:text-sm">{sponsor.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Silver Sponsors */}
      {silverSponsors.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FaMedal className="text-gray-400 w-5 h-5" />
            <h2 className="text-lg md:text-xl font-bold text-black">Silver Sponsors</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {silverSponsors.map((sponsor, index) => (
              <Link href={`/participants/SponsorsDetailsScreen/${sponsor.id}`} key={sponsor.id}>
                <div className="bg-white border border-gray-300 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row gap-3 sm:gap-4 h-full cursor-pointer hover:shadow-md transition">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 ${
                      index === 0
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : 'bg-gradient-to-r from-orange-500 to-orange-600'
                    } rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white font-bold text-lg">{sponsor.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <h3 className="text-md md:text-lg font-semibold mb-1 text-black">{sponsor.name}</h3>
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
                  <div className="w-full bg-white border border-gray-300 rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between h-full">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-bold text-md">{exhibitor.name.charAt(0)}</span>
                      </div>
                      <h3 className="text-sm md:text-md font-semibold text-black">{exhibitor.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 mb-1 text-xs md:text-sm">
                      <FaMapLocationDot className="text-red-500" />
                      <span className="font-semibold text-black">{exhibitor.location}</span>
                    </div>
                    <p className="text-xs md:text-sm text-black">{exhibitor.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-6">
        <Image src="/images/line.png" alt="Line" width={1360} height={127} className="w-full" />
      </div>
    </div>
  )
}

export default SponsorsExhibitorsPage
