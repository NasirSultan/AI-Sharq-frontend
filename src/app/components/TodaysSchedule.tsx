import Link from 'next/link'
import React from 'react'

export default function TodaysSchedule() {
  return (
    <>
 {/* Today's Schedule */}
<section className="mb-6">
  <div className="flex justify-between items-center mb-4 px-2 md:px-4">
    <h2 className="text-lg md:text-xl font-semibold text-black">Today's Schedule</h2>
    <p className="text-black hover:text-red-700 text-sm md:text-base font-medium cursor-pointer">
      <Link href={"/participants/ViewAllSessions"}>View All</Link>
    </p>
  </div>

  <div className="bg-white p-4 md:p-6 rounded-xl shadow flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0 max-w-full border border-gray-300">
    <div>
      <p className="text-black text-xs md:text-sm font-semibold">Next</p>
      <p className="text-red-700 text-xl md:text-2xl font-bold leading-tight">10:30</p>
    </div>
    <div className="flex-1 md:px-4">
      <p className="font-semibold text-black">Opening Keynote</p>
      <p className="text-sm text-gray-600">Dr Emily • Hall A</p>
    </div>
    <button className="text-red-700 text-xl"><svg width="30" height="27" viewBox="0 0 30 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M29.3722 11.9704C30.2093 12.8164 30.2093 14.1904 29.3722 15.0364L18.6573 25.8655C17.8202 26.7115 16.4607 26.7115 15.6236 25.8655C14.7865 25.0195 14.7865 23.6455 15.6236 22.7995L22.6888 15.6658H2.14298C0.957642 15.6658 0 14.698 0 13.5C0 12.302 0.957642 11.3342 2.14298 11.3342H22.6821L15.6303 4.20051C14.7932 3.35448 14.7932 1.98054 15.6303 1.13452C16.4674 0.288494 17.8269 0.288494 18.664 1.13452L29.3789 11.9636L29.3722 11.9704Z" fill="#9B2033"/>
</svg>
</button>
  </div>
</section>
</>
  )
}
