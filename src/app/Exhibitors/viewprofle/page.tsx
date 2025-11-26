'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'
import { useRouter } from 'next/navigation'
import api from '@/config/api'
import Image from 'next/image'
import { FaUser, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa'
import { QRCodeCanvas as QRCode } from 'qrcode.react'
import LogoutButton from './../../components/LogoutButton'

const ExhibitorProfileView: React.FC = () => {
  const router = useRouter()
  const exhibitorId = useSelector((state: RootState) => state.exhibitor.exhibitorId)
  const [exhibitor, setExhibitor] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const qrRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const fetchExhibitor = async () => {
      if (!exhibitorId) return
      setLoading(true)
      try {
        const res = await api.get(`/exhibiteros/${exhibitorId}`)
        setExhibitor(res.data)
      } catch (err) {
        console.log('Error fetching exhibitor', err)
      } finally {
        setLoading(false)
      }
    }
    fetchExhibitor()
  }, [exhibitorId])

  const handleDownloadQR = () => {
    if (qrRef.current) {
      const canvas = qrRef.current
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `exhibitor-${exhibitorId}-qr.png`
      a.click()
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!exhibitor) {
    return <div className="flex justify-center items-center min-h-screen">Exhibitor not found</div>
  }

  return (
    <>
      <div className="relative flex flex-col items-center min-h-screen bg-gray-50 p-4">
        {/* Cover image */}
        <div className="relative w-full max-w-5xl h-64 rounded-2xl overflow-hidden shadow-md mb-8">
          {exhibitor.picUrl ? (
            <img src={exhibitor.picUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-red-100 flex items-center justify-center">
              <FaUser className="text-5xl text-red-600" />
            </div>
          )}

          {/* Edit and QR buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              type="button"
              onClick={() => router.push('/Exhibitors/edit')}
              className="p-2 bg-red-600 text-white rounded-full shadow hover:bg-red-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652l-9.193 9.193a4.5 4.5 0 01-1.897 1.13l-3.323.94.94-3.323a4.5 4.5 0 011.13-1.897l9.193-9.193z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L16.875 4.5" />
              </svg>
            </button>

            <button
              onClick={() => setShowQR(true)}
              className="p-2 bg-gray-800 text-white rounded-full shadow hover:bg-gray-900"
            >
              QR
            </button>
                  <LogoutButton />
          </div>
        </div>
  
        {/* Profile Card */}
        <div className="bg-white border border-gray-300 rounded-2xl shadow-lg p-10 w-full max-w-5xl mb-16">
          <div className="flex flex-col items-center gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div>
                <p className="font-bold p-1">Exhibitor Name</p>
                <p className="px-4 py-3 border border-gray-300 rounded-xl">{exhibitor.name}</p>
              </div>

              <div>
                <p className="font-bold p-1">Email</p>
                <p className="px-4 py-3 border border-gray-300 rounded-xl">{exhibitor.email}</p>
              </div>

              <div>
                <p className="font-bold p-1">Phone</p>
                <p className="px-4 py-3 border border-gray-300 rounded-xl">{exhibitor.phone}</p>
              </div>

              <div>
                <p className="font-bold p-1">Location</p>
                <p className="px-4 py-3 border border-gray-300 rounded-xl">{exhibitor.location}</p>
              </div>

              <div>
                <p className="font-bold p-1">Website</p>
                <a
                  href={exhibitor.website}
                  target="_blank"
                  className="px-4 py-3 border border-gray-300 rounded-xl text-red-600 hover:underline block"
                >
                  {exhibitor.website}
                </a>
              </div>

              <div className="md:col-span-2">
                <p className="font-bold p-1">Description</p>
                <p className="px-4 py-3 border border-gray-300 rounded-xl">{exhibitor.description}</p>
              </div>

              <div className="md:col-span-2 flex gap-6 mt-6 justify-center">
                {exhibitor.linkedin && (
                  <a href={exhibitor.linkedin} target="_blank" className="text-blue-700 hover:text-blue-900 text-2xl">
                    <FaLinkedin />
                  </a>
                )}
                {exhibitor.twitter && (
                  <a href={exhibitor.twitter} target="_blank" className="text-blue-500 hover:text-blue-700 text-2xl">
                    <FaTwitter />
                  </a>
                )}
                {exhibitor.youtube && (
                  <a href={exhibitor.youtube} target="_blank" className="text-red-600 hover:text-red-800 text-2xl">
                    <FaYoutube />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="w-full flex justify-center  bottom-0">
        <Image src="/images/line.png" alt="Line" width={1450} height={127} className="w-full max-w-screen-xl" />
      </div>

      {/* QR Popup */}
      {showQR && (
        <div
          onClick={() => setShowQR(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-2xl shadow-lg" onClick={(e) => e.stopPropagation()}>
            <QRCode
              value={`${window.location.origin}/exhibitors/view/${exhibitorId}`}
              size={180}
              bgColor="#ffffff"
              fgColor="#000000"
              includeMargin={true}
              ref={qrRef}
            />
            <button
              onClick={handleDownloadQR}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full"
            >
              Download QR Code
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ExhibitorProfileView
