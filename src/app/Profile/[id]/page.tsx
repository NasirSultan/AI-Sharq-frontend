'use client'

import React from 'react'
import ProfileCard from '../ProfileCard'
import SpeakerProfileCard from '../SpeakerProfileCard'
import SponsorProfileCard from '../SponsorProfileCard'

interface ProfilePageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ role?: string }>
}

export default function ProfilePage({ params, searchParams }: ProfilePageProps) {
  const resolvedParams = React.use(params)       // unwrap params
  const resolvedSearch = React.use(searchParams) // unwrap searchParams

  const id = resolvedParams.id
  const role = resolvedSearch.role?.toLowerCase() // safely access role

  if (role === 'speaker') {
    return <SpeakerProfileCard speakerId={id} />
  }

    if (role === 'sponsor') {
    return <SponsorProfileCard sponsorId={id} />
  }
  if (role === 'participant' || role === 'organizer' || role === 'registrationteam') {
    return <ProfileCard profileId={id} role={role} />
  }

  return (
    <div className="text-center mt-20 text-gray-600">
      Invalid role
    </div>
  )
}
