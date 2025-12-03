'use client'

import React, { useEffect, useState, useRef } from 'react'
import { FaUser, FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import api from '@/config/api'

export default function ProfileCard({ role }: { role: string }) {
  const router = useRouter()
  const storedId = typeof window !== 'undefined' ? localStorage.getItem('participantId') : null
  const [profileId, setProfileId] = useState(storedId)
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const cancelRequest = useRef(false)
  const CACHE_TIME = 10 * 60 * 1000
const CACHE_KEY = `cachedUser_${profileId}`

useEffect(() => {
  cancelRequest.current = false
  if (!profileId) {
    setError('No participant ID found')
    setLoading(false)
    return
  }

  setUser(null)
  setLoading(true)
  setError(null)

  const cached = typeof window !== 'undefined' ? sessionStorage.getItem(CACHE_KEY) : null
  if (cached) {
    const parsed = JSON.parse(cached)
    if (Date.now() - parsed.timestamp < CACHE_TIME) {
      setUser(parsed.data)
      setLoading(false)
      return
    }
  }

  const loadUser = async () => {
    try {
      const res = await api.get(`/admin/users/${profileId}`)
      if (cancelRequest.current) return

      setUser(res.data)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: res.data, timestamp: Date.now() }))
      }
    } catch {
      if (cancelRequest.current) return
      setError('Failed to fetch user data')
    } finally {
      if (!cancelRequest.current) setLoading(false)
    }
  }

  loadUser()

  return () => {
    cancelRequest.current = true
  }
}, [profileId])

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="w-10 h-10 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div></div>
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  if (!user) return <div className="flex justify-center items-center h-screen text-gray-500">User not found</div>

  const displayValue = (value: any) => value || 'Not found yet'

  return (
    <div className="flex justify-center items-start min-h-screen px-4 py-10 bg-gray-50">
      <div className="w-full max-w-6xl flex flex-col gap-6">
        <button onClick={() => router.back()} className="text-red-900 cursor-pointer  text-xl flex items-center gap-2">
          <FaArrowLeft />  Profile
        </button>

       <div className="bg-white rounded-3xl shadow-lg px-10 py-12 flex flex-col items-center gap-8">
  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-red-700 text-6xl overflow-hidden shadow-md">
    {user.file ? <img src={user.file} alt="User" className="w-full h-full object-cover" /> : <FaUser />}
  </div>

  <p className="px-4 py-1 text-sm bg-gray-200 rounded-full text-black">{user.role}</p>

  <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
    <div className="flex flex-col">
      <p className="text-gray-500 text-sm">Full Name</p>
      <p className="px-4 py-2 rounded-xl bg-gray-50 text-black text-sm">{displayValue(user.name)}</p>
    </div>

    <div className="flex flex-col">
      <p className="text-gray-500 text-sm">Email</p>
      <p className="px-4 py-2 rounded-xl bg-gray-50 text-black text-sm break-all">{displayValue(user.email)}</p>
    </div>

    <div className="flex flex-col">
      <p className="text-gray-500 text-sm">Phone</p>
      <p className="px-4 py-2 rounded-xl bg-gray-50 text-black text-sm break-all">{displayValue(user.phone)}</p>
    </div>

    <div className="flex flex-col sm:col-span-2">
      <p className="text-gray-500 text-sm">Bio</p>
      <p className="px-4 py-2 rounded-xl bg-gray-50 text-black text-sm">{displayValue(user.bio)}</p>
    </div>
  </div>
</div>

      </div>
    </div>

  )
}
