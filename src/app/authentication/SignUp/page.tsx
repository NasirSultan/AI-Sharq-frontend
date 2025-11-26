'use client'

import { useState } from 'react'
import Image from 'next/image'
import ImageComponent from '../../components/Images'
import { FaUser, FaEnvelope, FaEyeSlash, FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { setUserId } from '@/lib/store/features/user/userSlice'
import api from '@/config/api'

export default function SignUp() {
  const router = useRouter()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userIdInput, setUserIdInput] = useState('')

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/register', {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'participant',
      })

      const userId = response?.data?.user?.id
      if (userId) {
        dispatch(setUserId(userId))
        setUserIdInput(userId)
      }

      router.push('/authentication/SignIn')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-3 pt-6 pb-16 relative bg-gray-50 gap-4">
      {/* Left Image for large screens */}
      <div className="hidden lg:flex lg:flex-shrink-0 lg:mr-4">
        <ImageComponent />
      </div>

      {/* Sign-up Card */}
      <div className="w-full max-w-[320px] bg-white border border-gray-300 rounded-lg shadow-md p-3 sm:p-4 flex flex-col gap-4 relative z-10">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/images/logo1.png"
            alt="Al Sharq Logo"
            width={120}
            height={36}
            className="object-contain"
          />

          <h1 className="text-base sm:text-lg font-medium text-gray-800 text-center leading-snug">
            Sign Up to <br />
            <strong className="text-[#9B2033]">AL SHARQ CONFERENCE</strong>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2.5">
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-700">Full Name*</label>
            <div className="relative">
              <input
                type="text"
                name="fullName"
                placeholder="Enter Your Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full h-9 border border-gray-300 rounded-md px-2.5 pr-9 text-sm text-gray-600 focus:outline-none focus:border-gray-500"
                required
              />
              <FaUser className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-700">Email Address*</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Enter Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-9 border border-gray-300 rounded-md px-2.5 pr-9 text-sm text-gray-600 focus:outline-none focus:border-gray-500"
                required
              />
              <FaEnvelope className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter Your Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-9 border border-gray-300 rounded-md px-2.5 text-sm text-gray-600 focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-700">Password*</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Enter Your Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-9 border border-gray-300 rounded-md px-2.5 pr-9 text-sm text-gray-600 focus:outline-none focus:border-gray-500"
                required
              />
              <FaEyeSlash className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-700">Confirm Password*</label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Your Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full h-9 border border-gray-300 rounded-md px-2.5 pr-9 text-sm text-gray-600 focus:outline-none focus:border-gray-500"
                required
              />
              <FaEyeSlash className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {error && <p className="text-red-600 text-xs text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-9 text-white text-sm font-medium rounded-md transition ${loading
                ? 'bg-red-400 cursor-not-allowed'
                : 'bg-red-700 hover:bg-red-800'
              }`}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>

          <div className="flex items-center gap-2">
            <hr className="flex-1 border-gray-300 opacity-20" />
            <span className="text-xs text-gray-500">Or</span>
            <hr className="flex-1 border-gray-300 opacity-20" />
          </div>

           <div className="flex flex-col sm:flex-row gap-1 w-full mt-2">
            <button className="flex items-center justify-center gap-1 flex-1 border border-[#DEDEDE] rounded-lg text-sm text-[#1E1E1E] px-2 py-1.5 hover:bg-gray-100 transition">
              <FaGoogle className="w-4 h-4 text-red-500" />
              Google
            </button>

            <button className="flex items-center justify-center gap-1 flex-1 border border-[#DEDEDE] rounded-lg text-sm text-[#1E1E1E] px-2 py-1.5 hover:bg-gray-100 transition">
              <FaFacebookF className="w-4 h-4 text-blue-600" />
              Facebook
            </button>

            <button className="flex items-center justify-center gap-1 flex-1 border border-[#DEDEDE] rounded-lg text-sm text-[#1E1E1E] px-2 py-1.5 hover:bg-gray-100 transition">
              <FaApple className="w-4 h-4 text-black" />
              Apple
            </button>
          </div>


          <p className="text-xs text-gray-800 text-center mt-1">
            Already have an account?{' '}
            <a className="text-blue-600 hover:underline" href="/authentication/SignIn">
              Sign In
            </a>
          </p>
        </form>
      </div>

      {/* Bottom line image */}
      <div className="absolute bottom-0 left-0 w-full">
        <Image
          src="/images/line.png"
          alt="Line"
          width={1729}
          height={127}
          className="w-full object-contain"
        />
      </div>
    </div>

  )
}
