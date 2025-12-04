'use client'

import React, { useEffect, useState, useRef } from 'react'
import { FaUser } from 'react-icons/fa'
import api from '@/config/api'

// Simple in-memory cache
const cache: Record<string, any> = {}

export default function ProfileCard({
  profileId,
  role,
}: {
  profileId: string
  role: string
}) {
  const [user, setUser] = useState<any | null>(() => cache[profileId] || null)
  const [loading, setLoading] = useState(!cache[profileId])
  const [error, setError] = useState<string | null>(null)
  const cancelRequest = useRef(false)

  // Preload function (optional)
  const preloadUser = async (id: string) => {
    if (!id || cache[id]) return
    try {
      const res = await api.get(`/admin/users/${id}`)
      cache[id] = res.data
    } catch (err) {
      console.error('Preload failed', err)
    }
  }

  useEffect(() => {
    cancelRequest.current = false
    if (!profileId) return

    if (user) return // already loaded from cache

    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        // Check cache again in case preload finished
        if (cache[profileId]) {
          setUser(cache[profileId])
          return
        }

        const res = await api.get(`/admin/users/${profileId}`)
        if (cancelRequest.current) return
        setUser(res.data)
        cache[profileId] = res.data
      } catch (err: any) {
        if (cancelRequest.current) return
        setError('Failed to fetch user data')
      } finally {
        if (!cancelRequest.current) setLoading(false)
      }
    }

    load()

    return () => {
      cancelRequest.current = true
    }
  }, [profileId])

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

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        User not found
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center gap-6 w-full max-w-xl">
      <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-red-700 text-5xl overflow-hidden shadow-md">
        {user.file ? (
          <img src={user.file} alt="User" className="w-full h-full object-cover" />
        ) : (
          <FaUser />
        )}
      </div>

      <div className="text-center">
        <p className="px-3 py-1 mt-1 text-xs bg-gray-200 rounded-full text-black">
          {role}
        </p>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <p className="text-sm text-red-900 m-1">Full Name*</p>
          <p className="px-1 py-2  rounded-lg bg-gray-50 text-black text-sm">
            {user.name}
          </p>
        </div>

      {role !== 'participant' && (
  <div className="flex flex-col">
    <p className="text-sm text-red-900 m-1">Organization*</p>
    <p className="px-1 py-2 rounded-lg bg-gray-50 text-black text-sm">
      {user.organization || 'No organization exists yet'}
    </p>
  </div>
)}


        <div className="flex flex-col sm:col-span-2">
          <p className="text-sm  text-red-900 m-1">Email*</p>
          <p className="px-1 py-2 rounded-lg bg-gray-50 text-black text-sm break-all">
            {user.email}
          </p>
       
       <div className="flex flex-col sm:col-span-2">
          <p className="text-sm  text-red-900 m-1">Bio*</p>
          <p className="px-1 py-2  rounded-lg bg-gray-50 text-black text-sm break-all">
            {user.Bio || 'No bio exists yet'}
          </p>
        </div>
       <div className="flex flex-col sm:col-span-2">
          <p className="text-sm  text-red-900 m-1">phone*</p>
          <p className="px-1 py-2 rounded-lg bg-gray-50 text-black text-sm break-all">
            {user.phone || 'No phone exists yet'}
          </p>
        </div>
        </div>
      </div>
    </div>
  )
}
