'use client';

import React, { useState } from 'react';
import { FiChevronDown, FiX } from 'react-icons/fi';
import Image from 'next/image';
import api from '@/config/api';

interface EditAnnouncementModalProps {
  announcement: any;
  onClose: () => void;
  onSaved?: () => void;
}

const allowedRoles = [
  'participant',
  'speaker',
  'exhibitor',
  'sponsor',
  'organizer',
  'registrationteam',
  'all'
];

const EditAnnouncementModal: React.FC<EditAnnouncementModalProps> = ({ announcement, onClose, onSaved }) => {
  const [title, setTitle] = useState(announcement.title);
  const [message, setMessage] = useState(announcement.message);
  const [roles, setRoles] = useState<string[]>(announcement.roles || []);
  const [scheduledAt, setScheduledAt] = useState(announcement.scheduledAt || '');
  const [sendNow, setSendNow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (role: string) => {
    if (roles.includes(role)) {
      setRoles(roles.filter(r => r !== role));
    } else {
      setRoles([...roles, role]);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || roles.length === 0) {
      alert('Please enter title and select at least one role');
      return;
    }

    setLoading(true);
    try {
      await api.patch(`/announcements/${announcement.id}`, {
        title: title.trim(),
        message: message.trim(),
        roles,
        scheduledAt: scheduledAt || null,
        sendNow
      });

      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      console.error('Failed to update announcement', err);
      alert('Failed to update announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="fixed inset-0 bg-gray-30/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center pt-6 pb-4 px-6">
          <div className="mb-3">
            <Image src="/images/logo.png" alt="Logo" width={120} height={36} />
          </div>
          <h2 className="text-lg font-medium text-gray-900 text-center">Edit Announcement</h2>
        </div>

        <div className="px-6 pb-6 space-y-4">
  <div>
    <label className="block text-sm font-normal text-gray-900 mb-2">Title*</label>
    <input
      type="text"
      value={title} 
      onChange={e => setTitle(e.target.value)}
      placeholder="Enter announcement title"
      className="w-full px-4 py-3 rounded-lg bg-gray-100 text-sm text-gray-700 focus:outline-none"
    />
  </div>

  <div>
    <label className="block text-sm font-normal text-gray-900 mb-2">Message</label>
    <textarea
      value={message}
      onChange={e => setMessage(e.target.value)}
      placeholder="Enter your announcement message"
      rows={4}
      className="w-full px-4 py-3 rounded-lg bg-gray-100 text-sm text-gray-700 resize-none focus:outline-none"
    />
  </div>

  <div>
    <label className="block text-sm font-normal text-gray-900 mb-2">Roles*</label>
    <div className="flex flex-wrap gap-2">
      {allowedRoles.map(role => (
        <button
          key={role}
          type="button"
          onClick={() => handleRoleChange(role)}
          className={`px-3 py-1 rounded-lg border text-sm ${
            roles.includes(role)
              ? 'bg-red-700 text-white border-red-700'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {role}
        </button>
      ))}
    </div>
  </div>

  <div>
    <label className="block text-sm font-normal text-gray-900 mb-2">Schedule (optional)</label>
    <input
      type="datetime-local"
      value={scheduledAt}
      onChange={e => setScheduledAt(e.target.value)}
      className="w-full px-4 py-3 rounded-lg bg-gray-100 text-sm text-gray-700 focus:outline-none"
    />
  </div>

  {!scheduledAt && (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={sendNow}
        onChange={e => setSendNow(e.target.checked)}
        id="sendNow"
        className="w-4 h-4 text-red-900 rounded"
      />
      <label htmlFor="sendNow" className="text-sm text-gray-700">
        {sendNow ? "Send" : "Draft"}
      </label>
    </div>
  )}

  <button
    onClick={handleSave}
    disabled={loading}
    className="w-full bg-red-900 text-white py-3 rounded-lg font-medium text-sm hover:bg-red-800 transition-colors mt-2"
  >
    {loading ? 'Saving...' : 'Save Changes'}
  </button>
</div>

      </div>
    </div>
  );
};

export default EditAnnouncementModal;
