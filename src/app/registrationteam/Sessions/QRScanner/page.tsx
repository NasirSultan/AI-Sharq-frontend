"use client"

import { useEffect, useState, useRef } from "react"
import { Camera, X, Loader2,ArrowLeft  } from "lucide-react"
import { FaUser } from "react-icons/fa"
import api from "@/config/api"
import Image from "next/image"
let Html5Qrcode: any
import { useRouter } from "next/navigation"

export default function SessionQrJoin() {
        const router = useRouter()
    const [session, setSession] = useState<any>(null)
    const [scanning, setScanning] = useState(false)
    const [html5QrCodeInstance, setHtml5QrCodeInstance] = useState<any>(null)
    const [scannedData, setScannedData] = useState<any>(null)
    const [statusMessage, setStatusMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const stored = localStorage.getItem("selectedSession")
        if (stored) setSession(JSON.parse(stored))
    }, [])

    useEffect(() => {
        import("html5-qrcode")
            .then(module => { Html5Qrcode = module.Html5Qrcode })
            .catch(err => console.error("Failed to load html5-qrcode", err))
    }, [])

    const startCameraScan = () => {
        if (!Html5Qrcode || !session) return
        if (fileInputRef.current) fileInputRef.current.value = ""
        setScanning(true)
        const instance = new Html5Qrcode("qr-reader")
        setHtml5QrCodeInstance(instance)
        instance.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText: string) => handleScan(decodedText),
            (err: any) => console.warn(err)
        ).catch(err => {
            console.error(err)
            setScanning(false)
        })
    }

    const stopScan = () => {
        if (html5QrCodeInstance) {
            html5QrCodeInstance.stop().then(() => setScanning(false)).catch(err => console.error(err))
        } else setScanning(false)
    }

const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !Html5Qrcode || !session) return
        if (scanning && html5QrCodeInstance) stopScan()
        
        setLoading(true)
        setStatusMessage("Processing QR code...")
        
        const instance = new Html5Qrcode("qr-reader-file")
        instance.scanFile(file, true)
            .then(decodedText => {
                handleScan(decodedText)
            })
            .catch(err => {
                console.error(err)
                setStatusMessage("Error: Could not read QR code from image")
                setLoading(false)
            })
    }

    const removeAllData = () => {
        if (scanning) stopScan()
        if (fileInputRef.current) fileInputRef.current.value = ""
        setScannedData(null)
        setStatusMessage("")
        setLoading(false)
    }

    const handleScan = async (decodedText: string) => {
        const lines = decodedText.split(/\r?\n/)
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
            } else if (line.startsWith("UID:")) {
                data.userId = parseInt(line.replace("UID:", ""))
            }
        })

        setScannedData(data)
        stopScan()

        if (data.userId && session?.sessionId) {
            setLoading(true)
            setStatusMessage("")
            try {
                const res = await api.post(`participants-session/${session.sessionId}/join`, { userId: data.userId })
                setStatusMessage(res.data.message)
            } catch (err: any) {
                setStatusMessage(err.response?.data?.message || "Error joining session")
            } finally {
                setLoading(false)
            }
        }
    }

    return (
       <div className="min-h-screen flex flex-col items-center p-4 md:p-6 bg-gray-50 gap-6 w-full max-w-6xl mx-auto">
            <button
                onClick={() => router.back()}
                className="self-start flex items-center gap-2 cursor-pointer text-red-900 font-semibold"
            >
                <ArrowLeft className="w-5 h-5" />
                Back
            </button>

            {session ? (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 md:p-6 w-full space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between text-xs font-semibold text-red-700 gap-2 sm:gap-0">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-xl self-start">{session.category}</span>
                        <div className="text-right text-red-900">
                            <div>
                                {session.startTime
                                    ? new Date(session.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                    : "Time TBD"} - {session.endTime
                                    ? new Date(session.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                    : ""}
                            </div>
                            {session.startTime && (
                                <div className="text-gray-500 text-xs sm:text-sm">
                                    {new Date(session.startTime).toLocaleDateString(undefined, {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric"
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-black">{session.sessionTitle}</h2>

                    <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <img src="/images/Vector.png" className="w-4 h-4" />
                            <strong>{session.location || "Online"}</strong>
                        </div>
                        {session.minutes && (
                            <div className="flex items-center gap-1">
                                <img src="/images/Vector (1).png" className="w-4 h-4" />
                                <span>{session.minutes} mins</span>
                            </div>
                        )}
                        {session.capacity && (
                            <div className="flex items-center gap-1">
                                <img src="/images/Vector (2).png" className="w-4 h-4" />
                                <span>{session.capacity} capacity</span>
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-gray-600">{session.sessionDescription || "No description available"}</p>
                </div>
            ) : (
                <p>No session selected</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <button
                    onClick={startCameraScan}
                    className="flex-1 bg-red-900 text-white px-4 py-2 rounded-full flex items-center justify-center gap-2 disabled:opacity-50"
                    disabled={scanning || !session || loading}
                >
                    <Camera className="w-4 h-4" />
                    {scanning ? "Scanning..." : "Camera"}
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="flex-1 border border-red-900 cursor-pointer p-2 rounded-full disabled:opacity-50"
                    disabled={loading}
                />
                {(scanning || scannedData) && (
                    <button onClick={removeAllData} className="bg-gray-300 px-3 py-2 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {scannedData && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 md:p-6 space-y-4 max-w-lg w-full">
                    <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                        {scannedData.photo ? (
                            <img src={scannedData.photo} alt={scannedData.name} className="w-24 h-24 rounded-full object-cover border-2 border-red-900" />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-red-900">
                                <FaUser className="w-12 h-12 text-red-900" />
                            </div>
                        )}
                        <div className="flex-1 flex flex-col gap-2 text-center sm:text-left">
                            <h2 className="text-lg font-bold text-black">{scannedData.name || "N/A"}</h2>
                            <div className="text-sm text-gray-700 space-y-1">
    <p><span className="font-semibold text-red-900">Email </span>{scannedData.email || "N/A"}</p>
    <p><span className="font-semibold text-red-900">Role </span>{scannedData.role || "N/A"}</p>
    {scannedData.bio && scannedData.bio !== "-" && (
        <p><span className="font-semibold text-red-900">Bio </span>{scannedData.bio}</p>
    )}
</div>

                        </div>
                    </div>

                    {loading || statusMessage ? (
                        <div className="mt-4 pt-4 border-t text-center">
                            {loading ? (
                                <div className="flex items-center justify-center gap-2 text-blue-600">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="font-medium">Scanning session...</span>
                                </div>
                            ) : (
                                <p className={`font-medium ${statusMessage.toLowerCase().includes("error") || statusMessage.toLowerCase().includes("failed") ? "text-red-600" : "text-green-600"}`}>
                                    {statusMessage}
                                </p>
                            )}
                        </div>
                    ) : null}
                </div>
            )}

            <div id="qr-reader" className="w-full max-w-md"></div>
            <div id="qr-reader-file" className="hidden"></div>
        </div>
    )
}