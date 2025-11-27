'use client'

import React, { useEffect, useState, useRef } from 'react'
import { FaUser } from 'react-icons/fa'
import api from '@/config/api'

export default function ProfileCard({ role }: { role: string }) {
  const storedId = typeof window !== 'undefined' ? localStorage.getItem('participantId') : null
  const [profileId, setProfileId] = useState(storedId)
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const cancelRequest = useRef(false)

  useEffect(() => {
    cancelRequest.current = false
    if (!profileId) {
      setError('No participant ID found')
      setLoading(false)
      return
    }

    const loadUser = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get(`/admin/users/${profileId}`)
        if (cancelRequest.current) return
        
        setUser(res.data)
      } catch (err) {
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
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center gap-6 w-full max-w-xl">
        <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-red-700 text-5xl overflow-hidden shadow-md">
          {user.file ? <img src={user.file} alt="User" className="w-full h-full object-cover" /> : <FaUser />}
        </div>

        <div className="text-center">
          <p className="px-3 py-1 mt-1 text-xs bg-gray-200 rounded-full text-black">{user.role}</p>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-black text-sm">{displayValue(user.name)}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-gray-500">Bio</p>
            <p className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-black text-sm">{displayValue(user.bio)}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-gray-500">Organization</p>
            <p className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-black text-sm">{displayValue(user.organization)}</p>
          </div>
          <div className="flex flex-col sm:col-span-2">
            <p className="text-sm text-gray-500">Email</p>
            <p className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-black text-sm break-all">{displayValue(user.email)}</p>
          </div>
         <div className="flex flex-col sm:col-span-2">
            <p className="text-sm text-gray-500">Phone</p>
            <p className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-black text-sm break-all">{displayValue(user.phone)}</p>
          </div>
        
        </div>
      </div>
    </div>
  )
}
