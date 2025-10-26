'use client';

import React from 'react';
import Image from 'next/image';
import { FaGlobe, FaEnvelope, FaPhone, FaArrowLeft, FaSearch } from 'react-icons/fa';
import { FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';
import SpeakerSession from '@/app/components/SpeakerSession';
import { FaShop } from 'react-icons/fa6';
// ✅ Replace with this:
import dynamic from 'next/dynamic';
const LiveLocation = dynamic(() => import('@/app/components/LiveLocation'), {
  ssr: false, // disables server-side rendering
});
import Link from 'next/link';


const SponsorsDetailsScreen: React.FC = () => {
  return (
    <div className="relative w-full h-screen">
      {/* Rectangle 161123900 */}
      <div
        className="absolute w-[1440px] h-[231px]  bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/building.jpg)' }}
      >
        {/* Arrow Back Button */}
        <div className="absolute w-[40px] h-[40px] left-[20px] top-[20px] rounded-full flex items-center justify-center cursor-pointer">

          <Link href="/participants/Sponsors&Exhibitors">
            <FaArrowLeft className="text-red-800 w-[20px] h-[20px] cursor-pointer" />
          </Link>        </div>
        {/* Gold Sponsors Label with Crown */}
        <div className="absolute flex flex-row justify-center items-center gap-2 left-[1149px] top-[39px] w-[211.25px] h-[37px] bg-[#FFFEEF] rounded-full px-3 py-2">
          <FaShop className="text-green-400 w-[20.25px] h-[15.75px] flex-none" />
          <span className="text-[#282828] font-medium text-2xl leading-6 tracking-tight font-['IBM_Plex_Sans']">
            Exhibitors
          </span>
        </div>


      </div>

      {/* Group 1597884762 */}
      <div
        className="absolute w-[177px] h-[177px] top-[140px]"
        style={{ left: 'calc(50% - 177px/2 - 550.5px)' }}
      >
        {/* img */}
        <div
          className="absolute w-[177px] h-[177px] left-0 top-0 rounded-full"
          style={{ background: 'linear-gradient(90deg, #FB923C 0%, #EA580C 100%)' }}
        />
        {/* CloudTech */}
        <div className="absolute w-[119px] h-[17px] left-[29px] top-[80px] text-white flex items-center justify-center">
          <span className="text-bold font-medium text-black">CloudTech</span>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="absolute w-[1280px] h-[1336px] left-[80px] top-[351px] flex flex-col gap-11">

        {/* Contact Sponsor Button */}
        <button className="w-44 h-12 bg-[#9B2033] text-white rounded-md font-medium text-base mb-4 p-3 flex items-center justify-center">
          Contact Sponsor
        </button>
        <div className="flex flex-row gap-5 w-full h-[241px]">
          {/* Company Description */}
          <div className="w-[940px] h-[270px] p-8 bg-white border border-gray-300 shadow-sm rounded-2xl flex flex-col gap-6">
            <div className="flex flex-row gap-6 w-full h-[147px]">
              <div className="flex flex-col gap-4 w-full">
                <h2 className="text-lg font-semibold text-[#282828]">TechCorp Solutions</h2>
                <p className="text-sm text-[#424242] leading-5">
                  TechWorld Inc. is a leading provider of enterprise software solutions and digital transformation services, helping Fortune 500 companies worldwide streamline operations, enhance productivity, and embrace innovation. With decades of experience across multiple industries, TechWorld specializes in creating customized technology solutions that drive growth, improve customer experiences, and enable organizations to stay competitive in an ever-evolving digital landscape. Committed to excellence, TechWorld combines cutting-edge tools, expert consulting, and best-in-class support to deliver measurable business outcomes and empower companies to achieve their strategic goals.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="w-[325px] h-[270px] p-8 bg-white border border-gray-300 shadow-sm rounded-2xl flex flex-col gap-3">
            {/* Contact Sponsor Button */}


            <h2 className="text-lg font-semibold text-[#282828]">Contact Information</h2>
            <div className="flex flex-col gap-6">
              {/* Website */}
              <div className="flex flex-row items-center gap-4">
                <div className="w-9 h-9 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <FaGlobe className="text-blue-600" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">Website</span>
                  <span className="text-sm text-blue-600">www.techcorp.com</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-row items-center gap-4">
                <div className="w-9 h-9 bg-green-100 rounded-2xl flex items-center justify-center">
                  <FaEnvelope className="text-green-600" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">Email</span>
                  <span className="text-sm text-black">contact@techcorp.com</span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-row items-center gap-4">
                <div className="w-9 h-9 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <FaPhone className="text-purple-600" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">Phone</span>
                  <span className="text-sm text-black">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Representatives and Products & Services Row */}
        <div className="flex flex-row gap-5 w-full">
          {/* Representatives Section */}
          <div className="w-[625px] h-[389px] p-10 bg-white border border-gray-300 shadow-sm rounded-2xl flex flex-col gap-10">
            <h2 className="text-2xl font-medium text-[#282828]">Representatives</h2>
            <div className="flex flex-col gap-3">
              {/* Ahmed Al-Rashid */}
              <div className="w-full h-18 p-4 bg-white border border-gray-200 shadow-sm rounded-lg flex flex-row justify-between items-center">
                <div className="flex flex-row items-center gap-3">
                  <Image src="/images/Ahmed.png" alt="Ahmed Al-Rashid" width={40} height={40} className="rounded-full" />
                  <div className="flex flex-col gap-2">
                    <span className="text-base font-medium text-[#282828]">Ahmed Al-Rashid</span>
                    <span className="text-sm text-gray-600">Tech Solutions Inc.</span>
                  </div>
                </div>
                <span className="text-base font-medium text-red-700">Connect</span>
              </div>

              {/* Sarah Mitchell */}
              <div className="w-full h-18 p-4 bg-white border border-gray-200 shadow-sm rounded-lg flex flex-row justify-between items-center">
                <div className="flex flex-row items-center gap-3">
                  <Image src="/images/Sara.png" alt="Sarah Mitchell" width={40} height={40} className="rounded-full" />
                  <div className="flex flex-col gap-2">
                    <span className="text-base font-medium text-[#282828]">Sarah Mitchell</span>
                    <span className="text-sm text-gray-600">Innovation Labs</span>
                  </div>
                </div>
                <span className="text-base font-medium text-red-700">Connect</span>
              </div>

              {/* David Chen */}
              <div className="w-full h-18 p-4 bg-white border border-gray-200 shadow-sm rounded-lg flex flex-row justify-between items-center">
                <div className="flex flex-row items-center gap-3">
                  <Image src="/images/drAhmad.jpg" alt="David Chen" width={40} height={40} className="rounded-full" />
                  <div className="flex flex-col gap-2">
                    <span className="text-base font-medium text-[#282828]">David Chen</span>
                    <span className="text-sm text-gray-600">Creative Minds Co.</span>
                  </div>
                </div>
                <span className="text-base font-medium text-red-700">Connect</span>
              </div>
            </div>
          </div>

          {/* Products & Services Section */}
          <div className="w-[625px] h-[389px] p-10 bg-white border border-gray-300 shadow-sm rounded-2xl flex flex-col gap-10">
            <h2 className="text-2xl font-medium text-[#282828]">Products & Services</h2>
            <div className="flex flex-col gap-3">
              {/* Cloud Infrastructure */}
              <div className="w-full h-16 p-4 bg-white border border-gray-200 shadow-sm rounded-lg flex flex-row items-center gap-4">
                <div className="w-9 h-9 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <FaGlobe className="text-blue-600" />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <span className="text-base font-medium text-[#282828]">Cloud Infrastructure</span>
                  <span className="text-sm text-gray-600">Scalable cloud computing solutions for enterprise applications</span>
                </div>
              </div>

              {/* Data Analytics */}
              <div className="w-full h-16 p-4 bg-white border border-gray-200 shadow-sm rounded-lg flex flex-row items-center gap-4">
                <div className="w-9 h-9 bg-green-100 rounded-2xl flex items-center justify-center">
                  <FaEnvelope className="text-green-600" />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <span className="text-base font-medium text-[#282828]">Data Analytics</span>
                  <span className="text-sm text-gray-600">Business intelligence and data visualization platforms</span>
                </div>
              </div>

              {/* Security Solutions */}
              <div className="w-full h-16 p-4 bg-white border border-gray-200 shadow-sm rounded-lg flex flex-row items-center gap-4">
                <div className="w-9 h-9 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <FaPhone className="text-purple-600" />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <span className="text-base font-medium text-[#282828]">Security Solutions</span>
                  <span className="text-sm text-gray-600">Enterprise-grade security and compliance tools</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* live location */}



        {/* Search/Filter Bar */}
        <div className="flex flex-row items-start gap-[16px] w-[1280px] h-[44px]">
          {/* Frame 1000004777 */}
          <div className="flex flex-row items-center gap-[13px] w-[972px] h-[44px]">
            {/* Search Input with Red Background */}
            <div className="flex flex-col justify-center items-center p-[14px_20px] gap-[10px] w-[972px] h-[44px] bg-[#9B2033] border border-[#9B2033] rounded-[10px]">
              <div className="flex flex-row justify-center items-end gap-[12px] w-[932px] h-[16px]">
                <div className="flex flex-row items-center gap-[8px] w-[118px] h-[16px]">
                  {/* Search Icon Placeholder */}
                  <FaSearch className="text-white w-[16px] h-[16px]" />

                  <span className="text-[14px] font-bold text-white font-['IBM_Plex_Sans'] leading-[10px]">
                    Search booths...
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Input with White Background */}
          <div className="flex flex-col justify-center items-center p-[14px_20px] gap-[10px] w-[292px] h-[44px] border border-[#E8E8E8] rounded-[10px]">
            <div className="flex flex-row justify-center items-end gap-[12px] w-[252px] h-[10px]">
              <div className="flex flex-row items-center gap-[8px] w-[59px] h-[10px]">
                <span className="text-[14px] font-bold text-[#282828] font-['IBM_Plex_Sans'] leading-[10px]">
                  Filter
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions Sponsored Section */}
        <div className="flex flex-row justify-between items-center w-full">
          <h2 className="text-2xl font-medium text-[#282828]">Sessions Sponsored</h2>
          <span className="text-base font-medium text-[#282828] cursor-pointer">View All</span>
        </div>

        <div className="flex flex-row gap-6 w-full h-[419px]">
          <SpeakerSession
            title="Exploring the role of diplomacy and collaboration in shaping future policies"
            time="2:00 PM – 3:30 PM"
            duration="90 minutes"
            room="Hall B"
            type="Female"
            typeColor="#91C6FF"
            typeTextColor="#1E40AF"
          />
          <SpeakerSession
            title="Exploring the role of diplomacy and collaboration in shaping future policies"
            time="10:00 AM – 11:30 AM"
            duration="90 minutes"
            room="Hall B"
            type="Female"
            typeColor="#E9EB87"
            typeTextColor="#606C38"
          />
          <SpeakerSession
            title="Exploring the role of diplomacy and collaboration in shaping future policies"
            time="4:00 PM – 5:00 PM"
            duration="90 minutes"
            room="Room C2"
            type="Female"
            typeColor="#F3E8FF"
            typeTextColor="#6B21A8"
          />
        </div>

        {/* Follow Us Section */}
        <div className="flex flex-col items-start gap-4 w-full mt-8 max-w-xs">
          <h2 className="text-2xl font-medium text-[#282828] mb-4">Follow Us</h2>
          <div className='flex flex-row gap-[60px]'>
            <button className="w-full h-12 bg-blue-600 rounded-lg flex items-center justify-center gap-3 flex-none">
              <FaLinkedin className="text-white" />
              <span className="text-base font-normal text-white">LinkedIn</span>
            </button>
            <button className="w-full h-12 bg-blue-400 rounded-lg flex items-center justify-center gap-3 flex-none">
              <FaTwitter className="text-white" />
              <span className="text-base font-normal text-white">Twitter</span>
            </button>
            <button className="w-full h-12 bg-red-500 rounded-lg flex items-center justify-center gap-3 flex-none">
              <FaYoutube className="text-white" />
              <span className="text-base font-normal text-white">Youtube</span>
            </button>
          </div>

        </div>

      </div>
      <Image src="/images/line.png" alt="Logo" width={1729} height={127} className="absolute top-[2510px]" />
    </div>
  );
};

export default SponsorsDetailsScreen;
