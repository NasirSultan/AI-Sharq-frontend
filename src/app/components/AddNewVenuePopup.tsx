'use client'
import React, { useEffect, useState } from 'react'
import { FaUpload } from 'react-icons/fa'
import Image from 'next/image'
import api from '@/config/api'

type AddNewVenuePopupProps = {
  isOpen: boolean
  onClose: () => void
}

type Sponsor = {
  id: number
  name: string
  email: string
  picUrl?: string
}

type Exhibitor = {
  id: number
  name: string
  email: string
  picUrl?: string
}

const AddNewVenuePopup = ({ isOpen, onClose }: AddNewVenuePopupProps) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([])
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null)
  const [selectedExhibitor, setSelectedExhibitor] = useState<Exhibitor | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [googleMapLink, setGoogleMapLink] = useState('')
  const [mapStatus, setMapStatus] = useState(true)

  useEffect(() => {
    if (!isOpen) return

    api.get('/sponsors/event/short-info')
      .then(res => setSponsors(res.data))
      .catch(err => console.error(err))

    api.get('/exhibiteros/event/short-info')
      .then(res => setExhibitors(res.data))
      .catch(err => console.error(err))
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!title || !selectedSponsor || !selectedExhibitor || !googleMapLink || !location) {
      alert('Please fill all required fields')
      return
    }

    const payload = {
      title,
      description,
      location,
      googleMapLink,
      mapstatus: mapStatus,
      sponsors: [{ id: selectedSponsor.id }],
      exhibitors: [{ id: selectedExhibitor.id }],
      startTime: new Date().toISOString(),
      endTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString()
    }

    try {
      const res = await api.post('/event', payload)
      console.log('Event created', res.data)
      onClose()
    } catch (err) {
      console.error(err)
      alert('Failed to create event')
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[9998]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-lg relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
          >✕</button>

          <div className="mb-6 flex justify-center">
            <Image src="/images/logo1.png" alt="Logo" width={196} height={58} />
          </div>

          <h2 className="text-center text-[24px] font-medium text-[#282828] mb-8">
            Add New Venue
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-[16px] text-[#262626] mb-2">Map Title*</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter a clear title"
                className="w-full border border-[#DEDEDE] rounded-lg px-4 py-3 text-[#616161] outline-none"
              />
            </div>

            <div>
              <label className="block text-[16px] text-[#262626] mb-2">Assign Sponsor*</label>
              <select
                className="w-full border border-[#DEDEDE] rounded-lg px-4 py-3 text-[#616161] outline-none cursor-pointer"
                value={selectedSponsor?.id || ''}
                onChange={e => {
                  const sponsor = sponsors.find(s => s.id === parseInt(e.target.value))
                  setSelectedSponsor(sponsor || null)
                }}
              >
                <option value="">Select a sponsor</option>
                {sponsors.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[16px] text-[#262626] mb-2">Assign Exhibitor*</label>
              <select
                className="w-full border border-[#DEDEDE] rounded-lg px-4 py-3 text-[#616161] outline-none cursor-pointer"
                value={selectedExhibitor?.id || ''}
                onChange={e => {
                  const exhibitor = exhibitors.find(ex => ex.id === parseInt(e.target.value))
                  setSelectedExhibitor(exhibitor || null)
                }}
              >
                <option value="">Select an exhibitor</option>
                {exhibitors.map(ex => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[16px] text-[#262626] mb-2">Location*</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Enter location"
                className="w-full border border-[#DEDEDE] rounded-lg px-4 py-3 text-[#616161] outline-none"
              />
            </div>

            <div>
              <label className="block text-[16px] text-[#262626] mb-2">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your topic in detail"
                className="w-full h-[115px] border border-[#DEDEDE] rounded-lg px-4 py-3 text-[#616161] resize-none outline-none"
              />
            </div>

            <div>
              <label className="block text-[16px] text-[#262626] mb-2">Upload Media</label>
              <div className="w-full h-[115px] border border-dashed border-[#DEDEDE] rounded-lg flex flex-col items-center justify-center text-[#616161] text-center px-4 cursor-pointer">
                <FaUpload className="text-[#9B2033] text-xl mb-2" />
                <span>Upload Media</span>
                <p className="text-[12px]">Drag and drop your map file here, or click to browse</p>
              </div>
            </div>

            <div>
              <label className="block text-[16px] text-[#262626] mb-2">Add Map Link*</label>
              <input
                type="text"
                value={googleMapLink}
                onChange={e => setGoogleMapLink(e.target.value)}
                placeholder="Add Google Maps link"
                className="w-full border border-[#DEDEDE] rounded-lg px-4 py-3 text-[#616161] outline-none"
              />
            </div>

            <div>
              <label className="block text-[16px] text-[#262626] mb-2">Visibility*</label>
              <div
                className="w-full border border-[#DEDEDE] rounded-lg px-4 py-3 text-[#616161] flex justify-between items-center cursor-pointer"
                onClick={() => setMapStatus(prev => !prev)}
              >
                <span>{mapStatus ? 'Map Visible to Participants' : 'Map Hidden from Participants'}</span>
                <span className="text-[#9B2033]">▼</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full h-[54px] bg-[#9B2033] text-white text-[16px] font-medium rounded-lg"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddNewVenuePopup
