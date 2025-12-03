'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ImageComponent from '../../components/Images'
import api from '@/config/api'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export default function SetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const parsed = JSON.parse(user)
      setUserId(parsed.id)
    }
  }, [])

  const validatePassword = (pass: string) => {
    const upper = /[A-Z]/
    const lower = /[a-z]/
    const number = /[0-9]/
    const special = /[!@#$%^&*()_+\[\]{}|;:,.<>?]/
    if (!upper.test(pass)) return 'Include at least one uppercase letter'
    if (!lower.test(pass)) return 'Include at least one lowercase letter'
    if (!number.test(pass)) return 'Include at least one number'
    if (!special.test(pass)) return 'Include at least one special character'
    if (pass.length < 8) return 'Password must be at least 8 characters'
    return ''
  }

  const handleSetPassword = async () => {
    if (!userId) return
    const validationError = validatePassword(password)
    if (validationError) {
      setError(validationError)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')
    try {
      await api.patch(`/auth/set-password/${userId}`, { password })
         localStorage.removeItem('user')
      setPassword('')
      setConfirmPassword('')
      router.push('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to set password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="flex flex-col lg:flex-row items-center gap-20 max-w-6xl w-full">
        <div className="hidden lg:flex flex-1 justify-center">
          <ImageComponent />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6 w-full max-w-md">
          <Image src="/images/logo1.png" alt="Logo" width={150} height={45} className="mb-4" />

          <h1 className="text-xl font-medium text-gray-800 text-center">Set Your Password</h1>
          <p className="text-sm text-gray-600 text-center mb-4">
            Enter a strong password following the suggestions
          </p>

          <div className="relative w-full mb-2">
  <input
    type={showPassword ? 'text' : 'password'}
    value={password}
    onChange={e => setPassword(e.target.value)}
    placeholder="Enter Password"
    className="w-full border border-red-800 rounded-lg p-2 pr-10 text-center focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-red-900"
  />
  <span
    onClick={() => setShowPassword(prev => !prev)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer"
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

<div className="relative w-full mb-2">
  <input
    type={showConfirm ? 'text' : 'password'}
    value={confirmPassword}
    onChange={e => setConfirmPassword(e.target.value)}
    placeholder="Confirm Password"
    className="w-full border border-red-800 rounded-lg p-2 pr-10 text-center focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-red-900"
  />
  <span
    onClick={() => setShowConfirm(prev => !prev)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer"
  >
    {showConfirm ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>


          {error && <p className="text-red-900 text-sm text-center mb-2">{error}</p>}

          <button
            onClick={handleSetPassword}
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white transition ${!loading ? 'bg-[#9B2033] hover:bg-[#7f1a28]' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {loading ? 'Updating...' : 'Set Password'}
          </button>
        </div>
      </div>
    </div>
  )
}
