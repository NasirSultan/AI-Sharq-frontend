'use client'

import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'
import api from '@/config/api'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FaUser, FaQrcode } from 'react-icons/fa'

import { FaPen } from 'react-icons/fa'
import LoadingButton from './../../components/LoadingButton'
import LogoutButton from './../../components/LogoutButton'
import UserQRModal from './../../components/UserQRModal'

export default function UserProfileView() {
  const router = useRouter()
  const userId = useSelector((state: RootState) => state.user.userId)

  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [qrLoading, setQrLoading] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const qrRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return
      setLoading(true)
      try {
        const res = await api.get(`/admin/users/${userId}`)
        setUser(res.data)
      } catch (err) {
        console.error('Error loading user data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [userId])

  const handleDownloadQR = async () => {
    setQrLoading(true)
    try {
      if (qrRef.current) {
        const canvas = qrRef.current
        const url = canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.href = url
        a.download = `user-${userId}-qr.png`
        a.click()
      }
    } catch (err) {
      console.error('QR download error', err)
    } finally {
      setQrLoading(false)
    }
  }

  if (loading) {
    return   <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
  }

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">User not found</div>
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen w-full flex items-center justify-center p-4 sm:p-6">
  <div className="bg-white w-full sm:w-[90%] md:w-[70%] max-w-3xl rounded-2xl shadow-2xl px-6 sm:px-10 py-8 sm:py-12 relative flex flex-col items-center gap-6 sm:gap-8">
    
    {/* Top Buttons */}
   <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex gap-3 flex-wrap sm:flex-nowrap">
  <button
    type="button"
    onClick={() => router.push('/participants/SetUpYourProfile')}
    className="p-3 bg-red-800 text-white rounded-full  cursor-pointer shadow hover:bg-red-900 transition"
  >
    <FaPen className="w-5 h-5 sm:w-4 sm:h-4" />
  </button>

  
</div>


    {/* Profile Picture */}
    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#F7DADC] flex items-center justify-center text-[#9B2033] text-4xl sm:text-5xl overflow-hidden shadow-md">
      {user.file ? (
        <img src={user.file} alt="User" className="w-full h-full object-cover" />
      ) : (
        <FaUser />
      )}
    </div>

    {/* Basic Info */}
    <div className="w-full text-center">
      <p className="text-lg sm:text-xl font-semibold text-gray-800">{user.role}</p>
    </div>

    {/* Details */}
   <div className="w-full mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

  <div className="flex flex-col gap-1 w-full">
    <p className="text-sm text-gray-500">Full Name</p>
    <p className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 break-words w-full">
      {user.name}
    </p>
  </div>

  <div className="flex flex-col gap-1 w-full">
    <p className="text-sm text-gray-500">Email</p>
    <p className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 break-words w-full">
      {user.email}
    </p>
  </div>

  {user.role !== 'participant' && (
    <div className="flex flex-col gap-1 w-full">
      <p className="text-sm text-gray-500">Organization</p>
      <p className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 break-words w-full">
        {user.organization ? user.organization : 'No organization exists yet'}
      </p>
    </div>
  )}

  <div className={`flex flex-col gap-1 w-full ${user.role === 'participant' ? 'sm:col-span-2' : ''}`}>
    <p className="text-sm text-gray-500">Phone</p>
    <p className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 break-words w-full">
      {user.phone ? user.phone : 'No phone added'}
    </p>
  </div>

  <div className="flex flex-col gap-1 sm:col-span-2 w-full">
    <p className="text-sm text-gray-500">Bio</p>
    <p className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 break-words w-full">
      {user.bio ? user.bio : 'No bio added yet'}
    </p>
  </div>

</div>


    {/* Logout */}
    <div className="w-full mt-6 flex justify-center">
      <LogoutButton />
    </div>
  </div>
</div>



      {/* Bottom Line */}
      <Image
        src="/images/line.png"
        alt="Line"
        width={1440}
        height={100}
        className="w-full mt-10"
      />

      {/* QR Modal */}
   

    </>
  )
}
