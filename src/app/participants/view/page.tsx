'use client'

import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'
import api from '@/config/api'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FaUser, FaQrcode } from 'react-icons/fa'
import { QRCodeCanvas as QRCode } from 'qrcode.react'
import { FaPen } from 'react-icons/fa'
import LoadingButton from './../../components/LoadingButton'
import LogoutButton from './../../components/LogoutButton'
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
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>
    }

    if (!user) {
        return <div className="flex justify-center items-center min-h-screen">User not found</div>
    }

    return (
        <>
          <div className="bg-gray-50 min-h-screen w-full flex items-center justify-center p-6">
  <div className="bg-white w-[70%] max-w-3xl rounded-2xl shadow-2xl px-10 py-12 relative flex flex-col items-center gap-8">
    {/* Top Buttons */}
    <div className="absolute top-6 right-6 flex gap-3">
      <button
        type="button"
        onClick={() => router.push('/participants/SetUpYourProfile')}
        className="p-3 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition"
      >
        <FaPen className="w-4 h-4" />
      </button>

      <button
        onClick={() => setShowQR(true)}
        className="p-3 bg-gray-800 text-white rounded-full shadow hover:bg-gray-900 transition"
      >
        <FaQrcode className="w-4 h-4" />
      </button>
    </div>

    {/* Profile Picture */}
    <div className="w-32 h-32 rounded-full bg-[#F7DADC] flex items-center justify-center text-[#9B2033] text-5xl overflow-hidden shadow-md">
      {user.file ? (
        <img src={user.file} alt="User" className="w-full h-full object-cover" />
      ) : (
        <FaUser />
      )}
    </div>

    {/* Basic Info */}
    <div className="w-full text-center">
      <p className="text-xl font-semibold text-gray-800">{user.role}</p>
      <p className="text-sm text-gray-500">{user.organization}</p>
    </div>

    {/* Details */}
    <div className="w-full mt-4 grid grid-cols-2 gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-500">Full Name</p>
        <p className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50">
          {user.name}
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-500">Organization</p>
        <p className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50">
 {user.organization ? user.organization : 'No organization exists yet'}
        </p>
      </div>

      <div className="flex flex-col gap-1 col-span-2">
        <p className="text-sm text-gray-500">Email</p>
        <p className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 break-all">
          {user.email}
        </p>
      </div>
    </div>
 
 <div className="w-full mt-8 flex justify-center">
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
            {showQR && (
                <div
                    onClick={() => setShowQR(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                >
                    <div className="bg-white p-6 rounded-2xl shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <QRCode
                            value={`${window.location.origin}/participants/profile/${userId}`}
                            size={180}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            includeMargin={true}
                            ref={qrRef}
                        />
                        <div className="mt-4">
                            <LoadingButton
                                text="Download QR Code"
                                loading={qrLoading}
                                onClick={handleDownloadQR}
                                color="bg-red-600"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
