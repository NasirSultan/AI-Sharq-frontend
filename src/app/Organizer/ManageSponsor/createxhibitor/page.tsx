'use client'

import React, { useState, useEffect } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import api from '@/config/api'
import Image from 'next/image'

interface Props {
  onClose: () => void
}

const SetUpYourProfile: React.FC<Props> = ({ onClose }) => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    twitter: '',
    youtube: '',
    description: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
const [error, setError] = useState<string>('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/exhibiteros', formData)
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem('exhibitorId', response.data.id.toString())
        window.alert('Profile saved successfully')
        onClose() // closes modal and refreshes parent if needed
        router.push('/Organizer/ManageSponsor')
      }
    } catch (err: any) {
    // type-safe handling
    if (err.response && err.response.data && typeof err.response.data.message === 'string') {
      setError(err.response.data.message)
    } else {
      setError('Something went wrong. Please try again.')
    }
  } finally {
    setLoading(false)
  }
  }

  const handleSkip = () => onClose()

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center  bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-10 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 text-xl"
        >
          ×
        </button>

        <div className="flex flex-col items-center gap-6">
          <div className="flex justify-center mb-6">
            <Image src="/images/logo1.png" alt="Logo" width={100} height={100} />
          </div>
          <h1 className="text-2xl font-medium text-gray-900 text-center">
            Set Up Your Exhibitor Profile
          </h1>
          <p className="text-base text-gray-900 text-center max-w-sm">
            Complete your profile to personalize your event experience and connect with others
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full mt-6">
          <div className="flex flex-col gap-1">
            <label className="text-gray-700">Exhibitor Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Exhibitor Name"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-700">Email*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl"
              required
            />
          </div>

          <div className="flex flex-col gap-1 relative">
            <label className="text-gray-700">Password*</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl pr-12"
              required
            />
            {formData.password.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Location"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-700">Website*</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="Website"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-700">LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              placeholder="LinkedIn"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-700">Twitter</label>
            <input
              type="url"
              name="twitter"
              value={formData.twitter}
              onChange={handleInputChange}
              placeholder="Twitter"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-700">YouTube</label>
            <input
              type="url"
              name="youtube"
              value={formData.youtube}
              onChange={handleInputChange}
              placeholder="YouTube"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              rows={4}
              className="w-full px-5 py-4 border border-gray-300 rounded-xl resize-none"
            />
          </div>

          <div className="flex flex-col gap-4 pt-4">

{error && (
  <p className="text-red-600 text-center text-sm">{error}</p>
)}


            <button
              type="submit"
              className="py-4 bg-red-900 text-white rounded-xl"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save & Continue'}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="py-4 border border-gray-300 rounded-xl"
            >
              Skip for Now
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SetUpYourProfile
