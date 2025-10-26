'use client'

import React, { useState } from 'react'

const SetExhibitorId: React.FC = () => {
  const [exhibitorId, setExhibitorId] = useState('')

  const handleSave = () => {
    if (!exhibitorId) return
    localStorage.setItem('exhibitorId', exhibitorId)
    alert('Exhibitor ID saved')
    setExhibitorId('')
  }

  return (
    <div className="p-4 flex flex-col gap-3 max-w-sm mx-auto mt-10">
      <label className="text-base font-medium text-gray-700">Enter Exhibitor ID</label>
      <input
        type="text"
        value={exhibitorId}
        onChange={e => setExhibitorId(e.target.value)}
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white rounded-md p-2 font-medium"
      >
        Save ID
      </button>
    </div>
  )
}

export default SetExhibitorId
