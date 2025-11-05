'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaBookmark, FaCalendarAlt, FaRegListAlt, FaSearch } from 'react-icons/fa';
import { FaArrowLeft, FaPlay } from 'react-icons/fa6';
import Image from 'next/image';
import api from '@/config/api';
import AddNewSpeaker from './addnewspeaker/page';
import Update from './update/page';
import { useDispatch } from 'react-redux'
import { setSpeakerId } from '@/lib/store/features/speaker/speakerSlice'

const stats = [
  { label: "Total Sessions", value: 24, change: "+2", percent: "2.5%", icon: <FaRegListAlt className="text-blue-600" />, iconBg: "bg-blue-100" },
  { label: "Ongoing", value: 5, change: "+1", percent: "1.2%", icon: <FaPlay className="text-green-600" />, iconBg: "bg-green-100" },
  { label: "Subscribed", value: 12, change: "+3", percent: "0.8%", icon: <FaBookmark className="text-yellow-600" />, iconBg: "bg-yellow-100" },
];

const filters = ['Daily', 'Weekly', '10 Days', '90 Days', 'All Time'];

const tagColors: Record<string, string> = {
  "Expert": "bg-blue-100 text-blue-800",
  "Keynote": "bg-green-100 text-green-800",
  "Technology": "bg-purple-100 text-purple-800",
  "Workshop": "bg-pink-100 text-pink-800",
  "Speaker": "bg-red-100 text-red-800"
};

export default function SchedulePage() {
  const [activeFilter, setActiveFilter] = useState('Daily');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<number | null>(null);
  const [speakers, setSpeakers] = useState<any[]>([]);
  const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const res = await api.get('/speakers/all-short-info');
        setSpeakers(res.data);
      } catch (error) {
        console.error("Error fetching speakers:", error);
      }
    };
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
const dispatch = useDispatch()

  const handleEdit = (id: number) => {
    setSelectedSpeakerId(id);
    setIsUpdateOpen(true);
  };

  return (
   <>
  <div className="min-h-screen font-sans bg-[#FAFAFA]  md:px-6 lg:px-8 py-4 space-y-6 max-w-6xl mx-auto">

    <div className="flex items-center gap-3">
      <Link href="/Organizer/Dashboard">
        <FaArrowLeft className="text-red-800 w-5 h-5 cursor-pointer" />
      </Link>
      <h1 className="text-lg font-bold text-gray-900 ml-3">Manage Speakers</h1>
    </div>

    <div className="flex flex-wrap justify-between items-center gap-3">
      <div className="flex bg-white border border-gray-300 rounded-md px-2 py-1 w-full md:w-[280px]">
        <FaSearch className="text-red-900 mr-2 mt-1" />
        <input type="text" placeholder="Search sessions or speakers" className="outline-none text-sm w-full" />
      </div>

      <div className="flex gap-2 flex-wrap">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${activeFilter === filter ? 'bg-[#86002B] text-white' : 'bg-white border border-gray-300 text-gray-800'}`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="flex items-center border border-gray-300 bg-white px-2 py-1 rounded-md text-sm text-gray-700">
        <FaCalendarAlt className="mr-1 text-gray-500" />
        Jan 2024 - Dec 2024
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
          <div className={`w-9 h-9 rounded-md ${item.iconBg} flex items-center justify-center mr-3`}>{item.icon}</div>
          <div className="flex-1">
            <p className="text-[20px] font-bold text-black leading-none">
              {item.value}
              <span className="text-green-600 text-sm font-semibold ml-1">{item.change}</span>
            </p>
            <p className="text-sm text-gray-600">{item.label}</p>
          </div>
          <div className="bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
            ▲ {item.percent}
          </div>
        </div>
      ))}
    </div>

    <div className="flex justify-between items-center">
      <button className="bg-[#9B2033] hover:bg-[#7c062a] transition text-white text-sm px-4 py-1.5 rounded-md font-medium" onClick={() => setIsModalOpen(true)}>
        + Create New Speaker
      </button>
      <button className="text-sm text-gray-600 hover:text-black transition underline font-medium">View All</button>
    </div>

    <div className="flex flex-col gap-4  pb-8">
      {speakers.map(speaker => (
        <div key={speaker.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex gap-4 items-start justify-between flex-wrap md:flex-nowrap">
            <div className="flex gap-3">
              <img
                src={
                  speaker.user.file
                    ? speaker.user.file.startsWith('http')
                      ? speaker.user.file
                      : `/files/${speaker.user.file}`
                    : '/images/default-avatar.png'
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
                {speaker.tags[0] && <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tagColors[speaker.tags[0]]}`}>{speaker.tags[0]}</span>}
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">{speaker.sessionCount} Sessions</span>
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

   <div className="relative w-full">
  <Image
    src="/images/line.png"
    alt="Line"
    width={1450}
    height={127}
    className="absolute top-0 left-0 w-full max-w-full h-auto"
  />
</div>

  </div>

  {isModalOpen && (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={() => setIsModalOpen(false)}></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
          <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-red-700 text-xl font-bold">✕</button>
          <AddNewSpeaker onClose={() => setIsModalOpen(false)} />
        </div>
      </div>
    </>
  )}

  {isUpdateOpen && selectedSpeakerId && (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={() => setIsUpdateOpen(false)}></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
          <button onClick={() => setIsUpdateOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-red-700 text-xl font-bold">✕</button>
          <Update speakerId={selectedSpeakerId} onClose={() => setIsUpdateOpen(false)} />
        </div>
      </div>
    </>
  )}
</>

  );
}
