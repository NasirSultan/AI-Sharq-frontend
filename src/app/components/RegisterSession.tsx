"use client"

import React, { useState } from "react"
import api from "@/config/api"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"
import { useRouter, useSearchParams } from "next/navigation"
import LoadingButton from "@/app/components/LoadingButton"

export default function RegisterSession() {
  const [whyWantToJoin, setWhyWantToJoin] = useState("")
  const [relevantExperience, setRelevantExperience] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState<{ message: string; success: boolean } | null>(null)

  const userId = useSelector((state: RootState) => state.user.userId)
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("sessionId")
  const router = useRouter()

  const handleRegister = async () => {
    if (!userId || !sessionId) {
      console.error("Missing userId or sessionId")
      return
    }

    try {
      setLoading(true)
      const payload = {
        userId: Number(userId),
        sessionId: Number(sessionId),
        whyWantToJoin,
        relevantExperience,
      }

      const res = await api.post(`/participants/session-register`, payload)

      setShowPopup({ message: "Successfully Registered!", success: true })
      setTimeout(() => {
        router.push("/participants/Schedule")
      }, 2000)
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setShowPopup({ message: "Already Registered", success: false })
        setTimeout(() => router.push("/participants/Schedule"), 2000)
      } else {
        console.error("Registration error:", err)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-4 bg-white rounded-xl shadow-sm mt-10 relative">
      {showPopup && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-xl shadow-md text-white ${
            showPopup.success ? "bg-green-600" : "bg-yellow-500"
          }`}
        >
          {showPopup.message}
        </div>
      )}

      <h1 className="text-lg font-semibold text-black">Register for Session</h1>

      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-700">Why do you want to join?</label>
          <textarea
            value={whyWantToJoin}
            onChange={(e) => setWhyWantToJoin(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Relevant Experience</label>
          <textarea
            value={relevantExperience}
            onChange={(e) => setRelevantExperience(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>
      </div>

      <div className="pt-3">
        <LoadingButton
          text="Register"
          onClick={handleRegister}
          loading={loading}
          color="bg-red-600"
        />
      </div>
    </div>
  )
}
