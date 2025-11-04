'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { FaArrowLeft, FaCheck, FaExclamationCircle } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'
import api from '@/config/api'
import { useRouter } from "next/navigation"

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
  unreadMessages: number
}

interface Message {
  senderId: number
  receiverId: number
  content: string
  createdAt?: string
  status?: 'sending' | 'sent' | 'failed'
  tempId?: string
}

interface ApiMessage {
  id: number
  from: 'sender' | 'receiver'
  content: string
  createdAt: string
}

const ChatPage: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.userId)
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [unreadCounts, setUnreadCounts] = useState<{ [userId: number]: number }>({})
  const router = useRouter()

  const getAvatarUrl = (user: User) => {
    if (user.file) {
      return user.file
    }
    
    const initial = user.name.charAt(0).toUpperCase()
    const colors = ['FFB3BA', 'FFDFBA', 'FFFFBA', 'BAFFC9', 'BAE1FF', 'D9B3FF']
    const colorIndex = user.name.length % colors.length
    const bgColor = colors[colorIndex]
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&background=${bgColor}&color=fff&size=128&rounded=true&bold=true`
  }

  const fetchConnections = async () => {
    if (!userId) return
    try {
      const res = await api.get(`/connections/all?userId=${userId}`)
      const connectionsData: Connection[] = Array.isArray(res.data) ? res.data : []

      setConnections(connectionsData)

      connectionsData.forEach(conn => {
        if (conn.unreadMessages > 0) {
          setUnreadCounts(prev => ({
            ...prev,
            [conn.user.id]: (prev[conn.user.id] || 0) + conn.unreadMessages
          }))
        }
      })
    } catch (error) {
      console.error('Error fetching connections:', error)
    }
  }

  const fetchMessages = async (otherUserId: number) => {
    if (!userId) return
    try {
      const res = await api.get(`/chat/messages?userId=${userId}&otherUserId=${otherUserId}`)
      if (res.data && Array.isArray(res.data.messages)) {
        const formatted: Message[] = (res.data.messages as ApiMessage[]).map((msg) => ({
          senderId: msg.from === 'sender' ? userId : otherUserId,
          receiverId: msg.from === 'sender' ? otherUserId : userId,
          content: msg.content,
          createdAt: msg.createdAt,
          status: 'sent'
        }))
        
        // Merge with existing messages that have 'sending' or 'failed' status
        setMessages(prev => {
          const optimisticMessages = prev.filter(m => m.status === 'sending' || m.status === 'failed')
          return [...formatted, ...optimisticMessages]
        })
      } else {
        setMessages([])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const selectUser = (user: User) => {
    setSelectedUser(user)
    fetchMessages(user.id)
    setUnreadCounts(prev => ({
      ...prev,
      [user.id]: 0
    }))
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !userId) return
    
    const tempId = `temp-${Date.now()}`
    const optimisticMessage: Message = {
      senderId: userId,
      receiverId: selectedUser.id,
      content: newMessage,
      createdAt: new Date().toISOString(),
      status: 'sending',
      tempId
    }

    // Add message optimistically
    setMessages(prev => [...prev, optimisticMessage])
    setNewMessage('')

    try {
      const payload = {
        senderId: userId,
        receiverId: selectedUser.id,
        content: optimisticMessage.content
      }
      
      await api.post('/chat/send', payload)
      
      // Update message status to sent
      setMessages(prev => 
        prev.map(msg => 
          msg.tempId === tempId 
            ? { ...msg, status: 'sent' as const }
            : msg
        )
      )

      // Fetch updated messages after a short delay
      setTimeout(() => {
        fetchMessages(selectedUser.id)
      }, 1000)
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Update message status to failed
      setMessages(prev => 
        prev.map(msg => 
          msg.tempId === tempId 
            ? { ...msg, status: 'failed' as const }
            : msg
        )
      )
    }
  }

  const retryMessage = async (msg: Message) => {
    if (!selectedUser || !userId) return

    // Update status to sending
    setMessages(prev => 
      prev.map(m => 
        m.tempId === msg.tempId 
          ? { ...m, status: 'sending' as const }
          : m
      )
    )

    try {
      const payload = {
        senderId: userId,
        receiverId: selectedUser.id,
        content: msg.content
      }
      
      await api.post('/chat/send', payload)
      
      // Update message status to sent
      setMessages(prev => 
        prev.map(m => 
          m.tempId === msg.tempId 
            ? { ...m, status: 'sent' as const }
            : m
        )
      )

      setTimeout(() => {
        fetchMessages(selectedUser.id)
      }, 1000)
    } catch (error) {
      console.error('Error retrying message:', error)
      
      setMessages(prev => 
        prev.map(m => 
          m.tempId === msg.tempId 
            ? { ...m, status: 'failed' as const }
            : m
        )
      )
    }
  }

  const getUnreadCount = (userId: number) => {
    return unreadCounts[userId] || 0
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!userId) return
    fetchConnections()
    const interval = setInterval(fetchConnections, 10000)
    return () => clearInterval(interval)
  }, [userId])

  useEffect(() => {
    if (!selectedUser) return
    fetchMessages(selectedUser.id)
    const interval = setInterval(() => {
      fetchMessages(selectedUser.id)
    }, 10000)
    return () => clearInterval(interval)
  }, [selectedUser, userId])

  return (
 <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
  {/* Header */}
<div className="w-full">
 <div className="max-w-6xl w-full mx-auto px-6 py-4 mt-2 bg-red-100 rounded-xl ">

    <div className="flex items-center gap-2">
      <FaArrowLeft
        onClick={() => router.back()}
        className="text-red-900 w-5 h-5 cursor-pointer hover:text-red-800 transition-all hover:scale-110"
      />
      <h1 className="text-xl font-semibold text-gray-800 ml-4">Al Sharq Chat</h1>
    </div>
    <p className="text-gray-700 text-base mt-2 ml-9">
      Welcome to Al Sharq Chat. Connect, share ideas, and stay in touch with your network.
    </p>
  </div>
</div>

  {/* Main Content */}
  <div className="flex-1 flex justify-center px-4 py-6 min-h-0">
    <div className="flex flex-col md:flex-row w-full max-w-6xl gap-6 min-h-0">
      {/* Chat List */}
      <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col min-h-0">
        <h2 className="px-6 py-4 text-lg font-semibold border-b border-gray-200 text-gray-800 shrink-0">
          Conversations
        </h2>
        <div className="flex-1 overflow-y-auto">
          <ul>
            {connections.map(conn => {
              const unreadCount = getUnreadCount(conn.user.id)
              return (
                <li
                  key={conn.connectionId}
                  onClick={() => selectUser(conn.user)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 transition-all ${
                    selectedUser?.id === conn.user.id 
                      ? 'bg-red-900 text-white shadow-md' 
                      : 'hover:bg-gray-50 hover:shadow-sm'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={getAvatarUrl(conn.user)}
                      alt={conn.user.name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                    />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center border-2 border-white">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold truncate ${
                      selectedUser?.id === conn.user.id ? 'text-white' : 'text-gray-800'
                    }`}>
                      {conn.user.name}
                    </p>
                    <p className={`text-sm truncate ${
                      selectedUser?.id === conn.user.id ? 'text-red-100' : 'text-gray-500'
                    }`}>
                      {conn.user.email}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col min-h-0">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-900 to-red-800 rounded-t-2xl shrink-0">
              <img
                src={getAvatarUrl(selectedUser)}
                alt={selectedUser.name}
                className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div className="ml-3">
                <p className="font-semibold text-white">{selectedUser.name}</p>
                <p className="text-sm text-red-100">{selectedUser.email}</p>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={msg.tempId || idx}
                      className={`flex items-start gap-3 ${
                        msg.senderId === userId ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.senderId !== userId && (
                        <img
                          src={getAvatarUrl(selectedUser)}
                          alt="avatar"
                          className="h-8 w-8 rounded-full shrink-0 object-cover border border-gray-200"
                        />
                      )}
                      <div className={`max-w-md ${msg.senderId === userId ? 'text-right' : ''}`}>
                        <div className={`px-4 py-3 rounded-2xl inline-block shadow-sm relative ${
                          msg.senderId === userId 
                            ? 'bg-gray-100 text-gray-800 rounded-br-sm' 
                            : 'bg-red-900 text-white rounded-bl-sm'
                        } ${msg.status === 'failed' ? 'opacity-70' : ''}`}>
                          {msg.content}
                          {msg.senderId === userId && msg.status && (
                            <span className="ml-2 inline-flex items-center">
                              {msg.status === 'sending' && (
                                <svg className="animate-spin h-3 w-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              )}
                              {msg.status === 'sent' && <FaCheck className="h-3 w-3 text-green-600" />}
                              {msg.status === 'failed' && <FaExclamationCircle className="h-3 w-3 text-red-600" />}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs px-1 text-gray-400">
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}
                          </p>
                          {msg.status === 'failed' && msg.senderId === userId && (
                            <button
                              onClick={() => retryMessage(msg)}
                              className="text-xs text-red-600 hover:text-red-700 underline"
                            >
                              Retry
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 px-6 py-4 bg-white shrink-0 shadow-inner">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 placeholder-gray-400 text-gray-800 rounded-full px-5 py-3 border border-gray-300 focus:outline-none focus:border-red-900 focus:ring-2 focus:ring-red-900 focus:ring-opacity-20 transition-all"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-red-900 text-white font-semibold px-6 py-3 rounded-full hover:bg-red-800 transition-all shadow-md hover:shadow-lg shrink-0 active:scale-95"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <svg
              className="w-24 h-24 mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-lg font-medium">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  </div>
</div>

  )
}

export default ChatPage