'use client'

import React, { useEffect, useState } from 'react'
import { FaSearch, FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { FaMessage } from 'react-icons/fa6'
import Image from 'next/image'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'
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

const Networking: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.userId)
  const [searchTerm, setSearchTerm] = useState('')
  const [connections, setConnections] = useState<Connection[]>([])

  const fetchConnections = async () => {
    try {
      const res = await api.get(`/connections/all?userId=${userId}`)
      setConnections(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (userId) fetchConnections()
  }, [userId])

  const filteredConnections = connections.filter(conn =>
    (conn.user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (conn.user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  return (
    <div className="relative w-full h-screen">
      <div className="absolute flex flex-col items-end p-0 gap-10 w-[1280px] h-[1367px] left-[80px] top-[30px]">

        {/* Header */}
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

        {/* Navigation */}
        <div className="flex flex-row items-center gap-10 w-[1280px] h-6">
          <Link href="/participants/Home">
            <FaArrowLeft className="text-[#9B2033] text-2xl" />
          </Link>
          <h1 className="text-2xl font-medium text-[#282828]">Networking</h1>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-row items-center gap-4 w-[1280px] h-11">
          <Link href="/participants/Networking">
            <button className="flex justify-center items-center p-4 w-80 h-11 border border-[#E8E8E8] rounded-xl text-black">
              Directory
            </button>
          </Link>
          <Link href="/participants/MyConnections">
            <button className="flex justify-center items-center p-4 w-80 h-11 bg-[#9B2033] rounded-xl">
              <span className="font-bold text-white">My Connections</span>
            </button>
          </Link>
          <div className="flex flex-row items-center p-4 gap-3 w-[628px] h-11 border border-[#E8E8E8] rounded-xl">
            <FaSearch className="text-[#9B2033] text-xl" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 text-base text-[#575454] border-none outline-none"
            />
          </div>
        </div>

        {/* Participants Count */}
        <div className="text-base font-medium text-[#282828]">
          {filteredConnections.length} Participants Showing
        </div>

        {/* Connections List */}
        <div className="flex flex-col items-start p-0 gap-6 w-[1280px] h-[1038px]">
          {filteredConnections.map(conn => (
            <div
              key={conn.connectionId}
              className="box-border flex items-center p-6 gap-6 w-[1280px] h-40 bg-white border border-[#D4D4D4] shadow-sm rounded-3xl"
            >
              {/* Profile Picture */}
              <img
                src={conn.user.file ? `/uploads/${conn.user.file}` : '/images/default.png'}
                alt={conn.user.name}
                className="w-24 h-24 rounded-full object-cover"
              />

              {/* Name and Email */}
              <div className="flex flex-col justify-center flex-1 gap-1">
                <h3 className="text-lg font-semibold text-[#282828]">{conn.user.name}</h3>
                <span className="text-base text-[#282828]">{conn.user.email}</span>
              </div>

              {/* Chat Icon */}
              <div className="flex items-center">
                <Image src="/images/chat.png" alt="Chat" width={34} height={34} />
              </div>
            </div>
          ))}
        </div>

      </div>
      <Image src="/images/line.png" alt="Line" width={1729} height={127} className="absolute top-[1510px]" />
    </div>
  )
}

export default Networking
