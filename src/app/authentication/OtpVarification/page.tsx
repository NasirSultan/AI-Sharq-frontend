'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import api from '@/config/api'
import ImageComponent from '../../components/Images'

export default function TwoStepVerification() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [step, timeLeft])

  const sendOtp = async () => {
    if (!email) return
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/send-otp', { email })
      console.log(data)
       if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
      setStep(2)
      setTimeLeft(60)
      setOtp(['', '', '', '', '', ''])
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

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

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const role = user.role

    if (role === 'exhibitor' || role === 'sponsor') {
      router.push('/authentication/ForgetPassword')
    } else {
      router.push('/authentication/SetNewPassword')
    }
  } catch (err: any) {
    setError(err.response?.data?.message || 'Invalid OTP')
    setOtp(['', '', '', '', '', ''])
    setTimeout(() => inputRefs.current[0]?.focus(), 100)
  } finally {
    setLoading(false)
  }
}


  const resendOtp = async () => {
    setOtp(['', '', '', '', '', ''])
    setTimeLeft(60)
    setTimeout(() => inputRefs.current[0]?.focus(), 100)
    await sendOtp()
  }

  return (
   <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
  <div className={`flex ${step === 1 ? 'flex-row' : 'flex-col'} items-center gap-20 max-w-6xl w-full`}>

    {step === 1 && (
      <div className="flex-1 justify-center hidden lg:flex">
        <ImageComponent />
      </div>
    )}

    <div className={`bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6 ${step === 1 ? 'flex-1' : 'w-full max-w-md'}`}>
      <Image src="/images/logo1.png" alt="Logo" width={150} height={45} className="mb-4" />

      {step === 1 ? (
        <>
          <h1 className="text-xl font-medium text-gray-800 text-center">Enter your email</h1>
          <p className="text-sm text-gray-600 text-center mb-4">We will send a six digit code</p>

          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border border-red-800 rounded-lg p-2 text-center mb-2 focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-red-900"
          />

          {error && <p className="text-red-900 text-sm text-center mb-2">{error}</p>}

          <button
            onClick={sendOtp}
            disabled={!email || loading}
            className={`w-full py-2 rounded-lg text-white transition ${email && !loading ? 'bg-[#9B2033] hover:bg-[#7f1a28]' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </>
      ) : (
        <>
          <h1 className="text-xl font-medium text-gray-800 text-center">Enter Verification Code</h1>
          <p className="text-sm text-gray-600 text-center mb-4">OTP sent to {email}</p>

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
              disabled={otp.some(d => !d) || loading}
              className={`w-full py-2 rounded-lg text-white transition ${otp.every(d => d !== '') && !loading ? 'bg-[#9B2033] hover:bg-[#7f1a28]' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-2">
            {timeLeft > 0
              ? `Resend code in 0:${timeLeft.toString().padStart(2, '0')}`
              : (
                <span onClick={resendOtp} className="text-[#9B2033] cursor-pointer">
                  Resend
                </span>
              )}
          </p>
        </>
      )}
    </div>
  </div>
</div>


  )
}
