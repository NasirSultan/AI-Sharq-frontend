'use client';

import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiChevronDown, FiEdit, FiTrash2, FiPlus, FiCheck, FiClock, FiFileText } from 'react-icons/fi';
import { BiBell } from 'react-icons/bi';
import EditAnnouncementModal from '../../components/EditAnnouncementModal';
import AddAnnouncementModal from '../../components/AddAnnouncementModal';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

interface Announcement {
  id: string;
  title: string;
  message: string;
  audience: string;
  date: string;
  status: 'sent' | 'scheduled' | 'draft';
}

const ManageAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Calculate statistics
  const totalSent = announcements.filter(ann => ann.status === 'sent').length;
  const totalScheduled = announcements.filter(ann => ann.status === 'scheduled').length;
  const totalDrafts = announcements.filter(ann => ann.status === 'draft').length;

  // Load announcements from localStorage on component mount
  useEffect(() => {
    const storedAnnouncements = localStorage.getItem('announcements');
    if (storedAnnouncements) {
      const parsed = JSON.parse(storedAnnouncements);
      setAnnouncements(parsed);
      setFilteredAnnouncements(parsed);
    } else {
      // Sample data
      const sampleAnnouncements: Announcement[] = [
        {
          id: '1',
          title: 'Keynote Session Reminder',
          message: "Don't miss today's keynote at 10:00 AM in Hall A. Dr. Ahmed Hassan will present the latest insights on digital transformation.",
          audience: 'All Participants',
          date: 'Feb 15, 9:30 AM',
          status: 'sent'
        },
        {
          id: '2',
          title: 'Networking Event',
          message: 'Join us for the networking session in the main hall at 2:00 PM.',
          audience: 'All Participants',
          date: 'Feb 16, 2:00 PM',
          status: 'scheduled'
        },
        {
          id: '3',
          title: 'Workshop Update',
          message: 'The AI workshop has been rescheduled to 4:00 PM.',
          audience: 'All Participants',
          date: 'Feb 17, 4:00 PM',
          status: 'draft'
        }
      ];
      setAnnouncements(sampleAnnouncements);
      setFilteredAnnouncements(sampleAnnouncements);
      localStorage.setItem('announcements', JSON.stringify(sampleAnnouncements));
    }
  }, []);

  // Filter announcements based on search and active filter
  useEffect(() => {
    let filtered = announcements;

    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(ann => ann.status === activeFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(ann =>
        ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ann.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAnnouncements(filtered);
  }, [announcements, searchTerm, activeFilter]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      const updatedAnnouncements = announcements.filter(ann => ann.id !== id);
      setAnnouncements(updatedAnnouncements);
      localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedAnnouncement: Announcement) => {
    const existingIndex = announcements.findIndex(ann => ann.id === updatedAnnouncement.id);

    let updatedAnnouncements;
    if (existingIndex >= 0) {
      // Update existing announcement
      updatedAnnouncements = announcements.map(ann =>
        ann.id === updatedAnnouncement.id ? updatedAnnouncement : ann
      );
    } else {
      // Add new announcement
      updatedAnnouncements = [...announcements, updatedAnnouncement];
    }

    setAnnouncements(updatedAnnouncements);
    localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
    setIsEditModalOpen(false);
    setEditingAnnouncement(null);
  };

  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8">
               <Link href="/Organizer/Dashboard">  <FaArrowLeft className="text-red-700 w-7 h-7" /></Link>
          
          
          <h1 className="text-2xl font-medium text-gray-900">Manage Announcements</h1>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {['all', 'sent', 'scheduled', 'drafts'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium ${
                    activeFilter === filter
                      ? 'bg-red-700 text-white border-red-700'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
                <FiFilter className="w-4 h-4 text-red-700" />
                <span className="text-sm text-gray-700">Filter</span>
                <FiChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Add New Button */}
          <div className="mt-6">
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800"
            >
              <FiPlus className="w-4 h-4" />
              <span className="text-sm font-medium">Add New</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Total Sent Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiCheck className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex flex-col gap-2 min-w-0">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-semibold text-gray-700">{totalSent}</span>
                  <span className="text-sm font-medium text-green-500">+2</span>
                </div>
                <span className="text-sm text-gray-600 truncate">Total Sent</span>
              </div>
            </div>
          </div>

          {/* Scheduled Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiClock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex flex-col gap-2 min-w-0">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-semibold text-gray-700">{totalScheduled}</span>
                  <span className="text-sm font-medium text-green-500">+2</span>
                </div>
                <span className="text-sm text-gray-600 truncate">Scheduled</span>
              </div>
            </div>
          </div>

          {/* Drafts Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiFileText className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex flex-col gap-2 min-w-0">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-semibold text-gray-700">{totalDrafts}</span>
                  <span className="text-sm font-medium text-green-500">+2</span>
                </div>
                <span className="text-sm text-gray-600 truncate">Drafts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
            <div key={announcement.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <BiBell className="w-5 h-5 text-red-700" />
                    <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{announcement.message}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <BiBell className="w-4 h-4" />
                      {announcement.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <FiFilter className="w-4 h-4" />
                      {announcement.audience}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <FiEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <BiBell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No announcements found</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingAnnouncement && (
        <EditAnnouncementModal
          announcement={editingAnnouncement}
          onSave={handleSaveEdit}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingAnnouncement(null);
          }}
        />
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <AddAnnouncementModal
          onSave={(newAnnouncement: Announcement) => {
            const updatedAnnouncements = [...announcements, newAnnouncement];
            setAnnouncements(updatedAnnouncements);
            localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
            setIsAddModalOpen(false);
          }}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ManageAnnouncements;
