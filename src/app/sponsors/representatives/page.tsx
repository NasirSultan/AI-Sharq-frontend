'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/config/api';
import { FaTrash, FaSpinner,FaArrowRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import Image from "next/image";
type NotificationType = 'success' | 'error';

const SponsorRepresentatives: React.FC = () => {
  const sponsorId = useSelector((state: RootState) => state.sponsor.sponsorId);
  const [participants, setParticipants] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [representatives, setRepresentatives] = useState<any[]>([]);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);
  const [displayTitle, setDisplayTitle] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);
const [searchTerm, setSearchTerm] = useState('');


const filteredParticipants = participants
  .filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.organization || '').toLowerCase().includes(searchTerm.toLowerCase())
  )
  .filter(user => !representatives.some(rep => rep.user.id === user.id));


  const showNotification = (message: string, type: NotificationType = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchParticipants = async () => {
    try {
      const response = await api.get('/admin/users/participants');
      setParticipants(response.data.users);
    } catch {
      showNotification('Failed to fetch participants', 'error');
    }
  };

  const fetchRepresentatives = async () => {
    if (!sponsorId) return;
    try {
      const response = await api.get(`/sponsor-related-representatives/sponsor/${sponsorId}`);
      setRepresentatives(response.data);
    } catch {
      showNotification('Failed to fetch representatives', 'error');
    }
  };

  const handleAddRepresentative = async () => {
    if (!sponsorId || !selectedUserId || !displayTitle) return;
    setLoadingAdd(true);
    try {
      await api.post('/sponsor-related-representatives', {
        sponsorId,
        userId: selectedUserId,
        displayTitle
      });
      setSelectedUserId(null);
      setDisplayTitle('');
      fetchRepresentatives();
      showNotification('Representative added', 'success');
    } catch {
      showNotification('Failed to add representative', 'error');
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoadingDeleteId(id);
    try {
      await api.delete(`/sponsor-related-representatives/${id}`);
      setRepresentatives(prev => prev.filter(r => r.id !== id));
      showNotification('Representative removed', 'success');
    } catch {
      showNotification('Failed to remove representative', 'error');
    } finally {
      setLoadingDeleteId(null);
    }
  };

  useEffect(() => {
    fetchParticipants();
    fetchRepresentatives();
  }, [sponsorId]);

  return (
    <div className="flex flex-col items-center min-h-screen p-4 gap-8 bg-gray-50">
      {notification && (
        <div className={`fixed top-5 right-5 p-2 rounded-lg mt-16 text-white shadow-lg ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {notification.message}
        </div>
      )}

      <div className="bg-white border border-gray-300 rounded-2xl shadow-lg p-10 w-full max-w-lg flex flex-col gap-4">
        <h1 className="text-2xl font-medium text-red-900">Add Representative</h1>
<div className="flex flex-col gap-2">
  <input
    type="text"
    placeholder="Search participant"
    value={searchTerm}
    onChange={e => setSearchTerm(e.target.value)}
 className="border-2 border-gray-300 focus:border-red-900 hover:border-red-900 outline-none p-2 rounded-xl"
  />

  <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-xl">
    {filteredParticipants.map(user => (
      <div
        key={user.id}
        onClick={() => setSelectedUserId(user.id)}
        className={`flex items-center gap-3 p-3 cursor-pointer ${
          selectedUserId === user.id ? 'bg-red-100' : 'hover:bg-gray-100'
        }`}
      >
        <img
          src={user.file || '/default-profile.png'}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-medium">{user.name}</span>
          <span className="text-gray-500">{user.organization || 'No Organization'}</span>
        </div>
      </div>
    ))}
    {filteredParticipants.length === 0 && (
      <div className="p-3 text-gray-500">No participants found</div>
    )}
  </div>

  <input
    type="text"
    placeholder="Display Title"
    value={displayTitle}
    onChange={e => setDisplayTitle(e.target.value)}
    className="border-2 border-gray-300 focus:border-red-900 hover:border-red-900 outline-none p-2 rounded-xl"
  />

  <button
    onClick={handleAddRepresentative}
    className={`py-2 rounded-xl mt-2 text-white cursor-pointer flex justify-center items-center ${loadingAdd ? 'bg-red-900' : 'bg-red-900 hover:bg-red-800'}`}
    disabled={loadingAdd || !selectedUserId || !displayTitle}
  >
    {loadingAdd && <FaSpinner className="animate-spin mr-2" />}
    {loadingAdd ? 'Adding...' : 'Add Representative'}
  </button>
</div>
 <Link href="/sponsors/ManageSessions" className="py-2 px-6 bg-white text-red-900 border-2 border-red-900 rounded-xl flex items-center justify-center gap-2 hover:bg-red-900 hover:text-white cursor-pointer"
>
          Back to Home <FaArrowRight />
        </Link>
      </div>

   {representatives.length > 0 && (
  <div className="w-full max-w-lg flex flex-col gap-4">
    <h2 className="text-xl font-medium text-gray-900">Representatives</h2>
    {representatives.map(rep => (
      <div key={rep.id} className="flex items-center justify-between gap-4 p-4 border border-gray-300 rounded-xl bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={rep.user.file || '/default-profile.png'}
            alt={rep.user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="font-medium">{rep.displayTitle}</span>
            <span className="text-gray-500">{rep.user.name} - {rep.user.organization || 'No Organization'}</span>
          </div>
        </div>
        <button
          onClick={() => handleDelete(rep.id)}
          className="text-red-600 hover:text-red-600 flex items-center justify-center cursor-pointer"
          disabled={loadingDeleteId === rep.id}
        >
          {loadingDeleteId === rep.id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
        </button>
      </div>
    ))}
  </div>
)}

    </div>
  );
};

export default SponsorRepresentatives;
