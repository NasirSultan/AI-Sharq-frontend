"use client"
import React, { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"
import api from "@/config/api"

export default function TotalLiveSession() {
  const [liveCount, setLiveCount] = useState(0)
  const userId = useSelector((state: RootState) => state.user.userId)
  const eventId = useSelector((state: RootState) => state.event.id)
  const cacheRef = useRef<{ timestamp: number; count: number }>({ timestamp: 0, count: 0 })

  useEffect(() => {
    const fetchLiveSessions = async () => {
      if (!userId || !eventId) return
      const now = Date.now()
      if (now - cacheRef.current.timestamp < 10 * 60 * 1000) {
        setLiveCount(cacheRef.current.count)
        return
      }

      try {
        const res = await api.get(`/participants-session/${userId}/registered-sessions?eventId=${eventId}`)
        const sessions = res.data || []
        const current = new Date()
        const liveSessions = sessions.filter((s: any) => {
          const start = new Date(s.startTime)
          const end = new Date(s.endTime)
          return start <= current && end >= current
        })

        cacheRef.current = { timestamp: now, count: liveSessions.length }
        setLiveCount(liveSessions.length)
      } catch (err) {
        console.error("Failed to fetch sessions", err)
        setLiveCount(0)
      }
    }

    fetchLiveSessions()
    const interval = setInterval(fetchLiveSessions, 60000)
    return () => clearInterval(interval)
  }, [userId, eventId])

  return <span className="text-red-900 text-lg font-bold">{liveCount}</span>
}
