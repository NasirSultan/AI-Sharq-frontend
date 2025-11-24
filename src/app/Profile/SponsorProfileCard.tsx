'use client'
import React from "react"
import Image from "next/image"
import { FaGlobe, FaEnvelope, FaPhone, FaArrowLeft, FaCrown, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa"
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import api from "@/config/api"

const fetcher = (url: string) => api.get(url).then(res => res.data)

interface User {
  id: string
  name: string
  photo?: string
  file?: string
  organization?: string
}

interface Representative {
  id: string
  user: User
}

interface Product {
  id: string
  title: string
  description: string
}

interface SocialMedia {
  name: string
  website: string
}

interface Contact {
  name?: string
  email?: string
  phone?: string
}

interface Sponsor {
  id: string
  name: string
  pic_url?: string
  description: string
  contacts: Contact[]
  representatives: Representative[]
  products: Product[]
  socialMedia: SocialMedia[]
}

interface SponsorProfileCardProps {
  sponsorId: string
}

const SponsorProfileCard: React.FC<SponsorProfileCardProps> = ({ sponsorId }) => {
  const router = useRouter()

  const { data: sponsor, error, isLoading } = useSWR<Sponsor>(
    sponsorId ? `/sponsors/${sponsorId}/details` : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
    </div>
  )

  if (error) return <div className="text-center mt-10 text-red-600">Failed to load sponsor details</div>
  if (!sponsor) return null

  return (
    <div className="relative w-full min-h-screen bg-gray-50 overflow-hidden">

      <div
        className="absolute w-full max-w-[1440px] h-[231px] bg-cover bg-center left-1/2 -translate-x-1/2 sm:h-[250px] md:h-[280px]"
        style={{ backgroundImage: `url(${sponsor.pic_url || "/images/building.jpg"})` }}
      >
        <div
          className="absolute w-10 h-10 left-4 sm:left-6 top-4 sm:top-6 rounded-full flex items-center justify-center cursor-pointer bg-white/80 hover:bg-white transition-colors"
          onClick={() => router.back()}
        >
          <FaArrowLeft className="text-red-800 w-5 h-5" />
        </div>

        <div className="absolute flex flex-row justify-center items-center gap-2 right-5 top-5 sm:right-8 sm:top-8 px-3 py-1.5 bg-[#FFFEEF] rounded-full w-auto">
          <FaCrown className="text-yellow-400 w-5 h-4 sm:w-5.5 sm:h-4.5" />
          <span className="text-[#282828] font-medium text-lg sm:text-2xl leading-6 tracking-tight">
            Gold Sponsors
          </span>
        </div>
      </div>

      <div
        className="sm:absolute relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center rounded-full text-white font-semibold text-lg sm:text-xl top-[140px] sm:top-[150px] sm:left-6 mx-auto sm:mx-0"
        style={{ background: "linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)" }}
      >
        {sponsor.name}
      </div>

      <div className="relative sm:mt-80 mt-38 mx-auto w-[90%] max-w-6xl flex flex-col gap-12">
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="flex-1 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold text-[#282828] mb-3">{sponsor.name}</h2>
            <p className="text-sm sm:text-base text-[#424242] leading-6">{sponsor.description}</p>
          </div>

          <div className="w-full lg:w-[325px] p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold text-[#282828] mb-3">Contact Information</h2>
            <div className="flex flex-col gap-3">
              <a href={sponsor.contacts[0]?.name ? `https://${sponsor.contacts[0].name}` : "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-all">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FaGlobe className="text-blue-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 block">Website</span>
                  <span className="text-sm text-blue-600 break-all">{sponsor.contacts[0]?.name}</span>
                </div>
              </a>
              <a href={sponsor.contacts[0]?.email ? `mailto:${sponsor.contacts[0].email}` : "#"} className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 transition-all">
                <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
                  <FaEnvelope className="text-green-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 block">Email</span>
                  <span className="text-sm text-black break-all">{sponsor.contacts[0]?.email}</span>
                </div>
              </a>
              <a href={sponsor.contacts[0]?.phone ? `tel:${sponsor.contacts[0].phone}` : "#"} className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-all">
                <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FaPhone className="text-purple-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 block">Phone</span>
                  <span className="text-sm text-black">{sponsor.contacts[0]?.phone}</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-medium text-[#282828] mb-6">Representatives</h2>
            <div className="flex flex-col gap-4">
              {sponsor.representatives.map((rep: Representative) => (
                <div key={rep.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg shadow-sm cursor-pointer transform transition-all duration-200 hover:scale-105 hover:border-red-900">
                  <div className="flex items-center gap-4">
                    <img
                      src={rep.user.photo ? (rep.user.photo.startsWith("http") ? rep.user.photo : `/uploads/${rep.user.photo}`) : rep.user.file ? rep.user.file : "/images/Ava.jpg"}
                      alt={rep.user.name || "User"}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <span className="text-base font-medium text-[#282828] block">{rep.user.name}</span>
                      <span className="text-sm text-gray-600">{rep.user.organization}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-medium text-[#282828] mb-6">Products & Services</h2>
            <div className="flex flex-col gap-4">
              {sponsor.products.map((product: Product) => (
                <div key={product.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg shadow-sm cursor-pointer transform transition-all duration-200 hover:scale-105 hover:border-red-900">
                  <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <FaGlobe className="text-blue-600" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-base font-medium text-[#282828]">{product.title}</span>
                    <span className="text-sm text-gray-600">{product.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 mt-8 w-full">
          <h2 className="text-2xl font-medium text-[#282828]">Follow Us</h2>
          <div className="flex gap-4 w-full">
            {sponsor.socialMedia.map((s: SocialMedia, index: number) => (
              <a key={index} href={s.website} target="_blank" rel="noopener noreferrer" className="flex-1">
                <button className={`w-full h-12 rounded-full flex items-center justify-center gap-3 text-white cursor-pointer transform transition-all duration-200 hover:scale-105 ${
                  s.name === "LinkedIn" ? "bg-blue-600 hover:bg-blue-700" :
                  s.name === "Twitter" ? "bg-blue-400 hover:bg-blue-500" :
                  s.name === "YouTube" ? "bg-red-900 hover:bg-red-800" :
                  "bg-gray-600 hover:bg-gray-700"
                }`}>
                  {s.name === "LinkedIn" && <FaLinkedin />}
                  {s.name === "Twitter" && <FaTwitter />}
                  {s.name === "YouTube" && <FaYoutube />}
                  <span className="text-base font-normal">{s.name}</span>
                </button>
              </a>
            ))}
          </div>
        </div>
      </div>

      <Image src="/images/line.png" alt="line" width={1729} height={127} className="mt-16 mx-auto block relative" />
    </div>
  )
}

export default SponsorProfileCard
