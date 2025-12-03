'use client'

import React, { useState, useRef, useEffect } from 'react'
import { FaSearch, FaArrowLeft, FaUser, FaArrowRight, FaComment } from 'react-icons/fa'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import api from '@/config/api'

interface User {
  id: number
  name: string
  email: string
  file?: string
}

interface Connection {
  connectionId: number
  user: User
  connectedAt: string
}

// SWR fetcher
const fetcher = (url: string) => api.get(url).then(res => res.data)

const Networking: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.userId)
  const [searchTerm, setSearchTerm] = useState('')
  const [connections, setConnections] = useState<Connection[]>([])
  const prevDataRef = useRef<Connection[]>([])
  const router = useRouter()

  const { data, error } = useSWR(
    userId ? `/connections/all?userId=${userId}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 60000,
    }
  )

  // Update state only if data changed
  useEffect(() => {
    if (data) {
      const prevData = prevDataRef.current
      const hasChanged =
        prevData.length !== data.length ||
        data.some(
          (conn: Connection, index: number) =>
            conn.connectionId !== prevData[index]?.connectionId
        )

      if (hasChanged) {
        setConnections(data)
        prevDataRef.current = data
      }
    }
  }, [data])

  if (error) console.error(error)

  const filteredConnections = connections.filter(
    (conn) =>
      (conn.user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (conn.user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">

      {/* Header */}
      <div className="flex items-center gap-3 bg-[#FFEEEE] p-4 rounded-2xl shadow mb-6">
        <div className="w-12 h-12 bg-[#FFBEBE] rounded-lg flex items-center justify-center">
          <FaComment className="text-[#9B2033] text-xl" />
        </div>
        <h2 className="text-lg font-semibold text-[#9B2033]">Chats List</h2>
        <Link href="/participants/Masseges" className="ml-auto">
          <FaArrowRight className="text-[#9B2033] text-2xl" />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4 my-2">
        <FaArrowLeft
          onClick={() => router.back()}
          className="text-red-800 w-5 h-5 cursor-pointer hover:text-red-900 transition"
        />
        <h1 className="text-2xl font-medium text-[#282828]">Networking</h1>
      </div>

      {/* Search & Filter */}
    <div className="flex flex-wrap gap-4 mb-4">

  <div className="flex nowrap gap-4 w-full sm:w-auto">
    <Link href="/participants/Directory">
      <button className="border border-[#E8E8E8] text-[#282828] font-medium py-2 px-4 rounded-xl shrink">
        Directory
      </button>
    </Link>

    <Link href="/participants/Networking">
      <button className="border border-[#E8E8E8] rounded-xl px-4 py-2 text-black shrink">
        Requests
      </button>
    </Link>

    <Link href="/participants/MyConnections">
      <button className="bg-[#9B2033] text-white rounded-xl px-4 py-2 font-bold shrink">
      Connections
      </button>
    </Link>
  </div>

  <div className="flex items-center border border-[#E8E8E8] rounded-xl px-3 py-2 w-full sm:flex-1 min-w-[200px]">
    <FaSearch className="text-[#9B2033] mr-2" />
    <input
      type="text"
      placeholder="Search"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="flex-1 outline-none border-none text-sm text-[#575454]"
    />
  </div>

</div>


      {/* Connections Count */}
      <div className="text-sm font-medium text-[#282828] mb-4">
        {filteredConnections.length} Participants Showing
      </div>

      {/* Connections List */}
      <div className="flex flex-col gap-3">
        {filteredConnections.map((conn) => (
          <div
            key={conn.connectionId}
            className="flex flex-row items-center gap-3 bg-white p-3 rounded-xl shadow border border-[#D4D4D4] w-full"
          >
            {/* Profile Picture or Fallback Icon */}
            <div className="w-10 h-10 relative flex-shrink-0">
              {conn.user.file ? (
                <img
                  src={conn.user.file}
                  alt={conn.user.name}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement
                    target.onerror = null
                    target.style.display = "none"
                  }}
                  className="w-8 h-8 rounded-full object-cover mx-auto my-auto"
                />
              ) : (
                <div className="absolute top-1 left-1 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <FaUser className="w-4 h-4 text-blue-500" />
                </div>
              )}
            </div>


            {/* Name and Email */}
            <div className="flex-1 flex flex-col justify-center gap-0.5">
              <h3 className="text-base font-semibold text-[#282828]">{conn.user.name}</h3>
              <span className="text-xs text-[#282828]">{conn.user.email}</span>
            </div>

            {/* Chat Icon */}
            <div className="flex-shrink-0">
              <img src="/images/chat.png" alt="Chat" width={28} height={28} />
            </div>
          </div>

        ))}
      </div>
    </div>
  )
}

export default Networking
