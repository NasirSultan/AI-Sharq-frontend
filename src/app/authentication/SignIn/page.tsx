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
import LoadingButton from './../../components/LoadingButton'

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [loading, setLoading] = useState(false)
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

      const { token, user } = res.data

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

        if (user.role === 'participant') router.push('/participants/vanue')
        else if (user.role === 'speaker') router.push('/speakers/ManageSessions')
        else if (user.role === 'organizer') router.push('/Organizer/Dashboard')
        else if (user.role === 'sponsor') router.push('/sponsors/ManageSessions')
        else if (user.role === 'exhibitor') router.push('/Exhibitors/ManageSessions')
        else router.push('/authentication/SignIn')
      }
    } catch (err) {
      console.error('Login failed', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-10 mt-10 mr-6 items-center justify-center lg:justify-start">
      <div className="hidden lg:block">
        <ImageComponent />
      </div>

      <div className="relative w-full max-w-[450px] h-auto bg-white border border-gray-300 rounded-[20px] shadow-[0px_4px_110.3px_rgba(68,68,68,0.25)] p-8 flex flex-col gap-10">
        <div className="flex flex-col items-center mb-4">
          <Image
            src="/images/logo1.png"
            alt="Al Sharq Logo"
            width={157}
            height={47}
            className="object-contain mb-[30px]"
          />
          <h1 className="text-2xl font-medium text-gray-800 text-center leading-tight">
            Sign In to <br />
            <strong className="text-[#9B2033]">AL SHARQ CONFERENCE</strong>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-[405px]">
          <div className="flex flex-col gap-3 w-full">
            <label className="text-base text-[#262626]">Email Address*</label>
            <div className="flex items-center gap-3 w-full border border-[#DEDEDE] rounded-lg px-4 py-3">
              <input
                type="email"
                name="email"
                placeholder="Enter Your Email Address"
                value={formData.email}
                onChange={handleChange}
                className="text-base text-[#616161] border-none outline-none w-full"
              />
              <FaEnvelope className="w-5 h-5 text-[#9C9C9C]" />
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <label className="text-base text-[#262626]">Password*</label>
            <div className="flex items-center gap-3 w-full border border-[#DEDEDE] rounded-lg px-4 py-3">
              <input
                type="password"
                name="password"
                placeholder="Enter Your Password"
                value={formData.password}
                onChange={handleChange}
                className="text-base text-[#616161] border-none outline-none w-full"
              />
              <FaEyeSlash className="w-5 h-5 text-[#9C9C9C]" />
            </div>
          </div>

          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 bg-white border border-[#282828] rounded"
              />
              <label className="text-base text-[#282828]">Remember me</label>
            </div>
            <Link href="/authentication/ForgetPassword">
              <span className="text-base text-[#9B2033]">Forget Password?</span>
            </Link>
          </div>

          <LoadingButton text="Sign In" loading={loading} color="bg-[#9B2033]" />
        </form>

        <div className="flex flex-col items-center gap-4 w-full max-w-[405px]">
          <div className="flex items-center gap-4 w-full">
            <hr className="flex-1 border border-[#546056] opacity-20" />
            <span className="text-sm text-[#6C7278]">Or</span>
            <hr className="flex-1 border border-[#546056] opacity-20" />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <button className="flex items-center justify-center gap-2 flex-1 border border-[#DEDEDE] rounded-lg text-base text-[#1E1E1E] px-4 py-3">
              <FaGoogle className="w-6 h-6" />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 flex-1 border border-[#DEDEDE] rounded-lg text-base text-[#1E1E1E] px-4 py-3">
              <FaFacebookF className="w-6 h-6" />
              Facebook
            </button>
            <button className="flex items-center justify-center gap-2 flex-1 border border-[#DEDEDE] rounded-lg text-base text-[#1E1E1E] px-4 py-3">
              <FaApple className="w-6 h-6" />
              Apple
            </button>
          </div>
        </div>

        <p className="text-base text-center text-[#282828]">
          New to website?{' '}
          <a className="text-blue-600" href="/authentication/SignUp">
            Sign Up
          </a>
        </p>
      </div>

      <Image
        src="/images/line.png"
        alt="Logo"
        width={1729}
        height={127}
        className="absolute top-[1010px]"
      />

      <style jsx>{`
        @media (max-width: 1024px) {
          .absolute {
            position: static;
          }
        }
        @media (max-width: 768px) {
          .p-8 {
            padding: 1.5rem;
          }
          .gap-10 {
            gap: 2rem;
          }
        }
        @media (max-width: 480px) {
          .text-2xl {
            font-size: 1.25rem;
          }
          .rounded-[20px] {
            border-radius: 12px;
          }
        }
      `}</style>
    </div>
  )
}
