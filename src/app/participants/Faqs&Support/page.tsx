"use client"
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

const faqs = [
  {
    question: "How do I register for the conference?",
    answer:
      "You can register by visiting the registration page on our website and following the instructions.",
  },
  {
    question: "How do I add a session to My Agenda?",
    answer:
      "Go to the Sessions tab, select the session you’re interested in, and click 'Add to My Agenda'.",
  },
  {
    question: "Can I connect with other participants?",
    answer:
      "Yes! Networking is one of the key features of this app. Go to the Networking Directory, where you can browse a list of participants who have opted in for networking. You can send a connection request to people you’d like to connect with. Once they accept, you’ll be able to see their contact details and start a 1:1 chat directly within the app. This feature is designed to make it easier for you to meet like-minded professionals during and after the conference.",
  },
  {
    question: "Where can I find my QR code for entry?",
    answer:
      "Your QR code will be available in the app under the 'My Profile' section before the event.",
  },
  {
    question: "Can I connect with other participants?",
    answer:
      "Yes, networking is available via the app’s networking section where you can chat with other participants.",
  },
  {
    question: "How do I view speaker details?",
    answer:
      "You can view speaker details by navigating to the Speakers tab in the app.",
  },
  {
    question: "Where can I find the event map?",
    answer:
      "The event map will be available in the Resources section of the app.",
  },
  {
    question: "Can I join virtual sessions?",
    answer:
      "Yes, you can join virtual sessions by clicking the session link in the Agenda tab.",
  },
];

const FAQSupport = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-8xl  p-10 min-h-[80px]">
                 {/* Header */}
      <div className="flex  gap-2 mb-6 mt- ml-5">
 <Link href="/participants/Home">
    <FaArrowLeft className="text-red-800 w-[20px] h-[20px] cursor-pointer" />
  </Link>
        <h1 className="text-xl font-semibold text-black ml-4">FAQ & Support</h1>
      </div>

      {/* FAQ List */}
      <div className="space-y-4 p-7 ">
        {faqs.map((faq, index) => (
      <div
  key={index}
  className={`rounded-xl border border-gray-200 transition-colors min-h-[70px] flex flex-col justify-center ${
    openIndex === index ? "bg-red-800 text-white" : "bg-white text-black"
  }`}
>

            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center px-4 py-3 font-medium text-left"
            >
              {faq.question}
              <span className="ml-2">{openIndex === index ? "▲" : ""}<img src="/images/Icon.png"></img>
</span>
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
  );
};

export default FAQSupport;
