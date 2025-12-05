"use client"

import React, { useState, useEffect, useRef } from "react"
import { X, Camera } from "lucide-react"
import { FaUser } from "react-icons/fa"
let Html5Qrcode: any
import Image from 'next/image'
export default function QrScannerPage() {
    const [result, setResult] = useState<string>("")
    const [scanning, setScanning] = useState(false)
    const [html5QrCodeInstance, setHtml5QrCodeInstance] = useState<any>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        import("html5-qrcode")
            .then(module => {
                Html5Qrcode = module.Html5Qrcode
            })
            .catch(err => console.error("Failed to load html5-qrcode", err))
    }, [])

    const startCameraScan = () => {
        if (!Html5Qrcode) return
        if (fileInputRef.current && fileInputRef.current.files?.length) fileInputRef.current.value = ""
        setScanning(true)
        const instance = new Html5Qrcode("qr-reader")
        setHtml5QrCodeInstance(instance)
        instance.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText: string) => {
                setResult(decodedText)
                stopScan()
            },
            (errorMessage: string) => console.warn(errorMessage)
        ).catch((err: any) => {
            console.error("Unable to start scanning", err)
            setScanning(false)
        })
    }

    const stopScan = () => {
        if (html5QrCodeInstance) {
            html5QrCodeInstance.stop()
                .then(() => setScanning(false))
                .catch((err: any) => console.error(err))
        } else {
            setScanning(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !Html5Qrcode) return
        if (scanning && html5QrCodeInstance) stopScan()

        const instance = new Html5Qrcode("qr-reader-file")
        instance.scanFile(file, true)
            .then((decodedText: string) => setResult(decodedText))
            .catch((err: any) => console.error(err))
    }

    const removeAllData = () => {
        if (scanning) stopScan()
        if (fileInputRef.current) fileInputRef.current.value = ""
        setResult("")
    }

const renderParticipantCard = () => {
        if (!result) return null
        const lines = result.split(/\r?\n/)
        const data: any = {}
        lines.forEach(line => {
            if (line.startsWith("FN:")) data.name = line.replace("FN:", "")
            else if (line.startsWith("EMAIL:")) data.email = line.replace("EMAIL:", "")
            else if (line.startsWith("NOTE:")) {
                const note = line.replace("NOTE:", "")
                note.split("|").forEach(item => {
                    const [key, value] = item.split(":").map(s => s.trim())
                    if (key.toLowerCase() === "role") data.role = value
                    if (key.toLowerCase() === "bio") data.bio = value !== "null" ? value : "-"
                })
            } else if (line.startsWith("PHOTO")) {
                const parts = line.split(":")
                if (parts.length > 1) data.photo = parts.slice(1).join(":").trim()
            }
        })

        return (
            <div className="w-full max-w-lg bg-gray-50 shadow-lg rounded-lg p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
                    {data.photo ? (
                        <img src={data.photo} alt={data.name} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-red-900 flex-shrink-0" />
                    ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-red-900 flex-shrink-0">
                            <FaUser className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-900" />
                        </div>
                    )}
                    <div className="flex-1 flex flex-col gap-2 bg-gray-100 rounded-lg p-3 sm:p-4 w-full">
                        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 text-center sm:text-left">{data.name || "N/A"}</h2>
                        <div className="space-y-1">
                            <p className="text-xs sm:text-sm md:text-base text-gray-700 break-words">
                                <span className="font-semibold text-red-900">Email </span>
                                {data.email || "N/A"}
                            </p>
                            <p className="text-xs sm:text-sm md:text-base text-gray-700">
                                <span className="font-semibold text-red-900">Role </span>
                                {data.role || "N/A"}
                            </p>
                              {data.bio && data.bio !== "-" && (
        <p><span className="font-semibold text-red-900">Bio </span>{data.bio}</p>
    )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-50">

            <div className="w-60 h-22 relative">
                <Image
                    src="/images/logo1.png"
                    alt="Al Sharq Logo"
                    fill
                    className="object-contain"
                />
            </div>

            <h1 className="text-2xl font-bold mb-6">QR Code Scanner</h1>

          <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full max-w-md">
    <button
        onClick={startCameraScan}
        className="flex-1 bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-full cursor-pointer flex items-center justify-center gap-2"
        disabled={scanning}
    >
        <Camera className="w-4 h-4" />
        {scanning ? "Scanning..." : "Camera"}
    </button>

    <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="flex-1 border border-red-900 cursor-pointer p-2 rounded-full hover:bg-red-900 hover:text-white"
    />

    {(scanning || result) && (
        <button
    onClick={removeAllData}
    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded-full cursor-pointer flex items-center justify-center gap-2"
>
    <X className="w-4 h-4" />
  
</button>

    )}
</div>


            {renderParticipantCard()}

            <div id="qr-reader" className="mb-6 w-full max-w-md"></div>
         <div id="qr-reader-file" className="hidden"></div>
        </div>
    )
}
