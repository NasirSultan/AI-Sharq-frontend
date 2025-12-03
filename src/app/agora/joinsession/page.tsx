"use client"

import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import api from "@/config/api"
import { RootState } from "@/lib/store/store"
import { useRouter } from "next/navigation"
import LoadingButton from "@/app/components/LoadingButton"
import Image from "next/image"

const AgoraTokenCard = () => {
  const [token, setToken] = useState<string | null>(null)
  const [fetchingToken, setFetchingToken] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState("")
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  const userId = useSelector((state: RootState) => state.user.userId)
  const [sessionName, setSessionName] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const fetchToken = async () => {
      setFetchingToken(true)
      try {
        const storedSession = localStorage.getItem("sessionName") || "defaultChannel"
        setSessionName(storedSession)

        const localRole = localStorage.getItem("role") || "audience"
        const role = localRole === "speaker" ? "host" : "audience"

        const response = await api.get("/agora/token", {
          params: { channelName: storedSession, uid: userId || 1, role }
        })

        const tokenFromApi = response.data?.data?.token
        if (tokenFromApi) {
          setToken(tokenFromApi)
        } else {
          throw new Error("Token not found in response")
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setFetchingToken(false)
      }
    }

    fetchToken()
  }, [userId])

  const handleSaveAndJoin = async () => {
    if (!userName.trim() || !token) return
    setButtonLoading(true)
    try {
      localStorage.setItem("sessionUserName", userName.trim())
      localStorage.setItem("agoraToken", token)
      
      // Store user ID as Agora ID in localStorage
      if (userId) {
        localStorage.setItem("agoraId", userId.toString())
      }
      
      setShowSuccessPopup(true)
      setTimeout(() => {
        router.push("/agora")
      }, 1500)
    } finally {
      setButtonLoading(false)
    }
  }

const handleSkip = () => {
  const previousPage = sessionStorage.getItem("previousPage") || "/defaultPage"
  router.push(previousPage)
}


  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <div className="flex justify-center mb-4">
          <Image src="/images/logo1.png" alt="Logo" width={160} height={40} />
        </div>

        <h2 className="text-xl font-semibold text-center text-black mb-2">
          Welcome to {sessionName} session
        </h2>

        <p className="text-sm text-gray-600 text-center mb-4">
          Enter your display name for this session
        </p>

        <div className="space-y-3">
          <div>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your nickname"
              className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          
    
        
        </div>

        <div className="pt-4">
          <LoadingButton
            text="Join Session"
            onClick={handleSaveAndJoin}
            loading={buttonLoading}
            color="bg-red-900 w-full"
            disabled={!userName.trim() || !token || buttonLoading}
          />
        </div>

        {/* New action buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleSkip}
            className="flex-1 bg-white text-black py-2 px-4 rounded-lg hover:bg-red-300 transition-colors text-sm font-medium cursor-pointer"
          >
            Skip to Schedule
          </button>
        </div>

        <div className="mt-4 text-center">
          {fetchingToken && <p className="text-gray-500">Fetching token...</p>}
          {error && <p className="text-red-900">Error: {error}</p>}
          {showSuccessPopup && (
            <p className="text-green-600 font-semibold">
              successfully! Redirecting...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AgoraTokenCard