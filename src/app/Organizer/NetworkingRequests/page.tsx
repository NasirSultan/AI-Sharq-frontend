"use client"
import React,{useState} from 'react'

import Link from 'next/link';
import { FaArrowLeft, FaSearch, FaCalendarAlt, FaPlay, FaRegListAlt,FaBookmark, FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';


const stats = [
  {
    label: "Total Sessions",
    value: 456,
    change: "+2",
    percent: "2.5%",
    icon: <FaRegListAlt className="text-blue-600" />,
    iconBg: "bg-blue-100",
  },
  {
    label: "Ongoing",
    value: 5,
    change: "+1",
    percent: "1.2%",
    icon: <FaPlay className="text-green-600" />,
    iconBg: "bg-green-100",
  },
  {
    label: "Subscribed",
    value: 12,
    change: "+3",
    percent: "0.8%",
    icon: <FaBookmark className="text-yellow-600" />,
    iconBg: "bg-yellow-100",
  },
];
const filters = ['Daily', 'Weekly', '10 Days', '90 Days', 'All Time'];

export default function page() {
      const [activeFilter, setActiveFilter] = useState('Daily');
  return (
              <div className="p-6 md:p-10 min-h-screen font-sans bg-[#FAFAFA]">

            {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/participants/Home">
            <FaArrowLeft className="text-red-800 w-[20px] h-[20px] cursor-pointer" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900 ml-5" >Networking Requests</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          {/* Search */}
          <div className="flex bg-white border border-gray-300 rounded-md px-3 py-2 w-full md:w-[300px]">
            <FaSearch className="text-red-900 mr-2 mt-1" />
            <input
              type="text"
              placeholder="Search sessions or speakers"
              className="outline-none text-sm w-full"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-3 flex-wrap">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  activeFilter === filter
                    ? 'bg-[#86002B] text-white'
                    : 'bg-white border border-gray-300 text-gray-800'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Date Range */}
          <div className="flex items-center border border-gray-300 bg-white px-3 py-2 rounded-md text-sm text-gray-700">
            <FaCalendarAlt className="mr-2 text-gray-500" />
            Jan 2024 - Dec 2024
          </div>
        </div>


  <div className="px-6 md:px-10 py-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-md ${item.iconBg} flex items-center justify-center mr-4`}
            >
              {item.icon}
            </div>

            {/* Value + Label */}
            <div className="flex-1">
              <p className="text-[22px] font-bold text-black leading-none">
                {item.value}
                <span className="text-green-600 text-sm font-semibold ml-1">
                  {item.change}
                </span>
              </p>
              <p className="text-sm text-gray-600">{item.label}</p>
            </div>

            {/* Percent Change */}
            <div className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
              ▲ {item.percent}
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="flex justify-end text-black">
  <p>View All</p>
</div>
<div className="space-y-6 mt-6">
  {[1, ].map((_, index) => (
    <div key={index} className="flex items-start justify-center gap-4">
      
      {/* Left Box */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 w-[45%] shadow-sm">
        <div className="flex items-start gap-4">
          <img src="/images/img (13).png" alt="Profile" className="w-14 h-14 rounded-full object-cover" />
          <div>
            <h3 className="font-semibold text-gray-900">Dr. Johnathan</h3>
            <p className="text-sm text-gray-500">Johnathan@gmail.com</p>
            <p className="text-sm mt-1 text-gray-600">
              Johnathan is a professor of Political Science at Cairo University, specializing in Middle Eastern politics and international relations.
            </p>
             <div className="flex space-x-2 mt-3">
              <button className="bg-red-800 text-white text-sm px-15 py-2 rounded-md">Block</button>
              <button className="border text-sm px-15 py-2 border-gray-500 text-black rounded-md">View</button>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow + Status in middle */}
      <div className="flex flex-col items-center justify-center w-[5%] mt-5">
        <span className="text-2xl text-red-800"><FaArrowRight></FaArrowRight></span>
        <span className={`mt-2 text-xs font-semibold px-2 py-1 rounded-full ${
          index === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {index === 0 ? 'Approved' : 'Pending'}
        </span>
      </div>

      {/* Right Box */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 w-[45%] shadow-sm">
        <div className="flex items-start gap-4">
          <img src="/images/Sara.png" alt="Profile" className="w-14 h-14 rounded-full object-cover" />
          <div>
            <h3 className="font-semibold text-gray-900">Sarah Johnson</h3>
            <p className="text-sm text-gray-500">SarahJ@gmail.com</p>
            <p className="text-sm mt-1 text-gray-600">
              Sarah is a professor of Political Science at Cairo University, specializing in Middle Eastern politics and international relations.
            </p>
            <div className="flex space-x-2 mt-3">
              <button className="bg-red-800 text-white text-sm px-15 py-2 rounded-md">Block</button>
              <button className="border text-sm px-15 py-2 border-gray-500 text-black rounded-md">View</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  ))}
  <div className="space-y-6 mt-6">
  {[1, ].map((_, index) => (
    <div key={index} className="flex items-start justify-center gap-4">
      
      {/* Left Box */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 w-[45%] shadow-sm">
        <div className="flex items-start gap-4">
          <img src="/images/img (14).png" alt="Profile" className="w-14 h-14 rounded-full object-cover" />
          <div>
            <h3 className="font-semibold text-gray-900">Michael Chen</h3>
            <p className="text-sm text-gray-500">michael@gmail.com</p>
            <p className="text-sm mt-1 text-gray-600">
Dr. Johnathan is a professor of Political Science at Cairo University with expertise in international relations and Middle Eastern diplomacy. She has published extensively on regional cooperation and has advised multiple governments and organizations on policy development.”            </p>
             <div className="flex space-x-2 mt-3">
              <button className="bg-red-800 text-white text-sm px-15 py-2 rounded-md">Block</button>
              <button className="border text-sm px-15 py-2 border-gray-500 text-black rounded-md">View</button>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow + Status in middle */}
      <div className="flex flex-col items-center justify-center w-[5%] mt-5">
        <span className="text-2xl text-red-800"><FaArrowRight></FaArrowRight></span>
        <span className={`mt-2 text-xs font-semibold px-2 py-1 rounded-full ${
          index === 0 ? 'bg-yellow-400 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {index === 0 ? 'Pending' : 'Pending'}
        </span>
      </div>

      {/* Right Box */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 w-[45%] shadow-sm">
        <div className="flex items-start gap-4">
          <img src="/images/img16.jpg" alt="Profile" className="w-14 h-14 rounded-full object-cover" />
          <div>
            <h3 className="font-semibold text-gray-900">Elena Rodriguez</h3>
            <p className="text-sm text-gray-500">SarahJ@gmail.com</p>
            <p className="text-sm mt-1 text-gray-600">
              Sarah is a professor of Political Science at Cairo University, specializing in Middle Eastern politics and international relations.
            </p>
            <div className="flex space-x-2 mt-3">
              <button className="bg-red-800 text-white text-sm px-15 py-2 rounded-md">Block</button>
              <button className="border text-sm px-15 py-2 border-gray-500 text-black rounded-md">View</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  ))}
  <div className="space-y-6 mt-6">
  {[1, ].map((_, index) => (
    <div key={index} className="flex items-start justify-center gap-4">
      
      {/* Left Box */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 w-[45%] shadow-sm">
        <div className="flex items-start gap-4">
          <img src="/images/img15.jpg" alt="Profile" className="w-14 h-14 rounded-full object-cover" />
          <div>
            <h3 className="font-semibold text-gray-900">David Wilson</h3>
            <p className="text-sm text-gray-500">michael@gmail.com</p>
            <p className="text-sm mt-1 text-gray-600">
              Johnathan is a professor of Political Science at Cairo University, specializing in Middle Eastern politics and international relations.
            </p>
             <div className="flex space-x-2 mt-3">
              <button className="bg-red-800 text-white text-sm px-15 py-2 rounded-md">Block</button>
              <button className="border text-sm px-15 py-2 border-gray-500 text-black rounded-md">View</button>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow + Status in middle */}
      <div className="flex flex-col items-center justify-center w-[5%] mt-5">
        <span className="text-2xl text-red-800"><FaArrowRight></FaArrowRight></span>
        <span className={`mt-2 text-xs font-semibold px-2 py-1 rounded-full ${
          index === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {index === 0 ? 'Approved' : 'Pending'}
        </span>
      </div>

      {/* Right Box */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 w-[45%] shadow-sm">
        <div className="flex items-start gap-4">
          <img src="/images/img18.jpg" alt="Profile" className="w-14 h-14 rounded-full object-cover" />
          <div>
            <h3 className="font-semibold text-gray-900">Anna Martinez</h3>
            <p className="text-sm text-gray-500">SarahJ@gmail.com</p>
            <p className="text-sm mt-1 text-gray-600">
              Sarah is a professor of Political Science at Cairo University, specializing in Middle Eastern politics and international relations.
            </p>
            <div className="flex space-x-2 mt-3">
              <button className="bg-red-800 text-white text-sm px-15 py-2 rounded-md">Block</button>
              <button className="border text-sm px-15 py-2 border-gray-500 text-black rounded-md">View</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  ))}
</div>




</div></div>
<div className="space-y-6 mt-6">
  {[1, ].map((_, index) => (
    <div key={index} className="flex items-start justify-center gap-4">
      
      {/* Left Box */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 w-[45%] shadow-sm">
        <div className="flex items-start gap-4">
          <img src="/images/img (13).png" alt="Profile" className="w-14 h-14 rounded-full object-cover" />
          <div>
            <h3 className="font-semibold text-gray-900">Dr. Johnathan</h3>
            <p className="text-sm text-gray-500">Johnathan@gmail.com</p>
            <p className="text-sm mt-1 text-gray-600">
              Johnathan is a professor of Political Science at Cairo University, specializing in Middle Eastern politics and international relations.
            </p>
             <div className="flex space-x-2 mt-3">
              <button className="bg-red-800 text-white text-sm px-15 py-2 rounded-md">Block</button>
              <button className="border text-sm px-15 py-2 border-gray-500 text-black rounded-md">View</button>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow + Status in middle */}
      <div className="flex flex-col items-center justify-center w-[5%] mt-5">
        <span className="text-2xl text-red-800"><FaArrowRight></FaArrowRight></span>
        <span className={`mt-2 text-xs font-semibold px-2 py-1 rounded-full ${
          index === 0 ? 'bg-yellow-300 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {index === 0 ? 'Pending' : 'Pending'}
        </span>
      </div>

      {/* Right Box */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 w-[45%] shadow-sm">
        <div className="flex items-start gap-4">
          <img src="/images/Sara.png" alt="Profile" className="w-14 h-14 rounded-full object-cover" />
          <div>
            <h3 className="font-semibold text-gray-900">Sarah Johnson</h3>
            <p className="text-sm text-gray-500">SarahJ@gmail.com</p>
            <p className="text-sm mt-1 text-gray-600">
              Sarah is a professor of Political Science at Cairo University, specializing in Middle Eastern politics and international relations.
            </p>
            <div className="flex space-x-2 mt-3">
              <button className="bg-red-800 text-white text-sm px-15 py-2 rounded-md">Block</button>
              <button className="border text-sm px-15 py-2 border-gray-500 text-black rounded-md">View</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  ))}</div>
  
  
   <Image src="/images/line.png" alt="Line" width={1450} height={127} className="absolute " />
  
  
  </div>

  )
}
