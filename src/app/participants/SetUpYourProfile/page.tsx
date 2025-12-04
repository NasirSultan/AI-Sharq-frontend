'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'
import api from '@/config/api'
import { useRouter } from 'next/navigation'
import { FaUser } from 'react-icons/fa'

export default function ProfileSetup() {
  const router = useRouter()
  const userId = useSelector((state: RootState) => state.user.userId)

  const [formData, setFormData] = useState({
    fullName: '',
    organization: '',
    phone: '',
    bio: '',
    file: '',
  })

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('')
  const [errors, setErrors] = useState({
    fullName: false,
    organization: false,
    phone: false,
    bio: false,
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/admin/users/${userId}`)
        const user = res.data
        setFormData({
          fullName: user.name || '',
          organization: user.organization || '',
          phone: user.phone || '',
          bio: user.bio || '',
          file: user.file || '',
        })
        setRole(user.role || '')
      } catch (err) {
        console.error('Error loading user data', err)
      }
    }
    if (userId) fetchUser()
  }, [userId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '')
      setFormData({ ...formData, [name]: numericValue })
    } else {
      setFormData({ ...formData, [name]: value })
    }
    setErrors({ ...errors, [name]: false })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFormData({ ...formData, file: URL.createObjectURL(selectedFile) })
    }
  }

  const validate = () => {
    const newErrors = {
      fullName: !formData.fullName,
      organization: !formData.organization,
      phone: !formData.phone,
      bio: !formData.bio,
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  const handleSubmit = async () => {
    if (!validate()) return

    const data = new FormData()
    data.append('name', formData.fullName)
    data.append('organization', formData.organization)
    data.append('phone', formData.phone)
    data.append('bio', formData.bio)
    if (file) data.append('file', file)

    for (let pair of data.entries()) {
      console.log(pair[0], pair[1])
    }

    try {
      setLoading(true)
      await api.patch(`/auth/update/${userId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (role === 'speaker') router.push('/speakers/SetUpYourProfile')
      else if (role === 'registrationteam') router.push('/registrationteam')
      else if (role === 'organizer') router.push('/Organizer/Dashboard')
      else if (role === 'participant') router.push('/participants/Home')
      else router.push('/')

    } catch (err) {
      console.error('Error updating profile', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    if (role === 'speaker') router.push('/speakers/ManageSessions')
    else if (role === 'organizer') router.push('/Organizer/Dashboard')
    else router.push('/participants/Home')
  }

  const inputClass = (hasError: boolean) =>
    `w-full h-12 px-4 border rounded-lg text-sm text-gray-800 ${hasError ? 'border-red-600 bg-red-50' : 'border-gray-300 bg-white'
    }`

  const textareaClass = (hasError: boolean) =>
    `w-full h-24 px-4 py-2 border rounded-lg text-sm text-gray-800 resize-none ${hasError ? 'border-red-600 bg-red-50' : 'border-gray-300 bg-white'
    }`

  return (
    <div className="bg-white min-h-screen w-full flex items-center justify-center relative">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl px-8 py-10 z-10 flex flex-col items-center gap-6">
        <h2 className="text-xl font-semibold text-gray-800 text-center">Set Up Your Profile</h2>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          Complete your profile to personalize your event experience and connect with others
        </p>

        <div className="w-24 h-24 rounded-full bg-[#F7DADC] flex items-center justify-center text-[#9B2033] text-4xl overflow-hidden">
          {formData.file ? <img src={formData.file} alt="User" className="w-full h-full object-cover" /> : <FaUser />}
        </div>

        <label htmlFor="file" className="text-sm font-medium text-gray-700 cursor-pointer hover:underline">
          Upload or Take Photo
        </label>
        <input type="file" id="file" accept="image/*" className="hidden" onChange={handleFileChange} />

       <div className="w-full flex flex-col gap-3">
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-700">Full Name*</label>
    <input
      type="text"
      name="fullName"
      placeholder="Enter your full name"
      value={formData.fullName}
      onChange={handleChange}
      className={`w-full h-10 px-3 border rounded-lg text-sm text-gray-800 ${errors.fullName ? 'border-red-600 bg-red-50' : 'border-gray-300 bg-white'}`}
    />
  </div>

  {role !== 'participant' && (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-700">Organization*</label>
      <input
        type="text"
        name="organization"
        placeholder="Enter your organization"
        value={formData.organization}
        onChange={handleChange}
        className={`w-full h-10 px-3 border rounded-lg text-sm text-gray-800 ${errors.organization ? 'border-red-600 bg-red-50' : 'border-gray-300 bg-white'}`}
      />
    </div>
  )}

  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-700">Phone*</label>
    <input
      type="text"
      name="phone"
      placeholder="Enter your phone number"
      value={formData.phone}
      onChange={handleChange}
      className={`w-full h-10 px-3 border rounded-lg text-sm text-gray-800 ${errors.phone ? 'border-red-600 bg-red-50' : 'border-gray-300 bg-white'}`}
    />
  </div>

  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-700">Bio*</label>
    <textarea
      name="bio"
      placeholder="Enter a short bio"
      value={formData.bio}
      onChange={handleChange}
      className={`w-full h-20 px-3 py-2 border rounded-lg text-sm text-gray-800 resize-none ${errors.bio ? 'border-red-600 bg-red-50' : 'border-gray-300 bg-white'}`}
    />
  </div>

  <button
    onClick={handleSubmit}
    disabled={loading}
    className={`w-full h-10 text-white text-sm font-semibold rounded-lg transition ${loading ? 'bg-red-900 cursor-not-allowed' : 'bg-[#9B2033] hover:bg-[#7c1a2a]'}`}
  >
    {loading ? 'Saving...' : 'Save & Continue'}
  </button>

  <p onClick={handleSkip} className="text-sm text-center text-gray-500 cursor-pointer hover:underline">
    Skip for now
  </p>
</div>

      </div>
    </div>
  )
}
