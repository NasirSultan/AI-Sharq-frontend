"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"
import api from "@/config/api"
import { FaSpinner } from "react-icons/fa"

const ParticipantOptIn = () => {
  const eventId = useSelector((state: RootState) => state.event.id)
  const userId = useSelector((state: RootState) => state.user.userId)
  const [optedIn, setOptedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!eventId || !userId) return

    const checkAndCreate = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/participant-directory-opt-in-out/${eventId}/${userId}`)
        setOptedIn(res.data.optedIn)
      } catch (err: any) {
        if (err.response?.status === 404) {
          const res = await api.post("/participant-directory-opt-in-out", {
            userId,
            eventId,
            optedIn: false,
          })
          setOptedIn(false)
        }
      } finally {
        setLoading(false)
      }
    }

    checkAndCreate()
  }, [eventId, userId])

  const toggleOptIn = async () => {
    setLoading(true)
    try {
      const res = await api.put(`/participant-directory-opt-in-out/${eventId}/${userId}`, {
        optedIn: !optedIn,
      })
      setOptedIn(res.data.optedIn)
    } catch (err) {
      console.error("Error updating opted-in status", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <FaSpinner className="animate-spin text-red-700 text-xl" />
      </div>
    )

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={toggleOptIn}
        className={`w-14 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
          optedIn ? "bg-red-700" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
            optedIn ? "translate-x-7" : "translate-x-0"
          }`}
        ></div>
      </button>
    </div>
  )
}

export default ParticipantOptIn
