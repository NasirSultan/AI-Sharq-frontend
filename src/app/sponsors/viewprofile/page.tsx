'use client'

import React, { useEffect, useState, useRef } from 'react'
import api from '@/config/api'
import { FaUser, FaLinkedin, FaTwitter, FaYoutube, FaEdit } from 'react-icons/fa'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'
import { QRCodeCanvas as QRCode } from 'qrcode.react'
import LogoutButton from './../../components/LogoutButton'
import Link from 'next/link'

const SponsorProfileView: React.FC = () => {
  const [sponsor, setSponsor] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const sponsorCache = useRef<any>(null)
  const sponsorId = useSelector((state: RootState) => state.sponsor.sponsorId)
  const qrRef = useRef<HTMLCanvasElement | null>(null)

  const fetchSponsor = async () => {
    if (!sponsorId) return

    try {
      const res = await api.get(`/sponsors/${sponsorId}`)
      if (!res.data) return

      // Compare with cached data
      const cachedStr = sponsorCache.current ? JSON.stringify(sponsorCache.current) : ''
      const fetchedStr = JSON.stringify(res.data)

      if (cachedStr !== fetchedStr) {
        sponsorCache.current = res.data
        setSponsor(res.data)
      }
    } catch (err) {
      console.log('Error fetching sponsor', err)
    }
  }

  // Load cached sponsor first without triggering loader
  useEffect(() => {
    if (sponsorCache.current && sponsorCache.current.id === sponsorId) {
      setSponsor(sponsorCache.current)
    } else {
      setLoading(true)
      fetchSponsor().finally(() => setLoading(false))
    }
  }, [sponsorId])

  const handleDownloadQR = () => {
    if (qrRef.current) {
      const url = qrRef.current.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `sponsor-${sponsorId}-qr.png`
      a.click()
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!sponsor) {
    return <div className="flex justify-center items-center min-h-screen">Sponsor not found</div>
  }

  return (
    <>
      <div className="relative flex flex-col items-center min-h-screen bg-gray-50 p-4">
        <div className="relative w-full max-w-5xl h-64 rounded-2xl overflow-hidden shadow-md mb-8">
          {sponsor.Pic_url ? (
            <img src={sponsor.Pic_url} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-red-100 flex items-center justify-center">
              <FaUser className="text-5xl text-red-600" />
            </div>
          )}

          <div className="absolute top-4 right-4 flex gap-2">
            <Link href="/sponsors/edit">
              <button className="w-12 h-12 flex items-center justify-center bg-red-900 text-white rounded-full shadow hover:bg-red-700">
                <FaEdit />
              </button>
            </Link>


            <LogoutButton />
          </div>
        </div>

       <div className="bg-white border border-gray-300 rounded-2xl shadow-lg p-10 w-full max-w-5xl mb-16">
  <div className="flex flex-col items-center gap-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <div>
        <p className="font-bold p-1">Sponsor Name</p>
        <p className="px-4 py-3 border border-gray-300 rounded-xl">{sponsor.name || 'N/A'}</p>
      </div>

      <div>
        <p className="font-bold p-1">Email</p>
        <p className="px-4 py-3 border border-gray-300 rounded-xl">{sponsor.email || 'N/A'}</p>
      </div>

      <div>
        <p className="font-bold p-1">Phone</p>
        <p className="px-4 py-3 border border-gray-300 rounded-xl">{sponsor.phone || 'N/A'}</p>
      </div>

      <div>
        <p className="font-bold p-1">Category</p>
        <p className="px-4 py-3 border border-gray-300 rounded-xl">{sponsor.category || 'N/A'}</p>
      </div>

      <div>
        <p className="font-bold p-1">Website</p>
        {sponsor.website ? (
          <a
            href={sponsor.website}
            target="_blank"
            className="px-4 py-3 border border-gray-300 rounded-xl text-red-600 hover:underline block"
          >
            {sponsor.website}
          </a>
        ) : (
          <p className="px-4 py-3 border border-gray-300 rounded-xl">N/A</p>
        )}
      </div>

      <div className="md:col-span-2">
        <p className="font-bold p-1">Description</p>
        <p className="px-4 py-3 border border-gray-300 rounded-xl">{sponsor.description || 'N/A'}</p>
      </div>

      <div className="md:col-span-2 flex gap-6 mt-6 justify-center">
        {sponsor.linkedin && (
          <a href={sponsor.linkedin} target="_blank" className="text-blue-700 hover:text-blue-900 text-2xl">
            <FaLinkedin />
          </a>
        )}
        {sponsor.twitter && (
          <a href={sponsor.twitter} target="_blank" className="text-blue-500 hover:text-blue-700 text-2xl">
            <FaTwitter />
          </a>
        )}
        {sponsor.youtube && (
          <a href={sponsor.youtube} target="_blank" className="text-red-600 hover:text-red-800 text-2xl">
            <FaYoutube />
          </a>
        )}
        {!sponsor.linkedin && !sponsor.twitter && !sponsor.youtube && <p>N/A</p>}
      </div>
    </div>
  </div>
</div>

      </div>

      <div className="w-full flex justify-center fix bottom-0">
        <Image src="/images/line.png" alt="Line" width={1450} height={127} className="w-full max-w-screen-xl" />
      </div>

      {showQR && (
        <div
          onClick={() => setShowQR(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-2xl shadow-lg" onClick={(e) => e.stopPropagation()}>
            <QRCode
              value={`${window.location.origin}/sponsors/view/${sponsorId}`}
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

export default SponsorProfileView
