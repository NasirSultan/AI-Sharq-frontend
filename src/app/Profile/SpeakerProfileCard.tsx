'use client'

import React, { useEffect, useState, useRef } from 'react'
import api from '@/config/api'
import { FaUser, FaLinkedin, FaTwitter, FaYoutube, FaFacebook } from 'react-icons/fa'

const speakerCache: Record<string, any> = {}

export const preloadSpeaker = async (speakerId: string) => {
  if (!speakerId || speakerCache[speakerId]) return
  try {
    const res = await api.get(`/speakers/${speakerId}`)
    speakerCache[speakerId] = res.data
  } catch (err) {
    console.error('Failed to preload speaker', err)
  }
}

export default function SpeakerProfileCard({ speakerId }: { speakerId: string }) {
  const [speaker, setSpeaker] = useState<any | null>(() => speakerCache[speakerId] || null)
  const [loading, setLoading] = useState(!speaker)
  const [error, setError] = useState<string | null>(null)
  const cancelRequest = useRef(false)

  useEffect(() => {
    cancelRequest.current = false
    if (!speakerId) return
    if (speakerCache[speakerId]) return setSpeaker(speakerCache[speakerId])

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const cached = speakerCache[speakerId]
        if (cached) {
          setSpeaker(cached)
          return
        }
        const res = await api.get(`/speakers/${speakerId}`)
        if (cancelRequest.current) return
        setSpeaker(res.data)
        speakerCache[speakerId] = res.data
      } catch (err) {
        if (cancelRequest.current) return
        setError('Failed to fetch speaker data')
      } finally {
        if (!cancelRequest.current) setLoading(false)
      }
    }

    load()

    return () => {
      cancelRequest.current = true
    }
  }, [speakerId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    )
  }

  if (!speaker) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Speaker not found
      </div>
    )
  }

  const user = speaker.user || {}

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white border border-gray-300 rounded-2xl shadow-lg p-8 w-full max-w-7xl">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-32 h-32 bg-gray-200 border-4 border-white rounded-full shadow-md flex items-center justify-center overflow-hidden">
            {user.file ? (
              <img src={user.file} alt="Speaker" className="w-full h-full object-cover" />
            ) : (
              <FaUser className="text-4xl text-gray-500" />
            )}
          </div>
          <p className="text-base text-gray-700 mt-4 font-medium">Speaker</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <div>
            <p className="font-semibold text-gray-600 mb-1">Name</p>
            <p className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">{user.name}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-600 mb-1">Email</p>
            <p className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">{user.email}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-600 mb-1">Country</p>
            <p className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">{speaker.country}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-600 mb-1">Website</p>
            <a
              href={speaker.website || '#'}
              target="_blank"
              className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-blue-600 hover:underline"
            >
              {speaker.website || 'N/A'}
            </a>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-semibold text-gray-600 mb-1">Designations</p>
            <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 flex flex-wrap gap-2">
              {speaker.designations?.map((d: string, i: number) => (
                <span key={i} className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-semibold text-gray-600 mb-1">Expertise & Tags</p>
            <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 flex flex-wrap gap-2">
              {speaker.expertise?.map((e: string, i: number) => (
                <span key={`exp-${i}`} className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                  {e}
                </span>
              ))}
              {speaker.tags?.map((tag: string, i: number) => (
                <span key={`tag-${i}`} className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <p className="font-semibold text-gray-600 mb-1">Bio</p>
          <p className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">{speaker.bio}</p>
        </div>

        {/* Social Icons */}
        <div className="flex gap-6 mt-6 justify-center text-2xl">
          <a href={speaker.linkedin || '#'} target="_blank" className="text-blue-700 hover:text-blue-500">
            <FaLinkedin />
          </a>
          <a href={speaker.twitter || '#'} target="_blank" className="text-blue-400 hover:text-blue-300">
            <FaTwitter />
          </a>
          <a href={speaker.youtube || '#'} target="_blank" className="text-red-600 hover:text-red-400">
            <FaYoutube />
          </a>
          <a href={speaker.facebook || '#'} target="_blank" className="text-blue-800 hover:text-blue-600">
            <FaFacebook />
          </a>
        </div>
      </div>
    </div>
  )
}
