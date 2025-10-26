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

      router.push('/participants/vanue')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center gap-20">
      <ImageComponent />

      <div className="w-[525px] h-[926px] bg-white border border-gray-300 rounded-2xl shadow-lg p-10 flex gap-10 m-14">
        <div className="w-[525px] flex flex-col items-center gap-10">
          <Image
            src="/images/logo1.png"
            alt="Al Sharq Logo"
            width={157}
            height={47}
            className="w-[157px] h-[47px]"
          />

          <h1 className="text-2xl font-medium text-gray-800 text-center leading-tight">
            Sign Up to <br />{' '}
            <strong className="text-[#9B2033]">AL SHARQ CONFERENCE</strong>
          </h1>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[405px] flex flex-col gap-6"
          >
            <div className="flex flex-col gap-3">
              <label className="text-base font-normal text-gray-700">
                Full Name*
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter Your Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full h-[53px] border border-gray-300 rounded-lg px-5 py-4 text-base text-gray-400 focus:outline-none focus:border-gray-500"
                  required
                />
                <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-base font-normal text-gray-700">
                Email Address*
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Your Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-[53px] border border-gray-300 rounded-lg px-5 py-4 text-base text-gray-400 focus:outline-none focus:border-gray-500"
                  required
                />
                <FaEnvelope className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-base font-normal text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter Your Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full h-[53px] border border-gray-300 rounded-lg px-5 py-4 text-base text-gray-400 focus:outline-none focus:border-gray-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-base font-normal text-gray-700">
                Password*
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Your Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-[53px] border border-gray-300 rounded-lg px-5 py-4 text-base text-gray-400 focus:outline-none focus:border-gray-500"
                  required
                />
                <FaEyeSlash className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-base font-normal text-gray-700">
                Confirm Password*
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Your Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full h-[53px] border border-gray-300 rounded-lg px-5 py-4 text-base text-gray-400 focus:outline-none focus:border-gray-500"
                  required
                />
                <FaEyeSlash className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-[54px] text-white text-base font-medium rounded-lg transition ${
                loading
                  ? 'bg-red-400 cursor-not-allowed'
                  : 'bg-red-700 hover:bg-red-800'
              }`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="flex items-center gap-4">
              <hr className="flex-1 border-gray-300 opacity-20" />
              <span className="text-sm text-gray-500">Or</span>
              <hr className="flex-1 border-gray-300 opacity-20" />
            </div>

            <div className="flex gap-2">
              <button className="flex-1 h-[59px] border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition">
                <FaGoogle className="w-6 h-6" />
                <span className="text-base text-gray-800">Google</span>
              </button>
              <button className="flex-1 h-[59px] border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition">
                <FaFacebookF className="w-6 h-6" />
                <span className="text-base text-gray-800">Facebook</span>
              </button>
              <button className="flex-1 h-[59px] border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition">
                <FaApple className="w-6 h-6" />
                <span className="text-base text-gray-800">Apple</span>
              </button>
            </div>

            <p className="text-base text-gray-800 text-center">
              Already have an account?{' '}
              <a className="text-blue-600" href="/authentication/SignIn">
                Sign In
              </a>
            </p>
          </form>
        </div>
      </div>
      <Image
        src="/images/line.png"
        alt="Logo"
        width={1729}
        height={127}
        className="absolute top-[1010px]"
      />
    </div>
  )
}
