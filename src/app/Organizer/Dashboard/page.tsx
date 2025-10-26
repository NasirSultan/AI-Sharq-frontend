"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaHandshake,
  FaMicrophone,
  FaTv,
  FaUserPlus,
  FaUsers,
  FaSearch,
} from "react-icons/fa";
import TodaysSchedule from "@/app/components/TodaysSchedule";
import Link from "next/link";
import api from "@/config/api";

const filters = ["Daily", "Weekly", "10 Days", "90 Days", "All Time"];

const quickAccessItems = [
  { label: "Manage Participants", desc: "Directory & search", Image: "/Images/div2.png", Link: "/Organizer/ManageParticipants" },
  { label: "Manage Sessions", desc: "Create & edit sessions", Image: "/Images/div2.png", Link: "/Organizer/ManageSessions" },
  { label: "Manage Speakers", desc: "Update profiles & bios", Image: "/Images/div3.png", Link: "/Organizer/ManageSpeaker" },
  { label: "Sponsors", desc: "Manage exhibitors", Image: "/Images/div4.png", Link: "/Organizer/ManageSponsor" },
  { label: "Venue Maps", desc: "Upload & update maps", Image: "/Images/div5.png", Link: "/Organizer/VenueMaps" },
  { label: "Announcement", desc: "Send Updates", Image: "/Images/div6.png", Link: "/Organizer/ManageAnnouncements" },
];

type Participant = {
  name: string
  email: string
  file: string | null
  Image: string
}

type Stat = {
  label: string
  value: number | string
  percent: string
  change: string
  icon: React.ReactNode
}

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState("Daily");
  const [stats, setStats] = useState<Stat[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const { data } = await api.get("/admin/users/dashboard");

        // dynamically calculate change as difference from value-1
        const dynamicStats: Stat[] = [
          { label: "Total Registrations", value: data.countTotalRegistration, percent: "2.3%", change: `+${data.countTotalRegistration - 1}`, icon: <FaUserPlus className="text-blue-500 text-xl" /> },
          { label: "Checked In Today", value: data.totalCheckin, percent: "1.5%", change: `+${data.totalCheckin - 0}`, icon: <FaCheckCircle className="text-green-500 text-xl" /> },
          { label: "Active Sessions", value: data.totalActiveSession, percent: "0.5%", change: `+${data.totalActiveSession - 1}`, icon: <FaTv className="text-purple-500 text-xl" /> },
          { label: "Total Speakers", value: data.totalSpeaker, percent: "3.0%", change: `+${data.totalSpeaker - 1}`, icon: <FaMicrophone className="text-red-500 text-xl" /> },
          { label: "Total Sponsors", value: data.totalSponsor, percent: "4.2%", change: `+${data.totalSponsor - 1}`, icon: <FaHandshake className="text-yellow-500 text-xl" /> },
          { label: "Total Participants", value: data.totalExhibitor, percent: "2.8%", change: `+${data.totalExhibitor - 1}`, icon: <FaUsers className="text-orange-500 text-xl" /> },
        ];

        setStats(dynamicStats);

        setParticipants(
          data.recentUsers.map((user: any) => ({
            name: user.name,
            email: user.email,
   file: user.file ? user.file : "/Images/default-user.png",

          }))
        );

      } catch (err) {
        console.error(err);
      }
    }

    fetchDashboard();
  }, []);

  return (
    <div className="p-2 space-y-8 bg-[#F9F9F9] min-h-screen">
      <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
        <div className="flex bg-white border border-gray-300 rounded-md px-3 py-2 w-full md:w-[300px]">
          <FaSearch className="text-red-900 mr-2" />
          <input type="text" placeholder="Search" className="outline-none text-sm w-full" />
        </div>
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-4 py-1 rounded-xl text-sm font-medium ${activeFilter === filter ? "bg-[#86002B] text-white" : "bg-white border border-gray-300 text-black"}`}>
              {filter}
            </button>
          ))}
        </div>
        <div className="flex items-center border border-gray-300 bg-white px-3 py-2 rounded-md text-sm text-gray-700">
          <FaCalendarAlt className="mr-2 text-gray-500" />
          Jan 2024 - Dec 2024
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-9">
        {stats.map((item, idx) => (
          <div key={idx} className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-3">
              <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center">{item.icon}</div>
              <div className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">▲ {item.percent}</div>
            </div>
            <p className="text-[22px] font-bold text-black mb-1">
              {item.value} <span className="text-green-600 text-sm font-semibold">{item.change}</span>
            </p>
            <p className="text-sm text-gray-600">{item.label}</p>
          </div>
        ))}
      </div>

      <TodaysSchedule />

      {/* Quick Access */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-6 text-black">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {quickAccessItems.map((item) => (
            <Link href={item.Link} key={item.label}>
              <div className="flex flex-col items-center text-center bg-white border border-gray-300 rounded-xl p-4 hover:shadow-md transition cursor-pointer">
                <Image src={item.Image} alt={item.label} width={40} height={40} className="mb-2" />
                <p className="font-semibold text-black text-sm">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-6 text-black">
          Tools & Support
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Box 1 */}
          <div className="flex items-center justify-between border border-gray-300 rounded-xl p-4 hover:shadow-md transition cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-md">
                <Image
                  src="/Images/qr.png"
                  alt="QR Scanner"
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <p className="font-semibold text-black text-sm">QR Scanner</p>
                <p className="text-xs text-gray-500">Validate check-ins</p>
              </div>
            </div>
            <span className="text-[#9B2033] text-lg font-bold">
              <Link href="/Organizer/Dashboard">
                <FaArrowRight />
              </Link>
            </span>
          </div>

          {/* Box 2 */}
          <div className="flex items-center justify-between border border-gray-300 rounded-xl p-4 hover:shadow-md transition cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="bg-[#E3FFF7] p-2 rounded-md">
                <Image
                  src="/Images/reports.png"
                  alt="Reports"
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <p className="font-semibold text-black text-sm">Reports</p>
                <p className="text-xs text-gray-500">Analytics & exports</p>
              </div>
            </div>
            <span className="text-[#9B2033] text-lg font-bold">
              <Link href="/Organizer/Report">
                <FaArrowRight />
              </Link>
            </span>
          </div>

          {/* Box 3 */}
          <div className="flex items-center justify-between border border-gray-300 rounded-xl p-4 hover:shadow-md transition cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="bg-[#FFF3F3] p-2 rounded-md">
                <Image
                  src="/Images/Faqs.png"
                  alt="Manage FAQ"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <p className="font-semibold text-black text-sm">Manage FAQ</p>
                <p className="text-xs text-gray-500">Help & guidance</p>
              </div>
            </div>
            <span className="text-[#9B2033] text-lg font-bold">
              <Link href="/Organizer/Dashboard">
                <FaArrowRight />
              </Link>
            </span>
          </div>
        </div>
      </section>
      {/* Recent Participants */}
      <div className="flex justify-between items-center mb-4 ml-10">
        <h2 className="text-lg font-semibold text-black">Recent Participants</h2>
        <a href="#" className="text-sm text-gray-600 hover:underline">View All</a>
      </div>

      <section className="p-6 bg-white rounded-xl shadow-sm max-w-8xl mx-auto">
        <div className="space-y-3">
          {participants.map((participant, index) => (
            <div key={index} className="flex items-center space-x-4 border border-gray-200 rounded-full p-3">
<img
  src={participant.file ? participant.file : "/Images/default-user.png"}
  alt={participant.name}
  width={40}
  height={40}
  className="rounded-full object-cover"
  style={{ width: "40px", height: "40px" }}
/>



              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full text-sm text-gray-700">
                <h3 className="font-semibold text-black">{participant.name}</h3>

                <p>{participant.email}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
