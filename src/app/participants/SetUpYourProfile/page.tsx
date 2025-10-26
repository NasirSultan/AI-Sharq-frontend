'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'
import api from '@/config/api'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaUser } from 'react-icons/fa'

export default function ProfileSetup() {
  const router = useRouter()
  const userId = useSelector((state: RootState) => state.user.userId)

  const [formData, setFormData] = useState({
    fullName: '',
    organization: '',
    email: '',
    file: '',
  })

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('')

  // Load user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/admin/users/${userId}`)
        const user = res.data
        setFormData({
          fullName: user.name || '',
          organization: user.organization || '',
          email: user.email || '',
          file: user.file || '',
        })
        setRole(user.role || '')
      } catch (err) {
        console.error('Error loading user data', err)
      }
    }

    if (userId) fetchUser()
  }, [userId])

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFormData({ ...formData, file: URL.createObjectURL(selectedFile) })
    }
  }

  // Save profile
  const handleSubmit = async () => {
    if (!formData.fullName || !formData.organization) return

    const data = new FormData()
    data.append('name', formData.fullName)
    data.append('organization', formData.organization)
    if (file) data.append('file', file)

    try {
      setLoading(true)
      await api.patch(`/auth/update/${userId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      // Redirect based on role
      if (role === 'speaker') {
        router.push('/speakers/SetUpYourProfile')
      } else if (role === 'organizer') {
        router.push('/Organizer/Dashboard')
      }
      else {
        router.push('/participants/Home')
      }
    } catch (err) {
      console.error('Error updating profile', err)
    } finally {
      setLoading(false)
    }
  }

  // Skip button redirect based on role
  const handleSkip = () => {
    if (role === 'speaker') {
      router.push('/speakers/ManageSessions')
    } else if (role === 'organizer') {
        router.push('/Organizer/Dashboard')
      }
     else {
      router.push('/participants/Home')
    }
  }

  return (
    <>
      <div className="bg-white min-h-screen w-full flex items-center justify-center relative">
        <div className="bg-white w-full max-w-md rounded-xl shadow-xl px-8 py-10 z-10 flex flex-col items-center gap-6">
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            Set Up Your Profile
          </h2>
          <p className="text-sm text-gray-500 text-center max-w-sm">
            Complete your profile to personalize your event experience and connect with others
          </p>

          <div className="w-24 h-24 rounded-full bg-[#F7DADC] flex items-center justify-center text-[#9B2033] text-4xl overflow-hidden">
            {formData.file ? (
              <img
                src={formData.file}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser />
            )}
          </div>

          <label
            htmlFor="file"
            className="text-sm font-medium text-gray-700 cursor-pointer hover:underline"
          >
            Upload or Take Photo
          </label>
          <input
            type="file"
            id="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="w-full flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-700">Full Name*</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm text-gray-800"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-700">Organization*</label>
              <input
                type="text"
                name="organization"
                placeholder="Enter your organization"
                value={formData.organization}
                onChange={handleChange}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm text-gray-800"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-700">Contact Email*</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                disabled
                className="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm text-gray-500 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full h-12 text-white text-sm font-semibold rounded-lg transition ${loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#9B2033] hover:bg-[#7c1a2a]'
                }`}
            >
              {loading ? 'Saving...' : 'Save & Continue'}
            </button>

            <p
              onClick={handleSkip}
              className="text-sm text-center text-gray-500 cursor-pointer hover:underline"
            >
              Skip for now
            </p>
          </div>
        </div>
      </div>

      <Image
        src="/images/line.png"
        alt="Line"
        width={1440}
        height={100}
        className="w-full mt-10"
      />
    </>
  )
}
