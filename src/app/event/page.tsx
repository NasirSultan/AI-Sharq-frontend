"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { setEventId } from "@/lib/store/features/event/eventSlice"
import { setUserId } from "@/lib/store/features/user/userSlice"
import { setSpeakerId } from "@/lib/store/features/speaker/speakerSlice"
import { setSponsorId } from "@/lib/store/features/sponsor/sponsorSilice"
import { setExhibitorId } from "@/lib/store/features/exhibitor/exhibitorSlice"
import Link from "next/link"

export default function EventsPage() {
  const dispatch = useDispatch()

  const [eventId, setEventIdInput] = useState("")
  const [userId, setUserIdInput] = useState("")
  const [speakerId, setSpeakerIdInput] = useState("")
  const [sponsorId, setSponsorIdInput] = useState("")
  const [exhibitorId, setExhibitorIdInput] = useState("")

  const [showSpeakerInput, setShowSpeakerInput] = useState(false)
  const [showSponsorInput, setShowSponsorInput] = useState(false)
  const [showExhibitorInput, setShowExhibitorInput] = useState(false)

  const [message, setMessage] = useState("")

  const handleSetIds = () => {
    const eId = Number(eventId)
    const uId = Number(userId)

    if (isNaN(eId) || isNaN(uId)) {
      setMessage("Please enter valid numbers")
      return
    }

    dispatch(setEventId(eId))
    dispatch(setUserId(uId))

    setEventIdInput("")
    setUserIdInput("")
    setMessage("Event and User saved successfully")
  }

  const handleSetSpeakerId = () => {
    const sId = Number(speakerId)
    if (isNaN(sId)) {
      setMessage("Please enter a valid speaker ID")
      return
    }
    dispatch(setSpeakerId(sId))
    setSpeakerIdInput("")
    setMessage("Speaker ID saved successfully")
  }

  const handleSetSponsorId = () => {
    const spId = Number(sponsorId)
    if (isNaN(spId)) {
      setMessage("Please enter a valid sponsor ID")
      return
    }
    dispatch(setSponsorId(spId))
    setSponsorIdInput("")
    setMessage("Sponsor ID saved successfully")
  }

  const handleSetExhibitorId = () => {
    const exId = Number(exhibitorId)
    if (isNaN(exId)) {
      setMessage("Please enter a valid exhibitor ID")
      return
    }
    dispatch(setExhibitorId(exId))
    setExhibitorIdInput("")
    setMessage("Exhibitor ID saved successfully")
  }

  const handleClearAll = () => {
dispatch(setEventId(0))
dispatch(setUserId(0))
dispatch(setSpeakerId(0))
dispatch(setSponsorId(0))
dispatch(setExhibitorId(0))


    setEventIdInput("")
    setUserIdInput("")
    setSpeakerIdInput("")
    setSponsorIdInput("")
    setExhibitorIdInput("")

    localStorage.clear()

    // remove all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
    })

    setMessage("All data cleared")
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Events Page</h1>

      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          value={eventId}
          onChange={(e) => setEventIdInput(e.target.value)}
          placeholder="Enter Event ID"
          style={{ marginRight: 10 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserIdInput(e.target.value)}
          placeholder="Enter User ID"
          style={{ marginRight: 10 }}
        />
      </div>

      <button onClick={handleSetIds}>Save Event and User</button>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setShowSpeakerInput(!showSpeakerInput)}>
          {showSpeakerInput ? "Hide Speaker ID" : "Add Speaker ID"}
        </button>
      </div>

      {showSpeakerInput && (
        <div style={{ marginTop: 10 }}>
          <input
            type="text"
            value={speakerId}
            onChange={(e) => setSpeakerIdInput(e.target.value)}
            placeholder="Enter Speaker ID"
            style={{ marginRight: 10 }}
          />
          <button onClick={handleSetSpeakerId}>Save Speaker ID</button>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setShowSponsorInput(!showSponsorInput)}>
          {showSponsorInput ? "Hide Sponsor ID" : "Add Sponsor ID"}
        </button>
      </div>

      {showSponsorInput && (
        <div style={{ marginTop: 10 }}>
          <input
            type="text"
            value={sponsorId}
            onChange={(e) => setSponsorIdInput(e.target.value)}
            placeholder="Enter Sponsor ID"
            style={{ marginRight: 10 }}
          />
          <button onClick={handleSetSponsorId}>Save Sponsor ID</button>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setShowExhibitorInput(!showExhibitorInput)}>
          {showExhibitorInput ? "Hide Exhibitor ID" : "Add Exhibitor ID"}
        </button>
      </div>

      {showExhibitorInput && (
        <div style={{ marginTop: 10 }}>
          <input
            type="text"
            value={exhibitorId}
            onChange={(e) => setExhibitorIdInput(e.target.value)}
            placeholder="Enter Exhibitor ID"
            style={{ marginRight: 10 }}
          />
          <button onClick={handleSetExhibitorId}>Save Exhibitor ID</button>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={handleClearAll}>Clear All Data</button>
      </div>

      {message && <p style={{ color: "green", marginTop: 10 }}>{message}</p>}

      <div style={{ marginTop: 20 }}>
        <Link href="/testing">Go to Testing Page</Link>
      </div>
    </div>
  )
}
