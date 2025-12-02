"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import api from "@/config/api"

// Add this interface for props
interface AddSessionProps {
  onClose: () => void
}

export default function AddSessionModal({ onClose }: AddSessionProps) {
  const [events, setEvents] = useState<any[]>([])
  const [speakers, setSpeakers] = useState<any[]>([])
  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "", // This will store the final location value
    category: "",
    capacity: "",
    eventId: "",
    speakerIds: [] as number[],
    registrationRequired: false,
  })
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [locationType, setLocationType] = useState("Online")
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [speakerSearch, setSpeakerSearch] = useState("")
  const [filteredSpeakers, setFilteredSpeakers] = useState<any[]>([])

  useEffect(() => {
    if (speakerSearch.trim() === "") {
      setFilteredSpeakers([])
    } else {
      const filtered = speakers.filter((speaker) =>
        speaker.user.name.toLowerCase().includes(speakerSearch.toLowerCase())
      )
      setFilteredSpeakers(filtered)
    }
  }, [speakerSearch, speakers])

  useEffect(() => {
    api.get("/event/short-info").then(res => setEvents(res.data))
    api.get("/speakers/all-details").then(res => setSpeakers(res.data))
  }, [])

  // Fix: Update location when locationType or address changes
  useEffect(() => {
    if (locationType === "Online") {
      setForm(prev => ({ ...prev, location: "Online" }))
    } else {
      setForm(prev => ({ ...prev, location: address }))
    }
  }, [locationType, address])

  const handleLocationTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocationType(e.target.value)
    if (e.target.value === "Online") {
      setAddress("")
      setForm(prev => ({ ...prev, location: "Online" }))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement

    if (name === "speakerIds") {
      const speakerId = parseInt(value)
      setForm(prev => ({
        ...prev,
        speakerIds: checked
          ? [...prev.speakerIds, speakerId]
          : prev.speakerIds.filter(id => id !== speakerId),
      }))
    } else if (type === "checkbox") {
      setForm(prev => ({ ...prev, [name]: checked }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const eventId = e.target.value
    setForm(prev => ({ ...prev, eventId }))
    const selectedEvent = events.find(ev => ev.eventId.toString() === eventId)
    if (selectedEvent) {
      setForm(prev => ({ ...prev, description: selectedEvent.description }))
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Validate required fields
      if (!form.title || !form.category || !form.startTime || !form.endTime || !form.eventId || form.speakerIds.length === 0 || !form.capacity) {
        alert("Please fill all required fields")
        return
      }

      const payload = {
        ...form,
        capacity: Number(form.capacity),
        tags,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        eventId: Number(form.eventId),
        // Location is already in form state from useEffect
      }

      console.log("Sending payload:", payload) // For debugging

      const res = await api.post("/sessions", payload)
      console.log("Session added successfully", res.data)
      alert("Session added successfully")
      
      // Close modal and refresh parent
      onClose()
    } catch (err: any) {
      console.error("Error adding session:", err)
      alert(`Failed to add session: ${err.response?.data?.message || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"></div>

      <div className="fixed inset-0 flex items-center justify-center px-4 z-[9999]">
        <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-700 text-2xl font-bold"
          >
            ✕
          </button>

          <div className="flex justify-center mb-4">
            <Image src="/images/logo1.png" alt="Logo" width={160} height={40} />
          </div>

          <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Add New Session</h2>

          <form className="space-y-5 text-gray-700 text-sm" onSubmit={handleSubmit}>
            <div>
              <label className="block font-semibold mb-2">Session Title<span className="text-red-700 ml-1">*</span></label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                type="text"
                placeholder="Enter a clear title"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#9B2033] focus:border-[#9B2033]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Category<span className="text-red-700 ml-1">*</span></label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#9B2033] focus:border-[#9B2033]"
                required
              >
                <option value="">Select Category</option>
                <option value="General Discussion">General Discussion</option>
                <option value="Workshop">Workshop</option>
                <option value="Keynote">Keynote</option>
              </select>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block font-semibold mb-2">Start Date<span className="text-red-700 ml-1">*</span></label>
                <input
                  name="startTime"
                  type="datetime-local"
                  value={form.startTime}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#9B2033] focus:border-[#9B2033]"
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block font-semibold mb-2">End Date<span className="text-red-700 ml-1">*</span></label>
                <input
                  name="endTime"
                  type="datetime-local"
                  value={form.endTime}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#9B2033] focus:border-[#9B2033]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Event<span className="text-red-700 ml-1">*</span></label>
              <select
                name="eventId"
                value={form.eventId}
                onChange={handleEventChange}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#9B2033] focus:border-[#9B2033]"
                required
              >
                <option value="">Select Event</option>
                {events.map(event => (
                  <option key={event.eventId} value={event.eventId}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your topic in detail"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#9B2033] focus:border-[#9B2033]"
              ></textarea>
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Speakers<span className="text-red-700 ml-1">*</span>
              </label>

              <input
                type="text"
                placeholder="Search speakers by name"
                value={speakerSearch}
                onChange={(e) => setSpeakerSearch(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-[#9B2033] focus:border-[#9B2033]"
              />

              {filteredSpeakers.length > 0 && (
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 mb-3">
                  {filteredSpeakers.map((speaker) => (
                    <label
                      key={speaker.speakerid}
                      className="flex flex-col cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-lg p-2"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="speakerIds"
                          value={speaker.speakerid}
                          checked={form.speakerIds.includes(speaker.speakerid)}
                          onChange={handleChange}
                          className="w-4 h-4"
                        />
                        <span className="text-gray-800 font-medium">
                          {speaker.user.name}
                        </span>
                      </div>
                      <span className="text-gray-500 text-sm ml-6">
                        {speaker.designations.join(", ")}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {form.speakerIds.length > 0 && (
                <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                  <h3 className="font-semibold mb-2 text-gray-700 text-sm">
                    Selected Speakers ({form.speakerIds.length})
                  </h3>
                  <div className="flex flex-col gap-2">
                    {form.speakerIds.map((id) => {
                      const sp = speakers.find((s) => s.speakerid === id)
                      if (!sp) return null
                      return (
                        <label
                          key={id}
                          className="flex flex-col bg-white border border-gray-200 rounded-lg p-2 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="speakerIds"
                              value={sp.speakerid}
                              checked={form.speakerIds.includes(sp.speakerid)}
                              onChange={handleChange}
                              className="w-4 h-4"
                            />
                            <span className="text-gray-800 font-medium">
                              {sp.user.name}
                            </span>
                          </div>
                          <span className="text-gray-500 text-sm ml-6">
                            {sp.designations.join(", ")}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-2">Location Type<span className="text-red-700 ml-1">*</span></label>
              <select
                value={locationType}
                onChange={handleLocationTypeChange}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#9B2033] focus:border-[#9B2033]"
                required
              >
                <option value="Online">Online</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>

            {locationType === "Onsite" && (
              <div className="mt-2">
                <label className="block font-semibold mb-2">Address<span className="text-red-700 ml-1">*</span></label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Enter address"
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#9B2033] focus:border-[#9B2033]"
                  required={locationType === "Onsite"}
                />
              </div>
            )}

            {/* Display final location value for debugging */}
            <div className="text-xs text-gray-500">
              Location will be saved as: <strong>{form.location}</strong>
            </div>

            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="block font-semibold mb-2">Capacity<span className="text-red-700 ml-1">*</span></label>
                <input
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  type="number"
                  placeholder="Enter capacity"
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#9B2033] focus:border-[#9B2033]"
                  required
                  min="1"
                />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  name="registrationRequired"
                  checked={form.registrationRequired}
                  onChange={handleChange}
                />
                <label className="text-gray-700 font-medium">Registration Required</label>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
       placeholder="Enter each question for this session separately"
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#9B2033] focus:border-[#9B2033]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-[#9B2033] hover:bg-[#7c062a] text-white px-4 rounded-lg transition"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <div
                    key={tag}
                    className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? "bg-red-800" : "bg-[#9B2033] hover:bg-[#7c062a]"} text-white text-sm font-semibold py-2 rounded-lg shadow-md transition disabled:cursor-not-allowed`}
            >
              {loading ? "Creating..." : "Create Session"}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}