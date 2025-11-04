"use client"
import React from "react"

export default function DiscoverMoreSessions() {
  return (
    <section className="w-full bg-white rounded-lg shadow-md p-6 md:p-8 text-center border border-gray-200 my-6">
      <div className="flex justify-center mb-4">
        <div className="inline-block">
          <img
            src="/images/div (6).png"
            alt="Icon"
            className="w-12 h-12 md:w-14 md:h-14 object-contain"
          />
        </div>
      </div>

      <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">
        Discover More Sessions
      </h3>

      <p className="text-sm md:text-base text-gray-600 mb-5 max-w-xl mx-auto">
        Browse the full conference schedule to add more sessions to your agenda.
      </p>

      <div className="flex justify-center">
        <button className="bg-red-800 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition text-sm font-medium">
          Browse All Sessions
        </button>
      </div>
    </section>
  )
}
