"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { FaGlobe, FaEnvelope, FaPhone, FaArrowLeft, FaCrown } from 'react-icons/fa'
import { FaLinkedin, FaTwitter, FaYoutube,FaMobileAlt, FaLaptop, FaCamera, FaTv, FaHeadphones } from 'react-icons/fa'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import api from '@/config/api'

const SponsorsDetailsScreen: React.FC = () => {
  const searchParams = useSearchParams()
  const sponsorId = searchParams.get('sponsorId')
  const [sponsor, setSponsor] = useState<any>(null)
  const [sessions, setSessions] = useState<any[]>([])

  useEffect(() => {
    if (!sponsorId) return
    const fetchSponsor = async () => {
      try {
        const res = await api.get(`/sponsors/${sponsorId}/details`)
        setSponsor(res.data)
        setSessions(res.data.sessions || [])
      } catch (error) {
        console.error(error)
        setSponsor(null)
        setSessions([])
      }
    }
    fetchSponsor()
  }, [sponsorId])

  if (!sponsor) return <div className="text-center mt-10">Loading...</div>

  return (
    <div className="relative w-full min-h-screen bg-gray-50">
      {/* Sponsor Header */}
      <div
        className="w-full h-60 sm:h-52 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${sponsor.pic_url || '/images/building.jpg'})` }}
      >
        <div className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center cursor-pointer bg-white rounded-full shadow-md">
          <Link href="/participants/Sponsors&Exhibitors">
            <FaArrowLeft className="text-red-800 w-5 h-5" />
          </Link>
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#FFFEEF] rounded-full px-3 py-1 shadow-sm">
          <FaCrown className="text-yellow-400 w-5 h-4" />
          <span className="text-[#282828] font-medium text-lg sm:text-base">Gold Sponsors</span>
        </div>
      </div>

      {/* Gradient circle */}
      <div className="absolute top-[140px] left-4 w-44 h-44 flex items-center justify-center">
        <div
          className="w-full h-full rounded-full flex items-center justify-center text-center p-4"
          style={{ background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)' }}
        >
          <span className="text-white text-lg font-semibold">
            {sponsor.name || 'Sponsor Name'}
          </span>
        </div>
      </div>


      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-28 flex flex-col gap-10">
      
        {/* Sponsor Info & Contact */}
       {/* Sponsor Info & Contact */}
<div className="flex flex-col lg:flex-row gap-5">
  <div className="flex-1 bg-white border border-gray-300 shadow-sm rounded-2xl p-6 flex flex-col gap-4">
    <h2 className="text-lg font-semibold text-[#282828]">{sponsor.name}</h2>
    <p className="text-sm text-[#424242] leading-5">{sponsor.description}</p>
  </div>

  <div className="w-full lg:w-80 bg-white border border-gray-300 shadow-sm rounded-2xl p-6 flex flex-col gap-4">
    <h2 className="text-lg font-semibold text-[#282828]">Contact Information</h2>
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
          <FaGlobe className="text-blue-600" />
        </div>
        <a
          href={sponsor.website || 'https://www.techcorp.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          {sponsor.website || 'www.techcorp.com'}
        </a>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
          <FaEnvelope className="text-green-600" />
        </div>
        <a
          href={`mailto:${sponsor.email || 'contact@techcorp.com'}`}
          className="text-sm text-black hover:underline"
        >
          {sponsor.email || 'contact@techcorp.com'}
        </a>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center">
          <FaPhone className="text-purple-600" />
        </div>
        <a
          href={`tel:${sponsor.phone || '+15551234567'}`}
          className="text-sm text-black hover:underline"
        >
          {sponsor.phone || '+1 (555) 123-4567'}
        </a>
      </div>
    </div>
  </div>
</div>


        {/* Representatives & Products */}
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex-1 bg-white border border-gray-300 shadow-sm rounded-2xl p-6 flex flex-col gap-6">
            <h2 className="text-2xl font-medium text-[#282828]">Representatives</h2>
            <div className="flex flex-col gap-3">
              {sponsor.representatives?.map((rep: any, index: number) => {
                const imgSrc = rep.user?.file || '/images/default-profile.png'
                const name = rep.user?.name || 'Unknown'
                const company = rep.user?.organization || 'No organization'
                return (
                  <div key={index} className="w-full p-3 bg-white border border-gray-200 shadow-sm rounded-lg flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 relative">
                      <Image
                        src={imgSrc}
                        alt={name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-medium text-[#282828]">{name}</span>
                      <span className="text-sm text-gray-600">{company}</span>
                    </div>
                    <div className="ml-auto">
                      <span className="text-base font-medium text-red-700">Connect</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex-1 bg-white border border-gray-300 shadow-sm rounded-2xl p-6 flex flex-col gap-6">
            <h2 className="text-2xl font-medium text-[#282828]">Products & Services</h2>
            <div className="flex flex-col gap-3">
              {sponsor.products?.map((product: any, index: number) => (
                <div key={index} className="w-full p-3 bg-white border border-gray-200 shadow-sm rounded-lg flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-2xl flex items-center justify-center">{product.icon || null}</div>
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-base font-medium text-[#282828]">{product.title}</span>
                    <span className="text-sm text-gray-600">{product.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Follow Us */}
        <div className="flex flex-col w-full gap-4">
          <h2 className="text-2xl font-medium text-[#282828] mb-2">Follow Us</h2>
          <div className="flex flex-row gap-3 w-full">
            <button className="flex-1 h-12 bg-blue-600 rounded-lg flex items-center justify-center gap-2">
              <FaLinkedin className="text-white" />
              <span className="text-white text-base">LinkedIn</span>
            </button>
            <button className="flex-1 h-12 bg-blue-400 rounded-lg flex items-center justify-center gap-2">
              <FaTwitter className="text-white" />
              <span className="text-white text-base">Twitter</span>
            </button>
            <button className="flex-1 h-12 bg-red-500 rounded-lg flex items-center justify-center gap-2">
              <FaYoutube className="text-white" />
              <span className="text-white text-base">Youtube</span>
            </button>
          </div>
        </div>

      </div>

    <div className="w-full flex justify-center mt-8">
  <Image
    src="/images/line.png"
    alt="Line"
    width={1850}
    height={127}

  />
</div>


    </div>
  )
}

export default SponsorsDetailsScreen
