'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'
import Image from 'next/image'
import api from '@/config/api'

export default function SetUpYourProfile() {
  const router = useRouter()

  // Get speaker ID from Redux store
  const speakerId = useSelector((state: RootState) => state.speaker.speakerId)

  const [loading, setLoading] = useState(false)

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

  const [designations, setDesignations] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])

  // Fetch speaker data and fill form
  useEffect(() => {
    if (!speakerId) return

    const fetchSpeaker = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/speakers/${speakerId}`)
        const data = res.data
        console.log('Speaker API response:', data)

        setFormData({
          bio: data.bio || '',
          expertise: data.expertise ? data.expertise.join(', ') : '',
          website: data.website || '',
          facebook: data.facebook || '',
          linkedin: data.linkedin || '',
          orgInput: '',
          tagInput: '',
          country: data.country || 'Pakistan',
        })

        setDesignations(data.designations || [])
        setTags(data.tags || [])
      } catch (err: any) {
        console.error('Error loading speaker:', err.response?.data || err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSpeaker()
  }, [speakerId])

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle designations input
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

  // Handle tags input
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

  // Submit speaker update
  const handleSpeakerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!speakerId) {
      console.error('Speaker ID not found')
      return
    }

    setLoading(true)
    const payload = {
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
      const res = await api.patch(`/speakers/${speakerId}`, payload)
      console.log('Speaker updated:', res.data)
      router.push('/speakers/ManageSessions')
    } catch (err: any) {
      console.error('Error updating speaker:', err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
  <div className="bg-white rounded-2xl shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl mx-4 max-h-[90vh] overflow-auto p-6 md:p-10">
    <div className="flex justify-center mb-6">
      <Image src="/images/logo1.png" alt="Logo" width={100} height={100} />
    </div>

    {loading && <p className="text-center text-gray-500 mb-6">Loading data, please wait...</p>}

    {!loading && (
      <>
        <h1 className="text-2xl font-medium text-gray-900 text-center mb-2">
          Update Speaker Profile
        </h1>
        <form onSubmit={handleSpeakerSubmit} className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Designations</label>
          <input
            type="text"
            name="orgInput"
            value={formData.orgInput}
            onChange={handleInputChange}
            onKeyDown={handleOrgKeyDown}
            placeholder="Type and press Enter"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500"
          />
          <div className="flex flex-wrap gap-1 mt-1">
            {designations.map((d, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded-full flex items-center gap-1 text-sm"
              >
                {d}
                <button type="button" onClick={() => removeDesignation(d)}>×</button>
              </span>
            ))}
          </div>

          <label className="font-medium text-gray-700 mt-2">Tags</label>
          <input
            type="text"
            name="tagInput"
            value={formData.tagInput}
            onChange={handleInputChange}
            onKeyDown={handleTagKeyDown}
            placeholder="Keynote Speaker, Workshop"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500"
          />
          <div className="flex flex-wrap gap-1 mt-1">
            {tags.map((t, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-green-200 text-green-800 rounded-full flex items-center gap-1 text-sm"
              >
                {t}
                <button type="button" onClick={() => removeTag(t)}>×</button>
              </span>
            ))}
          </div>

          <label className="font-medium text-gray-700 mt-2">Expertise</label>
          <input
            type="text"
            name="expertise"
            value={formData.expertise}
            onChange={handleInputChange}
            placeholder="AI, ML, NLP"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500"
          />

          <label className="font-medium text-gray-700 mt-2">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Describe yourself"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 resize-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="py-3 bg-red-900 text-white rounded-xl hover:bg-red-800 mt-3"
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
