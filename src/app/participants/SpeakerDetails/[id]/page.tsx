"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { FaArrowLeft } from "react-icons/fa"
import Link from "next/link"
import { useParams } from "next/navigation"
import api from "@/config/api"
import SpeakerSession from "../Speakersession/page"

const SpeakerDetails = () => {
  const params = useParams()
  const speakerId = params?.id

  const [speaker, setSpeaker] = useState<any>(null)

  useEffect(() => {
    const fetchSpeaker = async () => {
      if (!speakerId) return
      try {
        const res = await api.get(`/speakers/${speakerId}`)
        setSpeaker(res.data)
      } catch (error) {
        console.error("Error fetching speaker:", error)
      }
    }
    fetchSpeaker()
  }, [speakerId])

  if (!speaker) return <p className="text-center mt-20">Loading...</p>

  return (
    <div className="flex flex-col items-center p-6 gap-10 max-w-5xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 w-full">
        <Link href="/participants/Speakers">
          <FaArrowLeft className="text-red-800 w-6 h-6 cursor-pointer" />
        </Link>
        <h1 className="text-2xl font-medium text-gray-900">Speaker Details</h1>
      </div>

      {/* Speaker Info */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-36 h-36 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
          <img
            src={
              speaker.user.file
                ? speaker.user.file.startsWith("http")
                  ? speaker.user.file
                  : `/files/${speaker.user.file}`
                : "/images/default-avatar.png"
            }
            alt={speaker.user.name || "Speaker"}
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-2xl font-semibold text-gray-900">{speaker.user.name}</h2>
        <p className="text-sm text-gray-700 text-center">
          {speaker.designations.join(" - ")}
        </p>
      </div>

      {/* Biography */}
      <div className="w-full p-5 bg-white border border-gray-300 shadow-sm rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Biography</h3>
        <p className="text-sm text-gray-600">{speaker.bio}</p>
      </div>

      {/* Expertise */}
      <div className="w-full p-5 bg-white border border-gray-300 shadow-sm rounded-xl">
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
      <div className="w-full">
        <SpeakerSession />
      </div>

      {/* Contact & Social */}
      <div className="w-full p-5 bg-white border border-gray-300 shadow-sm rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Connect & Contact</h3>
        <div className="flex flex-wrap gap-3">
          {speaker.linkedin && (
            <a
              href={speaker.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[140px] p-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 text-sm"
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
              className="flex-1 min-w-[140px] p-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 text-sm"
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
              className="flex-1 min-w-[140px] p-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 text-sm"
            >
              <Image src="/images/web.png" alt="Website" width={24} height={24} />
              Website
            </a>
          )}
          {speaker.user.email && (
            <a
              href={`mailto:${speaker.user.email}`}
              className="flex-1 min-w-[140px] p-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 text-sm"
            >
              <Image src="/images/gmail.png" alt="Email" width={24} height={24} />
              Email
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default SpeakerDetails
