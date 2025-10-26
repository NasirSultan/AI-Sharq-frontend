'use client';

import { FaArrowLeft, FaElevator, FaEnvelope, FaGlobe, FaPhone, FaShop } from "react-icons/fa6";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaDoorOpen,
  FaNetworkWired,
  FaUsers,
  FaWifi,
  FaUtensils,
  FaCar,
  FaInfoCircle,
  FaYoutube,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

const LiveLocation1 = dynamic(() => import("@/app/components/LiveLocation1"), {
  ssr: false,
});
import Image from "next/image";
import dynamic from "next/dynamic";

export default function VenueDetail() {
  return (
    <><div className="relative w-full min-h-screen bg-[#F9F9F9]">
      {/* Top Image Section */}
      <div
        className="w-full h-[231px] bg-cover bg-center relative"
        style={{ backgroundImage: 'url(/images/building.jpg)' }}
      >
        {/* Back Button */}
        <div className="absolute top-5 left-5">
          <Link href="/Organizer/VenueMaps">
            <FaArrowLeft className="text-red-800 w-5 h-5 cursor-pointer" />
          </Link>
        </div>

        {/* Exhibitor Label */}
        <div className="absolute flex items-center gap-2 top-10 right-10 bg-[#FFFEEF] px-4 py-2 rounded-full">
          <FaShop className="text-green-400 w-5 h-5" />
          <span className="text-[#282828] text-base font-medium">Exhibitors</span>
        </div>
      </div>

      {/* Circle Logo & Label */}
      <div className="absolute top-[190px] left-[80px]">
        <div className="w-[140px] h-[150px] rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-md p-2">
          <span className="text-white font-bold text-xs text-cente break-words">
            GrandConventionCenter
          </span>
        </div>

      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto mt-[140px] px-6">
        {/* Contact Sponsor Button */}
        <button className="bg-[#9B2033] text-white px-6 py-2 rounded-md font-medium text-sm mb-6">
          Contact Sponsor
        </button>

        {/* Info Sections */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left - Description Box */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full lg:w-[940px] shadow-sm">
            <h2 className="text-lg font-semibold text-[#282828] mb-3">TechCorp Solutions</h2>
            <p className="text-sm text-[#424242] leading-relaxed">
              TechWorld Inc. is a leading provider of enterprise software solutions and digital transformation services,
              helping Fortune 500 companies worldwide streamline operations, enhance productivity, and embrace innovation.
              With decades of experience across multiple industries, TechWorld specializes in creating customized technology
              solutions that drive growth, improve customer experiences, and enable organizations to stay competitive in
              an ever-evolving digital landscape. Committed to excellence, TechWorld combines cutting-edge tools, expert
              consulting, and best-in-class support to deliver measurable business outcomes and empower companies to achieve
              their strategic goals.
            </p>
          </div>

          {/* Right - Contact Info */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full lg:w-[325px] shadow-sm">
            <h2 className="text-lg font-semibold text-[#282828] mb-4">Contact Information</h2>

            <div className="space-y-6">
              {/* Website */}
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <FaGlobe className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Website</p>
                  <p className="text-sm text-blue-600">www.techcorp.com</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-green-100 rounded-2xl flex items-center justify-center">
                  <FaEnvelope className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-black">contact@techcorp.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <FaPhone className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-sm text-black">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div><br></br>
      {/* Additional Venue Details Section */}
      <div className="w-full max-w-7xl mx-auto mb-6 ">
        <div className="flex justify-between bg-white border py-4 border-gray-300 rounded-xl overflow-hidden">
          {/* Hall A - Active */}
          <button className="bg-[#9B2033] text-white px-30 py-2 text-sm ml-10 font-semibold rounded-xl m-1">
            Hall A
          </button>

          {/* Hall B */}
          <button className="text-[#282828] px-6 py-2 text-sm font-semibold mr-25">
            Hall B
          </button>

          {/* Coffee Lounge */}
          <button className="text-[#282828] px-6 py-2 text-sm font-semibold mr-10">
            Coffee Lounge
          </button>
        </div>
      </div>





      <br></br>
      {/* Layout Image */}
      <div className="max-w-7xl h-[350px]  ml-25 bg-gray-200 rounded-xl overflow-hidden mb-10">
        <img
          src="/images/Rectangle 161123901.png" // Replace this with your actual image path
          alt="Hall Layout"
          className="w-full h-full object-cover" />
      </div>


      <div className="max-w-7xl mx-auto px-6 my-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Locations Box */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#282828] mb-4">Locations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hall A */}
              <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                <div className="w-9 h-9 bg-red-100 rounded-2xl flex items-center justify-center">
                  <FaMapMarkerAlt className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#282828]">Hall A</p>
                  <p className="text-sm text-gray-500">Main Auditorium</p>
                </div>
              </div>

              {/* Hall B */}
              <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                <div className="w-9 h-9 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <FaDoorOpen className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#282828]">Hall B</p>
                  <p className="text-sm text-gray-500">Conference Room</p>
                </div>
              </div>

              {/* Exhibitions */}
              <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                <div className="w-9 h-9 bg-green-100 rounded-2xl flex items-center justify-center">
                  <FaUsers className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#282828]">Exhibitions</p>
                  <p className="text-sm text-gray-500">Sponsor Booth</p>
                </div>
              </div>

              {/* Networking */}
              <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                <div className="w-9 h-9 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <FaNetworkWired className="text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#282828]">Networking</p>
                  <p className="text-sm text-gray-500">Coffee Lounge</p>
                </div>
              </div>
            </div>
          </div>

          {/* Facilities Box */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#282828] mb-4">Facilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Restrooms */}
              <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                <div className="w-9 h-9 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <FaUsers className="text-gray-600" />
                </div>
                <p className="text-sm font-medium text-[#282828]">Restrooms</p>
              </div>

              {/* WiFi Zone */}
              <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                <div className="w-9 h-9 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <FaWifi className="text-blue-600" />
                </div>
                <p className="text-sm font-medium text-[#282828]">WiFi Zone</p>
              </div>

              {/* Food Court */}
              <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                <div className="w-9 h-9 bg-yellow-100 rounded-2xl flex items-center justify-center">
                  <FaUtensils className="text-yellow-600" />
                </div>
                <p className="text-sm font-medium text-[#282828]">Food Court</p>
              </div>

              {/* Parking */}
              <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                <div className="w-9 h-9 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <FaCar className="text-purple-600" />
                </div>
                <p className="text-sm font-medium text-[#282828]">Parking</p>
              </div>

              {/* Elevators */}
              <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                <div className="w-9 h-9 bg-green-100 rounded-2xl flex items-center justify-center">
                  <FaElevator className="text-green-600" />
                </div>
                <p className="text-sm font-medium text-[#282828]">Elevators</p>
              </div>

              {/* Info Desk */}
              <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                <div className="w-9 h-9 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <FaInfoCircle className="text-indigo-600" />
                </div>
                <p className="text-sm font-medium text-[#282828]">Info Desk</p>
              </div>
            </div>
          </div>
        </div>
      </div>




      {/* Live Location Map with Booth Info */}
      <div className="w-full mx-auto mb-10 px-9">
        <LiveLocation1 />
      </div>
      {/* Follow Us Section */}
      <div className="flex flex-col items-start gap-3 w-full mt-8 max-w-xs ml-15">
        <h2 className="text-2xl font-medium text-[#282828] mb-4">Follow Us</h2>
        <div className='flex flex-row gap-[70px]'>
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


    </div><br></br>
    <Image src="/images/line.png" alt="Logo" width={1729} height={127} className="absolute top-" /></>



  );
}
