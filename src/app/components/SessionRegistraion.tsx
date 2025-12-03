"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"
import api from "@/config/api"
import { FaSpinner } from "react-icons/fa"

const RegistrationToggle = () => {
  const eventId = useSelector((state: RootState) => state.event.id)
  const userId = useSelector((state: RootState) => state.user.userId)
  const [registered, setRegistered] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!eventId || !userId) return

    const checkAndCreate = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/event/registration-status/${eventId}/${userId}`)
        setRegistered(res.data.registered)
      } catch (err: any) {
        if (err.response?.status === 404) {
          const res = await api.post("/event/toggle-registration", {
            eventId,
            userId
          })
          setRegistered(false)
        }
      } finally {
        setLoading(false)
      }
    }

    checkAndCreate()
  }, [eventId, userId])

  const toggle = async () => {
    setLoading(true)
    try {
      setRegistered(prev => !prev)
      await api.post("/event/toggle-registration", {
        eventId,
        userId
      })
    } catch (err) {
      setRegistered(prev => !prev)
      console.error("Error toggling registration", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <FaSpinner className="animate-spin text-red-700 text-xl" />
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={toggle}
        className={`w-8 h-4 flex items-center rounded-full p-[2px] transition-colors duration-300 ${
          registered ? "bg-red-700" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform duration-300 ${
            registered ? "translate-x-4" : "translate-x-0"
          }`}
        ></div>
      </button>
    </div>
  )
}

export default RegistrationToggle
