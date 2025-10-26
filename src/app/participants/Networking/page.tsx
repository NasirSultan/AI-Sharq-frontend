'use client';

import React, { useEffect, useState } from 'react';
import { FaSearch, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from "@/lib/store/store";
import api from "@/config/api";

interface PendingRequest {
  requestId: number;
  sender: {
    id: number;
    name: string;
    role: string;
    file: string | null;
  };
  sentAt: string;
}

const Networking: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.userId)
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const fetchPendingRequests = async () => {
    try {
      const res = await api.get(`/connections/pending?userId=${userId}`);
      setRequests(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, [userId]);

  const handleAction = async (requestId: number, status: 'ACCEPTED' | 'REJECTED') => {
    setLoadingIds(prev => [...prev, requestId]);
    try {
      const res = await api.patch(`/connections/${requestId}/status`, { status });
      if (res.status === 200) {
        setRequests(prev => prev.filter(r => r.requestId !== requestId));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== requestId));
    }
  };

  const filteredRequests = requests.filter(r =>
    r.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.sender.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full h-screen">
      <div className="absolute flex flex-col items-end p-0 gap-10 w-[1280px] h-[1367px] left-[80px] top-[30px]">

        <div className="box-border flex flex-col items-start p-6 gap-6 w-[1280px] h-24 bg-[#FFEEEE] border border-[#D4D4D4] shadow-sm rounded-3xl">
          <div className="flex flex-row items-center gap-3 w-[1169px] h-12">
            <div className="w-12 h-12 bg-[#FFBEBE] rounded-lg flex items-center justify-center">
              <FaMessage className="text-[#9B2033] text-xl" />
            </div>
            <h2 className="text-lg font-semibold text-[#9B2033]">Chats List</h2>
            <Link href="/participants/Masseges" className="ml-auto">
              <FaArrowRight className="text-[#9B2033] text-2xl" />
            </Link>
          </div>
        </div>

        <div className="flex flex-row items-center gap-10 w-[1280px] h-6">
          <Link href="/participants/Home">
            <FaArrowLeft className="text-red-800 w-[20px] h-[20px] cursor-pointer" />
          </Link>
          <h1 className="text-2xl font-medium text-[#282828]">Networking</h1>
        </div>

        <div className="flex flex-row items-center gap-4 w-[1280px] h-11">
          <Link href="/participants/Networking">
            <button className="flex justify-center items-center p-4 w-80 h-11 bg-[#9B2033] rounded-xl">
              <span className="text-sm font-bold text-white">Directory</span>
            </button>
          </Link>
          <Link href="/participants/MyConnections">
            <button className="flex justify-center items-center p-4 w-80 h-11 border border-[#E8E8E8] rounded-xl">
              <span className="font-medium text-[#282828]">My Connections</span>
            </button>
          </Link>
          <div className="flex flex-row items-center p-4 gap-3 w-[628px] h-11 border border-[#E8E8E8] rounded-xl">
            <FaSearch className="text-[#9B2033] text-xl" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 text-base text-[#575454] border-none outline-none"
            />
          </div>
        </div>

        <div className="text-base font-medium text-[#282828]">
          {filteredRequests.length} Participants Showing
        </div>

        <div className="flex flex-col items-start p-0 gap-6 w-[1280px] h-[1038px]">
          {filteredRequests.map(req => (
            <div key={req.requestId} className="box-border flex items-center p-6 gap-6 w-[1280px] h-40 bg-white border border-[#D4D4D4] shadow-sm rounded-3xl">
              <img
                src={req.sender.file ? `/uploads/${req.sender.file}` : '/images/default.png'}
                alt={req.sender.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="flex flex-col justify-center gap-1 flex-1">
                <h3 className="text-lg font-semibold text-[#282828]">{req.sender.name}</h3>
                <span className="text-base text-[#282828]">{req.sender.role}</span>
              </div>
              <div className="flex gap-4">
                <button
                  disabled={loadingIds.includes(req.requestId)}
                  onClick={() => handleAction(req.requestId, 'ACCEPTED')}
                  className="p-3 rounded-full bg-[#F7FCDC] text-[#849122] font-bold"
                >
                  Accept
                </button>
                <button
                  disabled={loadingIds.includes(req.requestId)}
                  onClick={() => handleAction(req.requestId, 'REJECTED')}
                  className="p-3 rounded-full bg-[#FCDCDC] text-[#9B2033] font-bold"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
      <Image src="/images/line.png" alt="Logo" width={1729} height={127} className="absolute top-[1510px]" />
    </div>
  );
};

export default Networking;
