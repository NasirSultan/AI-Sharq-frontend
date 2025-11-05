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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        const { data } = await api.get("/admin/users/dashboard");

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
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
<div className="container mx-auto max-w-6xl p-4 space-y-8 bg-[#F9F9F9] min-h-screen">

  <TodaysSchedule />

  {/* Stats Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {stats.map((item, idx) => (
      <div
        key={idx}
        className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-red-900 transition"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center">{item.icon}</div>
          <div className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
            ▲ {item.percent}
          </div>
        </div>
        <p className="text-[22px] font-bold text-black mb-1">
          {item.value} <span className="text-green-600 text-sm font-semibold">{item.change}</span>
        </p>
        <p className="text-sm text-gray-600">{item.label}</p>
      </div>
    ))}
  </div>



  {/* Quick Access */}
<section className="bg-white p-6 rounded-xl shadow">
  <h2 className="text-xl font-semibold mb-6 text-black">Quick Access</h2>
  <div className="flex flex-wrap gap-4">
    {quickAccessItems.map((item) => (
      <Link href={item.Link} key={item.label}>
        <div className="flex flex-col items-center text-center bg-white border border-gray-300 rounded-xl p-4 hover:shadow-md hover:border-red-900 transition cursor-pointer">
          <Image src={item.Image} alt={item.label} width={40} height={40} className="mb-2" />
          <p className="font-semibold text-black text-sm">{item.label}</p>
          <p className="text-xs text-gray-500">{item.desc}</p>
        </div>
      </Link>
    ))}
  </div>
</section>


  {/* Tools & Support */}
 <section className="bg-white p-6 rounded-xl shadow">
  <h2 className="text-xl font-semibold mb-6 text-black">Tools & Support</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[
      {
        title: "Reports",
        desc: "Analytics & exports",
        img: "/Images/reports.png",
        link: "/Organizer/Report",
        bg: "bg-[#E3FFF7]",
      },
      {
        title: "Manage FAQ",
        desc: "Help & guidance",
        img: "/Images/Faqs.png",
        link: "/Organizer/Dashboard",
        bg: "bg-[#FFF3F3]",
      },
    ].map((item, idx) => (
      <div
        key={idx}
        className="flex items-center justify-between border border-gray-300 rounded-xl p-4 hover:shadow-md hover:border-red-900 transition cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className={`${item.bg} p-2 rounded-md`}>
            <Image src={item.img} alt={item.title} width={24} height={24} />
          </div>
          <div>
            <p className="font-semibold text-black text-sm">{item.title}</p>
            <p className="text-xs text-gray-500">{item.desc}</p>
          </div>
        </div>
        <span className="text-[#9B2033] text-lg font-bold">
          <Link href={item.link}>
            <FaArrowRight />
          </Link>
        </span>
      </div>
    ))}
  </div>
</section>

  {/* Recent Participants */}
  <div className="flex justify-between items-center">
    <h2 className="text-lg font-semibold text-black">Recent Participants</h2>
  </div>

  <section className="p-6 bg-white rounded-xl shadow-sm">
    {participants.length === 0 ? (
      <p className="text-center text-gray-500 text-sm py-6">No participants exist</p>
    ) : (
      <div className="space-y-3">
        {participants.map((participant, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-200 rounded-full p-3 gap-2 sm:gap-4 hover:border-red-900 transition"
          >
            <img
              src={participant.file || "/Images/default-user.png"}
              alt={participant.name}
              className="rounded-full object-cover w-10 h-10"
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full text-sm text-gray-700">
              <h3 className="font-semibold text-black">{participant.name}</h3>
              <p>{participant.email}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
</div>


  );
}
