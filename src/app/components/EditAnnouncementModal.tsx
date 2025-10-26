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

interface EditAnnouncementModalProps {
  announcement: Announcement;
  onSave: (announcement: Announcement) => void;
  onClose: () => void;
}

const EditAnnouncementModal: React.FC<EditAnnouncementModalProps> = ({
  announcement,
  onSave,
  onClose
}) => {
  const [title, setTitle] = useState(announcement.title);
  const [message, setMessage] = useState(announcement.message);
  const [audience, setAudience] = useState(announcement.audience);

  const handleSave = () => {
    const updatedAnnouncement: Announcement = {
      ...announcement,
      title,
      message,
      audience,
      date: new Date().toLocaleString()
    };
    onSave(updatedAnnouncement);
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
          <h2 className="text-lg font-medium text-gray-900 text-center">Edit Announcement</h2>
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
                placeholder="Keynote Reminder"
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
                placeholder="Don't miss the keynote with Dr. Ahmed at 10:00 AM in Hall A"
                rows={3}
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
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAnnouncementModal;
