"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
import TodaysSchedule from "../../components/TodaysSchedule";
import QuickAccess from "../../components/QuickAcess";
import ToolsAndConnections from "../../components/ToolsAndConnections";
import TotalLiveSession from "../../components/totaltodaysession";
import Image from "next/image";
import { FaArrowRight, FaRegClock } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import api from "@/config/api";
import Link from "next/link";

interface Banner {
  sessionId: number;
  type: string;
    sessionTitle: string; 
  category: string;
  startTime: string;
  endTime: string;
  subtitle: string;
  bgColor: string;
  textColor: string;
  buttonColor: string;
}

// Cache object outside component to persist across renders
const sessionCache: {
  [key: number]: {
    data: any;
    timestamp: number;
  };
} = {};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

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
  "Don't miss this session, it's full of insights",
  "Join now to learn new skills and ideas",
  "Be part of this session, it's highly recommended",
];

export default function Home() {
  const eventId = useSelector((state: RootState) => state.event.id);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [nextSessions, setNextSessions] = useState([]);
  const [eventInfo, setEventInfo] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [emptyMessage, setEmptyMessage] = useState("");
  const [showRedirectButton, setShowRedirectButton] = useState(false);

  const hasFetched = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!eventId) {
      setEmptyMessage("Event not selected");
      setShowRedirectButton(false);
      setLoading(false);
      return;
    }

    // Prevent refetch if already fetched for this eventId
    if (hasFetched.current) {
      return;
    }

    // Check cache first
    const cached = sessionCache[eventId];
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_DURATION) {
      // Use cached data
      processSessionData(cached.data);
      setLoading(false);
      hasFetched.current = true;
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);

        // Cancel previous request if exists
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        const res = await api.get(`/event/event-sessions/${eventId}`, {
          signal: abortControllerRef.current.signal,
          timeout: 10000, // 5 second timeout
        });

        const data = res.data;

        // Cache the response
        sessionCache[eventId] = {
          data: data,
          timestamp: Date.now(),
        };

        processSessionData(data);
        hasFetched.current = true;
      } catch (err: any) {
        if (err.name === 'AbortError' || err.name === 'CanceledError') {
          console.log("Request was cancelled");
          return;
        }
        console.error("Error fetching sessions:", err);
        setEmptyMessage("Failed to load sessions");
        setShowRedirectButton(false);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [eventId]);

  const processSessionData = (data: any) => {
    // Set event info
    const event =
      data.allSessions?.[0]?.event || data.liveSessions?.[0]?.event;
    if (event) {
      setEventInfo({
        title: event.eventTitle,
        description: event.eventDescription,
      });
    }

    // Live banners
const liveBanners: Banner[] = (data.liveSessions || []).map((s: any) => {
  const { startTime, endTime } = parseDuration(s.duration);
  return {
    sessionId: s.sessionId,
    sessionTitle: s.sessionTitle, // Add this
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


    // Latest banners
const latestBanners: Banner[] = (data.allSessions || [])
  .filter((s: any) => !s.isLive)
  .slice(0, 1)
  .map((s: any) => {
    const { startTime, endTime } = parseDuration(s.duration);
    return {
      sessionId: s.sessionId,
      sessionTitle: s.sessionTitle, // Add this
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

    // Next sessions
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
      setEmptyMessage("No sessions are available for this event yet.");
      setShowRedirectButton(true);
    } else {
      setEmptyMessage("");
      setShowRedirectButton(false);
    }
  };

  const sortedBanners = useMemo(() => {
    const live = banners.find((b) => b.type === "Live");
    const rest = banners.filter((b) => b.type !== "Live");
    return live ? [live, ...rest] : rest;
  }, [banners]);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-red-900 rounded-full animate-spin"></div>
          </div>
        ) : emptyMessage ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <p className="text-black text-lg font-medium">{emptyMessage}</p>
            {showRedirectButton && (
              <Link href="/participants/vanue">
                <button className="px-4 py-2 border-2 border-red-900 text-red-900 bg-white rounded-full hover:bg-red-900 hover:text-white cursor-pointer">
                  View Venue
                </button>
              </Link>
            )}
          </div>
        ) : (
          <>
            {eventInfo && (
              <div>
                <div className="flex items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-black">Venue: {eventInfo.title}</h2>
                    <p className="text-gray-600 text-sm mt-1">{eventInfo.description}</p>
                  </div>
                </div>
                <div className="border-b border-gray-300 mt-2"></div>
              </div>
            )}

            <div className="space-y-4">
              {sortedBanners.map((banner, index) => {
                const { bgColor, textColor } = banner
                return (
                  <Link key={index} href={`/participants/SessionDetail1/${banner.sessionId}`}>
                    <div
                      className={`${bgColor} rounded-2xl shadow-md p-6 my-2 flex flex-col md:flex-row justify-between items-start md:items-center transition-all duration-200 hover:shadow-lg cursor-pointer`}
                    >
                      <div className="space-y-2">
                        <span
                          className={`inline-flex px-4 py-1 rounded-full text-xs font-semibold items-center space-x-2 ${banner.type === "Live" ? "bg-red-800 text-white" : "bg-[#9E9E5C] text-white"
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
  {banner.sessionTitle} - {banner.category} start at {banner.startTime}
</h3>

                        <p className={`text-sm ${textColor}`}>
                          {banner.subtitle} - {motivationalLines[index % motivationalLines.length]}
                        </p>
                      </div>

                      <button className="cursor-pointer transition">
                        <FaArrowRight className={`text-xl ${index === 1 ? "text-red-900" : "text-white"}`} />
                      </button>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="flex justify-between items-center border-b border-gray-300 pb-2">
              <h2 className="text-xl font-semibold text-black">Today's Schedule</h2>
              <Link href="/participants/RegisterSession" className="text-red-900 text-sm font-medium hover:underline">
                View All
              </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <FaRegClock className="text-red-900 text-2xl" />
                <p className="text-black text-sm font-semibold flex items-baseline gap-2">
                  Today Live Sessions <TotalLiveSession />
                </p>

              </div>
              <p className="text-gray-600 text-sm">
                Here is a list of all sessions scheduled for today. Some sessions do not require registration to join.
              </p>
            </div>
            <div>
              <div className="bg-white rounded-2xl shadow-md border border-gray-200">
                <h2 className="text-lg md:text-xl font-semibold mx-10 mt-4 text-[#282828]">Quick Access</h2>
                <QuickAccess />
              </div>

              <ToolsAndConnections />
            </div>
          </>
        )}
      </div>

      <Image src="/images/line.png" alt="Line" width={1450} height={127} className="w-full h-auto mt-12" />
    </main>

  );
}