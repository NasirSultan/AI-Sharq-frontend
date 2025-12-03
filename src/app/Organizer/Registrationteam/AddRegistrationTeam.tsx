"use client"
import React, { useState } from "react"
import api from "@/config/api"
import Image from 'next/image'
type Props = {
  onAdded: (member: any | null) => void
}
import { FaEye, FaEyeSlash } from "react-icons/fa"
type UserData = {
  name: string
  email: string
  password: string
  role: string
}

export default function AddRegistrationTeam({ onAdded }: Props) {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
    role: "registrationteam"
  })

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const key = e.target.name
    setUserData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    if (!userData.name || !userData.email || !userData.password) {
      alert("Please fill all fields")
      return
    }

    setLoading(true)

    try {
      const res = await api.post("/auth/register", userData)
      const newMember = res.data
      setUserData({ name: "", email: "", password: "", role: "registrationteam" })
      onAdded(newMember)
    } catch (err: any) {
      const msg = err?.response?.data?.message
      if (msg === "Email already in use") {
        alert("This email is already used. Please use another email.")
      } else {
        alert("Failed to add member")
      }
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0  bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <div className="flex justify-center mb-4">
          <Image
            src="/images/logo1.png"
            alt="Al Sharq Logo"
            width={80}
            height={30}
            className="object-contain"
          />
        </div>

        <h2 className="text-lg font-bold mb-4 text-center">Add Registration Team Member</h2>

        <div className="flex flex-col gap-3 ">
          <div className="flex flex-col">
            <label className="text-red-900 text-sm mb-1">Name*</label>
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              value={userData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded text-sm focus:border-red-900 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-red-900 text-sm mb-1">Email*</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={userData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded text-sm focus:border-red-900 outline-none"
            />
          </div>

         
<div className="flex flex-col relative">
  <label className="text-red-900 text-sm mb-1">Password*</label>
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Enter password"
    value={userData.password}
    onChange={handleChange}
    className="w-full border border-gray-300 p-2 rounded text-sm focus:border-red-900 outline-none pr-10"
  />
  <span
    onClick={() => setShowPassword(prev => !prev)}
    className="absolute right-2 top-[34px] cursor-pointer text-gray-500"
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>
        </div>

        <div className="flex flex-col mt-4 gap-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-red-900 text-white py-2 cursor-pointer rounded-2xl border border-red-900 hover:bg-white hover:text-red-900 transition text-sm"
          >
            {loading ? "Adding..." : "Add Member"}
          </button>

          <button
            onClick={() => onAdded(null)}
            className="w-full bg-white text-red-900 cursor-pointer py-2 rounded-2xl border border-red-900 hover:bg-red-900 hover:text-white transition text-sm"
          >
            Skip
          </button>
        </div>

      </div>
    </div>

  )
}
