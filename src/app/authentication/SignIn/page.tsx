'use client'

import { useState } from 'react'
import Image from 'next/image'
import ImageComponent from '../../components/Images'
import { FaEnvelope, FaEyeSlash, FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/config/api'
import { useDispatch } from 'react-redux'
import { setUserId } from '@/lib/store/features/user/userSlice'
import { setSpeakerId } from '@/lib/store/features/speaker/speakerSlice'
import { setSponsorId } from "@/lib/store/features/sponsor/sponsorSilice"
import { setExhibitorId } from "@/lib/store/features/exhibitor/exhibitorSlice"
import { setEventId } from "@/lib/store/features/event/eventSlice"

import LoadingButton from './../../components/LoadingButton'

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      })

      const { token, user, latestEventId } = res.data

      if (user && user.role) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('token', token || '')
          window.localStorage.setItem('role', user.role || '')
          if (user.role !== 'sponsor' && user.role !== 'exhibitor') {
            window.localStorage.setItem('userId', user.id?.toString() || '')
            window.localStorage.setItem('name', user.name || '')
            window.localStorage.setItem('picUrl', user.picUrl || user.Pic_url || '')
          } else {
            window.localStorage.setItem('name', user.name || '')
            window.localStorage.setItem('picUrl', user.picUrl || user.Pic_url || '')
          }
          sessionStorage.setItem('cameFromApp', 'true')
        }


        if (latestEventId) {
          dispatch(setEventId(latestEventId))
        }

        if (user.role !== 'sponsor' && user.role !== 'exhibitor') {
          dispatch(setUserId(user.id))
        }
        if (user.role === 'speaker' && user.speakerId) {
          dispatch(setSpeakerId(user.speakerId))
        }
        if (user.role === 'sponsor' && user.sponsorId) {
          dispatch(setSponsorId(user.sponsorId))
        }
        if (user.role === 'exhibitor' && user.exhibitorId) {
          dispatch(setExhibitorId(user.exhibitorId))
        }

        if (user.role === 'participant') router.push('/participants/Home')
        else if (user.role === 'speaker') router.push('/speakers/ManageSessions')
        else if (user.role === 'organizer') router.push('/Organizer/Dashboard')
        else if (user.role === 'sponsor') router.push('/sponsors/ManageSessions')
        else if (user.role === 'exhibitor') router.push('/Exhibitors/ManageSessions')
      else if (user.role === 'registrationteam') router.push('/registrationteam')
        else router.push('/authentication/SignIn')
      }
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        setError('You have been blocked')
      } else if (err.response && err.response.status === 401) {
        setError('Incorrect email or password')
      } else {
        setError('Something went wrong')
      }

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 md:px-10 pt-10 pb-32 relative bg-gray-50">
      {/* Left Image for large screens */}
      <div className="hidden lg:flex lg:flex-shrink-0 lg:mr-10">
        <ImageComponent />
      </div>

      {/* Sign-in Card */}
      <div className="relative w-full max-w-[400px] bg-white border border-gray-300 rounded-2xl shadow-md p-4 sm:p-6 flex flex-col gap-4 z-10">
        <div className="flex flex-col items-center mb-3">
          <Image
            src="/images/logo1.png"
            alt="Al Sharq Logo"
            width={120}
            height={36}
            className="object-contain mb-4"
          />
          <h1 className="text-lg sm:text-xl font-medium text-gray-800 text-center leading-snug">
          Login to <br />
            <strong className="text-[#9B2033]">AL SHARQ CONFERENCE</strong>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm text-[#262626]">Email Address*</label>
            <div className="flex items-center gap-2 w-full border border-[#DEDEDE] rounded-lg px-2 py-1.5">
              <input
                type="email"
                name="email"
                placeholder="Enter Your Email Address"
                value={formData.email}
                onChange={handleChange}
                className="text-sm text-[#616161] border-none outline-none w-full"
              />
              <FaEnvelope className="w-4 h-4 text-[#9C9C9C]" />
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
  <label className="text-sm text-[#262626]">Password*</label>
  <div className="flex items-center gap-2 w-full border border-[#DEDEDE] rounded-lg px-2 py-1.5">
    <input
      type={showPassword ? 'text' : 'password'}
      name="password"
      placeholder="Enter Your Password"
      value={formData.password}
      onChange={handleChange}
      className="text-sm text-[#616161] border-none outline-none w-full"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="text-gray-500 w-5 h-5"
    >
      {showPassword ? <FaEyeSlash /> : <FaEyeSlash />}
    </button>
  </div>
</div>


          <div className="flex items-center justify-between w-full mt-2">
            <label className="flex items-center gap-1 text-sm text-[#282828]">
             <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-3 h-3 mb-1 border border-[#282828] rounded cursor-pointer"
              />  Remember me
             
            </label>

            <Link href="/authentication/OtpVarification">
              <span className="text-sm text-[#9B2033] hover:underline">
                Forget Password?
              </span>
            </Link>
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <LoadingButton text="Login" loading={loading} color="bg-[#9B2033]" />
        </form>

        {/* <div className="flex flex-col items-center gap-3 w-full mt-3">
          <div className="flex items-center gap-2 w-full">
            <hr className="flex-1 border border-[#546056] opacity-20" />
            <span className="text-xs text-[#6C7278]">Or</span>
            <hr className="flex-1 border border-[#546056] opacity-20" />
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




        </div> */}

        <p className="text-sm text-center text-[#282828] mt-3">
          New to website?{' '}
          <a className="text-blue-600 hover:underline" href="/authentication/SignUp">
            Sign Up
          </a>
        </p>
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

      <style jsx>{`
    @media (max-width: 1024px) {
      .lg\\:flex {
        display: none !important;
      }
    }
    @media (max-width: 768px) {
      .p-6 {
        padding: 1.5rem;
      }
      .gap-6 {
        gap: 1.25rem;
      }
    }
    @media (max-width: 480px) {
      .text-xl {
        font-size: 1rem;
      }
      .rounded-2xl {
        border-radius: 12px;
      }
      .px-4 {
        padding-left: 1rem;
        padding-right: 1rem;
      }
    }
  `}</style>
    </div>



  )
}
