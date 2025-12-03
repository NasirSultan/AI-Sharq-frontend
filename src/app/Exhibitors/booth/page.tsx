'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'
import api from '@/config/api'

const AddBooth: React.FC = () => {
  const router = useRouter()
  const exhibitorId = useSelector((state: RootState) => state.exhibitor.exhibitorId)

  const [formData, setFormData] = useState({
    boothNumber: '',
    boothLocation: '',
    mapLink: '',
    openTime: ''
  })

  const [distance, setDistance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState('')

  // fetch booth details for exhibitor
  useEffect(() => {
    if (!exhibitorId) return

    const fetchBooth = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/booths/exhibitor/${exhibitorId}`)

        if (res.status === 200) {
          const booth = res.data
          setFormData({
            boothNumber: booth.boothNumber || '',
            boothLocation: booth.boothLocation || '',
            mapLink: booth.mapLink || '',
            openTime: booth.openTime || ''
          })
          setDistance(booth.distance)
          setIsEditing(true)
        }
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setMessage('No booth found, you can add a new one')
          setIsEditing(false)
        } else {
          console.log('Error fetching booth', err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBooth()
  }, [exhibitorId])

  // handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!exhibitorId) {
      console.log('Exhibitor ID not found')
      return
    }

    setLoading(true)

    try {
      const payload = {
        exhibitorId,
        boothNumber: formData.boothNumber,
        boothLocation: formData.boothLocation,
        mapLink: formData.mapLink,
        openTime: formData.openTime
      }

      const res = await api.post('/booths', payload)

      if (res.status === 200 || res.status === 201) {
        console.log('Booth saved', res.data)
        setDistance(res.data.distance)
        router.push('/Exhibitors/ManageSessions')
      }
    } catch (err: any) {
      console.log('Error saving booth', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4 gap-6">

      <div className="bg-white border border-gray-300 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-medium text-gray-900 mb-4">
          {isEditing ? 'Edit Booth' : 'Add Booth'}
        </h1>

        {message && (
          <p className="text-sm text-gray-600 mb-4">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label>Booth Number*</label>
            <input
              type="text"
              name="boothNumber"
              value={formData.boothNumber}
              onChange={handleChange}
              placeholder="B12"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              required
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Booth Location*</label>
            <input
              type="text"
              name="boothLocation"
              value={formData.boothLocation}
              onChange={handleChange}
              placeholder="Hall 3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              required
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Map Link</label>
            <input
              type="url"
              name="mapLink"
              value={formData.mapLink}
              onChange={handleChange}
              placeholder="https://maps.google.com/..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Open Time*</label>
            <input
              type="text"
              name="openTime"
              value={formData.openTime}
              onChange={handleChange}
              placeholder="10:00 AM"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`py-3 rounded-xl mt-4 text-white ${loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}`}
            disabled={loading}
          >
            {loading ? (isEditing ? 'Updating Booth...' : 'Adding Booth...') : (isEditing ? 'Update Booth' : 'Add Booth')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddBooth
