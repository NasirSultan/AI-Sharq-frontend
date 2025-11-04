"use client"

import React, { useEffect, useState, use } from "react"
import Image from "next/image"
import RelatedSessionsGrid from "@/app/components/relatedsession"
import { FaArrowLeft } from "react-icons/fa"
import api from "@/config/api"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"
import { useRouter } from "next/navigation"
import LoadingButton from "@/app/components/LoadingButton"
import { FaVideo, FaArrowRight } from "react-icons/fa";
import { useDispatch } from "react-redux"
import { setSpeakerId } from "@/lib/store/features/speaker/speakerSlice"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function SessionPage({ params }: PageProps) {
  const { id } = use(params)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bookmarked, setBookmarked] = useState(false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
const [joining, setJoining] = useState(false)

  const router = useRouter()
  const userId = useSelector((state: RootState) => state.user.userId)
  const eventId = useSelector((state: RootState) => state.event.id)
const dispatch = useDispatch()


console.log 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/sessions/detail/${id}`)
        setSession(res.data)
      } catch (err) {
        console.error("Failed to fetch session", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleBookmark = async () => {
    try {
      setBookmarkLoading(true)
      if (!userId || !eventId) {
        console.error("Missing userId or eventId from redux")
        return
      }

      const res = await api.post("/participants/agenda", {
        userId: Number(userId),
        sessionId: Number(id),
        eventId: Number(eventId),
      })

      setBookmarked(true)
      setShowPopup(true)
      setTimeout(() => setShowPopup(false), 2000)
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setBookmarked(true)
        setShowPopup(true)
        setTimeout(() => setShowPopup(false), 2000)
      } else {
        console.error("Bookmark error:", err)
      }
    } finally {
      setBookmarkLoading(false)
    }
  }
const userRole = typeof window !== "undefined" ? localStorage.getItem("role") : null;
  if (loading)
    return (
      <div className="flex justify-center mt-20">
  <button
    disabled
    className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-red-6 cursor-not-allowed"
  >
    <svg
      className="animate-spin h-5 w-5 text-red-600"
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
    Loading session...
  </button>
</div>



    )

  if (!session) return <p className="text-center mt-10">No session found</p>

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 relative">
      {showPopup && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded-xl shadow-md">
          Added to your agenda
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FaArrowLeft
            className="text-red-600 cursor-pointer"
            size={20}
            onClick={() => router.back()}
          />
          <h1 className="text-xl font-semibold text-black">Session Details</h1>
        </div>

        <button onClick={handleBookmark} disabled={bookmarkLoading} className="cursor-pointer">
          <svg
            width="20"
            height="26"
            viewBox="0 0 20 26"
            fill={bookmarked ? "#9B2033" : "none"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 0.5H17.5C18.6161 0.5 19.5 1.3798 19.5 2.4375V24.7656C19.5 25.1581 19.1682 25.5 18.7344 25.5C18.5709 25.5 18.4155 25.4524 18.2891 25.3652L10 19.707L1.71094 25.3652C1.58453 25.4524 1.42912 25.5 1.26562 25.5C0.831842 25.5 0.5 25.1581 0.5 24.7656V2.4375C0.5 1.3798 1.38393 0.5 2.5 0.5Z"
              stroke="#9B2033"
            />
          </svg>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-3">
        <div className="flex justify-between text-xs font-semibold text-red-700">
          <span className="bg-purple-100 text-purple-700 px-2 mt-3 py-1 rounded-xl">
            {session.category}
          </span>
          <div className="text-right text-red-700">
            <div>
              {new Date(session.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {new Date(session.endTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="text-gray-500">
              {new Date(session.startTime).toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        <h2 className="text-lg font-bold text-black">{session.title}</h2>

        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <img src="/images/Vector.png" className="w-4 h-4" />
            <strong>{session.location}</strong>
          </div>
          <div className="flex items-center gap-1">
            <img src="/images/Vector (1).png" className="w-4 h-4" />
            <span>
              {Math.floor(
                (new Date(session.endTime).getTime() -
                  new Date(session.startTime).getTime()) /
                  60000
              )}{" "}
              mins
            </span>
          </div>
          <div className="flex items-center gap-1">
            <img src="/images/Vector (2).png" className="w-4 h-4" />
            <span>{session.capacity} capacity</span>
          </div>
        </div>

        <p className="text-sm text-gray-600">{session.description}</p>
      </div>

{session.location?.toLowerCase() === "online" && (
  <div
    onClick={() => {
      if (joining) return
      const now = new Date()
      const start = new Date(session.startTime)
      const end = new Date(session.endTime)
      const isLive = now >= start && now <= end

      if (!isLive) return

      setJoining(true)
      localStorage.setItem("sessionName", session.title)
      setTimeout(() => {
        router.push(`/agora/joinsession`)
      }, 1000)
    }}
    className={`flex items-center gap-3 p-4 rounded-2xl shadow transition ${
      joining
        ? "bg-[#ffdada]"
        : "bg-[#FFEEEE] hover:bg-[#ffdada] cursor-pointer"
    } ${
      new Date() < new Date(session.startTime) ||
      new Date() > new Date(session.endTime)
        ? "opacity-60 cursor-not-allowed"
        : ""
    }`}
  >
    <div className="w-12 h-12 bg-[#FFBEBE] rounded-lg flex items-center justify-center relative overflow-hidden">
      {joining ? (
        <svg
          className="animate-spin h-5 w-5 text-[#9B2033]"
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
      ) : (
        <>
          {new Date() >= new Date(session.startTime) &&
          new Date() <= new Date(session.endTime) ? (
            <>
              <span className="absolute w-12 h-12 rounded-full border-2 border-[#9B2033]/40 animate-wave"></span>
              <span className="absolute w-12 h-12 rounded-full border border-[#9B2033]/30 animate-wave-delayed"></span>
              <FaVideo className="text-[#9B2033] text-xl relative z-10 animate-pulse-smooth" />
            </>
          ) : (
            <FaVideo className="text-[#9B2033] text-xl opacity-50" />
          )}
        </>
      )}
    </div>

    <div>
      <h2 className="text-lg font-semibold text-[#9B2033]">
        {joining
          ? "Joining..."
          : new Date() >= new Date(session.startTime) &&
            new Date() <= new Date(session.endTime)
          ? "Join Live Session"
          : "Session Not Live"}
      </h2>
      <p className="text-xs text-[#9B2033]">
        {joining
          ? "Redirecting..."
          : new Date() >= new Date(session.startTime) &&
            new Date() <= new Date(session.endTime)
          ? "Click to join the live session"
          : "You can join only during live time"}
      </p>
    </div>

    {!joining && (
      <FaArrowRight className="text-[#9B2033] text-2xl ml-auto" />
    )}
  </div>
)}






{session.speakers?.length > 0 && (
  <div className="space-y-4">
    <h3 className="text-md font-semibold text-black">Speakers</h3>
    {session.speakers.map((speaker: any) => (
      <div
        key={speaker.id}
        
       onClick={() => {
  dispatch(setSpeakerId(speaker.id))
  router.push(`/participants/SpeakerDetails/${speaker.id}`)
}}

        className="flex items-start bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative cursor-pointer hover:shadow-md transition"
      >
       <img
  src={speaker.user?.file || "/images/img (13).png"}
  alt={speaker.user?.name}
  className="w-20 h-20 rounded-full object-cover"
/>

        <div className="flex-1 flex flex-col ml-4 text-xs text-gray-800 space-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-sm">
                {speaker.user?.name}
              </h4>
              {speaker.designations?.length > 0 && (
                <span className="text-gray-600">
                  {speaker.designations.join(" • ")}
                </span>
              )}
            </div>
            {speaker.category && (
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-xl">
                {speaker.category}
              </span>
            )}
          </div>
          {speaker.bio && (
            <p className="text-gray-600 leading-snug">{speaker.bio}</p>
          )}
        </div>

        {speaker.tags?.[0] && (
          <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-xl ml-auto self-start">
            {speaker.tags[0]}
          </span>
        )}
      </div>
    ))}
  </div>
)}



      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap gap-2">
          {session.tags?.map((tag: string, idx: number) => (
            <span
              key={idx}
              className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-xl"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="text-sm font-semibold text-black">
          {session.event?.title}
        </div>

     <div className="flex items-center justify-between">
  <p className="text-xs text-gray-600">
    {session.registrationRequired
      ? "Registration Required"
      : "No Registration Required"}
  </p>

{userRole === "participant" && (
  session.registrationRequired ? (
    <button
      onClick={() => router.push(`/participants/SessionRegistration/${id}`)}
      className="bg-red-700 text-white text-xs font-semibold px-3 py-1 rounded-lg hover:bg-red-700 cursor-pointer"
    >
      Register Now
    </button>
  ) : (
    <button
      disabled
      className="bg-gray-300 text-gray-500 text-xs font-semibold px-2 py-1 rounded-lg cursor-not-allowed"
    >
      Not Required
    </button>
  )
)}


</div>

      </div>

 {userRole !== "speaker" && <RelatedSessionsGrid />}

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">Who's Attending</h2>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-3">
              {session.registeredUsers?.slice(0, 5).map((user: any, idx: number) => (
                <img
                  key={idx}
                  src={user.photo ? `/uploads/${user.photo}` : "/images/img (13).png"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              {session.registrationCount} registered attendees
            </span>
          </div>
          
        </div>
      </section>

      <Image
        src="/images/line.png"
        alt="Line"
        width={1729}
        height={127}
        className="w-full mt-6"
      />
    </div>
  )
}
