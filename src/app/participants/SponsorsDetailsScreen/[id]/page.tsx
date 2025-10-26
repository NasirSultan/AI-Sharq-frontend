"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from "next/navigation"

import Image from 'next/image'
import { FaGlobe, FaEnvelope, FaPhone, FaArrowLeft, FaCrown } from 'react-icons/fa'
import { FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa'
import RelatedSessionsGrid from "@/app/components/relatedsession"
import Link from 'next/link'
import api from '@/config/api'

interface SocialMedia {
  name: string
  website: string
}

interface Contact {
  name: string
  email: string
  phone: string
}

interface Product {
  id: number
  title: string
  description: string
}

interface Representative {
  id: number
  displayTitle: string
  user: {
    id: number
    name: string
    organization: string
    photo: string | null
    file: string | null
  }
}

interface SponsorDetails {
  id: number
  name: string
  pic_url: string
  description: string
  socialMedia: SocialMedia[]
  contacts: Contact[]
  products: Product[]
  representatives: Representative[]
}

const SponsorsDetailsScreen: React.FC = () => {
  const params = useParams()
  const { id } = params
  const [sponsor, setSponsor] = useState<SponsorDetails | null>(null)

  useEffect(() => {
    const fetchSponsor = async () => {
      try {
        if (id) {
          const { data } = await api.get(`/sponsors/${id}/details`)
          setSponsor(data)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchSponsor()
  }, [id])


  if (!sponsor) return null

  return (
    <div className="relative w-full h-screen">
      {/* Cover Section with pic_url */}
      {/* Cover Section with pic_url or fallback */}
      {/* Cover Section with pic_url or fallback */}
      {/* Cover Section with fixed default image */}
     {/* Cover Section with backend pic_url or fallback */}
<div
  className="absolute w-[1440px] h-[231px] bg-cover bg-center"
  style={{
    backgroundImage: `url(${sponsor.pic_url || '/images/building.jpg'})`,
  }}
>
  {/* Arrow Back Button */}
  <div className="absolute w-[40px] h-[40px] left-[20px] top-[20px] rounded-full flex items-center justify-center cursor-pointer">
    <Link href="/participants/Sponsors&Exhibitors">
      <FaArrowLeft className="text-red-800 w-[20px] h-[20px] cursor-pointer" />
    </Link>
  </div>

  {/* Gold Sponsors Label with Crown */}
  <div className="absolute flex flex-row justify-center items-center gap-2 left-[1149px] top-[39px] w-[211.25px] h-[37px] bg-[#FFFEEF] rounded-full px-3 py-2">
    <FaCrown className="text-yellow-400 w-[20.25px] h-[15.75px] flex-none" />
    <span className="text-[#282828] font-medium text-2xl leading-6 tracking-tight font-['IBM_Plex_Sans']">
      Gold Sponsors
    </span>
  </div>
</div>

      {/* Profile Pic Placeholder with Company Name */}
      <div
        className="absolute w-[177px] h-[177px] top-[140px] flex items-center justify-center rounded-full text-white font-semibold text-xl"
        style={{ left: 'calc(50% - 177px/2 - 550.5px)', background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)' }}
      >
        {sponsor.name}
      </div>

      {/* Main Content */}
      <div className="absolute w-[1280px] h-[1336px] left-[80px] top-[351px] flex flex-col gap-11">
        {/* Contact Sponsor Button */}
        <button className="w-44 h-12 bg-[#9B2033] text-white rounded-md font-medium text-base mb-4 p-3 flex items-center justify-center">
          Contact Sponsor
        </button>

        <div className="flex flex-row gap-5 w-full h-[241px]">
          {/* Company Description */}
          <div className="w-[940px] h-[270px] p-8 bg-white border border-gray-300 shadow-sm rounded-2xl flex flex-col gap-6">
            <h2 className="text-lg font-semibold text-[#282828]">{sponsor.name}</h2>
            <p className="text-sm text-[#424242] leading-5">{sponsor.description}</p>
          </div>

          {/* Contact Information */}
          <div className="w-[325px] h-[270px] p-8 bg-white border border-gray-300 shadow-sm rounded-2xl flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-[#282828]">Contact Information</h2>
            <div className="flex flex-col gap-6">
              <div className="flex flex-row items-center gap-4">
                <div className="w-9 h-9 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <FaGlobe className="text-blue-600" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">Website</span>
                  <span className="text-sm text-blue-600">{sponsor.contacts[0]?.name}</span>
                </div>
              </div>
              <div className="flex flex-row items-center gap-4">
                <div className="w-9 h-9 bg-green-100 rounded-2xl flex items-center justify-center">
                  <FaEnvelope className="text-green-600" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">Email</span>
                  <span className="text-sm text-black">{sponsor.contacts[0]?.email}</span>
                </div>
              </div>
              <div className="flex flex-row items-center gap-4">
                <div className="w-9 h-9 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <FaPhone className="text-purple-600" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">Phone</span>
                  <span className="text-sm text-black">{sponsor.contacts[0]?.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Representatives */}
        <div className="flex flex-row gap-5 w-full">
          <div className="w-[625px] h-[389px] p-10 bg-white border border-gray-300 shadow-sm rounded-2xl flex flex-col gap-10">
            <h2 className="text-2xl font-medium text-[#282828]">Representatives</h2>
            <div className="flex flex-col gap-3">
              {sponsor.representatives.map(rep => (
                <div key={rep.id} className="w-full h-18 p-4 bg-white border border-gray-200 shadow-sm rounded-lg flex flex-row justify-between items-center">
                  <div className="flex flex-row items-center gap-3">
                    <Image
                      src={rep.user.photo ? `/uploads/${rep.user.photo}` : '/images/default-avatar.png'}
                      alt={rep.user.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
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

          {/* Products */}
          <div className="w-[625px] h-[389px] p-10 bg-white border border-gray-300 shadow-sm rounded-2xl flex flex-col gap-10">
            <h2 className="text-2xl font-medium text-[#282828]">Products & Services</h2>
            <div className="flex flex-col gap-3">
              {sponsor.products.map(product => (
                <div key={product.id} className="w-full h-16 p-4 bg-white border border-gray-200 shadow-sm rounded-lg flex flex-row items-center gap-4">
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

        {/* Sessions Sponsored */}
        <div className="flex flex-row justify-between items-center w-full">
          <h2 className="text-2xl font-medium text-[#282828]">Sessions Sponsored</h2>
          <span className="text-base font-medium text-[#282828] cursor-pointer">View All</span>
        </div>

        <RelatedSessionsGrid />

        {/* Follow Us Section */}
        <div className="flex flex-col items-start gap-4 w-full mt-8">
          <h2 className="text-2xl font-medium text-[#282828] mb-4">Follow Us</h2>
          <div className="flex flex-row gap-6 w-full">
            {sponsor.socialMedia.map((s, index) => (
              <a
                key={index}
                href={s.website}
                target="_blank"
                rel="noopener noreferrer"
                className="basis-[30%] shrink-0"
              >
                <button
                  className={`w-full h-12 rounded-lg flex items-center justify-center gap-3
            ${s.name === 'LinkedIn' ? 'bg-blue-600' : ''}
            ${s.name === 'Twitter' ? 'bg-blue-400' : ''}
            ${s.name === 'YouTube' ? 'bg-red-500' : ''}`}
                >
                  {s.name === 'LinkedIn' && <FaLinkedin className="text-white" />}
                  {s.name === 'Twitter' && <FaTwitter className="text-white" />}
                  {s.name === 'YouTube' && <FaYoutube className="text-white" />}
                  <span className="text-base font-normal text-white">{s.name}</span>
                </button>
              </a>
            ))}
          </div>
        </div>

      </div>

      <Image src="/images/line.png" alt="Logo" width={1729} height={127} className="absolute top-[1910px]" />
    </div>
  )
}

export default SponsorsDetailsScreen
