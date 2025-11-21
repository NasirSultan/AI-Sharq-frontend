'use client'

import React, { useState, useRef, useEffect } from 'react'
import { FaSearch, FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { FaMessage } from 'react-icons/fa6'
import Image from 'next/image'
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
  file: string | null
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
      // Compare lengths or IDs to check for changes
      const hasChanged =
        prevData.length !== data.length ||
        data.some((conn: Connection, index: number) => conn.connectionId !== prevData[index]?.connectionId)

      if (hasChanged) {
        setConnections(data)
        prevDataRef.current = data
      }
    }
  }, [data])

  if (error) console.error(error)

  const filteredConnections = connections.filter(conn =>
    (conn.user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (conn.user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">

      {/* Header */}
      <div className="flex items-center gap-3 bg-[#FFEEEE] p-4 rounded-2xl shadow mb-6">
        <div className="w-12 h-12 bg-[#FFBEBE] rounded-lg flex items-center justify-center">
          <FaMessage className="text-[#9B2033] text-xl" />
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
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <Link href="/participants/Networking">
          <button className="border border-[#E8E8E8] rounded-xl px-6 py-2 text-black">
            Directory
          </button>
        </Link>
        <Link href="/participants/MyConnections">
          <button className="bg-[#9B2033] text-white rounded-xl px-6 py-2 font-bold">
            My Connections
          </button>
        </Link>
        <div className="flex items-center border border-[#E8E8E8] rounded-xl px-3 py-2 flex-1 min-w-[200px]">
          <FaSearch className="text-[#9B2033] mr-2" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
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
        {filteredConnections.map(conn => (
          <div
            key={conn.connectionId}
            className="flex flex-row items-center gap-3 bg-white p-3 rounded-xl shadow border border-[#D4D4D4] w-full"
          >
            {/* Profile Picture */}
            <div className="w-14 h-14 relative rounded-full overflow-hidden flex-shrink-0">
              {conn.user.file ? (
                <Image
                  src={encodeURI(conn.user.file)}
                  alt={conn.user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <Image
                  src="/https://thumbs.dreamstime.com/b/beautiful-woman-walking-balancing-street-curb-curbstone-sunset-copy-space-caucasian-smiling-carrying-bag-154366915.jpg"
                  alt={conn.user.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* Name and Email */}
            <div className="flex-1 flex flex-col justify-center gap-0.5">
              <h3 className="text-base font-semibold text-[#282828]">{conn.user.name}</h3>
              <span className="text-xs text-[#282828]">{conn.user.email}</span>
            </div>

            {/* Chat Icon */}
            <div className="flex-shrink-0">
              <Image src="/images/chat.png" alt="Chat" width={28} height={28} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Networking
