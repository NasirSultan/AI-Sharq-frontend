'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { FaGlobe, FaEnvelope, FaPhone, FaArrowLeft, FaLinkedin, FaTwitter, FaYoutube, FaMapMarkerAlt } from 'react-icons/fa'
import { FaShop } from 'react-icons/fa6'
import Link from 'next/link'
import api from '@/config/api'
import RelatedSessionsGrid from "@/app/components/relatedsession"
import { useRouter } from 'next/navigation'

interface Booth {
  id: number
  boothNumber: string
  boothLocation: string
  mapLink: string
  distance: number | null
  openTime: string
}

interface Representative {
  id: number
  displayTitle: string
  user: {
    name: string
    photo: string | null
    organization: string
  }
}

interface Product {
  id: number
  title: string
  description: string
}

interface SocialMedia {
  name: string
  website: string
}

interface Exhibitor {
  id: number
  name: string
  picUrl: string
  description: string
  location: string
  website: string
  email: string
  phone: string
  socialMedia: SocialMedia[]
  contacts: { name: string; email: string; phone: string }[]
  products: Product[]
  representatives: Representative[]
  booths: Booth[]
}

interface PageProps {
  params: Promise<{ id: string }>
}

interface DynamicMapCardProps {
  booth: Booth
}

// Dynamic Map Card Component with embedded map
const DynamicMapCard: React.FC<DynamicMapCardProps> = ({ booth }) => {
  // Extract Google Maps embed URL from the mapLink
  const getEmbedUrl = (mapLink: string): string => {
    try {
      // If it's already an embed URL, return as is
      if (mapLink.includes('/embed')) {
        return mapLink;
      }

      // If it's a Google Maps share link, convert to embed
      if (mapLink.includes('maps.app.goo.gl') || mapLink.includes('google.com/maps')) {
        // Extract place ID or coordinates and create embed URL
        const url = new URL(mapLink);
        const placeId = url.searchParams.get('q') || url.pathname.split('/').pop();

        if (placeId) {
          return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(placeId)}&zoom=15`;
        }
      }

      // Fallback: Use the original link in an iframe (may not work for all sites)
      return mapLink;
    } catch {
      // Fallback to a default map or the original link
      return mapLink;
    }
  }

  const handleViewFullMap = () => {
    window.open(booth.mapLink, '_blank', 'noopener,noreferrer');
  }

  return (
   <div className="mb-8 sm:mb-10">
  <h2 className="text-xl sm:text-2xl font-medium text-[#282828] mb-6">Booth Location</h2>

  <div className="w-full flex flex-col sm:flex-row gap-6">
    {/* Column 1: Booth Details */}
   <div className="flex-1 bg-white border border-gray-300 shadow-sm rounded-2xl p-6 flex flex-col justify-center">
  <div className="flex items-center gap-2 mb-2 justify-center">
    <FaMapMarkerAlt className="text-[#9B2033] text-lg" />
    <h3 className="text-lg font-semibold text-[#282828]">Booth {booth.boothNumber}</h3>
  </div>
  <p className="text-[#424242] mb-1 text-center">{booth.boothLocation}</p>
  {booth.openTime && (
    <p className="text-sm text-gray-600 mb-1 text-center">
      <span className="font-medium">Open:</span> {booth.openTime}
    </p>
  )}
  <p className="text-sm text-gray-600 mb-1 text-center">
    <span className="font-medium">Distance:</span> {booth.distance || 10}m
  </p>
</div>


    {/* Column 2: Map */}
    <div
      className="flex-1 bg-white border border-gray-300 shadow-sm rounded-2xl overflow-hidden relative h-64 sm:h-auto cursor-pointer"
      onClick={handleViewFullMap}
    >
      <img
        src="https://static0.anpoimages.com/wordpress/wp-content/uploads/2022/07/googleMapsTricksHero.jpg"
        alt={`Booth ${booth.boothNumber} Location`}
        className="w-full h-full object-cover"
      />
    </div>
  </div>
</div>


  )
}

// Alternative Simple Map Card if embed doesn't work well
const SimpleMapCard: React.FC<DynamicMapCardProps> = ({ booth }) => {
  const handleViewMap = () => {
    window.open(booth.mapLink, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-medium text-[#282828]">Booth Location</h2>
      </div>

      <div className="w-full bg-white border border-gray-300 shadow-sm rounded-2xl overflow-hidden">
        {/* Map Preview */}
        <div
          className="w-full h-64 sm:h-80 md:h-96 bg-gray-100 relative cursor-pointer"
          onClick={handleViewMap}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
            <div className="text-center">
              <FaMapMarkerAlt className="text-[#9B2033] text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#282828] mb-2">Booth {booth.boothNumber}</h3>
              <p className="text-gray-600 mb-4">{booth.boothLocation}</p>
              <button className="px-6 py-2 bg-[#9B2033] text-white rounded-lg font-medium hover:bg-[#8a1c2e] transition-colors">
                View on Map
              </button>
            </div>
          </div>
        </div>

        {/* Booth Info */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[#424242] font-medium">{booth.boothLocation}</p>
              {booth.openTime && (
                <p className="text-sm text-gray-600">Open: {booth.openTime}</p>
              )}
            </div>
            <button
              onClick={handleViewMap}
              className="flex items-center gap-2 text-[#9B2033] font-medium hover:text-[#8a1c2e] transition-colors"
            >
              <FaGlobe className="text-lg" />
              Open in Maps
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Map social names to icons and brand colors
const socialMap: Record<string, { icon: any; color: string }> = {
  linkedin: { icon: FaLinkedin, color: '#0A66C2' },
  twitter: { icon: FaTwitter, color: '#1DA1F2' },
  youtube: { icon: FaYoutube, color: '#FF0000' },
}

const ExhibitorDetailsScreen: React.FC<PageProps> = ({ params }) => {
    const router = useRouter()
  const [exhibitor, setExhibitor] = useState<Exhibitor | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [useEmbeddedMap, setUseEmbeddedMap] = useState(true)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const fetchExhibitor = async () => {
      const resolvedParams = await params
      try {
        const res = await api.get(`/exhibiteros/${resolvedParams.id}/details`)
        setExhibitor(res.data)
      } catch {
        setExhibitor(null)
      } finally {
        setLoading(false)
      }
    }
    fetchExhibitor()
  }, [params])

  if (loading) return (
     <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
  )

  if (!exhibitor) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">No exhibitor found</p>
    </div>
  )

  const firstBooth = exhibitor.booths.length > 0 ? exhibitor.booths[0] : undefined

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 bg-cover bg-center"
        style={{ backgroundImage: `url(${exhibitor.picUrl})` }}>

      <div
  className="absolute w-10 h-10 left-4 sm:left-6 top-4 sm:top-6 rounded-full flex items-center justify-center cursor-pointer bg-white/80 hover:bg-white transition-colors"
  onClick={() => router.back()}
>
  <FaArrowLeft className="text-red-800 w-5 h-5" />
</div>

        <div className="absolute flex flex-row justify-center items-center gap-2 right-4 sm:right-6 top-4 sm:top-6 w-auto px-4 py-2 h-9 bg-[#FFFEEF] rounded-full">
          <FaShop className="text-green-400 w-5 h-4" />
          <span className="text-[#282828] font-medium text-sm sm:text-base lg:text-lg">Exhibitors</span>
        </div>
      </div>

      {/* Exhibitor Circle */}
      <div className="relative flex ml-10 justify-left -mt-20 sm:-mt-24 md:-mt-28">
        <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-full bg-gradient-to-r from-[#FB923C] to-[#EA580C] flex items-center justify-center">
          <div className="text-center px-2">
            <span className="font-medium text-white text-sm sm:text-base md:text-lg lg:text-xl whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] sm:max-w-[140px] md:max-w-[160px]">
              {exhibitor.name}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
 <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Contact Button */}
      
        {/* Info Panels */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8 sm:mb-10">
          {/* Description Panel */}
          <div className="flex-1 p-6 sm:p-8 bg-white border border-gray-300 shadow-sm rounded-2xl">
            <h2 className="text-lg sm:text-xl font-semibold text-[#282828] mb-4">{exhibitor.name}</h2>
            <p className="text-sm sm:text-base text-[#424242] leading-6 sm:leading-7">
              {exhibitor.description}
            </p>
          </div>

          {/* Contact Information Panel */}
          <div className="w-full lg:w-80 xl:w-96 p-6 sm:p-8 bg-white border border-gray-300 shadow-sm rounded-2xl">
            <h2 className="text-lg sm:text-xl font-semibold text-[#282828] mb-4 sm:mb-6">Contact Information</h2>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-row items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FaGlobe className="text-blue-600 text-sm sm:text-base" />
                </div>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <span className="text-sm font-medium text-gray-700">Website</span>
                  <a
                    href={exhibitor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 truncate hover:underline"
                  >
                    {exhibitor.website}
                  </a>
                </div>
              </div>

              <div className="flex flex-row items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-green-600 text-sm sm:text-base" />
                </div>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <span className="text-sm font-medium text-gray-700">Email</span>
                  <a
                    href={`mailto:${exhibitor.email}`}
                    className="text-sm text-black truncate hover:underline"
                  >
                    {exhibitor.email}
                  </a>
                </div>
              </div>

              <div className="flex flex-row items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FaPhone className="text-purple-600 text-sm sm:text-base" />
                </div>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <span className="text-sm font-medium text-gray-700">Phone</span>
                  <a
                    href={`tel:${exhibitor.phone}`}
                    className="text-sm text-black hover:underline"
                  >
                    {exhibitor.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Representatives & Products */}
        <div className="flex flex-col xl:flex-row gap-6 mb-8 sm:mb-10">
          {/* Representatives */}
          <div className="flex-1 p-6 sm:p-8 lg:p-10 bg-white border border-gray-300 shadow-sm rounded-2xl">
            <h2 className="text-xl sm:text-2xl font-medium text-[#282828] mb-6 sm:mb-8">Representatives</h2>
            <div className="space-y-4">
              {exhibitor.representatives.length > 0 ? (
                exhibitor.representatives.map(rep => (
                  <div key={rep.id} className="w-full p-4 bg-white border border-gray-200 shadow-sm rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex flex-row items-center gap-3">
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                        <Image
                          src={rep.user.photo || '/images/img (13).png'}
                          alt={rep.user.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-base font-medium text-[#282828] truncate">{rep.user.name}</span>
                        <span className="text-sm text-gray-600 truncate">{rep.user.organization}</span>
                      </div>
                    </div>
                    <span className="text-base font-medium text-red-700 cursor-pointer hover:text-red-800 transition-colors sm:self-start">
                      Connect
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No representatives available</p>
              )}
            </div>
          </div>

          {/* Products & Services */}
          <div className="flex-1 p-6 sm:p-8 lg:p-10 bg-white border border-gray-300 shadow-sm rounded-2xl">
            <h2 className="text-xl sm:text-2xl font-medium text-[#282828] mb-6 sm:mb-8">Products & Services</h2>
            <div className="space-y-4">
              {exhibitor.products.map(prod => (
                <div key={prod.id} className="w-full p-4 bg-white border border-gray-200 shadow-sm rounded-lg flex flex-row items-center gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FaGlobe className="text-blue-600 text-sm sm:text-base" />
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="text-base font-medium text-[#282828] truncate">{prod.title}</span>
                    <span className="text-sm text-gray-600 line-clamp-2">{prod.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Map Card */}
        {mounted && firstBooth && (
          <DynamicMapCard booth={firstBooth} />
        )}

        {/* Sessions */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            {/* <h2 className="text-xl sm:text-2xl font-medium text-[#282828]">Sessions Sponsored</h2> */}
            
          </div>
          {/* <RelatedSessionsGrid /> */}
        </div>

        {/* Social Media */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8">
          {exhibitor.socialMedia.map(sm => {
            const key = sm.name.toLowerCase()
            const social = socialMap[key]
            if (!social) return null
            const Icon = social.icon
            return (
              <a
                key={sm.name}
                href={sm.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-12 rounded-lg flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: social.color }}
              >
                <Icon className="text-white text-lg" />
                <span className="text-base font-normal text-white">{sm.name}</span>
              </a>
            )
          })}
        </div>
      </div>

      {/* Bottom Image */}
      <div className="w-full overflow-hidden">
        <Image
          src="/images/line.png"
          alt="Decoration"
          width={1729}
          height={127}
          className="w-full h-auto"
        />
      </div>
    </div>
  )
}

export default ExhibitorDetailsScreen