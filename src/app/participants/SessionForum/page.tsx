'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'
import api from '@/config/api'
import { useRouter } from 'next/navigation'

interface Creator {
  id: number
  name: string
  file: string
}

interface Forum {
  forumId: number
  title: string
  content: string
  status: string
  tag: string
  totalComments: number
  totalUsers: number
  creator: Creator
}

interface SessionData {
  id: number
  title: string
  tags: string[]
  forums: Forum[]
}

const colors = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-yellow-100 text-yellow-700',
  'bg-pink-100 text-pink-700',
  'bg-purple-100 text-purple-700',
  'bg-red-100 text-red-700',
  'bg-orange-100 text-orange-700',
]

export default function ForumsPage() {
  const [session, setSession] = useState<SessionData | null>(null)
const [id, setId] = useState<number | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [tagColors, setTagColors] = useState<Record<string, string>>({})
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [popup, setPopup] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [role, setRole] = useState('')
  const router = useRouter()
  const [btnLoading, setBtnLoading] = useState(false)

useEffect(() => {
  const savedId = localStorage.getItem("sessionId")

  if (savedId) {
    setId(Number(savedId))
  }
}, [])



    const handleClick = () => {
    setBtnLoading(true)
    setTimeout(() => {
      setBtnLoading(false)
    }, 2000)
  }
  useEffect(() => {
    fetchData()
  }, [id])
  useEffect(() => {
    const storedRole = localStorage.getItem('role') || ''
    setRole(storedRole)
  }, [])
  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/session-forums/session/${id}`)
      const data = res.data

      const dynamicColors: Record<string, string> = {}
      data.tags.forEach((tag: string, index: number) => {
        dynamicColors[tag] = colors[index % colors.length]
      })

      data.forums.forEach((forum: Forum) => {
        if (!dynamicColors[forum.tag]) {
          const colorIndex = Object.keys(dynamicColors).length % colors.length
          dynamicColors[forum.tag] = colors[colorIndex]
        }
      })

      setTagColors(dynamicColors)
      setSession(data)
    } catch (error) {
      showPopup('error', 'Failed to load forums.')
    } finally {
      setLoading(false)
    }
  }

  const showPopup = (type: 'success' | 'error', message: string) => {
    setPopup({ type, message })
    setTimeout(() => setPopup(null), 2000)
  }

  const updateForumStatus = (forumId: number, status: string) => {
    if (!session) return
    const updatedForums = session.forums.map(forum =>
      forum.forumId === forumId ? { ...forum, status } : forum
    )
    setSession({ ...session, forums: updatedForums })
  }

  const handleApprove = async (forumId: number) => {
    try {
      await api.patch(`/session-forums/status/${forumId}`, { status: 'APPROVED' })
      updateForumStatus(forumId, 'APPROVED')
      showPopup('success', 'Forum approved.')
    } catch {
      showPopup('error', 'Failed to approve forum.')
    }
  }

  const handleReject = async (forumId: number) => {
    try {
      await api.patch(`/session-forums/status/${forumId}`, { status: 'REJECTED' })
      updateForumStatus(forumId, 'REJECTED')
      showPopup('success', 'Forum rejected.')
    } catch {
      showPopup('error', 'Failed to reject forum.')
    }
  }





  const handleDelete = async (forumId: number) => {
    try {
      await api.delete(`/session-forums/${forumId}`)
      if (!session) return
      const updatedForums = session.forums.filter(f => f.forumId !== forumId)
      setSession({ ...session, forums: updatedForums })
      showPopup('success', 'Forum deleted.')
    } catch {
      showPopup('error', 'Failed to delete forum.')
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="w-10 h-10 border-4 border-red-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )

  if (!session) return <div className="p-6 text-gray-600"></div>

  const filteredForums = session.forums.filter(forum =>
    forum.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const displayedForums = activeTag
    ? filteredForums.filter(forum => forum.tag === activeTag)
    : filteredForums

  return (
    <>
      {popup && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-md shadow-lg text-white ${popup.type === 'success' ? 'bg-green-700' : 'bg-red-700'
            }`}
        >
          {popup.message}
        </div>
      )}

      <div className="min-h-screen bg-[#fafafa] px-3 sm:px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full  transition"
          >
            <FaArrowLeft className="text-red-900 cursor-pointer" size={20} />
          </button>
<div className="flex flex-col">
  <h1 className="text-xl sm:text-2xl font-semibold text-red-900">
    Forum
  </h1>
</div>

        </div>


        <div className="flex flex-col gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-2.5 w-4 h-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search topics..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none text-sm"
              />
            </div>
            <button className="bg-red-800 text-white text-sm px-4 py-2 rounded-md hover:bg-red-700">
              Search
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="text-red-800 font-semibold text-base sm:text-lg">
              Trending Topics
            </span>
            {session.tags.slice(0, 6).map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`text-xs sm:text-sm px-3 py-1 rounded-full border transition ${tagColors[tag]
                  } ${activeTag === tag
                    ? 'ring-2 ring-red-600'
                    : 'hover:scale-105 duration-200'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg sm:text-xl text-black font-semibold">
            {activeTag ? `${activeTag} Discussions` : 'All Discussions'}
          </h2>
          <button
            onClick={() => {
              if (!session) return
              const url = '/participants/SessionForum/CreateForum'
              const state = { ...window.history.state, sessionId: session.id }
              window.history.replaceState(state, '', url)
              window.location.href = url
            }}
            className="bg-red-800 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg hover:bg-red-900 cursor-pointer"
          >
            Create New Topic
          </button>


        </div>

        {displayedForums.length === 0 && (
          <p className="text-gray-600 text-sm">No forums found.</p>
        )}

        <div className="space-y-3">
          {displayedForums.map(forum => (
            <div
              key={forum.forumId}
              className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 flex flex-col transition"
            >
              <div className="mb-1">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${tagColors[forum.tag] || 'bg-gray-100 text-gray-700'
                    }`}
                >
                  {forum.tag}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-semibold text-black">
                {forum.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                {forum.content}
              </p>

              <div className="flex items-center gap-4 mt-2 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <svg
                    width="15"
                    height="12"
                    viewBox="0 0 15 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.375 0C3.87228 0 4.34919 0.197544 4.70083 0.549175C5.05246 0.900805 5.25 1.37772 5.25 1.875C5.25 2.37228 5.05246 2.84919 4.70083 3.20083C4.34919 3.55246 3.87228 3.75 3.375 3.75C2.87772 3.75 2.40081 3.55246 2.04917 3.20083C1.69754 2.84919 1.5 2.37228 1.5 1.875C1.5 1.37772 1.69754 0.900805 2.04917 0.549175C2.40081 0.197544 2.87772 0 3.375 0ZM12 0C12.4973 0 12.9742 0.197544 13.3258 0.549175C13.6775 0.900805 13.875 1.37772 13.875 1.875C13.875 2.37228 13.6775 2.84919 13.3258 3.20083C12.9742 3.55246 12.4973 3.75 12 3.75C11.5027 3.75 11.0258 3.55246 10.6742 3.20083C10.3225 2.84919 10.125 2.37228 10.125 1.875C10.125 1.37772 10.3225 0.900805 10.6742 0.549175C11.0258 0.197544 11.5027 0 12 0ZM0 7.00078C0 5.62031 1.12031 4.5 2.50078 4.5H3.50156C3.87422 4.5 4.22813 4.58203 4.54688 4.72734C4.51641 4.89609 4.50234 5.07188 4.50234 5.25C4.50234 6.14531 4.89609 6.94922 5.51719 7.5C5.5125 7.5 5.50781 7.5 5.50078 7.5H0.499219C0.225 7.5 0 7.275 0 7.00078ZM9.49922 7.5C9.49453 7.5 9.48984 7.5 9.48281 7.5C10.1062 6.94922 10.4977 6.14531 10.4977 5.25C10.4977 5.07188 10.4812 4.89844 10.4531 4.72734C10.7719 4.57969 11.1258 4.5 11.4984 4.5H12.4992C13.8797 4.5 15 5.62031 15 7.00078C15 7.27734 14.775 7.5 14.5008 7.5H9.49922ZM5.25 5.25C5.25 4.65326 5.48705 4.08097 5.90901 3.65901C6.33097 3.23705 6.90326 3 7.5 3C8.09674 3 8.66903 3.23705 9.09099 3.65901C9.51295 4.08097 9.75 4.65326 9.75 5.25C9.75 5.84674 9.51295 6.41903 9.09099 6.84099C8.66903 7.26295 8.09674 7.5 7.5 7.5C6.90326 7.5 6.33097 7.26295 5.90901 6.84099C5.48705 6.41903 5.25 5.84674 5.25 5.25ZM3 11.3742C3 9.64922 4.39922 8.25 6.12422 8.25H8.87578C10.6008 8.25 12 9.64922 12 11.3742C12 11.7188 11.7211 12 11.3742 12H3.62578C3.28125 12 3 11.7211 3 11.3742Z"
                      fill="#9B2033"
                    />
                  </svg>
                  <span>{forum.totalUsers} Members</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 11.5C21 16.1944 16.9706 20 12 20C10.3478 20 8.8043 19.555 7.5 18.7778L3 20L4.22222 15.5C3.44498 14.1957 3 12.6522 3 11C3 6.02944 6.80558 2 11.5 2C16.1944 2 21 6.02944 21 11.5Z"
                      stroke="#9B2033"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{forum.totalComments} Comments</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                  <img
                    src={forum.creator.file}
                    alt={forum.creator.name}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
                  />
                  <span>Created by {forum.creator.name}</span>
                </div>

                <div className="flex gap-2">
                  {role === 'organizer' ? (
                    <>
                      {forum.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(forum.forumId)}
                            className="text-xs sm:text-sm px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(forum.forumId)}
                            className="text-xs sm:text-sm px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-900 cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(forum.forumId)}
                   className="text-xs sm:text-sm px-4 py-2 bg-white text-red-700 border border-red-700 rounded-lg hover:bg-red-50 cursor-pointer"

                      >
                        Delete
                      </button>
                      <Link href={`/participants/SessionForum/JoinForum/${forum.forumId}`}>
                        <button className="text-xs sm:text-sm px-4 py-2 bg-red-200 text-red-900 rounded-lg hover:bg-red-900  hover:text-white cursor-pointer">
                          Join Forum
                        </button>
                      </Link>
                    </>
                  ) : (
                    <>
                      {forum.status === 'APPROVED' ? (
                        <Link href={`/participants/SessionForum/JoinForum/${forum.forumId}`}>
                          <button className="text-xs sm:text-sm px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700">
                            Join Forum
                          </button>
                        </Link>
                      ) : forum.status === 'PENDING' ? (
                        <span className="text-xs sm:text-sm px-4 py-2 bg-gray-400 text-white rounded-lg">
                          Pending
                        </span>
                      ) : null}
                    </>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full mt-10">
        <Image
          src="/images/line.png"
          alt="Footer Line"
          width={1729}
          height={127}
          className="w-full"
        />
      </div>
    </>
  )
}
