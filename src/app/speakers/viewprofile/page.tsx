'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'
import api from '@/config/api'
import Image from 'next/image'
import Link from 'next/link'
import {
  FaUser,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaFacebook,
  FaQrcode
} from 'react-icons/fa'
import { QRCodeCanvas as QRCode } from 'qrcode.react'
import LogoutButton from './../../components/LogoutButton'
export default function SpeakerProfileView() {
  const speakerId = useSelector((state: RootState) => state.speaker.speakerId)
  const [speaker, setSpeaker] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const qrRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const fetchSpeaker = async () => {
      if (!speakerId) return
      setLoading(true)
      try {
        const res = await api.get(`/speakers/${speakerId}`)
        setSpeaker(res.data)
      } catch (err) {
        console.log('Error fetching speaker', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSpeaker()
  }, [speakerId])

  const handleDownloadQR = () => {
    if (qrRef.current) {
      const canvas = qrRef.current
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `speaker-${speakerId}-qr.png`
      a.click()
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700 text-lg font-medium">
        Loading speaker profile...
      </div>
    )
  }

  if (!speaker) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700 text-lg font-medium">
        Speaker not found
      </div>
    )
  }

  const user = speaker.user || {}

  return (
   <>
  <div className="relative flex flex-col items-center min-h-screen bg-gray-50 p-4">
    <div className="relative bg-white border border-gray-300 rounded-2xl shadow-lg p-10 w-full max-w-6xl mb-16">
<div className="absolute top-4 right-4 flex gap-2">


<Link
  href="/participants/SetUpYourProfile"
  className="p-3 bg-red-900 text-white rounded-full shadow hover:bg-red-700 flex items-center justify-center"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652l-9.193 9.193a4.5 4.5 0 01-1.897 1.13l-3.323.94.94-3.323a4.5 4.5 0 011.13-1.897l9.193-9.193z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L16.875 4.5" />
  </svg>
</Link>


 
</div>


      <div className="flex flex-col items-center mb-10">
        <div className="w-32 h-32 bg-red-100 border-4 border-white rounded-full shadow-md flex items-center justify-center overflow-hidden">
          {user.file ? (
            <img src={user.file} alt="Speaker" className="w-full h-full object-cover" />
          ) : (
            <FaUser className="text-4xl text-red-600" />
          )}
        </div>
        <p className="text-base text-gray-900 text-center mt-4">Speaker </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
  <div>
    <p className="font-bold p-1">Name</p>
    <p className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50">
      {user.name}
    </p>
  </div>

  <div>
    <p className="font-bold p-1">Email</p>
    <p className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50">
      {user.email}
    </p>
  </div>

  <div>
    <p className="font-bold p-1">Country</p>
    <p className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50">
      {speaker.country}
    </p>
  </div>

  <div>
    <p className="font-bold p-1">Website</p>
    <a
      href={speaker.website}
      target="_blank"
      className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-red-600 bg-gray-50 hover:underline block"
    >
      {speaker.website}
    </a>
  </div>

  <div>
    <p className="font-bold p-1">Designations</p>
    <div className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 flex flex-wrap gap-2">
      {speaker.designations?.map((d: string, i: number) => (
        <span key={i} className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
          {d}
        </span>
      ))}
    </div>
  </div>

  <div>
    <p className="font-bold p-1">Expertise & Tags</p>
    <div className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 flex flex-wrap gap-2">
      {speaker.expertise?.map((e: string, i: number) => (
        <span key={`exp-${i}`} className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
          {e}
        </span>
      ))}
      {speaker.tags?.map((tag: string, i: number) => (
        <span key={`tag-${i}`} className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full">
          {tag}
        </span>
      ))}
    </div>
  </div>
</div>


      <div className="mt-6">
        <p className="font-bold p-1">Bio</p>
        <p className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50">
          {speaker.bio}
        </p>
      </div>

     <div className="flex gap-6 mt-6 justify-center text-2xl">
  <a 
    href={speaker.linkedin || '#'} 
    target="_blank" 
    className="text-blue-700 hover:text-blue-900"
  >
    <FaLinkedin />
  </a>
  <a 
    href={speaker.twitter || '#'} 
    target="_blank" 
    className="text-blue-500 hover:text-blue-700"
  >
    <FaTwitter />
  </a>
  <a 
    href={speaker.youtube || '#'} 
    target="_blank" 
    className="text-red-600 hover:text-red-800"
  >
    <FaYoutube />
  </a>
  <a 
    href={speaker.facebook || '#'} 
    target="_blank" 
    className="text-blue-800 hover:text-blue-900"
  >
    <FaFacebook />
  </a>
</div>


     <div className="flex gap-4 mt-6 justify-center">
<LogoutButton className="rounded-[50px] border border-gray-500 px-4 py-2 transition-colors hover:bg-white hover:text-red-500 cursor-pointer" />
<button
  onClick={() => {
    localStorage.setItem('role', 'participant');
    window.location.href = '/participants/Home';
  }}
  className="bg-white text-red-900 border border-red-900 px-4 py-4  hover:bg-red-800 hover:text-white hover:rounded-full  rounded-full transition-all cursor-pointer"
>
  Participant Home
</button>


</div>

    </div>
  </div>

  <div className="w-full flex justify-center bottom-0">
    <Image src="/images/line.png" alt="Line" width={1450} height={127} className="w-full max-w-screen-xl" />
  </div>

  {showQR && (
    <div
      onClick={() => setShowQR(false)}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-2xl shadow-lg" onClick={(e) => e.stopPropagation()}>
        <QRCode
          value={`${window.location.origin}/speakers/view/${speakerId}`}
          size={180}
          bgColor="#ffffff"
          fgColor="#000000"
          includeMargin={true}
          ref={qrRef}
        />
        <button
          onClick={handleDownloadQR}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full"
        >
          Download QR Code
        </button>
      </div>
    </div>
  )}

<div className="w-full flex justify-center bottom-0">
    <Image src="/images/line.png" alt="Line" width={1700} height={127} className="w-full max-w-screen-xl" />
  </div>
</>

  )
}
