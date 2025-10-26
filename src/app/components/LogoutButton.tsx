'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaSignOutAlt } from 'react-icons/fa'
import { FaSpinner } from 'react-icons/fa'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = () => {
    setLoading(true)

    // Clear all local storage
    localStorage.clear()

    // Clear all cookies
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim()
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
    })

    // Wait shortly before redirecting
    setTimeout(() => {
      router.push('/authentication/SignIn')
    }, 1000)
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white shadow transition 
        ${loading ? 'bg-red-500 opacity-80 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
    >
      {loading ? (
        <>
          <FaSpinner className="w-4 h-4 animate-spin" />
          <span>Logging out...</span>
        </>
      ) : (
        <>
          <FaSignOutAlt className="w-4 h-4" />
          <span>Logout</span>
        </>
      )}
    </button>
  )
}
