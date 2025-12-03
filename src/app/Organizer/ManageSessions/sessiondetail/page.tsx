'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/config/api'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import RelatedSessionsGrid from "@/app/components/relatedsession"
export default function SessionPage() {
    const [session, setSession] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [bookmarked, setBookmarked] = useState(false)

    const userId = useSelector((state: RootState) => state.user.userId)
    const eventId = useSelector((state: RootState) => state.event.id)

useEffect(() => {
    const fetchData = async () => {
        const id = localStorage.getItem('sessionId')
        if (!id) {
            setLoading(false)
            return
        }
        try {
            const res = await api.get(`/sessions/detail/${id}`)
            setSession(res.data)
        } catch {
            setSession(null)
        } finally {
            setLoading(false)
        }
    }
    fetchData()
}, [])


    const handleBookmark = async () => {
        if (!userId || !eventId || !session?.id) return
        try {
            await api.post('/participants/agenda', {
                userId: Number(userId),
                sessionId: Number(session.id),
                eventId: Number(eventId),
            })
            setBookmarked(true)
        } catch {
            setBookmarked(true)
        }
    }

    if (loading) return <p className="text-center mt-10">Loading...</p>
    if (!session) return <p className="text-center mt-10">No session found</p>

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex items-center space-x-3">
                <Link href="/Organizer/ManageSessions">
                    <FaArrowLeft className="text-red-600 cursor-pointer" size={20} />
                </Link>
                <h1 className="text-xl font-semibold text-black">Session Details</h1>
            </div>

            {/* Session Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between text-xs font-semibold text-red-700 mb-1">
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-xl">{session.category}</span>
                    <div className="flex flex-col text-xs text-red-500">
                        <div>
                            {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                            {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="mt-1 text-gray-600 text-end">
                            {new Date(session.startTime).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                </div>
                <h2 className="text-lg font-bold text-black">{session.title}</h2>
                <div className="flex flex-wrap text-xs text-gray-500 space-x-4 mb-2">
                    <div className="flex items-center space-x-1">
                        <img src="/images/Vector.png" className="w-4 h-4" />
                        <strong>{session.location}</strong>
                    </div>
                    <div className="flex items-center space-x-1">
                        <img src="/images/Vector (1).png" className="w-4 h-4" />
                        <span>{Math.floor((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000)} mins</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <img src="/images/Vector (2).png" className="w-4 h-4" />
                        <span>{session.capacity} capacity</span>
                    </div>
                </div>
                <p className="text-xs text-gray-600">{session.description}</p>
            </div>

            {/* Speakers */}
{session.speakers?.length > 0 && (
  <div className="space-y-4">
    <h3 className="text-md font-semibold text-black">Speakers</h3>
    {session.speakers.map((speaker: any) => (
      <div key={speaker.id} className="flex items-start bg-white border border-gray-200 rounded-lg p-4 shadow-sm">

        <img
          src={speaker.user?.file || '/images/img (13).png'}
          alt={speaker.user?.name}
          className="w-20 h-20 rounded-full object-cover"
        />

        <div className="flex-1 flex flex-col ml-4 text-xs text-gray-800">
          {/* Name + Designations + Tag */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-sm">{speaker.user?.name}</h4>
              {speaker.designations?.length > 0 && (
                <span className="text-gray-600">{speaker.designations.join(' • ')}</span>
              )}
            </div>
            {speaker.tags?.length > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-xl">
                {speaker.tags[0]}
              </span>
            )}
          </div>

          {/* Bio */}
          {speaker.bio && <p className="mt-1 text-gray-600">{speaker.bio}</p>}
        </div>

      </div>
    ))}
  </div>
)}


            {/* Tags and Event Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex flex-wrap gap-2">
                    {session.tags?.map((tag: string, idx: number) => (
                        <span key={idx} className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-xl">{tag}</span>
                    ))}
                </div>
                <h4 className="text-sm font-semibold text-black">{session.event?.title}</h4>
                <span className="flex items-center space-x-1"> Registraion
                    {session.registrationRequired ? (
                        <FaCheckCircle className="text-green-600 mx-2" />
                    ) : (
                        <FaTimesCircle className="text-red-600 mx-2" />
                    )}
                </span>
                <p className="text-xs text-gray-600 my-2">{session.event?.description}</p>
            </div>
      <RelatedSessionsGrid />
            <section className="max-w-7xl mx-auto ">
                <h2 className="text-base font-semibold mb-3 text-black">Who's Attending</h2>
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="flex -space-x-4">
                            {session.registeredUsers?.slice(0, 5).map((user: any, idx: number) => (
                                <img
                                    key={idx}
                                    src={user.photo ? `/uploads/${user.photo}` : "/images/img (13).png"}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-600 ml-2">
                            {session.registrationCount} registered attendees
                        </span>
                    </div>
                    <button className="text-red-700 hover:text-red-900">
                        <svg
                            width="30"
                            height="26"
                            viewBox="0 0 30 26"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M29.3722 11.4704C30.2093 12.3164 30.2093 13.6904 29.3722 14.5364L18.6573 25.3655C17.8202 26.2115 16.4607 26.2115 15.6236 25.3655C14.7865 24.5195 14.7865 23.1455 15.6236 22.2995L22.6888 15.1658H2.14298C0.957643 15.1658 0 14.198 0 13C0 11.802 0.957643 10.8342 2.14298 10.8342H22.6821L15.6303 3.70051C14.7932 2.85448 14.7932 1.48054 15.6303 0.634518C16.4674 -0.211506 17.8269 -0.211506 18.664 0.634518L29.3789 11.4636L29.3722 11.4704Z"
                                fill="#9B2033"
                            />
                        </svg>
                    </button>
                </div>
            </section>

        </div>
    )
}
