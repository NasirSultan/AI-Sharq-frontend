"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import api from '@/config/api'

export default function TwoStepVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const router = useRouter()
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    const savedEmail = JSON.parse(localStorage.getItem('user') || '{}')?.email || ''
    setEmail(savedEmail)
    if (inputRefs.current[0]) inputRefs.current[0].focus()
  }, [])

  const handleChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      if (value && index < 5) inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullOtp = otp.join('')
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/verify-otp', { email, otp: fullOtp })
      router.push('/authentication/SignUp/Setpassword')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP')
      setOtp(['', '', '', '', '', ''])
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6 w-full max-w-md">
        <Image src="/images/logo1.png" alt="Logo" width={150} height={45} className="mb-4" />

        <h1 className="text-xl font-medium text-gray-800 text-center">Enter Verification Code</h1>
        <p className="text-sm text-gray-600 text-center mb-4">OTP sent to your email</p>

        <form onSubmit={verifyOtp} className="flex flex-col gap-4 items-center w-full">
          <div className="flex justify-center gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(e.target.value, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                ref={el => (inputRefs.current[idx] = el)}
                className="w-12 h-12 border border-red-800 rounded-lg p-2 text-center mb-2 focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-red-900"
              />
            ))}
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={otp.some(d => !d) || loading || !email}
            className={`w-full py-2 rounded-lg text-white transition ${otp.every(d => d !== '') && !loading && email ? 'bg-[#9B2033] hover:bg-[#7f1a28]' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  )
}
