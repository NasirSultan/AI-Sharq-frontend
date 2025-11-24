'use client'
import useSWR from 'swr'
import Link from 'next/link'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'
import { FaCalendarAlt, FaUser } from 'react-icons/fa'
import api from '@/config/api'

const parseDuration = (start: string, end: string) => {
  if (!start || !end) return { startTime: null, endTime: null, minutes: 0 }

  const startTime = new Date(start)
  const endTime = new Date(end)
  const minutes =
    isNaN(startTime.getTime()) || isNaN(endTime.getTime())
      ? 0
      : Math.round((endTime.getTime() - startTime.getTime()) / 60000)

  return { startTime, endTime, minutes }
}

const fetcher = (url: string) => api.get(url).then(res => res.data.sessions || [])

export default function SpeakerSessions() {
  const speakerId = useSelector((state: RootState) => state.speaker.speakerId)

  const { data: sessionsData, error, isLoading } = useSWR(
    speakerId ? `/sessions/speaker/${speakerId}` : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  if (!speakerId) {
    return <p className="text-gray-800 text-sm md:text-base font-medium">Speaker not selected</p>
  }

  if (error) {
    return <p className="text-gray-800 text-sm md:text-base font-medium">Failed to load sessions</p>
  }

  if (isLoading) {
    return (
       <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    )
  }

  const sessions = sessionsData.map((s: any) => {
    const { startTime, endTime, minutes } = parseDuration(s.startTime, s.endTime)
    return { ...s, startTime, endTime, minutes }
  })

  if (sessions.length === 0) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="text-gray-800 text-sm md:text-base font-medium">No sessions found</p>
      </div>
    )
  }

  return (
    <div className="font-sans w-full">
      <h1 className="text-lg md:text-xl font-semibold text-black mb-4">
        Speaker Related Sessions
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
        {sessions.map((session, index) => (
          <div
            key={session.id || index}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition w-full"
          >
            <div>
              <h2 className="text-sm md:text-base font-semibold text-black mb-1">
                {session.title}
              </h2>

              <p className="text-xs text-gray-500 mb-2 line-clamp-3">
                {session.description || 'No description available'}
              </p>

              {session.speakers && session.speakers.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  {session.speakers[0].file ? (
                    <div className="w-8 h-8 relative rounded-full overflow-hidden">
                      <Image
                        src={session.speakers[0].file ||         <FaUser />} 
                        alt={session.speakers[0].name || 'Speaker'}
                        width={32}
                        height={32}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-700">
                      <FaUser />
                    </div>
                  )}
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-medium text-gray-900">
                      {session.speakers[0].name || 'Unknown Speaker'}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-700 mb-2">
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="text-blue-500" />
                  <span>
                    {session.startTime && session.endTime
                      ? `${session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${session.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      : 'No time available'}
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-[#e6f0f4] text-blue-550 rounded-lg text-xs font-medium">
                  {session.category || 'No category'}
                </span>
              </div>

              <div className="text-xs text-gray-800 space-y-1">
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span>{session.minutes} min</span>
                </div>
                <div className="flex justify-between">
                  <span>Room</span>
                  <span>{session.location || 'Unknown'}</span>
                </div>
              </div>
            </div>

            <Link
              href={session.id ? `/participants/SessionDetail1/${session.id}` : '#'}
              className="w-full mt-3"
            >
              <button className="w-full bg-[#9B2033] text-white py-2 cursor-pointer text-sm rounded-md hover:bg-[#801c2a] transition">
                View Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
