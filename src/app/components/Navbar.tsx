'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FaQrcode, FaUsers, FaMapMarkedAlt, FaBell } from 'react-icons/fa'
import api from '@/config/api'
import UserQRModal from './UserQRModal'
import Link from "next/link"
export default function Navbar() {
  const router = useRouter()
  const userId = useSelector((state: RootState) => state.user.userId)

  const [user, setUser] = useState({ name: '', file: '' })
  const [loading, setLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(false)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const storedRole = localStorage.getItem('role')
    setRole(storedRole)

    if (storedRole === 'exhibitor' || storedRole === 'sponsor') {
      const name = localStorage.getItem('name')
      const file = localStorage.getItem('picUrl')
      setUser({
        name: name || 'User',
        file: file || '/images/default-avatar.png',
      })
      setLoading(false)
    } else if (userId) {
      const fetchUser = async () => {
        try {
          const res = await api.get(`/admin/users/${userId}`)
          const data = res.data
          setUser({
            name: data.name || '',
            file: data.file || '',
          })
        } catch (err) {
          console.error('Error loading user', err)
        } finally {
          setLoading(false)
        }
      }
      fetchUser()
    }

    const unreadMsgs = localStorage.getItem('unreadMessages') === 'true'
    const unreadNotifs = localStorage.getItem('unreadNotifications') === 'true'
    setUnreadMessages(unreadMsgs)
    setUnreadNotifications(unreadNotifs)
  }, [userId])

  const handleLogoClick = () => {
    if (role === 'speaker') router.push('/speakers/ManageSessions')
    else if (role === 'participant') router.push('/participants/Home')
    else if (role === 'exhibitor') router.push('/Exhibitors/ManageSessions')
    else if (role === 'sponsor') router.push('/sponsors/ManageSessions')
    else if (role === 'organizer') router.push('/Organizer/Dashboard')
    else if (role === 'registrationteam') router.push('/registrationteam')
    else router.push('/')
  }

  const handleMessagesClick = () => {
    setUnreadMessages(false)
    localStorage.setItem('unreadMessages', 'false')
    router.push('/participants/Masseges')
  }

  const handleNotificationsClick = () => {
    setUnreadNotifications(false)

    localStorage.setItem('unreadNotifications', 'false')
  }


  const handleVenuesClick = () => {
    if (role === 'participant') router.push('/participants/vanue')
    else if (role === 'organizer') router.push('/Organizer/VenueMaps')
  }

  const showChatAndNetworking =
    role === 'organizer' || role === 'speaker' || role === 'participant'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-2 py-2 sm:px-4 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">

      {/* Logo */}
      <div className="flex items-center cursor-pointer transition transform hover:scale-110
" onClick={handleLogoClick}>
        <Image
          src="/images/logo1.png"
          alt="Logo"
          width={80}  // smaller on small screens
          height={80}
          className="object-contain"
        />
      </div>

      {/* Right Side Buttons */}
      <div className="flex items-center gap-1 sm:gap-3 flex-nowrap overflow-x-auto">
        {showChatAndNetworking && (
          <button
            onClick={() => router.push('/participants/MyConnections')}
            className="p-2 sm:p-3 bg-red-100 text-red-900 rounded-full shadow transition cursor-pointer "
          >
            <FaUsers className="w-3 h-3 sm:w-4 sm:h-4 transition transform hover:scale-150" />
          </button>
        )}

        <button
          onClick={() => setShowQR(true)}
          className="p-2 sm:p-3 bg-red-100 text-red-900 rounded-full shadow transition cursor-pointer"
        >
          <FaQrcode className="w-3 h-3 sm:w-4 sm:h-4  transition transform hover:scale-150" />
        </button>

        {(role === 'participant' || role === 'organizer') && (
          <button
            onClick={handleVenuesClick}
            className="p-2 sm:p-3 bg-red-100 text-red-900 rounded-full shadow transition cursor-pointer"
          >
            <FaMapMarkedAlt className="w-3 h-3 sm:w-4 sm:h-4 transition transform hover:scale-150" />
          </button>
        )}

        {showChatAndNetworking && (
          <div className="relative cursor-pointer">
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center p-1 sm:p-2 justify-center bg-red-100 rounded-full shadow-sm "
              onClick={handleMessagesClick}
            >
              <img src="/images/tabler-icon-bell-filled.png" alt="Notifications" className="transition transform hover:scale-140" />
            </div>
            {unreadMessages && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-[#234D70] rounded-full border border-white"></span>
            )}
          </div>
        )}

          <Link href="/notification">
      <div className="relative cursor-pointer">
        <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center p-1 sm:p-2 justify-center bg-red-100 rounded-full shadow-sm">
          <FaBell className="text-red-900 w-4 h-4 sm:w-5 sm:h-5 transition transform hover:scale-140" />
        </div>
        {unreadNotifications && (
          <span className="absolute top-0 right-0 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-[#234D70] rounded-full border border-white"></span>
        )}
      </div>
    </Link>

        {!loading && (
          <div
            className="flex items-center gap-1 sm:gap-2 cursor-pointer min-w-[80px]"
            onClick={() => {
              if (role === 'speaker') router.push('/speakers/viewprofile')
              else if (role === 'participant') router.push('/participants/view')
              else if (role === 'exhibitor') router.push('/Exhibitors/viewprofle')
              else if (role === 'sponsor') router.push('/sponsors/viewprofile')
              else if (role === 'organizer') router.push('/participants/view')
              else if (role === 'registrationteam') router.push('/participants/view')
              else router.push('/')
            }}
          >
            <img
              src={user?.file || '/images/img (13).png'}
              alt="User"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
            />
            <div className="flex flex-col leading-tight text-xs sm:text-sm truncate">
              <span className="text-red-900">Welcome</span>
              <span className="flex items-center gap-1 font-medium text-gray-800 truncate">
                {user?.name || 'User'}
                <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 5L5 0L10 5H0Z" fill="#414141" />
                </svg>
              </span>
            </div>

          </div>
        )}
      </div>

      <UserQRModal show={showQR} userId={userId || ''} onClose={() => setShowQR(false)} />
    </nav>


  )
}
