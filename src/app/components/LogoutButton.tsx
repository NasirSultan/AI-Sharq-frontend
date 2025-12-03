'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaSignOutAlt, FaSpinner } from 'react-icons/fa'

interface LogoutButtonProps {
  className?: string
}

export default function LogoutButton({ className = '' }: LogoutButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = () => {
    setLoading(true)

    localStorage.clear()

    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim()
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
    })

    setTimeout(() => {
      router.push('/authentication/SignIn')
    }, 1000)
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-3 border border-red-700 rounded-[50px] shadow transition-colors
        ${loading
          ? 'bg-red-700 opacity-80 cursor-not-allowed text-white'
          : 'bg-red-700 text-white hover:bg-white hover:text-red-700 cursor-pointer'} 
        ${className}`}
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
