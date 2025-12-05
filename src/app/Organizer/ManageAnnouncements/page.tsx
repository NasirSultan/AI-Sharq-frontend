'use client'

import React, { useState, useEffect } from 'react'
import api from '@/config/api'
import { FiSearch, FiFilter, FiEdit, FiTrendingUp,FiMail,FiTrash2, FiPlus, FiClock } from 'react-icons/fi'
import { BiBell } from 'react-icons/bi'

import EditAnnouncementModal from '../../components/EditAnnouncementModal'
import AddAnnouncementModal from '../../components/AddAnnouncementModal'
import { FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'

interface Announcement {
  id: number
  title: string
  message: string
  roles?: string[]
  scheduledAt: string | null
  isSent: boolean
  createdAt: string
  updatedAt: string
}

const ManageAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fetchAnnouncements = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/announcements')
      setAnnouncements(response.data)
      setFilteredAnnouncements(response.data)
    } catch (err) {
      console.error('Failed to fetch announcements', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  useEffect(() => {
    let filtered = announcements
    if (activeFilter === 'sent') filtered = filtered.filter(ann => ann.isSent)
    else if (activeFilter === 'draft') filtered = filtered.filter(ann => !ann.isSent)

    if (searchTerm) {
      filtered = filtered.filter(
        ann =>
          ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ann.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredAnnouncements(filtered)
  }, [announcements, searchTerm, activeFilter])

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return
    try {
      await api.delete(`/announcements/${id}`)
      await fetchAnnouncements()
    } catch (err) {
      console.error('Failed to delete announcement', err)
    }
  }

  const handleEdit = (announcement: Announcement) => {
    if (announcement.isSent) return
    setEditingAnnouncement(announcement)
    setIsEditModalOpen(true)
  }

  const handleAddNew = () => setIsAddModalOpen(true)

  const handleSaveEdit = async (updated: Announcement) => {
    try {
      await api.patch(`/announcements/${updated.id}`, updated)
      return true
    } catch (err) {
      console.error('Failed to update announcement', err)
      return false
    }
  }

  const handleSaveNew = async (newAnnouncement: Announcement) => {
    try {
      await api.post('/announcements', newAnnouncement)
      return true
    } catch (err) {
      console.error('Failed to add announcement', err)
      return false
    }
  }

  const onEditModalClose = () => {
    setIsEditModalOpen(false)
    setEditingAnnouncement(null)
    fetchAnnouncements()
  }

  const onAddModalClose = () => {
    setIsAddModalOpen(false)
    fetchAnnouncements()
  }

  const totalCount = announcements.length
  const sentCount = announcements.filter(a => a.isSent).length
  const draftCount = announcements.filter(a => !a.isSent).length

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
  <div className="max-w-6xl mx-auto">

    <div className="flex items-center gap-4 mb-8">
      <Link href="/Organizer/Dashboard">
        <FaArrowLeft className="text-red-700 w-7 h-7" />
      </Link>
      <h1 className="text-2xl font-medium text-gray-900">Manage Announcements</h1>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 h-24 rounded-lg shadow flex items-center justify-center gap-3 hover:shadow-lg transition">
        <FiMail className="w-6 h-6 text-gray-500" />
        <div className="text-center">
          <p className="text-gray-500">Total</p>
          <p className="text-lg font-bold text-gray-900">{totalCount}</p>
        </div>
      </div>

      <div className="bg-white p-4 h-24 rounded-lg shadow flex items-center justify-center gap-3 hover:shadow-lg transition">
        <FiTrendingUp className="w-6 h-6 text-green-600" />
        <div className="text-center">
          <p className="text-gray-500">Sent</p>
          <p className="text-lg font-bold text-green-600">{sentCount}</p>
        </div>
      </div>

      <div className="bg-white p-4 h-24 rounded-lg shadow flex items-center justify-center gap-3 hover:shadow-lg transition">
        <FiEdit className="w-6 h-6 text-gray-900" />
        <div className="text-center">
          <p className="text-gray-500">Draft</p>
          <p className="text-lg font-bold text-gray-900">{draftCount}</p>
        </div>
      </div>
    </div>

    <div className="w-full mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full flex-1">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search announcements..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-900 focus:border-red-900"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'sent', 'draft'].map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium ${
              activeFilter === filter
                ? 'bg-red-900 text-white border-red-900'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}

        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700"
        >
          <FiPlus className="w-4 h-4" />
          Add New
        </button>
      </div>
    </div>

    <div className="space-y-4">
      {isLoading ? (
        <div className="bg-white rounded-lg p-12 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-red-700 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading announcements...</p>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="text-center py-12">
          <BiBell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No announcements found</p>
        </div>
      ) : (
        filteredAnnouncements.map(ann => (
          <div key={ann.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <BiBell className="w-5 h-5 text-red-700" />
                <h3 className="text-lg font-semibold text-gray-900">{ann.title}</h3>
              </div>

              <p className="text-gray-600 mb-2">{ann.message}</p>

              <div className="flex gap-6 text-sm flex-wrap">
                <span
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${
                    ann.isSent
                      ? 'bg-green-100 text-green-700 border-green-300'
                      : ann.scheduledAt
                      ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                      : 'bg-red-100 text-red-700 border-red-300'
                  }`}
                >
                  <FiClock className="w-4 h-4" />
                  {ann.isSent
                    ? 'Sent'
                    : ann.scheduledAt
                    ? 'Scheduled at ' + new Date(ann.scheduledAt).toLocaleString()
                    : 'Draft'}
                </span>

                <span className="flex items-center gap-1 text-gray-500">
                  <FiFilter className="w-4 h-4" />
                  {(ann.roles || []).join(', ')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!ann.isSent && (
                <button
                  onClick={() => handleEdit(ann)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <FiEdit className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={() => handleDelete(ann.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>

  {isEditModalOpen && editingAnnouncement && (
    <EditAnnouncementModal
      announcement={editingAnnouncement}
      onSave={handleSaveEdit}
      onClose={onEditModalClose}
    />
  )}

  {isAddModalOpen && (
    <AddAnnouncementModal
      onSave={handleSaveNew}
      onClose={onAddModalClose}
    />
  )}
</div>

  )
}

export default ManageAnnouncements