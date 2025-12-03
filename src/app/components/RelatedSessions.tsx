"use client";
import React, { useState } from "react";

type Session = {
  title: string;
  speaker: string;
  speakerImage: string;
  time: string;
  tag: string;
  tagColor: string;
  duration: string;
  room: string;
  description: string;
};




const allEvents: Session[] = [
  {
    title: "Digital Transformation in MENA",
    speakerImage: "/images/img (7).png",
    speaker: "Dr. Sarah Hassan +2 more",
    description:
      "Exploring the role of diplomacy and collaboration in shaping future policies.",
    time: "2:00 PM – 3:30 PM",
    tag: "Keynote",
    tagColor: "bg-blue-200 text-blue-700",
    duration: "90 minutes",
    room: "Hall B",
  },
  {
    title: "The Future of Regional Cooperation",
    speakerImage: "/images/img (8).png",
    speaker: "Prof. Omar Khair",
    description:
      "Exploring the role of diplomacy and collaboration in shaping future policies.",
    time: "10:00 AM – 11:30 AM",
    tag: "Panel",
    tagColor: "bg-yellow-200 text-yellow-700",
    duration: "90 minutes",
    room: "Hall B",
  },
  {
    title: "Innovation in Sustainable Energy",
    speakerImage: "/images/img (9).png",
    speaker: "Dr. Mathew",
    description:
      "Exploring the role of diplomacy and collaboration in shaping future policies.",
    time: "4:00 PM – 5:00 PM",
    tag: "Workshop",
    tagColor: "bg-purple-200 text-purple-700",
    duration: "90 minutes",
    room: "Room C2",
  },
];

type ModalProps = {
  show: boolean;
  onClose: () => void;
};

const ApplyWorkshopModal: React.FC<ModalProps> = ({ show, onClose }) => {
  const [step, setStep] = useState(1);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md mx-auto rounded-xl p-6 max-h-[95vh] overflow-auto z-10 shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <img src="/images/logo1.png" alt="Logo" className="mx-auto mb-4 w-32" />
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            Apply for Workshop
          </h3>
          <p className="text-sm text-gray-500">Fill the information below</p>
        </div>

{/* Step Buttons */}
<div className="flex justify-center space-x-9 mb-6 bg-white border border-gray-200 rounded-xl py-2 px-5">
  <button
    onClick={() => setStep(1)}
    className={`px-6 py-2 rounded-md font-semibold text-sm transition-colors ${
      step === 1
        ? "bg-[#9B2033] text-white px-15"
        : "bg-white text-gray-600"
    }`}
  >
    Step 1
  </button>
  <button
    onClick={() => setStep(2)}
    className={`px-6 py-2 rounded-md font-semibold text-sm transition-colors ${
      step === 2
        ? "bg-[#9B2033] text-white px-15"
        : "bg-white text-gray-600"
    }`}
  >
    Step 2
  </button>
</div>


{step === 1 ? (
  <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
    <div>
      <label className="block text-gray-700 font-medium text-sm mb-1">Full Name</label>
      <input
        type="text"
        placeholder="Enter your full name"
        className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9B2033]"
        required
      />
    </div>
    <div>
      <label className="block text-gray-700 font-medium text-sm mb-1">Organization/Company<span className="text-red-600">*</span></label>
      <input
        type="text"
        placeholder="Enter your organization"
        className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9B2033]"
        required
      />
    </div>
    <div>
      <label className="block text-gray-700 font-medium text-sm mb-1">Contact Email<span className="text-red-600">*</span></label>
      <input
        type="email"
        placeholder="user@example.com"
        className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9B2033]"
        required
      />
      <p className="text-xs text-gray-500 mt-1">Email from registration (cannot be changed)</p>
    </div>
    <div>
      <label className="block text-gray-700 font-medium text-sm mb-1">Kindly share any specific personal needs</label>
      <textarea
        placeholder="Describe..."
        className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9B2033]"
        rows={4}
      ></textarea>
    </div>
    <button
      type="button"
      onClick={() => setStep(2)}
      className="w-full bg-[#9B2033] text-white py-3 rounded-md text-sm font-semibold hover:bg-red-700 transition"
    >
      Next
    </button>
  </form>
) : (
  <form
  className="space-y-5"
  onSubmit={(e) => {
    e.preventDefault();
    alert("Application Submitted!");
    onClose();
  }}
>
  <div>
    <label className="block text-gray-700 font-medium text-sm mb-1">
      Why do you want to attend this workshop?
    </label>
    <textarea
      placeholder="Describe..."
      className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9B2033]"
      rows={3}
      required
    ></textarea>
  </div>

  <div>
    <label className="block text-gray-700 font-medium text-sm mb-1">
      Relevant Experience & Background
    </label>
    <textarea
      placeholder="Describe..."
      className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9B2033]"
      rows={3}
      required
    ></textarea>
  </div>

  <div className="flex justify-center space-x-6">
    <button
      type="button"
      onClick={() => setStep(1)}
      className="px-16 py-2 rounded-lg  bg-gray-400 text-white font-semibold hover:bg-gray-800 transition"
    >
      Back
    </button>
    <button
      type="submit"
      className="px-16 py-2 rounded-md  bg-red-800 text-white font-semibold hover:bg-gray-900 transition"
    >
      Apply
    </button>
  </div>
</form>

)}

      </div>
    </div>
  );
};

export default function RelatedSessionsGrid() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8" id="app-root">
      <ApplyWorkshopModal show={showModal} onClose={() => setShowModal(false)} />

      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Related Sessions</h2>
        <a href="/all-sessions" className="text-sm text-gray-600 hover:underline">
          View All
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {allEvents.map((event, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between"
          >
            {/* Top Row */}
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-semibold text-black">{event.title}</h3>
              <button
                aria-label="Bookmark"
                className="text-gray-400 hover:text-red-700 transition"
              >
                <svg
                  width="12"
                  height="16"
                  viewBox="0 0 12 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.5 0.5H10.5C11.052 0.5 11.5 0.948017 11.5 1.5V15.2402C11.5 15.3828 11.3828 15.5 11.2402 15.5C11.2121 15.5 11.1851 15.4961 11.1602 15.4883L11.0898 15.4531L6.28711 12.0908L6 11.8896L5.71289 12.0908L0.910156 15.4531L0.839844 15.4883C0.814907 15.4961 0.787903 15.5 0.759766 15.5C0.617158 15.5 0.5 15.3828 0.5 15.2402V1.5C0.5 0.948017 0.948017 0.5 1.5 0.5Z"
                    stroke="#9B2033"
                  />
                </svg>
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-500 mb-3">{event.description}</p>

            {/* Speaker */}
            <div className="flex items-center text-xs text-gray-600 mb-3 space-x-2">
              <img
                src={event.speakerImage}
                alt={event.speaker}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span>{event.speaker}</span>
            </div>

            {/* Time & Tag */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-xs text-gray-600 space-x-1">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="#2D7DD2"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  className="inline-block"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span>{event.time}</span>
              </div>

              <span
                className={`px-2 py-1 rounded-xl text-xs font-semibold ${event.tagColor}`}
              >
                {event.tag}
              </span>
            </div>

            {/* Duration & Room */}
            <div className="flex justify-between text-xs text-gray-900 mb-4">
              <span>
                <strong>Duration:</strong> {event.duration}
              </span>
              <span>
                <strong>Room:</strong> {event.room}
              </span>
            </div>

            {/* View Details Button */}
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-[#9B2033] text-white py-2 text-sm rounded-md hover:bg-red-700 transition"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
