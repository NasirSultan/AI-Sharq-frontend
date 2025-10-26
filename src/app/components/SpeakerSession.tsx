"use client";
import React, { useState, useEffect } from 'react';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';

interface SpeakerSessionProps {
  title: string;
  time: string;
  duration: string;
  room: string;
  type: string;
  typeColor: string;
  typeTextColor: string;
}

const SpeakerSession: React.FC<SpeakerSessionProps> = ({
  title,
  time,
  duration,
  room,
  type,
  typeColor,
  typeTextColor
}) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`saved-${title}`);
    if (saved) {
      setIsSaved(JSON.parse(saved));
    }
  }, [title]);

  const handleSaveClick = () => {
    const newSaved = !isSaved;
    setIsSaved(newSaved);
    localStorage.setItem(`saved-${title}`, JSON.stringify(newSaved));
  };

  return (
    <div className="w-[400px] h-[419px] p-10 bg-white border border-gray-300 shadow-sm rounded-2xl flex flex-col gap-6">
      {/* Session Header */}
      <div className="flex flex-row items-center gap-4 h-19">
        <div className="flex flex-col gap-3.5 flex-1">
          <div className="flex flex-row items-center gap-3.5 h-15">
            <h4 className="text-lg font-bold text-[#282828] leading-5 flex-1">
              {title}
            </h4>
            {isSaved ? (
              <FaBookmark
                className="text-[#9B2033] cursor-pointer"
                onClick={handleSaveClick}
              />
            ) : (
              <FaRegBookmark
                className="text-gray-400 cursor-pointer"
                onClick={handleSaveClick}
              />
            )}
          </div>
          <div className="flex flex-row items-center gap-2 h-9">
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            <span className="text-sm font-medium text-[#282828] leading-2.5">Dr. Sarah Hassan</span>
            <span className="text-xs text-[#9B2033] leading-4">+2 more</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-[366px] h-0 border border-gray-300"></div>

      {/* Session Description */}
      <p className="text-sm text-[#424242] leading-5 h-7.5">
        {title}
      </p>

      {/* Session Details */}
      <div className="flex flex-row items-center gap-2.5 h-8">
        <div className="flex flex-row items-center gap-2.5 flex-1 h-7.5">
          <div className="w-7.5 h-7.5">
            <div className="w-7.5 h-7.5 border-2 border-[#2D7DD2] rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-[#2D7DD2] rounded-full"></div>
            </div>
          </div>
          <span className="text-sm text-[#424242] leading-2.5">{time}</span>
        </div>
        <div className={`px-3 py-2 rounded-full`} style={{ backgroundColor: typeColor }}>
          <span className="text-lg font-medium leading-5" style={{ color: typeTextColor }}>
            {type}
          </span>
        </div>
      </div>

      {/* Duration and Room */}
      <div className="flex flex-col gap-5.5 h-2.5">
        <div className="flex flex-row justify-between items-center h-2.5">
          <span className="text-sm font-medium text-[#282828] leading-2.5">Duration</span>
          <span className="text-sm font-semibold text-[#414141] leading-2.5">{duration}</span>
        </div>
        <div className="flex flex-row justify-between items-center h-2.5">
          <span className="text-sm font-medium text-[#282828] leading-2.5">Room</span>
          <span className="text-sm font-semibold text-[#414141] leading-2.5">{room}</span>
        </div>
      </div>

      {/* Register Button */}
      <div className="flex flex-row items-center gap-3 h-19 mt-[30px]">
        <button className="flex-1 h-11 bg-[#9B2033] border border-[#9B2033] rounded-lg flex items-center justify-center">
          <span className="text-sm font-bold text-white leading-3.5">Register Now</span>
        </button>
      </div>
    </div>
  );
};

export default SpeakerSession;
