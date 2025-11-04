"use client";

import React, { useEffect, useState } from "react";
import TodaysSchedule from "../../components/TodaysSchedule";
import QuickAccess from "../../components/QuickAcess";
import ToolsAndConnections from "../../components/ToolsAndConnections";
import Image from "next/image";
import { FaArrowRight, FaCalendarAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import api from "@/config/api";
import Link from "next/link";
import EventLocationMap from '../../components/EventLocationMap'

interface Banner {
  sessionId: number;
  type: string;
  category: string;
  startTime: string;
  endTime: string;
  subtitle: string;
  bgColor: string;
  textColor: string;
  buttonColor: string;
}

const parseDuration = (duration: string) => {
  const parts = duration.split(" - ");
  if (parts.length === 2) {
    const start = new Date(parts[0].trim());
    const end = new Date(parts[1].trim());
    return {
      startTime: isNaN(start.getTime())
        ? ""
        : start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      endTime: isNaN(end.getTime())
        ? ""
        : end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  }
  return { startTime: "", endTime: "" };
};

const motivationalLines = [
  "Don’t miss this session, it’s full of insights",
  "Join now to learn new skills and ideas",
  "Be part of this session, it’s highly recommended",
];

export default function Home() {
  const eventId = useSelector((state: RootState) => state.event.id);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [nextSessions, setNextSessions] = useState<any[]>([]);
  const [eventInfo, setEventInfo] = useState<{ title: string; description: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [emptyMessage, setEmptyMessage] = useState("");

  const fetchSessions = async () => {
    if (!eventId) {
      setEmptyMessage("Event not selected");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get(`/event/event-sessions/${eventId}`);
      const data = res.data;

      const event = data.allSessions?.[0]?.event || data.liveSessions?.[0]?.event;
      if (event) {
        setEventInfo({
          title: event.eventTitle,
          description: event.eventDescription,
        });
      }

      const liveBanners: Banner[] = (data.liveSessions || []).map((s: any) => {
        const { startTime, endTime } = parseDuration(s.duration);
        return {
          sessionId: s.sessionId,
          type: "Live",
          category: s.category || "N/A",
          startTime,
          endTime,
          subtitle: s.location || "",
          bgColor: "bg-red-800",
          textColor: "text-white",
          buttonColor: "text-white",
        };
      });

      const latestBanners: Banner[] = (data.allSessions || [])
        .filter((s: any) => !s.isLive)
        .slice(0, 1)
        .map((s: any) => {
          const { startTime, endTime } = parseDuration(s.duration);
          return {
            sessionId: s.sessionId,
            type: "Latest Update",
            category: s.category || "N/A",
            startTime,
            endTime,
            subtitle: s.location || "",
            bgColor: "bg-white",
            textColor: "text-red-800",
            buttonColor: "text-red-700",
          };
        });

      setBanners([...liveBanners, ...latestBanners]);

      const next = (data.allSessions || []).slice(1, 2).map((s: any) => {
        const { startTime } = parseDuration(s.duration);
        return {
          sessionId: s.sessionId,
          startTime: startTime || "TBD",
          category: s.category || "N/A",
          speaker: s.speakerName || "Unknown",
          location: s.location || "TBD",
        };
      });
      setNextSessions(next);

      if (liveBanners.length + latestBanners.length === 0 && next.length === 0) {
        setEmptyMessage("No sessions available");
      } else {
        setEmptyMessage("");
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setEmptyMessage("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [eventId]);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-red-900 rounded-full animate-spin"></div>
          </div>
        ) : emptyMessage ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-black text-lg font-medium">{emptyMessage}</p>
          </div>
        ) : (
          <>
            {/* Event Card */}
            {eventInfo && (
              <div className="  " >
                <div className="flex items-center ">
                  <div>
                    <h2 className="text-2xl font-bold text-black">
                      Venue: {eventInfo.title}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">{eventInfo.description}</p>
                  </div>
                </div>
                <div className="border-b border-gray-300 mt-2"></div>
              </div>
            )}


            {/* Banners Section */}
           <div className="space-y-4">
  {[
    ...(banners.find((b) => b.type === "Live") ? [banners.find((b) => b.type === "Live")!] : []),
    ...banners.filter((b) => b.type !== "Live"),
  ].map((banner, index) => {
    const { bgColor, textColor } = banner;
    return (
      <div
        key={index}
        className={`${bgColor} rounded-2xl shadow-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center transition-all duration-200 hover:shadow-lg`}
      >
        <div className="space-y-2">
          <span
            className={`inline-flex px-4 py-1 rounded-full text-xs font-semibold items-center space-x-2 ${
              banner.type === "Live"
                ? "bg-red-800 text-white"
                : "bg-[#9E9E5C] text-white"
            }`}
          >
            {banner.type === "Live" && (
              <div className="relative flex items-center">
                <span className="absolute inline-flex h-4 w-4 bg-white rounded-full opacity-75 animate-ping"></span>
                <span className="relative inline-flex ml-1 h-2 w-2 bg-white rounded-full"></span>
              </div>
            )}
            <span>{banner.type}</span>
          </span>

          <h3 className={`text-xl font-bold ${textColor}`}>
            {banner.category} start at{" "}
            {banner.startTime && banner.endTime ? banner.startTime : ""}
          </h3>

          <p className={`text-sm ${textColor}`}>
            {banner.subtitle} -{" "}
            {motivationalLines[index % motivationalLines.length]}
          </p>
        </div>

        <Link href={`/participants/SessionDetail1/${banner.sessionId}`}>
          <button className="cursor-pointer transition">
            <FaArrowRight
              className={`text-xl ${
                index === 1 ? "text-red-900" : "text-white"
              }`}
            />
          </button>
        </Link>
      </div>
    );
  })}
</div>

            {/* Schedule Header */}
            <div className="flex justify-between items-center border-b border-gray-300 pb-2">
              <h2 className="text-xl font-semibold text-black">Today's Schedule</h2>
              <Link
                href="/participants/ViewAllSessions"
                className="text-red-900 text-sm font-medium hover:underline"
              >
                View All
              </Link>
            </div>

            {/* Next Sessions */}
            <div className="space-y-4">
              {nextSessions.map((session, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex items-center justify-between hover:shadow-md transition w-full"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-gray-500 text-xs font-semibold">Next</p>
                      <p className="text-red-900 text-lg font-bold">{session.startTime}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-black">{session.category}</p>
                      <p className="text-sm text-gray-600">{session.location}</p>
                    </div>
                  </div>
                  <Link href={`/participants/SessionDetail1/${session.sessionId}`}>
                    <button className="text-red-900 hover:text-red-900">
                      <FaArrowRight className="text-xl cursor-pointer" />
                    </button>
                  </Link>
                </div>
              ))}
            </div>

            {/* Other Sections */}
            <div>
              <div className="bg-white  rounded-2xl shadow-md border border-gray-200">
                <h2 className="text-lg md:text-xl font-semibold mx-10  mt-4 text-[#282828]">
                  Quick Access
                </h2>
                <QuickAccess />
              </div>


              <ToolsAndConnections />
            </div>
          </>
        )}
      </div>

      <Image
        src="/images/line.png"
        alt="Line"
        width={1450}
        height={127}
        className="w-full h-auto mt-12"
      />
    </main>
  );
}
