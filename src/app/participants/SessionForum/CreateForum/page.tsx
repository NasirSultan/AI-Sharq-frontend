'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import api from '@/config/api'

export default function CreateForumPage() {
  const router = useRouter()
  const userId = useSelector((state: any) => state.user.userId)
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tag, setTag] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [hasCreated, setHasCreated] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const id = window.history.state?.sessionId || null
    if (id) setSessionId(id)

    const storedTags = JSON.parse(localStorage.getItem('sessionTags') || '[]')
    setTags(storedTags)
  }, [])

  const handleCreateForum = async () => {
    if (!sessionId || !userId) {
      setMessage('Missing session or user info')
      return
    }

    if (!title || !content || !tag) {
      setMessage('All fields are required')
      return
    }

    if (hasCreated) {
      setMessage('You already created a forum for this session')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      await api.post('/session-forums', {
        sessionId, // sent in request body, never displayed
        userId,
        title,
        content,
        tag,
      })

      setHasCreated(true)
      setMessage('Forum created successfully')
      setTimeout(() => router.push('/participants/SessionForum'), 1200)
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to create forum')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-5 shadow-md text-center rounded-lg bg-white">
      <div className="flex justify-center mb-5">
        <Image
          src="/images/logo1.png"
          alt="Al Sharq Logo"
          width={110}
          height={34}
          className="object-contain"
        />
      </div>

      <h1 className="text-xl font-semibold mb-1">Create New Topic</h1>
      <p className="mb-5 text-gray-600 text-sm">Start a new discussion below</p>

      <div className="text-left space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-900 text-sm">
            Forum Title <span className="text-red-900">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter a title for your topic"
            className="w-full p-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-red-900 outline-none text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-900 text-sm">
            Discussion Content <span className="text-red-900">*</span>
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your thoughts or questions..."
            className="w-full p-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-red-900 outline-none h-24 resize-none text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-900 text-sm">
            Select a Tag <span className="text-red-900">*</span>
          </label>
          <select
            value={tag}
            onChange={e => setTag(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-red-900 outline-none text-sm"
          >
            <option value="">Choose a tag</option>
            {tags.map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleCreateForum}
          disabled={hasCreated || loading}
          className={`w-full flex justify-center items-center gap-2 py-3 rounded-md text-sm font-medium text-white
            ${hasCreated ? 'bg-red-900 cursor-not-allowed' : 'bg-red-900 hover:bg-red-800 cursor-pointer'}`}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          )}
          {hasCreated ? 'Forum Created' : loading ? 'Creating...' : 'Create Forum'}
        </button>
      </div>

      {message && (
        <p className="mt-4 text-center text-sm text-green-200">{message}</p>
      )}
    </div>
  )
}
