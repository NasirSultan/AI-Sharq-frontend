'use client';

import React, { useState } from 'react';
import { FiChevronDown, FiX } from 'react-icons/fi';
import Image from 'next/image';

interface Announcement {
  id: string;
  title: string;
  message: string;
  audience: string;
  date: string;
  status: 'sent' | 'scheduled' | 'draft';
}

interface AddAnnouncementModalProps {
  onSave: (announcement: Announcement) => void;
  onClose: () => void;
}

const AddAnnouncementModal: React.FC<AddAnnouncementModalProps> = ({
  onSave,
  onClose
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('All Participants');

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: title.trim(),
      message: message.trim(),
      audience,
      date: new Date().toLocaleString(),
      status: 'draft'
    };
    onSave(newAnnouncement);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center pt-6 pb-4 px-6">
          <div className="mb-3">
            <Image
              src="/images/logo.png"
              alt="Al Sharq Logo"
              width={120}
              height={36}
              className="object-contain"
            />
          </div>
          <h2 className="text-lg font-medium text-gray-900 text-center">Add New Announcement</h2>
        </div>

        {/* Form */}
        <div className="px-6 pb-6">
          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-normal text-gray-900 mb-2">
                Title*
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter announcement title"
                className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-600 placeholder-gray-400"
              />
            </div>

            {/* Message Input */}
            <div>
              <label className="block text-sm font-normal text-gray-900 mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your announcement message"
                rows={4}
                className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-600 placeholder-gray-400 resize-none"
              />
            </div>

            {/* Audience Selection */}
            <div>
              <label className="block text-sm font-normal text-gray-900 mb-2">
                Audience Selection*
              </label>
              <div className="relative">
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-600 appearance-none bg-white"
                >
                  <option value="All Participants">All Participants</option>
                  <option value="Speakers">Speakers</option>
                  <option value="Attendees">Attendees</option>
                  <option value="Sponsors">Sponsors</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-700 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full bg-red-700 text-white py-3 rounded-lg font-medium text-sm hover:bg-red-800 transition-colors mt-4"
            >
              Create Announcement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAnnouncementModal;
