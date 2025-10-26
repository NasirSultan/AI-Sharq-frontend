import React from 'react';
import SpeakerSession from '../../components/SpeakerSession';
import Image from 'next/image';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';


const SpeakerDetails = () => {
  const sessions = [
    {
      title: "Exploring the role of diplomacy and collaboration in shaping future policies",
      time: "2:00 PM – 3:30 PM",
      duration: "90 minutes",
      room: "Hall B",
      type: "Panel",
      typeColor: "#91C6FF",
      typeTextColor: "#1E40AF"
    },
    {
      title: "Exploring the role of diplomacy and collaboration in shaping future policies",
      time: "10:00 AM – 11:30 AM",
      duration: "90 minutes",
      room: "Hall B",
      type: "Keynote",
      typeColor: "#E9EB87",
      typeTextColor: "#606C38"
    },
    {
      title: "Exploring the role of diplomacy and collaboration in shaping future policies",
      time: "4:00 PM – 5:00 PM",
      duration: "60 minutes",
      room: "Room C2",
      type: "Workshop",
      typeColor: "#F3E8FF",
      typeTextColor: "#6B21A8"
    }
  ];

  return (
    <div className="flex flex-col justify-center items-center p-0 gap-10 w-full max-w-[1280px] mx-auto min-h-screen py-8">
      {/* Header Section */}
      <div className="flex flex-row items-center gap-10 w-full max-w-[1280px] h-8">
 <Link href="/participants/Speakers">
    <FaArrowLeft className="text-red-800 w-[20px] h-[20px] cursor-pointer" />
  </Link>        <h1 className="text-2xl font-medium text-[#282828] leading-6 tracking-tight">
          Speaker Details
        </h1>
      </div>

      {/* Speaker Profile Section */}
      <div className="flex flex-col items-center gap-6 w-full max-w-[1280px]">
        {/* Speaker Image */}
        <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
          <Image
            src="/images/drAhmad.jpg"
            alt="Dr. Ahmed Hassan"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>

        {/* Speaker Name and Title */}
        <div className="flex flex-col items-center gap-6 w-full max-w-[1280px]">
          <h2 className="text-2xl font-medium text-[#282828] text-center leading-6 tracking-tight">
            Dr. Ahmed Hassan
          </h2>
          <p className="text-base text-[#282828] text-center leading-6">
            Director of Regional Affairs - Middle East Institute
          </p>
        </div>
      </div>

      {/* Biography Section */}
      <div className="w-full max-w-[1280px] p-6 bg-white border border-gray-300 shadow-sm rounded-2xl">
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-semibold text-[#282828] leading-7">
            Biography
          </h3>
          <p className="text-sm text-[#424242] leading-5">
            Dr. Ahmed Hassan is a leading expert in artificial intelligence and digital transformation with over 15 years of experience in technology innovation. He has led major digital transformation initiatives across Fortune 500 companies and is a recognized thought leader in AI ethics and sustainable technology development.Prior to founding Tech Innovations Ltd, Dr. Hassan served as Chief Technology Officer at several multinational corporations, where he spearheaded breakthrough AI implementations that revolutionized business operations and customer experiences. He holds a Ph.D. in Computer Science from MIT and has published over 50 research papers on machine learning, neural networks, and ethical AI frameworks. Dr. Hassan is also a frequent keynote speaker at international technology conferences. Read more
          </p>
        </div>
      </div>

      {/* Areas of Expertise Section */}
      <div className="w-full max-w-[1280px] p-6 bg-white border border-gray-300 shadow-sm rounded-2xl">
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-semibold text-[#282828] leading-7">
            Areas of Expertise
          </h3>
          <div className="flex flex-row flex-wrap gap-3.5">
            <div className="px-3 py-2.5 bg-[#FFEFF2] rounded-full">
              <span className="text-lg font-medium text-[#9B2033] leading-5">Artificial Intelligence</span>
            </div>
            <div className="px-3 py-2.5 bg-[#FFEFF2] rounded-full">
              <span className="text-lg font-medium text-[#9B2033] leading-5">Digital Transformation</span>
            </div>
            <div className="px-3 py-2.5 bg-[#FFEFF2] rounded-full">
              <span className="text-lg font-medium text-[#9B2033] leading-5">Machine Learning</span>
            </div>
            <div className="px-3 py-2.5 bg-[#FFEFF2] rounded-full">
              <span className="text-lg font-medium text-[#9B2033] leading-5">AI Ethics</span>
            </div>
            <div className="px-3 py-2.5 bg-[#FFEFF2] rounded-full">
              <span className="text-lg font-medium text-[#9B2033] leading-5">Neural Networks</span>
            </div>
            <div className="px-3 py-2.5 bg-[#FFEFF2] rounded-full">
              <span className="text-lg font-medium text-[#9B2033] leading-5">Technology Innovation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Speaking Sessions Section */}
      <div className="flex justify-center w-full max-w-[1280px]">
        <h3 className="text-2xl font-medium text-[#282828] leading-6 tracking-tight">
          Speaking Sessions (3)
        </h3>
      </div>

      {/* Sessions Grid */}
      <div className="flex flex-row flex-wrap justify-center gap-6 w-full max-w-[1280px]">
        {sessions.map((session, index) => (
          <SpeakerSession
            key={index}
            title={session.title}
            time={session.time}
            duration={session.duration}
            room={session.room}
            type={session.type}
            typeColor={session.typeColor}
            typeTextColor={session.typeTextColor}
          />
        ))}
      </div>

      {/* Connect & Contact Section */}
      <div className="w-full max-w-[1280px] p-6 bg-white border border-gray-300 shadow-sm rounded-2xl">
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-semibold text-[#282828] leading-7">
            Connect & Contact
          </h3>
          <div className="flex flex-row gap-2">
            <div className="flex-1 p-10 border border-gray-300 rounded-lg flex items-center justify-center gap-2.5">
              <Image src="/images/linkedin.png" alt="LinkedIn" width={24} height={24} />
              <span className="text-base text-black leading-5">LinkedIn</span>
            </div>
            <div className="flex-1 p-10 border border-gray-300 rounded-lg flex items-center justify-center gap-2.5">
            <Image src="/images/facebook.png" alt="Facebook" width={24} height={24} />
              <span className="text-base text-black leading-5">Facebook</span>
            </div>
            <div className="flex-1 p-10 border border-gray-300 rounded-lg flex items-center justify-center gap-2.5">
             <Image src="/images/web.png" alt="Website" width={24} height={24} />
              <span className="text-base text-black leading-5">Website</span>
            </div>
            <div className="flex-1 p-10 border border-gray-300 rounded-lg flex items-center justify-center gap-2.5">
              <Image src="/images/gmail.png" alt="Email" width={24} height={24} />
              <span className="text-base text-black leading-5">Email</span>
            </div>
          </div>
        </div>
      </div>
        <img src="/images/line.png" alt="Logo" width={1729} height={127} className="absolute top-[1710px]" />
    </div>
  );
};

export default SpeakerDetails;
