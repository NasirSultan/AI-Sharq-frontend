"use client"

import React, { useState, use } from "react"
import api from "@/config/api"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"
import { useRouter } from "next/navigation"
import LoadingButton from "@/app/components/LoadingButton"
import Image from "next/image"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function RegisterSession({ params }: PageProps) {
  const { id } = use(params)
  const [whyWantToJoin, setWhyWantToJoin] = useState("")
  const [relevantExperience, setRelevantExperience] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState<{ message: string; success: boolean } | null>(null)

  const userId = useSelector((state: RootState) => state.user.userId)
  const router = useRouter()

const handleRegister = async () => {
  if (!userId || !id) return

  if (!whyWantToJoin.trim() || !relevantExperience.trim()) {
    setShowPopup({ message: "Please fill all fields", success: false })
    return
  }

  try {
    setLoading(true)

    const payload = {
      userId: Number(userId),
      sessionId: Number(id),
      whyWantToJoin,
      relevantExperience
    }

    const res = await api.post(`/participants-session/registration`, payload)

    if (res.status === 201) {
      setShowPopup({ message: "Successfully Registered!", success: true })

      const cached = localStorage.getItem(`session-${id}`)
      if (cached) {
        const data = JSON.parse(cached)
        localStorage.setItem(
          `session-${id}`,
          JSON.stringify({
            ...data,
            isRegistered: true
          })
        )
      }

      setTimeout(() => router.push("/participants/Schedule"), 1000)
    }
  } catch (err) {
    if (err.response && err.response.status === 400) {
      setShowPopup({ message: "Already Registered", success: false })

      const cached = localStorage.getItem(`session-${id}`)
      if (cached) {
        const data = JSON.parse(cached)
        localStorage.setItem(
          `session-${id}`,
          JSON.stringify({
            ...data,
            isRegistered: true
          })
        )
      }

      setTimeout(() => router.push("/participants/Schedule"), 1000)
    } else {
      setShowPopup({ message: "Something went wrong. Try again.", success: false })
    }
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <div className="flex justify-center mb-4">
          <Image src="/images/logo1.png" alt="Logo" width={160} height={40} />
        </div>

        <h2 className="text-xl font-semibold text-center text-black mb-2">Apply for Session</h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Please fill in the information below.
        </p>

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

        <div className="pt-4">
          <LoadingButton
            text="Register"
            onClick={handleRegister}
            loading={loading}
            color="bg-red-900 w-full"
            disabled={!whyWantToJoin || !relevantExperience}
          />
        </div>

        {showPopup && (
          <div
            className={`absolute top-2 left-1/2 transform -translate-x-1/2 text-sm px-4 py-2 rounded-lg shadow-md ${
              showPopup.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-900"
            }`}
          >
            {showPopup.message}
          </div>
        )}
      </div>
    </div>
  )
}
