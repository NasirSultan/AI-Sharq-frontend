'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'
import api from '@/config/api'
import {
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaArrowLeft,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa'
import { FaShop } from 'react-icons/fa6'

const LiveLocation = dynamic(() => import('@/app/components/LiveLocation'), { ssr: false })

const socialMap: Record<string, { icon: any; color: string }> = {
  linkedin: { icon: FaLinkedin, color: '#0A66C2' },
  twitter: { icon: FaTwitter, color: '#1DA1F2' },
  youtube: { icon: FaYoutube, color: '#FF0000' },
}

const ExhibitorDetailsScreen: React.FC = () => {
  const exhibitorId = useSelector((state: RootState) => state.exhibitor.exhibitorId)
  const [exhibitor, setExhibitor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const fetchExhibitor = async () => {
      if (!exhibitorId) {
        setLoading(false)
        return
      }
      try {
        const res = await api.get(`/exhibiteros/${exhibitorId}/details`)
        setExhibitor(res.data)
      } catch {
        setExhibitor(null)
      } finally {
        setLoading(false)
      }
    }
    fetchExhibitor()
  }, [exhibitorId])

  if (loading) return <div className="text-center mt-10">Loading...</div>
  if (!exhibitor) return <div className="text-center mt-10">No exhibitor found</div>

  const firstBooth = exhibitor.booths?.[0]

  return (
    <div className="relative w-full min-h-screen bg-gray-50">
      {/* Header Section */}
      <div
        className="w-full h-60 sm:h-52 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${exhibitor.picUrl || '/images/building.jpg'})` }}
      >
        {/* Back Button */}
        <div className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md cursor-pointer">
          <Link href="/participants/Sponsors&Exhibitors">
            <FaArrowLeft className="text-red-800 w-5 h-5" />
          </Link>
        </div>

        {/* Exhibitor Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#FFFEEF] rounded-full px-3 py-1 shadow-sm">
          <FaShop className="text-green-500 w-5 h-5" />
          <span className="text-[#282828] font-medium text-lg sm:text-base">Exhibitors</span>
        </div>
      </div>

      {/* Gradient Circle for Name */}
      <div className="absolute top-[140px] left-4 w-44 h-44 flex items-center justify-center">
        <div
          className="w-full h-full rounded-full flex items-center justify-center text-center p-4"
          style={{ background: 'linear-gradient(90deg, #FB923C 0%, #EA580C 100%)' }}
        >
          <span className="text-white text-lg font-semibold">{exhibitor.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-28 flex flex-col gap-10">

        {/* About and Contact */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* About Section */}
          <div className="flex-1 bg-white border border-gray-300 shadow-sm rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-[#282828]">{exhibitor.name}</h2>
            <p className="text-sm text-[#424242] leading-5">{exhibitor.description}</p>
          </div>

          {/* Contact Info */}
          <div className="w-full lg:w-80 bg-white border border-gray-300 shadow-sm rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-[#282828]">Contact Information</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaGlobe className="text-blue-600" />
                </div>
                <a
                  href={exhibitor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {exhibitor.website || 'Website'}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                  <FaEnvelope className="text-green-600" />
                </div>
                <a
                  href={`mailto:${exhibitor.email}`}
                  className="text-sm text-black hover:underline"
                >
                  {exhibitor.email || 'Email'}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaPhone className="text-purple-600" />
                </div>
                <a
                  href={`tel:${exhibitor.phone}`}
                  className="text-sm text-black hover:underline"
                >
                  {exhibitor.phone || 'Phone'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Representatives and Products */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Representatives */}
          <div className="flex-1 bg-white border border-gray-300 shadow-sm rounded-2xl p-6 flex flex-col gap-6">
            <h2 className="text-2xl font-medium text-[#282828]">Representatives</h2>
            <div className="flex flex-col gap-3">
              {exhibitor.representatives?.map((rep: any, index: number) => (
                <div
                  key={index}
                  className="w-full p-3 bg-white border border-gray-200 shadow-sm rounded-lg flex items-center gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 relative">
                    <Image
                      src={rep.user.photo || '/images/default-profile.png'}
                      alt={rep.user.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-medium text-[#282828]">{rep.user.name}</span>
                    <span className="text-sm text-gray-600">{rep.user.organization}</span>
                  </div>
                  <div className="ml-auto">
                    <span className="text-base font-medium text-red-700 cursor-pointer">Connect</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="flex-1 bg-white border border-gray-300 shadow-sm rounded-2xl p-6 flex flex-col gap-6">
            <h2 className="text-2xl font-medium text-[#282828]">Products & Services</h2>
            <div className="flex flex-col gap-3">
              {exhibitor.products?.map((product: any, index: number) => (
                <div
                  key={index}
                  className="w-full p-3 bg-white border border-gray-200 shadow-sm rounded-lg flex items-center gap-3"
                >
                  <div className="w-9 h-9 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <FaGlobe className="text-blue-600" />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-base font-medium text-[#282828]">{product.title}</span>
                    <span className="text-sm text-gray-600">{product.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Location */}
        {mounted && firstBooth && (
          <div
            className="cursor-pointer"
            onClick={() => {
              const query = encodeURIComponent(firstBooth.boothLocation || firstBooth.boothNumber)
              window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
            }}
          >
            <LiveLocation booth={firstBooth} />
          </div>
        )}

        {/* Social Media */}
        <div className="flex flex-col w-full gap-4 mt-10">
          <h2 className="text-2xl font-medium text-[#282828] mb-2">Follow Us</h2>
          <div className="flex flex-row gap-3 w-full">
            {exhibitor.socialMedia?.map((sm: any) => {
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
                  className="flex-1 h-12 rounded-lg flex items-center justify-center gap-2"
                  style={{ backgroundColor: social.color }}
                >
                  <Icon className="text-white" />
                  <span className="text-white text-base">{sm.name}</span>
                </a>
              )
            })}
          </div>
        </div>

        {/* Divider Line */}
        <div className="w-full flex justify-center mt-8">
          <Image
            src="/images/line.png"
            alt="Line"
            width={1850}
            height={127}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}

export default ExhibitorDetailsScreen
