"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaSearch, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import api from "@/config/api";
import { useSearchParams } from 'next/navigation'
const filtersList = ["Daily", "Weekly", "10 Days", "90 Days", "All Time"];
import { useRouter } from "next/navigation"

const parseDuration = (duration: string) => {
  if (!duration) return { startTime: null, endTime: null, minutes: 0 };
  const parts = duration.split(" - ").map((p) => p.trim());
  const start = new Date(parts[0]);
  const end = new Date(parts[1]);
  const minutes =
    isNaN(start.getTime()) || isNaN(end.getTime())
      ? 0
      : Math.round((end.getTime() - start.getTime()) / 60000);
  return {
    startTime: isNaN(start.getTime()) ? null : start,
    endTime: isNaN(end.getTime()) ? null : end,
    minutes,
  };
};

export default function MyAgendaPage() {
 
  const [activeFilter, setActiveFilter] = useState("All Time");
  const [searchText, setSearchText] = useState("");
  const [allSessions, setAllSessions] = useState<any[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [emptyMessage, setEmptyMessage] = useState("");
    const searchParams = useSearchParams()
  const userId = searchParams.get('userId') 
  const fetchSessions = async () => {
    if (!userId) {
      setEmptyMessage("Event not selected");
      setLoading(false);
      return;
    }
    try {
      const res = await api.get(`/participants/bookmarked-sessions/${userId}`);

      const liveSessions = res.data.liveSessions || [];
      const allBookmarkedSessions = res.data.allSessions || [];

      // remove duplicates
      const sessionMap = new Map<number, any>();
      [...allBookmarkedSessions, ...liveSessions].forEach((s: any) => {
        sessionMap.set(s.sessionId, s);
      });
      const sessions = Array.from(sessionMap.values()).map((s) => {
        const { startTime, endTime, minutes } = parseDuration(s.duration || "");
        return { ...s, startTime, endTime, minutes };
      });

      setAllSessions(sessions);
      setFilteredSessions(sessions);

      if (sessions.length === 0) setEmptyMessage("No bookmarked sessions");
    } catch {
      setEmptyMessage("Failed to load sessions");
      setAllSessions([]);
      setFilteredSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    let filtered = [...allSessions];
    const now = new Date();

    if (activeFilter === "Daily") {
      filtered = filtered.filter(
        (s) => s.startTime && s.startTime.toDateString() === now.toDateString()
      );
    } else if (activeFilter === "Weekly") {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      filtered = filtered.filter(
        (s) => s.startTime && s.startTime >= weekStart && s.startTime <= weekEnd
      );
    } else if (activeFilter === "10 Days") {
      const start = new Date();
      const end = new Date();
      end.setDate(start.getDate() + 10);
      filtered = filtered.filter(
        (s) => s.startTime && s.startTime >= start && s.startTime <= end
      );
    } else if (activeFilter === "90 Days") {
      const start = new Date();
      const end = new Date();
      end.setDate(start.getDate() + 90);
      filtered = filtered.filter(
        (s) => s.startTime && s.startTime >= start && s.startTime <= end
      );
    }

    if (searchText) {
      filtered = filtered.filter((s) =>
        s.sessionTitle.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredSessions(filtered);
    if (filtered.length === 0) setEmptyMessage("No sessions found");
  }, [activeFilter, searchText, allSessions]);
  const router = useRouter()
  return (
    <>
     <div className="min-h-screen bg-[#FAFAFA] px-4 md:px-8 lg:px-10 py-6 space-y-8 max-w-6xl mx-auto">

          <div className="flex items-center gap-2 mb-6">
      <FaArrowLeft
        className="text-red-900 w-5 h-5 cursor-pointer hover:text-red-700 transition"
        onClick={() => router.back()}
      />
      <h1 className="text-xl font-semibold text-black">My Agenda</h1>
    </div>
        <div className="flex md:flex-nowrap justify-between mb-6 md:gap-5 flex-wrap gap-3">
          <div className="flex bg-white border border-gray-300 rounded-md px-3 py-2 w-[385px] hover:border-red-700 transition">
            <FaSearch className="text-red-900 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="outline-none text-sm w-full text-black"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filtersList.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1 rounded-xl text-sm font-medium cursor-pointer transition ${
                  activeFilter === filter
                    ? "bg-[#86002B] text-white"
                    : "bg-white border border-gray-300 text-black hover:bg-gray-100"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center border border-gray-300 bg-white px-3 py-2 rounded-md text-sm text-gray-700 cursor-pointer hover:border-red-700 transition">
            <FaCalendarAlt className="mr-2 text-gray-500" />
            Jan 2024 - Dec 2024
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-[#9B2033] rounded-full animate-spin"></div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-black text-lg font-medium">{emptyMessage}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredSessions.map((session, index) => (
              <div
                key={session?.sessionId ?? index}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between h-[380px]"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-black">
                    {session.sessionTitle}
                  </h2>
                  <span className="text-red-600 w-4 h-4 cursor-pointer hover:opacity-70 transition">
                    <svg
                      width="12"
                      height="16"
                      viewBox="0 0 12 16"
                      fill="#9B2033"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 1.5V15.2406C0 15.6594 0.340625 16 0.759375 16C0.915625 16 1.06875 15.9531 1.19687 15.8625L6 12.5L10.8031 15.8625C10.9313 15.9531 11.0844 16 11.2406 16C11.6594 16 12 15.6594 12 15.2406V1.5C12 0.671875 11.3281 0 10.5 0H1.5C0.671875 0 0 0.671875 0 1.5Z"
                        stroke="#9B2033"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </span>
                </div>

                <div className="flex items-center text-xs text-gray-600 space-x-2">
                  <img
                    src={
                      session.speakers[0]?.pic
                        ? `https://your-image-base-url/${session.speakers[0].pic}`
                        : "/images/img (9).png"
                    }
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span>{session.speakers[0]?.fullName ?? "Unknown"}</span>
                </div>

                <hr className="border-t border-gray-300" />

                <p className="text-xs text-gray-500 mb-3">
                  {session.event?.eventDescription ?? "No description"}
                </p>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt className="text-blue-700" />
                      <span>
                        {session.startTime && session.endTime
                          ? `${session.startTime.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })} - ${session.endTime.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`
                          : "No time available"}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold">
                    {session.category || "No category"}
                  </span>
                </div>

                <div className="flex text-xs text-gray-900 mb-2 items-center justify-between">
                  <span>Duration</span>
                  <span>{session.minutes} minutes</span>
                </div>
                <div className="flex text-xs text-gray-900 mb-2 items-center justify-between">
                  <span>Room</span>
                  <span>{session.location || "Hall B"}</span>
                </div>

                <Link
                  href={
                    session?.sessionId
                      ? `/participants/SessionDetail/${session.sessionId}`
                      : "#"
                  }
                  className="w-full"
                >
                  <button className="w-full bg-[#9B2033] text-white py-2 text-sm rounded-md hover:bg-red-700 transition cursor-pointer">
                    View Details
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <Image
        src="/images/line.png"
        alt="Logo"
        width={1729}
        height={127}
        className="absolute"
      />
    </>
  );
}
