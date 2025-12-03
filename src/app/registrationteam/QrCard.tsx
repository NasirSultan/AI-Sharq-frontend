"use client"

import React, { useRef, useEffect } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { Download } from "lucide-react"
import Image from 'next/image'
type User = {
    id: number
    name: string
    email: string
    bio: string
    role: string
    file?: string
}

type QrCardProps = {
    user: User
    onClose: () => void
}

export default function QrCard({ user, onClose }: QrCardProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const qrRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [onClose])



    // Create vCard format for better compatibility with devices
    const generateVCard = () => {
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${user.name}
EMAIL:${user.email}
NOTE:ID: ${user.id} | Role: ${user.role} | Bio: ${user.bio}${user.file ? ` | Photo: ${user.file}` : ''}
UID:${user.id}
${user.file ? `PHOTO;VALUE=URL:${user.file}` : ''}
END:VCARD`



        return vcard
    }

    const handleDownload = () => {
        const canvas = qrRef.current
        if (!canvas) return

        const tempCanvas = document.createElement("canvas")
        const ctx = tempCanvas.getContext("2d")
        if (!ctx) return

        tempCanvas.width = 400
        tempCanvas.height = 500

        // Create a new image element for the logo
        const logoImg = new window.Image()
        logoImg.crossOrigin = "anonymous"

        logoImg.onload = () => {
            // Draw white background
            ctx.fillStyle = "#ffffff"
            ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

            // Draw border
            ctx.strokeStyle = "#e5e7eb"
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.roundRect(10, 10, tempCanvas.width - 20, tempCanvas.height - 20, 12)
            ctx.stroke()

            // Draw logo image at the top
            const logoWidth = 180
            const logoHeight = 80
            const logoX = (tempCanvas.width - logoWidth) / 2
            const logoY = 20
            ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight)

            // Draw QR code
            const qrSize = 200
            const qrX = (tempCanvas.width - qrSize) / 2
            const qrY = 120
            ctx.drawImage(canvas, qrX, qrY, qrSize, qrSize)

            // Draw user name
            ctx.fillStyle = "#000000"
            ctx.font = "bold 20px Arial"
            ctx.textAlign = "center"
            ctx.fillText(user.name, tempCanvas.width / 2, 360)

            // Draw subtitle
            ctx.fillStyle = "#6b7280"
            ctx.font = "14px Arial"
            ctx.fillText("Scan to view profile", tempCanvas.width / 2, 400)

            // Download the image
            tempCanvas.toBlob((blob) => {
                if (!blob) return
                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = url
                link.download = `${user.name.replace(/\s+/g, "_")}_QR_Card.png`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)
            })
        }

        logoImg.onerror = () => {
            console.error("Failed to load logo image")
            // Fallback: draw text if image fails to load
            ctx.fillStyle = "#ffffff"
            ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
            ctx.strokeStyle = "#e5e7eb"
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.roundRect(10, 10, tempCanvas.width - 20, tempCanvas.height - 20, 12)
            ctx.stroke()

            ctx.fillStyle = "#1f2937"
            ctx.font = "bold 24px Arial"
            ctx.textAlign = "center"
            ctx.fillText("LOGO", tempCanvas.width / 2, 60)

            const qrSize = 200
            const qrX = (tempCanvas.width - qrSize) / 2
            const qrY = 120
            ctx.drawImage(canvas, qrX, qrY, qrSize, qrSize)

            ctx.fillStyle = "#000000"
            ctx.font = "bold 20px Arial"
            ctx.fillText(user.name, tempCanvas.width / 2, 360)

            
        }

        // Set the logo source
        logoImg.src = "/images/logo1.png"
    }

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div
                ref={modalRef}
                className="bg-white rounded-xl p-6 w-full max-w-sm relative shadow-2xl"
            >


                <div className="flex justify-center items-center ">
                    <div className="relative w-46 h-25">
                        <Image
                            src="/images/logo1.png"
                            alt="Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>


                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                        <QRCodeCanvas
                            ref={qrRef}
                            value={generateVCard()}
                            size={150}
                            level="M"
                            includeMargin={false}
                        />
                    </div>
                </div>

                <div className="text-center mb-6">
                    <p className="text-xl font-bold text-black mb-1">{user.name}</p>

                </div>


                <button
                    onClick={handleDownload}
                    className="w-full bg-red-900 hover:bg-red-800 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                    <Download size={20} />
                    Download QR Card
                </button>
            </div>
        </div>
    )
}