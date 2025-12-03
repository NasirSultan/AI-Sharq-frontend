'use client';

import React, { useEffect, useState } from 'react';
import { FaSearch, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from "@/lib/store/store";
import api from "@/config/api";
import { useRouter } from "next/navigation";
import ToolsAndConnections from "../../components/ToolsAndConnections";

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
  const userId = useSelector((state: RootState) => state.user.userId);
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const router = useRouter();

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/connections/pending?userId=${userId}`);
      setRequests(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchPendingRequests();
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
    <div className="container mx-auto max-w-6xl px-4 py-6">

      <div className="flex flex-col gap-6">

        <div className="flex items-center gap-3 bg-[#FFEEEE] p-4 rounded-2xl shadow">
          <div className="w-12 h-12 bg-[#FFBEBE] rounded-lg flex items-center justify-center">
            <FaMessage className="text-[#9B2033] text-xl" />
          </div>
          <h2 className="text-lg font-semibold text-[#9B2033]">Chats List</h2>
          <Link href="/participants/Masseges" className="ml-auto">
            <FaArrowRight className="text-[#9B2033] text-2xl" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <FaArrowLeft
            onClick={() => router.back()}
            className="text-red-800 w-5 h-5 cursor-pointer hover:text-red-900 transition"
          />
          <h1 className="text-2xl font-medium text-[#282828]">Networking</h1>
        </div>

       <div className="flex flex-wrap gap-4">

  <div className="flex gap-4 w-full sm:w-auto whitespace-nowrap">
    <Link href="/participants/Directory">
      <button className="border border-[#E8E8E8] text-[#282828] font-medium py-2 px-4 rounded-xl">
        Directory
      </button>
    </Link>

    <Link href="/participants/Networking">
      <button className="bg-[#9B2033] text-white font-bold py-2 px-4 rounded-xl">
        Requests
      </button>
    </Link>

    <Link href="/participants/MyConnections">
      <button className="border border-[#E8E8E8] text-[#282828] font-medium py-2 px-4 rounded-xl">
     Connections
      </button>
    </Link>
  </div>

  <div className="flex items-center gap-2 border border-[#E8E8E8] rounded-xl px-3 py-2 w-full sm:flex-1 min-w-[200px]">
    <FaSearch className="text-[#9B2033]" />
    <input
      type="text"
      placeholder="Search"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="flex-1 outline-none border-none text-sm text-[#575454]"
    />
  </div>

</div>


        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="text-sm font-medium text-[#282828]">
              {filteredRequests.length} Participants Showing
            </div>

            <div className="flex flex-col gap-6 w-full">
              {filteredRequests.map(req => (
                <div
                  key={req.requestId}
                  className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl shadow border border-[#D4D4D4] w-full"
                >
                  <div className="w-16 h-16 flex items-center justify-center rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={req.sender.file || "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"}
                      alt={req.sender.name || "User"}
                      className="rounded-full object-cover w-12 h-12"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-1 text-center md:text-left">
                    <h3 className="text-lg font-semibold text-[#282828]">{req.sender.name}</h3>
                    <span className="text-sm text-[#282828]">{req.sender.role}</span>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button
                      disabled={loadingIds.includes(req.requestId)}
                      onClick={() => handleAction(req.requestId, 'ACCEPTED')}
                      className="px-4 py-2 rounded-full bg-[#F7FCDC] text-[#849122] font-bold"
                    >
                      {loadingIds.includes(req.requestId) ? '...' : 'Accept'}
                    </button>
                    <button
                      disabled={loadingIds.includes(req.requestId)}
                      onClick={() => handleAction(req.requestId, 'REJECTED')}
                      className="px-4 py-2 rounded-full bg-[#FCDCDC] text-[#9B2033] font-bold"
                    >
                      {loadingIds.includes(req.requestId) ? '...' : 'Reject'}
                    </button>
                  </div>
                </div>
              ))}

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Networking;
