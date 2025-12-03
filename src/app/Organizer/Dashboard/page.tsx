"use client";

import React, { useState, useEffect } from "react";
import Image from 'next/image'
import {
  FaUsers,
  FaCalendarAlt,
  FaMicrophone,
  FaHandshake,
  FaTv,
  FaBullhorn,
  FaUserPlus, FaQrcode,
  FaCheckCircle, FaClipboardList,
  FaArrowRight, FaFileAlt, FaQuestionCircle
} from "react-icons/fa";
import OptIn from "./../../components/opt-in"
import { FaUserCheck, FaChalkboardTeacher, FaCalendarCheck } from "react-icons/fa"


import TodaysSchedule from "@/app/components/TodaysSchedule";
import Link from "next/link";
import api from "@/config/api";

const quickAccessItems = [
  { label: "Manage Participants", desc: "Directory & search", Icon: FaUsers, color: "text-blue-500", Link: "/Organizer/ManageParticipants" },
  { label: "Manage Sessions", desc: "Create & edit sessions", Icon: FaCalendarAlt, color: "text-green-500", Link: "/Organizer/ManageSessions" },
  { label: "Manage Speakers", desc: "Update profiles & bios", Icon: FaMicrophone, color: "text-red-500", Link: "/Organizer/ManageSpeaker" },
  { label: "Sponsors", desc: "Manage exhibitors", Icon: FaHandshake, color: "text-yellow-500", Link: "/Organizer/ManageSponsor" },
  { label: "Manage Teams", desc: "Manage and update participant details", Icon: FaClipboardList, color: "text-purple-500", Link: "/Organizer/Registrationteam" },
  { label: "Announcement", desc: "Send Updates", Icon: FaBullhorn, color: "text-orange-500", Link: "/Organizer/ManageAnnouncements" },
  { label: "Opt In/Out", desc: "Manage preferences", Icon: OptIn, color: "text-pink-500", Link: null }
];

type Participant = {
  name: string
  email: string
  file: string | null
}

type StatData = {
  label: string
  value: number | string
  percent: string
  change: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatData[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  // Map label to icon dynamically
  const iconMap: { [key: string]: React.ReactNode } = {
    "total registrations": <FaUserPlus className="text-blue-500 text-xl" />,
    "checked in today": <FaCheckCircle className="text-green-500 text-xl" />,
    "active sessions": <FaTv className="text-purple-500 text-xl" />,
    "total speakers": <FaMicrophone className="text-red-500 text-xl" />,
    "total sponsors": <FaHandshake className="text-yellow-500 text-xl" />,
    "recent participants": <FaUsers className="text-orange-500 text-xl" />,
  };

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);

      const cachedData = sessionStorage.getItem("dashboardData");
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        setStats(parsed.stats);
        setParticipants(parsed.participants);
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/admin/users/dashboard");

        const dynamicStats: StatData[] = [
          { label: "Total Registrations", value: data.countTotalRegistration, percent: "2.3%", change: `+${data.countTotalRegistration - 1}` },
          { label: "Checked In Today", value: data.totalCheckin, percent: "1.5%", change: `+${data.totalCheckin - 0}` },
          { label: "Active Sessions", value: data.totalActiveSession, percent: "0.5%", change: `+${data.totalActiveSession - 1}` },
          { label: "Total Speakers", value: data.totalSpeaker, percent: "3.0%", change: `+${data.totalSpeaker - 1}` },
          { label: "Total Sponsors", value: data.totalSponsor, percent: "4.2%", change: `+${data.totalSponsor - 1}` },
          { label: "Recent Participants", value: data.totalExhibitor, percent: "2.8%", change: `+${data.totalExhibitor - 1}` },
        ];

        const participantList = data.recentUsers.map((user: any) => ({
          name: user.name,
          email: user.email,
          file: user.file || "/Images/default-user.png",
        }));

        setStats(dynamicStats);
        setParticipants(participantList);

        sessionStorage.setItem("dashboardData", JSON.stringify({ stats: dynamicStats, participants: participantList }));

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  return (
    <div className="container mx-auto max-w-6xl p-4 space-y-8 bg-[#F9F9F9] min-h-screen">

      <TodaysSchedule />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="bg-gray-100 animate-pulse h-28 rounded-xl" />
          ))
        ) : (
          stats.map((item, idx) => (
            <div key={idx} className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-red-900 transition">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center">
                  {iconMap[item.label.toLowerCase()]}
                </div>
                <div className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                  ▲ {item.percent}
                </div>
              </div>
              <p className="text-[22px] font-bold text-black mb-1">{item.value} <span className="text-green-600 text-sm font-semibold">{item.change}</span></p>
              <p className="text-sm text-gray-600">{item.label}</p>
            </div>
          ))
        )}
      </div>

      {/* Quick Access */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-6 text-black">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {quickAccessItems.map((item) => {
            const Icon = item.Icon
            const content = (
              <div className="flex flex-col justify-center items-center text-center bg-white border border-gray-300 rounded-xl p-4 hover:shadow-md hover:border-red-900 transition cursor-pointer h-full">
                <Icon className={`text-3xl mb-2 ${item.color}`} />
                <p className="font-semibold text-black text-sm">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            )

            return item.Link ? (
              <Link href={item.Link} key={item.label} className="h-full">
                {content}
              </Link>
            ) : (
              <div key={item.label} className="h-full">
                {content}
              </div>
            )
          })}
        </div>
      </section>


      {/* Tools & Support */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-6 text-black">Tools & Support</h2>
        <div className="flex flex-wrap gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex-1 min-w-[250px] flex items-center justify-between border border-gray-300 rounded-xl p-4 animate-pulse h-20" />
            ))
          ) : (
            [
              { title: "Reports", desc: "Analytics & exports", icon: <FaFileAlt size={24} color="#0B3D91" />, bg: "bg-[#E3FFF7]", href: "/Organizer/Report" },
              { title: "Manage FAQ", desc: "Help & guidance", icon: <FaQuestionCircle size={24} color="#9B2033" />, bg: "bg-[#FFF3F3]", href: "/Organizer/ManageFAQS" },
              { title: "Import Participants", desc: "Upload CSV files", icon: <FaUserPlus size={24} color="#0B3D91" />, bg: "bg-[#E3F0FF]", href: "/Organizer/DataImport" },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="flex-1 min-w-[250px] flex items-center justify-between border border-gray-300 rounded-xl p-4 hover:shadow-md hover:border-red-900 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`${item.bg} p-2 rounded-md`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-black text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
                <div className="text-red-900 text-lg font-bold">
                  <FaArrowRight />
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-6 text-black">QR Scanner</h2>
        <div className="flex flex-wrap gap-4">
          {[
            { title: "Profile Check", desc: "Verify participant,Speakers etc info", icon: <FaUserCheck size={24} color="#0B3D91" />, bg: "bg-[#E3FFF7]", href: "/Organizer/QrScanner" },
            { title: "Class Master Registration ", desc: "Confirm class registrations", icon: <FaChalkboardTeacher size={24} color="#9B2033" />, bg: "bg-[#FFF3F3]", href: "/registrationteam/CheckEeventRegistration" },
            { title: "Session Registrations", desc: "Verify session registrations", icon: <FaCalendarCheck size={24} color="#0B3D91" />, bg: "bg-[#FFF8E3]", href: "/registrationteam/Sessions" },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="flex-1 min-w-[250px] flex items-center justify-between border border-gray-300 rounded-xl p-4 hover:shadow-md hover:border-red-900 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`${item.bg} p-2 rounded-md`}>
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-black text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
              <div className="text-red-900 text-lg font-bold">
                <FaArrowRight />
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* Recent Participants */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-black">Recent Participants</h2>
      </div>

      <section className="p-6 bg-white rounded-xl shadow-sm">
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-4 animate-pulse mb-3 h-12 bg-gray-100 rounded-full" />
          ))
        ) : participants.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-6">No participants exist</p>
        ) : (
          participants.map((participant, index) => (
            <div key={index} className="flex flex-col my-1 sm:flex-row sm:items-center sm:justify-between border border-gray-200 rounded-full p-3 gap-2 sm:gap-4 hover:border-red-900 transition">
              <img
                src={participant.file || "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"}
                alt={participant.name || "Default Avatar"}
                onError={(e) => { e.currentTarget.src = "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"; }}
                className="rounded-full object-cover w-10 h-10"
              />
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full text-sm text-gray-700">
                <h3 className="font-semibold text-black">{participant.name}</h3>
                <p>{participant.email}</p>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
