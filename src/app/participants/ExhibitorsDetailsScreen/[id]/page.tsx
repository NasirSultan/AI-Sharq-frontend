'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { FaGlobe, FaEnvelope, FaPhone, FaArrowLeft, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa'
import { FaShop } from 'react-icons/fa6'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import api from '@/config/api'
import RelatedSessionsGrid from "@/app/components/relatedsession"

const LiveLocation = dynamic(() => import('@/app/components/LiveLocation'), { ssr: false })

interface Booth {
  id: number
  boothNumber: string
  boothLocation: string
  mapLink: string
  distance: number
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

// Map social names to icons and brand colors
const socialMap: Record<string, { icon: any; color: string }> = {
  linkedin: { icon: FaLinkedin, color: '#0A66C2' },
  twitter: { icon: FaTwitter, color: '#1DA1F2' },
  youtube: { icon: FaYoutube, color: '#FF0000' },
}

const ExhibitorDetailsScreen: React.FC<PageProps> = ({ params }) => {
  const [exhibitor, setExhibitor] = useState<Exhibitor | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

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

  if (loading) return <p>Loading...</p>
  if (!exhibitor) return <p>No exhibitor found</p>

  const firstBooth = exhibitor.booths.length > 0 ? exhibitor.booths[0] : undefined

  return (
    <div className="relative w-full h-screen">
      {/* Header */}
<div
  className="absolute w-[1440px] h-[231px] bg-cover bg-center"
  style={{ backgroundImage: `url(${exhibitor.picUrl})` }}
>

        <div className="absolute w-[40px] h-[40px] left-[20px] top-[20px] rounded-full flex items-center justify-center cursor-pointer">
          <Link href="/participants/Sponsors&Exhibitors">
            <FaArrowLeft className="text-red-800 w-[20px] h-[20px]" />
          </Link>
        </div>
        <div className="absolute flex flex-row justify-center items-center gap-2 left-[1149px] top-[39px] w-[211px] h-[37px] bg-[#FFFEEF] rounded-full px-3 py-2">
          <FaShop className="text-green-400 w-[20px] h-[16px]" />
          <span className="text-[#282828] font-medium text-2xl">Exhibitors</span>
        </div>
      </div>

      {/* Exhibitor Circle */}
      <div className="absolute w-[177px] h-[177px] top-[140px]" style={{ left: 'calc(50% - 177px/2 - 550px)' }}>
        <div className="absolute w-[177px] h-[177px] left-0 top-0 rounded-full" style={{ background: 'linear-gradient(90deg, #FB923C 0%, #EA580C 100%)' }} />
        <div className="absolute w-[119px] h-[17px] left-[29px] top-[80px] flex items-center justify-center">
          <span className="font-medium text-black">{exhibitor.name}</span>
        </div>
      </div>

      <div className="absolute w-[1280px] h-auto left-[80px] top-[351px] flex flex-col gap-11">
        <button className="w-44 h-12 bg-[#9B2033] text-white rounded-md font-medium text-base mb-4 p-3 flex items-center justify-center">
          Contact Exhibitor
        </button>

        {/* Info Panels */}
        <div className="flex flex-row gap-5 w-full">
          <div className="w-[940px] h-auto p-8 bg-white border border-gray-300 shadow-sm rounded-2xl flex flex-col gap-6">
            <h2 className="text-lg font-semibold text-[#282828]">{exhibitor.name}</h2>
            <p className="text-sm text-[#424242] leading-5">{exhibitor.description}</p>
          </div>

          <div className="w-[325px] h-auto p-8 bg-white border border-gray-300 shadow-sm rounded-2xl flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-[#282828]">Contact Information</h2>

            <div className="flex flex-row items-center gap-4">
              <div className="w-9 h-9 bg-blue-100 rounded-2xl flex items-center justify-center">
                <FaGlobe className="text-blue-600" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Website</span>
                <span className="text-sm text-blue-600">{exhibitor.website}</span>
              </div>
            </div>

            <div className="flex flex-row items-center gap-4">
              <div className="w-9 h-9 bg-green-100 rounded-2xl flex items-center justify-center">
                <FaEnvelope className="text-green-600" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <span className="text-sm text-black">{exhibitor.email}</span>
              </div>
            </div>

            <div className="flex flex-row items-center gap-4">
              <div className="w-9 h-9 bg-purple-100 rounded-2xl flex items-center justify-center">
                <FaPhone className="text-purple-600" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Phone</span>
                <span className="text-sm text-black">{exhibitor.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Representatives & Products */}
        <div className="flex flex-row gap-5 w-full">
          <div className="w-[625px] h-auto p-10 bg-white border border-gray-300 shadow-sm rounded-2xl flex flex-col gap-10">
            <h2 className="text-2xl font-medium text-[#282828]">Representatives</h2>
            <div className="flex flex-col gap-3">
              {exhibitor.representatives.map(rep => (
                <div key={rep.id} className="w-full h-18 p-4 bg-white border border-gray-200 shadow-sm rounded-lg flex flex-row justify-between items-center">
                  <div className="flex flex-row items-center gap-3">
                    <Image src={rep.user.photo || '/images/img (13).png'} alt={rep.user.name} width={40} height={40} className="rounded-full" />
                    <div className="flex flex-col gap-2">
                      <span className="text-base font-medium text-[#282828]">{rep.user.name}</span>
                      <span className="text-sm text-gray-600">{rep.user.organization}</span>
                    </div>
                  </div>
                  <span className="text-base font-medium text-red-700">Connect</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-[625px] h-auto p-10 bg-white border border-gray-300 shadow-sm rounded-2xl flex flex-col gap-10">
            <h2 className="text-2xl font-medium text-[#282828]">Products & Services</h2>
            <div className="flex flex-col gap-3">
              {exhibitor.products.map(prod => (
                <div key={prod.id} className="w-full h-16 p-4 bg-white border border-gray-200 shadow-sm rounded-lg flex flex-row items-center gap-4">
                  <div className="w-9 h-9 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <FaGlobe className="text-blue-600" />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-base font-medium text-[#282828]">{prod.title}</span>
                    <span className="text-sm text-gray-600">{prod.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Location */}
        {mounted && firstBooth && <LiveLocation booth={firstBooth} />}

        {/* Sessions */}
        <div className="flex flex-row justify-between items-center w-full mt-10">
          <h2 className="text-2xl font-medium text-[#282828]">Sessions Sponsored</h2>
          <span className="text-base font-medium text-[#282828] cursor-pointer">View All</span>
        </div>

        <RelatedSessionsGrid />

        {/* Social Media */}
        <div className="flex flex-row gap-6 mt-8">
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
        className="flex-1 h-12 rounded-lg flex items-center justify-center gap-3"
        style={{ backgroundColor: social.color }}
      >
        <Icon className="text-white" />
        <span className="text-base font-normal text-white">{sm.name}</span>
      </a>
    )
  })}
</div>

      </div>
  
  <Image src="/images/line.png" alt="Logo" width={1729} height={127} className="absolute bottom-[2300px]" />
  
    </div>
  )
}

export default ExhibitorDetailsScreen
