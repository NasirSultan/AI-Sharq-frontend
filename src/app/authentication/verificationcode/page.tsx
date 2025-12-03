'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function VerificationCode() {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const router = useRouter()
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)
      if (value && index < 5) inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = code.join('')
    if (fullCode === '123456') {
      router.push('/authentication/SignIn')
    } else {
      setError('Invalid code')
    }
  }

  const resendCode = () => {
    setCode(['', '', '', '', '', ''])
    setTimeLeft(60)
    inputRefs.current[0]?.focus()
  }

  const isFull = code.every(digit => digit !== '')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
        <div className="flex justify-center mb-4">
          <Image src="/images/logo1.png" alt="Logo" width={120} height={36} className="object-contain" />
        </div>
        <h1 className="text-lg font-medium text-gray-800 text-center">
          Enter Verification Code
        </h1>
        <p className="text-sm text-gray-600 text-center">
          Please enter the 6-digit code sent to your email or phone
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 items-center">
          <div className="flex gap-2">
            {code.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(e.target.value, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                ref={el => (inputRefs.current[idx] = el)}
                className="w-10 h-12 border border-gray-300 rounded-lg text-center text-lg"
              />
            ))}
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={!isFull}
            className={`w-full py-2 rounded-lg text-white transition ${isFull ? 'bg-[#9B2033] hover:bg-[#7f1a28]' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Verify
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-2">
          {timeLeft > 0 ? `Resend code in 0:${timeLeft.toString().padStart(2, '0')}` :
          <span onClick={resendCode} className="text-[#9B2033] cursor-pointer">Resend</span>}
        </p>
      </div>
    </div>
  )
}
