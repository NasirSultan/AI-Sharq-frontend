import React from 'react'
import { FaSpinner } from 'react-icons/fa'

interface LoadingButtonProps {
  text: string
  loading: boolean
  onClick?: () => void
  color?: string
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  text,
  loading,
  onClick,
  color = 'bg-red-600',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`py-3 px-6 rounded-xl text-white flex items-center justify-center gap-2 cursor-pointer
        ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'} ${color}`}
    >
      {loading && <FaSpinner className="animate-spin" />}
      {loading ? 'Please wait...' : text}
    </button>
  )
}

export default LoadingButton
