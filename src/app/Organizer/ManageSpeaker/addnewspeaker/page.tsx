'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import api from '@/config/api'

const SetUpYourProfile: React.FC = () => {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'speaker',
  })

  const [formData, setFormData] = useState({
    bio: '',
    expertise: '',
    website: '',
    facebook: '',
    linkedin: '',
    orgInput: '',
    tagInput: '',
    country: 'Pakistan',
  })

  const [designations, setDesignations] = useState<string[]>(['Middle East Institute'])
  const [tags, setTags] = useState<string[]>(['workshop', 'Innovation'])

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleOrgKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmed = formData.orgInput.trim()
      if (trimmed && !designations.includes(trimmed)) {
        setDesignations(prev => [...prev, trimmed])
        setFormData(prev => ({ ...prev, orgInput: '' }))
      }
    }
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmed = formData.tagInput.trim()
      if (trimmed && !tags.includes(trimmed)) {
        setTags(prev => [...prev, trimmed])
        setFormData(prev => ({ ...prev, tagInput: '' }))
      }
    }
  }

  const removeDesignation = (d: string) => setDesignations(prev => prev.filter(item => item !== d))
  const removeTag = (t: string) => setTags(prev => prev.filter(item => item !== t))

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/register', userData)
      if (res.data && res.data.user && res.data.user.id) {
        setUserId(res.data.user.id)
        setStep(2)
      }
    } catch (err: any) {
      console.error(err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSpeakerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setLoading(true)

    const payload = {
      userId,
      designations,
      bio: formData.bio,
      expertise: formData.expertise.split(',').map(e => e.trim()).filter(Boolean),
      website: formData.website || null,
      facebook: formData.facebook || null,
      linkedin: formData.linkedin || null,
      tags,
      country: formData.country,
      featured: true,
      verified: true,
      priority: 1,
      isActive: true,
    }

    try {
      const res = await api.post('/speakers', payload)
      if (res.data && res.data.id) {
        router.push('/Organizer/ManageSpeaker') // redirect to speaker list page
      }
    } catch (err: any) {
      console.error(err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8 md:p-10">
        <div className="flex justify-center mb-6">
          <Image src="/images/logo1.png" alt="Logo" width={100} height={100} />
        </div>

        {step === 1 && (
          <>
            <h1 className="text-2xl font-medium text-gray-900 text-center mb-6">Register Speaker</h1>
            <form onSubmit={handleUserSubmit} className="flex flex-col gap-3">
              <label className="text-red-900 text-sm">Full Name*</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleUserChange}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
              />

              <label className="text-red-900 text-sm">Email*</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleUserChange}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
              />

              <label className="text-red-900 text-sm">Password*</label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleUserChange}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 mt-4"
              >
                {loading ? 'Loading...' : 'Next'}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl font-medium text-gray-900 text-center mb-4">Set Up Speaker Profile</h1>
            <form onSubmit={handleSpeakerSubmit} className="flex flex-col gap-3">
              <label className="font-medium text-red-900 text-sm">Designations*</label>
              <input
                type="text"
                name="orgInput"
                value={formData.orgInput}
                onChange={handleInputChange}
                onKeyDown={handleOrgKeyDown}
                placeholder="Type and press Enter"
                className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
              />
              <div className="flex flex-wrap gap-2 mt-1">
                {designations.map((d, i) => (
                  <span key={i} className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full flex items-center gap-1 text-xs">
                    {d}
                    <button type="button" onClick={() => removeDesignation(d)}>×</button>
                  </span>
                ))}
              </div>

              <label className="font-medium text-red-900 text-sm mt-3">Tags*</label>
              <input
                type="text"
                name="tagInput"
                value={formData.tagInput}
                onChange={handleInputChange}
                onKeyDown={handleTagKeyDown}
                placeholder="Keynote Speaker, Workshop"
                className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
              />
              <div className="flex flex-wrap gap-2 mt-1">
                {tags.map((t, i) => (
                  <span key={i} className="px-2 py-1 bg-green-200 text-green-800 rounded-full flex items-center gap-1 text-xs">
                    {t}
                    <button type="button" onClick={() => removeTag(t)}>×</button>
                  </span>
                ))}
              </div>

              <label className="font-medium text-red-900 text-sm mt-3">Expertise*</label>
              <input
                type="text"
                name="expertise"
                value={formData.expertise}
                onChange={handleInputChange}
                placeholder="AI, ML, NLP"
                className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
              />

              <label className="font-medium text-red-900 text-sm mt-3">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
              />

              <label className="font-medium text-red-900 text-sm mt-3">Facebook</label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                placeholder="https://facebook.com/example"
                className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
              />

              <label className="font-medium text-red-900 text-sm mt-3">LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/example"
                className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
              />

              <label className="font-medium text-red-900 text-sm mt-3">Bio*</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Describe yourself"
                rows={4}
                className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none text-sm"
              />

              <button
                type="submit"
                disabled={loading}
                className="py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 mt-3 text-sm"
              >
                {loading ? 'Saving...' : 'Save & Finish'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default SetUpYourProfile
