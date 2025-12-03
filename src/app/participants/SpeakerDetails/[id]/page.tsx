"use client"

import React from "react"
import Image from "next/image"
import { FaArrowLeft ,FaUser } from "react-icons/fa"
import { useParams, useRouter } from "next/navigation"
import useSWR from "swr"
import SpeakerSession from "../Speakersession/page"
import api from "@/config/api"

const fetcher = (url: string) => api.get(url).then(res => res.data)

const SpeakerDetails = () => {
  const params = useParams()
  const speakerId = params?.id
  const router = useRouter()

  const { data: speaker, error, isLoading, mutate } = useSWR(
    speakerId ? `/speakers/${speakerId}` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 } // cache for 1 minute
  )

  if (isLoading) return   <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>

  if (error) return <p className="text-center mt-20 text-red-600">Failed to load speaker.</p>
  if (!speaker) return null

  return (
    <>
    <div className="flex flex-col items-center gap-5 w-full px-4 sm:px-6 md:max-w-6xl mx-auto min-h-screen">

  {/* Header */}
  <div className="flex items-center gap-4 w-full mt-5">
    <FaArrowLeft
      onClick={() => router.back()}
      className="text-red-800 w-6 h-6 cursor-pointer"
    />
    <h1 className="text-2xl font-medium text-gray-900">Speaker Details</h1>
  </div>

  {/* Speaker Info */}
  <div className="flex flex-col items-center gap-6 mt-5 w-full">
    <div className="relative w-36 h-36 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center">
  {speaker.user.file ? (
    <img
      src={
        speaker.user.file.startsWith("http")
          ? speaker.user.file
          : `/files/${speaker.user.file}`
      }
      alt={speaker.user.name || "Speaker"}
      className="w-full h-full object-cover"
    />
  ) : (
    <FaUser className="w-16 h-16 text-blue-500" />
  )}
</div>


    <h2 className="text-2xl font-semibold text-gray-900 text-center">{speaker.user.name}</h2>
    <p className="text-sm text-gray-700 text-center">
      {speaker.designations.join(" - ")}
    </p>
  </div>

  {/* Biography */}
  <div className="w-full p-5 bg-white border border-gray-300 shadow-sm rounded-xl mt-5">
    <h3 className="text-lg font-semibold text-gray-900 mb-3">Biography</h3>
    <p className="text-sm text-gray-600">{speaker.bio}</p>
  </div>

  {/* Expertise */}
  <div className="w-full p-5 bg-white border border-gray-300 shadow-sm rounded-xl mt-5">
    <h3 className="text-lg font-semibold text-gray-900 mb-3">Areas of Expertise</h3>
    <div className="flex flex-wrap gap-3">
      {speaker.expertise.map((exp: string, index: number) => (
        <div key={index} className="px-3 py-1.5 bg-[#FFEFF2] rounded-full">
          <span className="text-sm font-medium text-[#9B2033]">{exp}</span>
        </div>
      ))}
    </div>
  </div>

  {/* Speaker Sessions */}
  <div className="w-full mt-5">
    <SpeakerSession speakerId={speakerId} />
  </div>

  {/* Contact & Social */}
  <div className="w-full  p-5 rounded-xl mt-5">
  <h3 className="text-lg font-semibold text-gray-900 mb-3">Connect & Contact</h3>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
    {speaker.linkedin && (
      <a
        href={speaker.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 p-3 rounded-lg text-sm bg-gray-50 hover:bg-gray-100 transition"
      >
        <Image src="/images/linkedin.png" alt="LinkedIn" width={24} height={24} />
        LinkedIn
      </a>
    )}
    {speaker.facebook && (
      <a
        href={speaker.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 p-3 rounded-lg text-sm bg-gray-50 hover:bg-gray-100 transition"
      >
        <Image src="/images/facebook.png" alt="Facebook" width={24} height={24} />
        Facebook
      </a>
    )}
    {speaker.website && (
      <a
        href={speaker.website}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 p-3 rounded-lg text-sm bg-gray-50 hover:bg-gray-100 transition"
      >
        <Image src="/images/web.png" alt="Website" width={24} height={24} />
        Website
      </a>
    )}
    {speaker.user.email && (
      <a
        href={`mailto:${speaker.user.email}`}
        className="flex items-center justify-center gap-2 p-3 rounded-lg text-sm bg-gray-50 hover:bg-gray-100 transition"
      >
        <Image src="/images/gmail.png" alt="Email" width={24} height={24} />
        Email
      </a>
    )}
  </div>
</div>


</div>


      {/* Footer line */}
      <div className="relative w-full mt-12">
        <Image
          src="/images/line.png"
          alt="Line"
          width={2200}
          height={100}
          className="w-full object-contain"
        />
      </div>
    </>
  )
}

export default SpeakerDetails
