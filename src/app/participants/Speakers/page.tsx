"use client"
import Link from "next/link"
import React, { useEffect, useState, useMemo } from "react"
import { FaArrowLeft,FaUser, FaFilter, FaSearch } from "react-icons/fa"
import Image from "next/image"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/lib/store/store"
import { setSpeakerId } from "@/lib/store/features/speaker/speakerSlice"
import api from "@/config/api"

const tagColors: Record<string, string> = {
  Expert: "bg-blue-200 text-blue-800",
  Keynote: "bg-green-200 text-green-800",
  Technology: "bg-purple-200 text-purple-800",
  Workshop: "bg-pink-200 text-pink-800",
  Speaker: "bg-red-200 text-red-800",
  Research: "bg-yellow-200 text-yellow-800",
  AI: "bg-indigo-200 text-indigo-800",
  ML: "bg-teal-200 text-teal-800",
  NLP: "bg-orange-200 text-orange-800",
  Cloud: "bg-sky-200 text-sky-800",
}

export default function SpeakersPage() {
  const eventId = useSelector((state: RootState) => state.event.id)
  const [speakers, setSpeakers] = useState<any[]>([])
  const [activeFilter, setActiveFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!eventId) return

    let isMounted = true

    const cachedSpeakers = localStorage.getItem(`speakers-${eventId}`)
    if (cachedSpeakers) {
      const data = JSON.parse(cachedSpeakers)
      setSpeakers(data)
      return
    }

    const fetchSpeakers = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/speakers/event/${eventId}/short-info`)
        if (!isMounted) return
        setSpeakers(res.data)
        localStorage.setItem(`speakers-${eventId}`, JSON.stringify(res.data))
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }

    fetchSpeakers()

    return () => {
      isMounted = false
    }
  }, [eventId])

  type SpeakerItem = {
    user: {
      name: string
    }
    bio: string
    expertise: string[]
    tags: string[]
  }

  const filteredSpeakers = useMemo(() => {
    return speakers.filter((item: SpeakerItem) => {
      const filterMatch =
        activeFilter === "All" ||
        item.tags.some(tag => tag.toLowerCase() === activeFilter.toLowerCase())

      const searchMatch =
        item.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()))

      return filterMatch && searchMatch
    })
  }, [speakers, activeFilter, searchQuery])

  return (
    <>
      <div className="flex flex-col gap-6 p-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/participants/Home">
            <FaArrowLeft className="text-red-800 w-5 h-5 cursor-pointer" />
          </Link>
          <h1 className="text-xl font-medium text-gray-900">Speakers</h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2 w-1/2 min-w-[150px]">
            <FaSearch className="text-red-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-gray-400 text-sm"
            />
          </div>
          {["All", "Expert", "Keynote", "Technology", "Workshop"].map(tag => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`px-4 py-2 rounded-lg text-sm ${
                activeFilter === tag
                  ? "bg-red-700 text-white font-bold"
                  : "border border-gray-300 text-gray-900"
              }`}
            >
              {tag}
            </button>
          ))}
          <div className="border border-gray-300 rounded-lg p-2">
            <FaFilter className="text-red-500 w-4 h-4" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <p className="text-md font-medium text-gray-900">
              {filteredSpeakers.length} Speakers Showing
            </p>

            <div className="flex flex-col gap-4">
              {filteredSpeakers.map((speaker, index) => (
                <Link
                  key={index}
                  href={`/participants/SpeakerDetails/${speaker.id}`}
                  onClick={() => dispatch(setSpeakerId(speaker.id))}
                  className="block"
                >
                 <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm hover:shadow-md transition">
  <div className="flex gap-4 flex-wrap">
    {speaker.user.file ? (
      <img
        src={speaker.user.file}
        alt={speaker.user.name}
        className="w-16 h-16 rounded-full object-cover"
      />
    ) : (
      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
        <FaUser className="w-6 h-6 text-blue-500" />
      </div>
    )}
    <div className="flex-1 min-w-[150px]">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <h2 className="text-lg font-semibold text-gray-900">{speaker.user.name}</h2>

        {speaker.designations.map((d, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-1 h-1 bg-red-700 rounded-full" />
            <p className="text-sm text-gray-900">{d}</p>
          </div>
        ))}

        <div className="ml-auto flex gap-1 flex-wrap">
          {speaker.tags[0] && (
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                tagColors[speaker.tags[0]] ?? "bg-gray-200 text-gray-800"
              }`}
            >
              {speaker.tags[0]}
            </span>
          )}
        </div>

        <div className="bg-red-200 p-1 rounded-full">
          <p className="text-xs text-red-700">{speaker.sessionCount} Sessions</p>
        </div>
      </div>

      <p className="text-xs text-gray-600 leading-relaxed">{speaker.bio}</p>
    </div>
  </div>
</div>

                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <Image
        src="/images/line.png"
        alt="Line"
        width={2200}
        height={100}
        className="absolute bottom-0"
      />
    </>
  )
}
