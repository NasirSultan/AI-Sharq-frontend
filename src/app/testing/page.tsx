"use client"

import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"
import api from "@/config/api"

export default function TestingPage() {
  // Get event ID from Redux
  const eventId = useSelector((state: RootState) => state.event.id)

  // Fetch sessions from backend
  const fetchSessions = async () => {
    if (!eventId) {
      console.warn("No event ID found in Redux")
      return
    }

    try {
      const res = await api.get(`/participants/all-sessions/${eventId}`)
      console.log("API Response:", res.data)
    } catch (err) {
      console.error("Error fetching sessions:", err)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [eventId])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Testing API</h1>
      <p>Check console for session response</p>
    </div>
  )
}
