'use client'

import React, { useState, useEffect } from 'react'
import { FaUser, FaEye, FaEyeSlash, FaSpinner, FaPlus } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'
import api from '@/config/api'

const EditSponsorProfile: React.FC = () => {
  const router = useRouter()
  const sponsorId = useSelector((state: RootState) => state.sponsor.sponsorId)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    Pic_url: '',
    email: '',
    phone: '',
    category: '',
    password: '', // will always stay empty unless changed
    website: '',
    linkedin: '',
    twitter: '',
    youtube: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!sponsorId) return
      try {
        const res = await api.get(`/sponsors/${sponsorId}`)
        if (res.status === 200) {
          const { password, ...dataWithoutPassword } = res.data
          setFormData({ ...dataWithoutPassword, password: '' }) // never prefill password
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [sponsorId])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setFormData(prev => ({ ...prev, Pic_url: URL.createObjectURL(e.target.files[0]) }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sponsorId) return

    setLoading(true)
    const form = new FormData()

    // Add all fields except id
    Object.keys(formData).forEach(key => {
      const value = (formData as any)[key]
      if (key !== 'id' && key !== 'password') {
        form.append(key, value || '')
      }
    })

    // Only append password if user entered a new one
    if (formData.password && formData.password.trim() !== '') {
      form.append('password', formData.password)
    }

    // Append file if selected
    if (file) form.append('file', file)

    try {
      await api.patch(`/sponsors/${Number(sponsorId)}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      router.push('/sponsors/ManageSessions')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
 <div className="w-full max-w-6xl mx-auto flex justify-center items-center min-h-screen bg-gray-50 pt-4 mx-2">
        <div className="bg-white border mx-2 border-gray-300 rounded-2xl shadow-lg p-10 w-full max-w-6xl">
          <div className="flex flex-col items-center gap-8">
            <h1 className="text-2xl font-medium text-gray-900 text-center">
              Edit Sponsor Profile
            </h1>

            <div className="relative">
              <div className="w-32 h-32 bg-red-100 border-4 border-white rounded-full shadow-md flex items-center justify-center overflow-hidden">
                {formData.Pic_url ? (
                  <img
                    src={formData.Pic_url}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <FaUser className="text-4xl text-red-600" />
                )}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 w-11 h-11 bg-red-600 rounded-full shadow-md flex items-center justify-center"
                onClick={() => document.getElementById('profile-upload')?.click()}
              >
                <FaPlus className="text-white text-lg" />
              </button>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl"
                    required
                  >
                    <option value="">Select Category</option>
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

                <div className="flex flex-col gap-1 relative md:col-span-2">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    placeholder="Password cannot be changed"
                    disabled
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>

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

              <div className="flex flex-col gap-4 pt-4 w-full">
                <button
                  type="submit"
                  disabled={loading}
                  className="py-3 px-6 bg-red-900 text-white rounded-xl cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 text-base sm:text-sm"
                >
                  {loading ? <FaSpinner className="animate-spin text-xl  bg-red-900" /> : 'Update & Save'}
                </button>


                <div className="flex flex-row gap-4 w-full flex-wrap">
                  <button
                    type="button"
                    onClick={() => router.push('/sponsors/sponsorsproducts')}
                    className="flex-1 py-3 text-red-900 border border-red-900 rounded-full hover:bg-red-900 hover:text-white transition cursor-pointer text-sm sm:text-xs text-center"
                  >
                    Add New Service
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/sponsors/representatives')}
                    className="flex-1 py-3 text-red-900 border border-red-900 rounded-full hover:bg-red-900 hover:text-white transition cursor-pointer text-sm sm:text-xs text-center"
                  >
                    Add New Representative
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>

      <img src="/images/line.png" alt="Logo" className="absolute w-full" />
    </>
  )
}

export default EditSponsorProfile
