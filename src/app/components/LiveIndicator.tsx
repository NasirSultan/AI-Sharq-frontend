"use client";

import React, { useEffect, useState } from "react";
import { getRemainingSessions } from "../config/services/participants";

export default function LiveIndicator() {

    const [sessions, setSessions] = useState<any[]>([]);
      
        const fetchSessions = async () => {
          try {
            const data = await getRemainingSessions(2);
            console.log("API raw response:", data);
      
            // Normalize response
            const sessionsArr = Array.isArray(data)
              ? data
              : data?.allSessions ??
                data?.liveSessions ??
                data?.data?.allSessions ??
                [];
      
            // Filter for live sessions only    
            const liveSessions = (sessionsArr ?? []).filter(
              (session: any) => session.isLive === true
            );
      
            setSessions(liveSessions);
          } catch (err) {
            console.error("Error fetching sessions:", err);
            setSessions([]);
          }
        };
      
        useEffect(() => {
          fetchSessions();
        }, []);
    
  return (
  <div className="flex justify-center items-center font-sans">
  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#222] rounded-lg group relative">
    {/* Ripple Circle */}
    <div
      className={`relative w-2 h-2 rounded-full ${
        sessions.length > 0 ? "bg-red-600 ripple" : "bg-gray-400"
      }`}
    ></div>

    <div
      className={`font-bold tracking-widest text-xs ${
        sessions.length > 0 ? "text-red-600" : "text-gray-400"
      }`}
    >
      LIVE
    </div>
  </div>

  {/* Custom Ripple CSS */}
  <style jsx>{`
    @keyframes ripple {
      0% {
        width: 8px;
        height: 8px;
        opacity: 1;
      }
      100% {
        width: 18px;
        height: 18px;
        opacity: 0;
      }
    }
    .ripple::before,
    .ripple::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      border: 1.5px solid red;
      border-radius: 9999px;
      transform: translate(-50%, -50%);
      animation: ripple 1.5s infinite;
    }
    .ripple::after {
      animation-delay: 0.75s;
    }
  `}</style>
</div>

  );
}
