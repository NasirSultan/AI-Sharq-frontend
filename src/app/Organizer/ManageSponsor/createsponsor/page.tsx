'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaUser, FaEye, FaEyeSlash, FaPlus } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import api from '@/config/api'

const SetUpYourProfile: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    Pic_url: '',
    email: '',
    phone: '',
    category: '',
    password: '',
    website: '',
    linkedin: '',
    twitter: '',
    youtube: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
const handleInputChanges = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = e.target
  setFormData(prev => ({ ...prev, [name]: value }))
}

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = { ...formData }

    if (!profileImage && !formData.Pic_url) {
      payload.Pic_url = 'https://al-sharq.fra1.digitaloceanspaces.com/images%20%2814%29.jpg'
    } else if (profileImage) {
      payload.Pic_url = URL.createObjectURL(profileImage)
    }

    try {
      const response = await api.post('/sponsors', payload)

      if (response.status === 200 || response.status === 201) {
        alert('Sponsor profile created successfully')

        localStorage.setItem('sponsorId', response.data.id.toString())

        // Reset form for new entry
        setFormData({
          name: '',
          description: '',
          Pic_url: '',
          email: '',
          phone: '',
          category: '',
          password: '',
          website: '',
          linkedin: '',
          twitter: '',
          youtube: '',
        })
        setProfileImage(null)
      } else {
        console.log('Unexpected response', response.data)
      }
    } catch (err: any) {
  const message = err.response?.data?.message || 'Something went wrong'
  setError(message)
}
finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4  bg-opacity-550">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-10 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 text-xl"
        >
          ×
        </button>

        <div className="flex flex-col items-center gap-8">
          <div className="flex justify-center mb-6">
            <Image src="/images/logo1.png" alt="Logo" width={100} height={100} />
          </div>

          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-medium text-gray-900 text-center">
              Set Up Your Sponsor Profile
            </h1>
            <p className="text-base text-gray-900 text-center max-w-sm">
              Complete your profile to personalize your event experience and connect with others
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-1">
              <label>Sponsor Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Sponsor Name"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>Email*</label>
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

            <div className="flex flex-col gap-1">
              <label>Phone</label>
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
  <label>Category*</label>
  <select
    name="category"
    value={formData.category}
    onChange={handleInputChanges}
    className="w-full px-5 py-4 border border-gray-300 rounded-xl"
    required
  >
    <option value="" disabled>
      Select Category
    </option>
    <option value="Gold">Gold</option>
    <option value="Silver">Silver</option>
  </select>
</div>


            <div className="flex flex-col gap-1">
              <label>Website*</label>
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
              <label>LinkedIn</label>
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
              <label>Twitter</label>
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
              <label>YouTube</label>
              <input
                type="url"
                name="youtube"
                value={formData.youtube}
                onChange={handleInputChange}
                placeholder="YouTube"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1 relative">
              <label>Password*</label>
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
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label>Description</label>
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
              <button
                type="submit"
                className="py-4 bg-red-900 text-white rounded-xl flex justify-center items-center gap-2"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save & Continue'}
              </button>
           
            </div>
          {error && (
  <p className="text-red-600 text-center text-sm">{error}</p>
)}

          </form>
        </div>
      </div>
    </div>
  )
}

export default SetUpYourProfile
