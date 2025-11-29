'use client'

import { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { QRCodeCanvas as QRCode } from 'qrcode.react'
import LoadingButton from './LoadingButton'
import { RootState } from '@/lib/store/store'

export default function UserQRModal({
  show,
  userId,
  onClose,
}: {
  show: boolean
  userId: string
  onClose: () => void
}) {
  const qrRef = useRef<HTMLCanvasElement | null>(null)
  const [qrLoading, setQrLoading] = useState(false)
  const [role, setRole] = useState('')

  // Get speaker ID from Redux
  const speakerId = useSelector((state: RootState) => state.speaker.speakerId)
const sponsorId = useSelector((state: RootState) => state.sponsor.sponsorId)
  useEffect(() => {
    const savedRole = localStorage.getItem('role')
    if (savedRole) {
      setRole(savedRole)
    }
  }, [])

  // Decide which ID to use
const finalUserId =
  role === 'speaker'
    ? speakerId
    : role === 'sponsor'
    ? sponsorId
    : userId

  const handleDownloadQR = async () => {
    setQrLoading(true)
    try {
      if (qrRef.current) {
        const canvas = qrRef.current
        const url = canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.href = url
        a.download = `user-${finalUserId}-qr.png`
        a.click()
      }
    } catch (err) {
      console.error('QR download error', err)
    } finally {
      setQrLoading(false)
    }
  }

  if (!show) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center"
      >
        <QRCode
          // value={`https://connect.sharqforum.org/Profile/${finalUserId}?role=${encodeURIComponent(
             value={`http://192.168.100.10:3000/Profile/${finalUserId}?role=${encodeURIComponent(

            role
          )}`}
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
  )
}
