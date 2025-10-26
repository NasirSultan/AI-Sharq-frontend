'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'
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
  unreadMessages: number
}

interface Message {
  senderId: number
  receiverId: number
  content: string
  createdAt?: string
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

  // Generate Google Avatar URL based on user name
  const getAvatarUrl = (user: User) => {
    // Use the first letter of the name for the avatar
    const initial = user.name.charAt(0).toUpperCase()
    // Generate a consistent background color based on the name
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
          createdAt: msg.createdAt
        }))
        setMessages(formatted)
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
    try {
      const payload: Message = {
        senderId: userId,
        receiverId: selectedUser.id,
        content: newMessage
      }
      await api.post('/chat/send', payload)
      setNewMessage('')
      fetchMessages(selectedUser.id)
    } catch (error) {
      console.error('Error sending message:', error)
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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2 py-4 px-6">
          <Link href="/participants/Home">
            <FaArrowLeft className="text-red-800 w-5 h-5 cursor-pointer" />
          </Link>
          <h1 className="text-xl font-semibold text-black ml-4">Chats</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0 p-6 gap-6">
        {/* Chat List */}
        <div className="w-1/3 bg-white rounded-2xl shadow border flex flex-col min-h-0">
          <h2 className="px-6 py-4 text-lg font-semibold border-b border-gray-300 text-black shrink-0">
            Chat List
          </h2>
          <div className="flex-1 overflow-y-auto">
            <ul>
              {connections.map(conn => {
                const unreadCount = getUnreadCount(conn.user.id)
                return (
                  <li
                    key={conn.connectionId}
                    onClick={() => selectUser(conn.user)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 ${
                      selectedUser?.id === conn.user.id ? 'bg-red-800 text-white' : 'hover:bg-gray-50'
                    }`}
                  >
                    <img
                      src={getAvatarUrl(conn.user)}
                      alt={conn.user.name}
                      className="h-10 w-10 rounded-full shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${
                        selectedUser?.id === conn.user.id ? 'text-white' : 'text-black'
                      }`}>
                        {conn.user.name}
                      </p>
                      <p className={`text-sm truncate ${
                        selectedUser?.id === conn.user.id ? 'text-white' : 'text-gray-500'
                      }`}>
                        {conn.user.email}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full min-w-[20px] text-center shrink-0">
                        {unreadCount}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-white rounded-2xl shadow border flex flex-col min-h-0">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center px-6 py-4 border-b border-gray-300 shrink-0">
                <img
                  src={getAvatarUrl(selectedUser)}
                  alt={selectedUser.name}
                  className="h-10 w-10 rounded-full"
                />
                <div className="ml-3">
                  <p className="font-semibold text-black">{selectedUser.name}</p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 flex flex-col min-h-0">
                {/* Scrollable Messages Area */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 ${
                          msg.senderId === userId ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {msg.senderId !== userId && (
                          <img
                            src={getAvatarUrl(selectedUser)}
                            alt="avatar"
                            className="h-8 w-8 rounded-full shrink-0"
                          />
                        )}
                        <div className={`max-w-md ${msg.senderId === userId ? 'text-right' : ''}`}>
                          <div className={`px-4 py-2 rounded-xl inline-block ${
                            msg.senderId === userId ? 'bg-gray-100 text-gray-800' : 'bg-red-600 text-white'
                          }`}>
                            {msg.content}
                          </div>
                          <p className={`text-xs mt-1 ${
                            msg.senderId === userId ? 'text-gray-400' : 'text-gray-400'
                          }`}>
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}
                          </p>
                        </div>
                        {msg.senderId === userId && (
                          <img
                            src={getAvatarUrl({ id: userId, name: 'You', email: '', file: null })}
                            alt="avatar"
                            className="h-8 w-8 rounded-full shrink-0"
                          />
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input Container - Fixed at Bottom */}
                <div className="border-t border-gray-300 px-6 py-4 bg-white shrink-0">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 placeholder-gray-400 text-black rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-red-800"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="text-red-800 font-bold px-4 py-2 rounded-full border border-red-800 hover:bg-red-50 transition-colors shrink-0"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatPage