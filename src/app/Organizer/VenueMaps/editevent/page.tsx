'use client'
import React, { useEffect, useState } from 'react'
import { FaUpload } from 'react-icons/fa'
import Image from 'next/image'
import api from '@/config/api'

type AddNewVenuePopupProps = {
  isOpen: boolean
  onClose: () => void
  eventId?: number
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

const AddNewVenuePopup = ({ isOpen, onClose, eventId }: AddNewVenuePopupProps) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([])
  const [selectedSponsors, setSelectedSponsors] = useState<number[]>([])
  const [selectedExhibitors, setSelectedExhibitors] = useState<number[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [googleMapLink, setGoogleMapLink] = useState('')
  const [mapStatus, setMapStatus] = useState(true)

  useEffect(() => {
    if (isOpen && eventId) {
      api.get(`/event/${eventId}`)
        .then(res => {
          const data = res.data
          setTitle(data.title || '')
          setDescription(data.description || '')
          setLocation(data.location || '')
          setGoogleMapLink(data.googleMapLink || '')
          setMapStatus(data.mapstatus)

          if (data.sponsors) {
            setSelectedSponsors(data.sponsors.map((s: any) => s.id))
          }

          if (data.exhibitors) {
            setSelectedExhibitors(data.exhibitors.map((e: any) => e.id))
          }
        })
        .catch(err => console.error('Error loading event data', err))
    }
  }, [isOpen, eventId])

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

  const handleSponsorSelect = (id: number) => {
    setSelectedSponsors(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleExhibitorSelect = (id: number) => {
    setSelectedExhibitors(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    if (!title || !location || !googleMapLink) {
      alert('Please fill all required fields')
      return
    }

    const payload = {
      title,
      description,
      location,
      googleMapLink,
      mapstatus: mapStatus,
      sponsors: selectedSponsors.map(id => ({ id })),
      exhibitors: selectedExhibitors.map(id => ({ id }))
    }

    try {
      const res = await api.patch(`/event/${eventId}`, payload)
      console.log('Event updated successfully:', res.data)
      alert('Event updated successfully')
      onClose()
    } catch (err) {
      console.error('Failed to update event', err)
      alert('Failed to update event')
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
            Update Venue
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
              <label className="block text-[16px] text-[#262626] mb-2">Assign Sponsors*</label>
              <div className="flex flex-col gap-2">
                {sponsors.map(s => (
                  <label key={s.id} className="flex items-center gap-2 text-[#616161]">
                    <input
                      type="checkbox"
                      checked={selectedSponsors.includes(s.id)}
                      onChange={() => handleSponsorSelect(s.id)}
                    />
                    {s.name} ({s.email})
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[16px] text-[#262626] mb-2">Assign Exhibitors*</label>
              <div className="flex flex-col gap-2">
                {exhibitors.map(ex => (
                  <label key={ex.id} className="flex items-center gap-2 text-[#616161]">
                    <input
                      type="checkbox"
                      checked={selectedExhibitors.includes(ex.id)}
                      onChange={() => handleExhibitorSelect(ex.id)}
                    />
                    {ex.name} ({ex.email})
                  </label>
                ))}
              </div>
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
                placeholder="Describe your topic"
                className="w-full h-[115px] border border-[#DEDEDE] rounded-lg px-4 py-3 text-[#616161] resize-none outline-none"
              />
            </div>

            <div>
              <label className="block text-[16px] text-[#262626] mb-2">Upload Media</label>
              <div className="w-full h-[115px] border border-dashed border-[#DEDEDE] rounded-lg flex flex-col items-center justify-center text-[#616161] text-center px-4 cursor-pointer">
                <FaUpload className="text-[#9B2033] text-xl mb-2" />
                <span>Upload Media</span>
                <p className="text-[12px]">Drag and drop your map file or click to browse</p>
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
              Update
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddNewVenuePopup
