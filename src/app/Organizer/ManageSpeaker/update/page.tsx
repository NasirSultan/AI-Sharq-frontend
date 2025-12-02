'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import api from '@/config/api'

interface SetUpYourProfileProps {
  speakerId: number
  onClose?: () => void
}

const SetUpYourProfile: React.FC<SetUpYourProfileProps> = ({ speakerId, onClose }) => {
  const router = useRouter()
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

  // load speaker info based on given id
  useEffect(() => {
    const fetchSpeaker = async () => {
      if (!speakerId) return
      setLoading(true)
      try {
        const res = await api.get(`/speakers/${speakerId}`)
        const data = res.data

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

const handleSpeakerSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
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
    await api.patch(`/speakers/${speakerId}`, payload)
    if (onClose) onClose()
    else router.push('/Organizer/ManageSpeaker')
  } catch (err: any) {
    console.error('Error updating speaker:', err.response?.data || err.message)
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <button
  type="button"
  onClick={() => onClose && onClose()}
>
  ×
</button>
      
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-auto p-8 md:p-10">
       <div className="relative mb-6 flex justify-center">
  <div className="w-34 h-24 relative">
    <Image
      src="/images/logo1.png"
      alt="Logo"
      fill
      className="object-contain"
    />
  </div>

  <button
    type="button"
    onClick={() => onClose && onClose()}
    className="absolute top-0 right-0 text-gray-500 hover:text-red-700 text-2xl font-bold"
  >
    ×
  </button>
</div>

<h1 className="text-2xl font-medium text-gray-900 text-center mb-10">
  Set Up Speaker Profile
</h1>


        {loading && (
          <p className="text-center text-gray-500 mb-4">Loading...</p>
        )}

        {!loading && (
          <form onSubmit={handleSpeakerSubmit} className="flex flex-col gap-4">
            <label className="font-medium text-gray-700">Designations</label>
            <input
              type="text"
              name="orgInput"
              value={formData.orgInput}
              onChange={handleInputChange}
              onKeyDown={handleOrgKeyDown}
              placeholder="Type and press Enter"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {designations.map((d, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full flex items-center gap-2 text-sm"
                >
                  {d}
                  <button type="button" onClick={() => removeDesignation(d)}>×</button>
                </span>
              ))}
            </div>

            <label className="font-medium text-gray-700 mt-4">Tags</label>
            <input
              type="text"
              name="tagInput"
              value={formData.tagInput}
              onChange={handleInputChange}
              onKeyDown={handleTagKeyDown}
              placeholder="Keynote Speaker, Workshop"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((t, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-green-200 text-green-800 rounded-full flex items-center gap-2 text-sm"
                >
                  {t}
                  <button type="button" onClick={() => removeTag(t)}>×</button>
                </span>
              ))}
            </div>

            <label className="font-medium text-gray-700 mt-4">Expertise</label>
            <input
              type="text"
              name="expertise"
              value={formData.expertise}
              onChange={handleInputChange}
              placeholder="AI, ML, NLP"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <label className="font-medium text-gray-700 mt-4">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <label className="font-medium text-gray-700 mt-4">Facebook</label>
            <input
              type="url"
              name="facebook"
              value={formData.facebook}
              onChange={handleInputChange}
              placeholder="https://facebook.com/example"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <label className="font-medium text-gray-700 mt-4">LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/example"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <label className="font-medium text-gray-700 mt-4">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Describe yourself"
              rows={6}
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="py-4 bg-red-900 text-white rounded-xl hover:bg-red-800 mt-4"
            >
              {loading ? 'Saving...' : 'Save & Finish'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default SetUpYourProfile
