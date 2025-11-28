'use client'

import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'next/navigation'
import api from '@/config/api'
import { useRouter } from 'next/navigation'

import { FaArrowLeft } from 'react-icons/fa'

interface User {
  id: number
  name: string
  role: string
  file?: string
}

interface Reply {
  id: number
  content: string
  user: User
  createdAt: string
}

interface Comment {
  id: number
  content: string
  user: User
  replies: Reply[]
  createdAt: string
}

interface Forum {
  id: number
  title: string
  content: string
  tag: string
  user: User
  totalUsers: number
  totalComments: number
  comments: Comment[]
}

export default function ForumPage() {
  const { id } = useParams()
  const userId = useSelector((state: any) => state.user.userId)

  const [forum, setForum] = useState<Forum | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({})
  const [activeReply, setActiveReply] = useState<number | null>(null)
  const [replySubmitting, setReplySubmitting] = useState<{ [key: number]: boolean }>({})
  const [isPolling, setIsPolling] = useState(false)
  const commentsEndRef = useRef<HTMLDivElement>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const fetchForum = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true)
      }
      const res = await api.get(`/forum-comments/forum/${Number(id)}`)
      setForum(res.data)
    } catch (err) {
      console.error('Failed to fetch forum', err)
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }

  const startPolling = () => {
    setIsPolling(true)
    pollingIntervalRef.current = setInterval(() => {
      fetchForum(true) // Silent fetch (no loading state)
    }, 10000) // 10 seconds
  }

  const stopPolling = () => {
    setIsPolling(false)
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    try {
      setSubmitting(true)
      await api.post('/forum-comments', {
        forumId: Number(id),
        userId,
        content: newComment,
      })

      setNewComment('')

      // Refetch to get complete data with user info
      await fetchForum(true) // Silent fetch

      // Scroll to new comment
      setTimeout(scrollToBottom, 100)
    } catch (err) {
      console.error('Failed to add comment', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddReply = async (commentId: number) => {
    const content = replyContent[commentId]
    if (!content?.trim()) return
    try {
      setReplySubmitting(prev => ({ ...prev, [commentId]: true }))
      await api.post('/forum-comments', {
        forumId: Number(id),
        userId,
        content,
        parentCommentId: commentId,
      })

      setReplyContent(prev => ({ ...prev, [commentId]: '' }))
      setActiveReply(null)

      // Refetch to get complete data with user info
      await fetchForum(true) // Silent fetch
    } catch (err) {
      console.error('Failed to add reply', err)
    } finally {
      setReplySubmitting(prev => ({ ...prev, [commentId]: false }))
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return
    try {
      await api.delete(`/forum-comments/${commentId}`)

      // Refetch to ensure consistency
      const res = await api.get(`/forum-comments/forum/${Number(id)}`)
      setForum(res.data)
    } catch (err) {
      console.error('Failed to delete comment', err)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  useEffect(() => {
    fetchForum()
    startPolling() // Start auto-refresh

    return () => {
      stopPolling() // Cleanup on unmount
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading forum...</p>
        </div>
      </div>
    )
  }

  if (!forum) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Forum not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 max-w-6xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full  transition  "
        >
          <FaArrowLeft className="text-red-900 cursor-pointer" size={20} />
        </button>

        <h1 className="text-xl sm:text-2xl font-semibold text-red-900">
          Forum Description
        </h1>
      </div>


      <div className="">
        {/* Auto-refresh indicator */}
        {/* Forum Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
              {forum.tag}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            {forum.title}
          </h1>

          <p className="text-gray-700 text-sm sm:text-base mb-4 leading-relaxed">
            {forum.content}
          </p>

          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>
                {forum.totalUsers} {forum.totalUsers === 1 ? 'User' : 'Users'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>
                {forum.totalComments} {forum.totalComments === 1 ? 'Comment' : 'Comments'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <img
              src={forum.user?.file || '/default-avatar.png'}
              alt={forum.user?.name || 'User'}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-red-900"
            />
            <div className="flex-1">
              <p className="text-sm sm:text-base font-bold text-gray-900">

                Created by   {forum.user?.name || 'Unknown User'}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 capitalize">
                {forum.user?.role || 'user'}
              </p>
            </div>
          </div>
        </div>


        {/* Add Comment Section */}


        {/* Comments List */}
        <div className="space-y-6 pb-28 relative">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 px-1">
            Comments ({forum.comments.length})
          </h2>

          {forum.comments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-2 text-center">
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            forum.comments.map(comment => (
              <div key={comment.id} className="bg-white rounded-lg shadow-sm  sm:p-6">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={comment.user?.file || '/default-avatar.png'}
                    alt={comment.user?.name || 'User'}
                    className="w-5 h-5 sm:w-7 sm:h-7 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">
                        {comment.user?.name || 'Unknown User'}
                      </p>
                      <span className="px-1 py-0.5 bg-gray-100 text-gray-600 rounded text-xs capitalize">
                        {comment.user?.role || 'user'}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base break-words">
                      {comment.content}
                    </p>
                  </div>
                </div>

                {comment.replies.length > 0 && (
                  <div className="mt-4 ml-6 sm:ml-11 space-y-3 border-l-2 border-gray-200 pl-4 sm:pl-6">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="flex flex-col gap-1">
                        <div className="flex items-start gap-3">
                          <img
                            src={reply.user?.file || '/default-avatar.png'}
                            alt={reply.user?.name || 'User'}
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900 text-xs sm:text-sm">
                                {reply.user?.name || 'Unknown User'}
                              </p>
                              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs capitalize">
                                {reply.user?.role || 'user'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700 text-xs sm:text-sm break-words">
                              {reply.content}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 ml-9 sm:ml-11">
                          {userId === reply.user?.id && (
                            <button
                              onClick={() => handleDeleteComment(reply.id)}
                              className="text-xs sm:text-sm text-red-600 hover:text-red-900 font-medium cursor-pointer"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 mt-3 ml-11 sm:ml-13">
                  <button
                    onClick={() => setActiveReply(activeReply === comment.id ? null : comment.id)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-mediu cursor-pointer"
                  >
                    Reply
                  </button>
                  {userId === comment.user?.id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-sm text-red-600 hover:text-red-900 font-medium cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </div>

                {activeReply === comment.id && (
                  <div className="mt-4 ml-11 sm:ml-13 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={replyContent[comment.id] || ''}
                      onChange={e =>
                        setReplyContent(prev => ({ ...prev, [comment.id]: e.target.value }))
                      }
                      onKeyPress={e => e.key === 'Enter' && handleAddReply(comment.id)}
                      disabled={replySubmitting[comment.id]}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm disabled:bg-gray-100"
                    />
                    <button
                      onClick={() => handleAddReply(comment.id)}
                      disabled={replySubmitting[comment.id] || !replyContent[comment.id]?.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium cursor-pointer"
                    >
                      {replySubmitting[comment.id] ? 'Posting...' : 'Reply'}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}

          <div ref={commentsEndRef} />

          {/* Fixed Add Comment Box */}
          <div className="fixed bottom-0 left-0 right-0 bg-gray-50 p-3 sm:p-4 shadow-lg z-50">
            <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleAddComment()}
                disabled={submitting}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none text-sm sm:text-base disabled:bg-gray-100"
              />
              <button
                onClick={handleAddComment}
                disabled={submitting || !newComment.trim()}
                className="px-6 py-2 bg-red-900 text-white rounded-lg hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium cursor-pointer"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>


        </div>

      </div>
    </div>
  )
}