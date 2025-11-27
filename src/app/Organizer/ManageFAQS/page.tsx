"use client"
import React, { useState } from "react"
import { FaArrowLeft } from "react-icons/fa"
import Link from "next/link"
import Image from "next/image"

const faqs = [
  {
    question: "How do I register for the conference?",
    answer: "You can register by visiting the registration page on our website and following the instructions."
  },
  {
    question: "How do I add a session to My Agenda?",
    answer: "Go to the Sessions tab, select the session you are interested in, and click Add to My Agenda."
  },
  {
    question: "Can I connect with other participants?",
    answer: "Yes. Networking is a key feature. Go to the Networking Directory and browse participants who opted in. You can send a request, and after they accept, you can view their details and start a chat."
  },
  {
    question: "Where can I find my QR code for entry?",
    answer: "Your QR code will be available in the app under the My Profile section before the event."
  },
  {
    question: "Can I connect with other participants?",
    answer: "Yes, networking is available through the app where you can chat with others."
  },
  {
    question: "How do I view speaker details?",
    answer: "You can view speaker details by navigating to the Speakers tab."
  },
  {
    question: "Where can I find the event map?",
    answer: "The event map will be available in the Resources section."
  },
  {
    question: "Can I join virtual sessions?",
    answer: "Yes, you can join virtual sessions by clicking the session link in the Agenda tab."
  }
]

export default function FaqSupport() {
  const [openIndex, setOpenIndex] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleFaq = index => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      <div className="max-w-6xl w-full mx-auto p-6 min-h-[80px]">
        <div className="flex gap-2 mb-6 ml-2">
          <Link href="/Organizer/Dashboard">
            <FaArrowLeft className="text-red-800 w-[20px] h-[20px] cursor-pointer" />
          </Link>
          <h1 className="text-xl font-semibold text-black ml-3">FAQ & Support</h1>
        </div>

        <button
          className="bg-[#9B2033] hover:bg-[#7c062a] transition text-white text-sm ml-3 px-5 py-2 rounded-md font-medium"
          onClick={() => setIsModalOpen(true)}
        >
          + Add FAQS
        </button>

        <div className="space-y-4 p-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-xl border border-gray-200 transition-colors min-h-[70px] flex flex-col justify-center ${
                openIndex === index ? "bg-red-800 text-white" : "bg-white text-black"
              }`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center px-4 py-3 font-bold text-left"
              >
                {faq.question}
                <span className="ml-2">{openIndex === index ? "▲" : ""}<img src="/images/Icon.png" /></span>
              </button>

              {openIndex === index && (
                <div className="px-4 pb-3 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Image src="/images/line.png" alt="Line" width={1450} height={127} className="absolute" />

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl font-bold"
            >
              ✕
            </button>

            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <Image src="/images/logo1.png" alt="Logo" width={100} height={100} />
              </div>

              <h2 className="text-center text-xl font-semibold text-gray-900 mb-6">Add New Question</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Question*</label>
                <input
                  type="text"
                  placeholder="Type your question here..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 text-sm text-gray-700 leading-relaxed">
                  Yes. Networking is one of the key features. Go to the Networking Directory and browse a list of participants who opted in. You can send a request and chat after they accept.
                </div>
              </div>

              <div className="flex justify-center">
                <button className="bg-[#9B2033] text-white w-full py-3 rounded-lg font-semibold text-lg hover:bg-red-800 transition">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
