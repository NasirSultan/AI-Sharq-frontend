'use client'

import React, { useState, useEffect } from 'react'
import { FaUser, FaPlus } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'
import api from '@/config/api'
import { FaSpinner } from 'react-icons/fa'
const EditExhibitorProfile: React.FC = () => {
  const router = useRouter()
  const exhibitorId = useSelector((state: RootState) => state.exhibitor.exhibitorId)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    picUrl: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    twitter: '',
    youtube: '',
  })

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
 console.log(`exhibitors ${exhibitorId}`)

      if (!exhibitorId) return
      try {
        const res = await api.get(`/exhibiteros/${exhibitorId}`)
        if (res.status === 200) {
          setFormData(prev => ({
            ...prev,
            ...res.data,
            picUrl: res.data.picUrl || '',
          }))
        }
      } catch (err) {
        console.error('Error fetching exhibitor', err)
      }
    }
    fetchData()
  }, [exhibitorId])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setFormData(prev => ({ ...prev, picUrl: URL.createObjectURL(selectedFile) }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!exhibitorId) return

    setLoading(true)

    try {
      const form = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value as string)
      })
      if (file) form.append('file', file)

      const res = await api.patch(`/exhibiteros/${exhibitorId}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (res.status === 200) {
        router.push('/Exhibitors/ManageSessions')
      }
    } catch (err) {
      console.error('Error updating exhibitor', err)
    } finally {
      setLoading(false)
    }
  }

interface LoadingButtonProps {
  text: string
  loading: boolean
  onClick?: () => void
  color?: string
}
    const goToBooth = () => {
    router.push('/Exhibitors/add-representative')
  }


    const goToProducts = () => {
    router.push('/Exhibitors/product-exhibitors')
  }




const LoadingButton: React.FC<LoadingButtonProps> = ({
  text,
  loading,
  onClick,
  color = 'bg-red-600',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`py-3 px-6 rounded-xl text-white flex items-center justify-center gap-2 
        ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'} ${color}`}
    >
      {loading && <FaSpinner className="animate-spin" />}
      {loading ? 'Please wait...' : text}
    </button>
  )
}




  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 pt-4">
      <div className="bg-white border border-gray-300 rounded-2xl shadow-lg p-10 w-full max-w-7xl">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-2xl font-medium text-gray-900 text-center">Edit Exhibitor Profile</h1>

          <div className="relative">
            <div className="w-32 h-32 bg-red-100 border-4 border-white rounded-full shadow-md flex items-center justify-center overflow-hidden">
              {formData.picUrl ? (
                <img src={formData.picUrl} alt="Exhibitor Logo" className="w-full h-full object-cover" />
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
              {['name', 'email', 'phone', 'location', 'website', 'linkedin', 'twitter', 'youtube'].map(field => (
                <div key={field} className="flex flex-col gap-1">
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={formData[field as keyof typeof formData] || ''}
                    onChange={handleInputChange}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl"
                  />
                </div>
              ))}
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

            <button
              type="submit"
              disabled={loading}
              className="py-4 bg-red-700 text-white rounded-xl disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Update & Save'}
            </button>
        
       <div className="flex flex-col md:flex-row gap-4 w-full">
              <button
                type="button"
                onClick={goToBooth}
                className="py-4 px-6 bg-gray-800 text-white rounded-xl w-full"
              >
                Add Representatives
              </button>
              <button
                type="button"
                onClick={goToProducts}
                className="py-4 px-6 bg-red-600 text-white rounded-xl w-full"
              >
                Go to Products
              </button>
            </div>
        
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditExhibitorProfile
