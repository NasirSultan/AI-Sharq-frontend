'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FaBookmark, FaRegListAlt, FaSearch } from 'react-icons/fa';
import { FaArrowLeft, FaPlay } from 'react-icons/fa6';
import Image from 'next/image';
import api from '@/config/api';
import Update from './update/page';
import { useDispatch } from 'react-redux';
import { setSpeakerId } from '@/lib/store/features/speaker/speakerSlice';

const tagColors: Record<string, string> = {
  "Expert": "bg-blue-100 text-blue-800",
  "Keynote": "bg-green-100 text-green-800",
  "Technology": "bg-purple-100 text-purple-800",
  "Workshop": "bg-pink-100 text-pink-800",
  "Speaker": "bg-red-100 text-red-800"
};

export default function SchedulePage() {
  const [activeFilter, setActiveFilter] = useState('Daily');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<number | null>(null);
  const [speakers, setSpeakers] = useState<any[]>([]);
  const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);

  const router = useRouter();
  const dispatch = useDispatch();

  const fetchSpeakers = async () => {
    try {
      const res = await api.get('/speakers/all-short-info');
      setSpeakers(res.data);
    } catch (error) {
      console.error("Error fetching speakers:", error);
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const handleDelete = async (id: number) => {
    setLoadingDeleteId(id);
    try {
      await api.delete(`/speakers/${id}`);
      setSpeakers(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error("Error deleting speaker:", error);
    } finally {
      setLoadingDeleteId(null);
    }
  };

  const handleEdit = (id: number) => {
    setSelectedSpeakerId(id);
    setIsUpdateOpen(true);
  };

  const getFilteredSpeakers = () => {
    const now = new Date();
    return speakers
      .filter(speaker => {
        if (!speaker.createdAt) return true;
        const speakerDate = new Date(speaker.createdAt);

        switch(activeFilter) {
          case 'Daily':
            return speakerDate.toDateString() === now.toDateString();
          case 'Weekly': {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            return speakerDate >= oneWeekAgo && speakerDate <= now;
          }
          case '10 Days': {
            const tenDaysAgo = new Date();
            tenDaysAgo.setDate(now.getDate() - 10);
            return speakerDate >= tenDaysAgo && speakerDate <= now;
          }
          case '90 Days': {
            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(now.getDate() - 90);
            return speakerDate >= ninetyDaysAgo && speakerDate <= now;
          }
          case 'All Time':
            return true;
          default:
            return true;
        }
      })
      .filter(speaker => 
        speaker.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  return (
    <>
      <div className="min-h-screen font-sans bg-[#FAFAFA] md:px-6 lg:px-8 py-4 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/Organizer/Dashboard">
            <FaArrowLeft className="text-red-800 w-5 h-5 cursor-pointer" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900 ml-3">Manage Speakers</h1>
        </div>

        <div className="flex gap-3 w-full">
          <div className="flex bg-white border border-gray-300 rounded-md px-3 py-2 flex-1">
            <FaSearch className="text-red-900 mr-2 mt-1" />
            <input 
              type="text" 
              placeholder="Search speakers" 
              className="outline-none text-sm w-full"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <button 
            className="bg-[#9B2033] hover:bg-[#7c062a] transition text-white text-sm px-4 py-1.5 rounded-md font-medium"
            onClick={() => router.push('/Organizer/ManageSpeaker/addnewspeaker')}
          >
            + Create New Speaker
          </button>
        </div>

        <div className="flex flex-col gap-4 pb-8">
          {getFilteredSpeakers().map(speaker => (
            <div key={speaker.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex gap-4 items-start justify-between flex-wrap md:flex-nowrap">
                <div className="flex gap-3">
                  <img
                    src={
                      speaker.user.file
                        ? speaker.user.file.startsWith('http')
                          ? speaker.user.file
                          : `/files/${speaker.user.file}`
                        : 'https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png'
                    }
                    alt={speaker.user.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-gray-900 font-medium flex-wrap">
                      <h2 className="text-base font-semibold">{speaker.user.name}</h2>
                      {speaker.designations.map((d: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-1">
                          {idx < speaker.designations.length - 1 && <div className="w-1 h-1 bg-red-700 rounded-full" />}
                          <span className="text-xs">{d}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{speaker.bio}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-end justify-between w-full md:w-auto">
                  <div className="flex flex-wrap gap-1 justify-end">
                    {speaker.tags[0] && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tagColors[speaker.tags[0]]}`}>
                        {speaker.tags[0]}
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                      {speaker.sessionCount} Sessions
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button
                      className="bg-[#9B2033] hover:bg-[#7c062a] transition text-white text-xs px-6 py-1.5 rounded-md font-medium cursor-pointer"
                      onClick={() => handleEdit(speaker.id)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(speaker.id)}
                      disabled={loadingDeleteId === speaker.id}
                      className="border hover:bg-gray-200 transition text-gray-800 text-xs px-6 py-1.5 rounded-md font-medium relative cursor-pointer"
                    >
                      {loadingDeleteId === speaker.id ? 'Deleting...' : 'Delete'}
                    </button>
                    <Link href={`/participants/SpeakerDetails/${speaker.id}`} onClick={() => dispatch(setSpeakerId(speaker.id))}>
                      <button className="border hover:border-black text-xs px-6 py-1.5 rounded-md text-gray-800 hover:text-black transition font-medium cursor-pointer">
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isUpdateOpen && selectedSpeakerId && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 z-50" 
            onClick={() => setIsUpdateOpen(false)}
          ></div>

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div 
              className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsUpdateOpen(false)} 
                className="absolute top-3 right-3 text-gray-500 hover:text-red-700 text-xl font-bold"
              >
                ✕
              </button>

              <Update speakerId={selectedSpeakerId} onClose={() => setIsUpdateOpen(false)} />
            </div>
          </div>
        </>
      )}

      <div className="relative w-full">
        <Image
          src="/images/line.png"
          alt="Line"
          width={1450}
          height={127}
          className="absolute top-0 left-0 w-full max-w-full h-auto"
        />
      </div>
    </>
  );
}
