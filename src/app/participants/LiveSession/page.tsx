'use client';

import Image from 'next/image';
import { FaPlay, FaArrowLeft, FaExpand, FaEye, FaArrowRight } from 'react-icons/fa';
import LiveChat from '../../components/LiveChat';
import Link from 'next/link';
import { FiMessageCircle } from 'react-icons/fi';
import { FaMessage } from 'react-icons/fa6';


export default function LiveSession() {

  return (

    <div className="relative">
      {/* Background Rectangle */}
      <div className="absolute w-full h-[671px] left-0 top-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.42),rgba(0,0,0,0.42)),url(/images/liveman.png)] bg-cover bg-center" />

      {/* Header Overlay */}
      <div className="absolute w-full h-[78px] left-0 top-0 bg-black bg-opacity-40" />

      {/* Navbar Frame */}
      <div className="absolute w-full max-w-[1277.56px] h-[44px] left-5 md:left-[81.22px] top-[19px] flex flex-row justify-between items-center px-4 md:px-0">
        {/* Left Frame */}
        <div className="flex flex-row items-center gap-9 w-[227px] h-[41px]">
          {/* Logo Vector */}
       {/* Logo Vector */}
 <div className="w-[30px] h-[26px] flex items-center justify-center">
      <Link href="/participants/SessionDetail1" className="cursor-pointer">
        <FaArrowLeft className="text-[#9B2033]" size={24} />
      </Link>
    </div>

          {/* Title Frame */}
          <div className="flex flex-col justify-center items-start gap-[8px] w-[159px] h-[41px]">
            <h1 className="w-[133px] h-[17px] font-['IBM_Plex_Sans'] font-medium text-[24px] leading-[24px] text-white">
              Live Session
            </h1>
            <div className="flex flex-row items-center gap-2 text-gray-300 text-xs">
              <p>Now Live</p>
              
              <p>● 234 participants</p>
             
            </div>
          </div>
        </div>

        {/* Right Frame */}
        <div className="w-[97.56px] h-[44px] relative">
          {/* Live Indicator */}
          <div className="absolute w-[54px] h-[23px] left-[3px] top-[10px] bg-red-600 bg-opacity-50 rounded-full flex flex-col items-start p-[4px_6px] gap-[10px]">
            <div className="flex flex-row items-center gap-[4px] w-[42px] h-[15px]">
              {/* Red Dot */}
              <div className="w-[12px] h-[12px] bg-white rounded-full" />
              <span className="w-[26px] h-[8px] font-['IBM_Plex_Sans'] font-medium text-[12px] leading-[7px] text-white">
                LIVE
              </span>
              
            </div>
          </div>

          {/* Button */}
          <button className="absolute w-[32px] h-[34px] left-[66px] top-[5px] bg-black bg-opacity-50 rounded-[8px] flex items-center justify-center">
            <FaExpand className="text-white ml-1" size={12} />
          </button>
        </div>
      </div>

      {/* Content Frame */}
      <div className="absolute w-[673px] h-[80px] left-[80px] top-[543px] flex flex-row items-center gap-[29px]">
        {/* Avatar */}
        <div className="w-[80px] h-[80px] bg-[#9B2033] rounded-full flex items-center justify-center">
          <FaPlay className="text-white" size={24} />
        </div>

        {/* Text Frame */}
        <div className="flex flex-col items-start gap-[19px] w-[564px] h-[49px]">
          <h2 className="w-[564px] h-[17px] font-['IBM_Plex_Sans'] font-semibold text-[24px] leading-[150%] text-white">
            The Future of Regional Cooperation
          </h2>

          {/* Speaker Info */}
          <div className="flex flex-row items-center gap-[24px] w-[564px] h-[13px]">
            <span className="w-[117px] h-[13px] font-['IBM_Plex_Sans'] font-semibold text-[18px] leading-[150%] text-white">
              Dr. Johnathan
            </span>
            <div className="w-[4px] h-[4px] bg-[#9B2033] rounded-full" />
            <span className="w-[193px] h-[11px] font-['IBM_Plex_Sans'] font-normal text-[16px] leading-[150%] text-white">
              Director of Regional Affairs
            </span>
            <div className="w-[4px] h-[4px] bg-[#9B2033] rounded-full" />
            <span className="w-[150px] h-[11px] font-['IBM_Plex_Sans'] font-normal text-[16px] leading-[150%] text-white">
              Middle East Institute
            </span>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="absolute w-[1440px] h-[48px] left-0 top-[671px] bg-[#234D70]">
        {/* Left Section */}
        <div className="absolute w-[290.45px] h-[24px] left-[16px] top-[12px] flex flex-row items-center gap-2">
          <div className="w-[12px] h-[12px] bg-red-600 rounded-full opacity-92" />
          <span className="font-['IBM_Plex_Sans'] font-medium text-[16px] leading-[24px] text-white">
            Live Now
          </span>
          <span className="font-['Inter'] font-normal text-[16px] leading-[24px] text-blue-100">
            •
          </span>
          <span className="font-['IBM_Plex_Sans'] font-normal text-[16px] leading-[24px] text-blue-100">
            45 minutes remaining
          </span>
        </div>

        {/* Right Section */}
        <div className="absolute w-[111.16px] h-[20px] left-[1250px] top-[14px] flex flex-row items-center gap-3">
          <div className="flex flex-row items-center gap-1">
            <FaEye className="w-[17.5px] h-[14px] text-blue-100" />
            <span className="font-['IBM_Plex_Sans'] font-normal text-[16px] leading-[24px] text-blue-100">
              234
            </span>
          </div>
          <div className="flex flex-row items-center gap-1">
            <FaEye className="w-[15.75px] h-[14px] text-blue-100" />
            <span className="font-['IBM_Plex_Sans'] font-normal text-[16px] leading-[24px] text-blue-100">
              1.2K
            </span>
          </div>
        </div>
      </div>
       <LiveChat />

      {/* Additional content below LiveChat as provided */}
      <div className="absolute flex flex-col items-start gap-[37px] w-[1280px] h-[1068px] left-[80px] top-[1564px]">
        {/* Session Info and Live Poll */}
        <div className="flex flex-row gap-[24px] w-[1279px] h-[491px]">
          {/* Left: Session Info */}
          <div className="flex flex-col gap-[24px] p-[24px_32px] bg-white border border-gray-300 shadow-lg rounded-[20px] w-[847px] h-[491px]">
            <div className="text-[18px] font-semibold font-['IBM Plex Sans'] text-[#282828] leading-[150%]">
              About
            </div>
            <div className="text-[14px] font-normal font-['IBM Plex Sans'] text-[#424242] leading-[140%]">
              Explore the evolving landscape of regional cooperation in the Middle East and North Africa. This keynote will examine emerging partnerships, economic integration opportunities, and the role of technology in fostering collaboration across borders.
            </div>
            <div className="text-[18px] font-semibold font-['IBM Plex Sans'] text-[#282828] leading-[150%]">
              Key Topics
            </div>
            <div className="flex flex-row gap-[14px]">
              <div className="flex justify-center items-center bg-[#FFEFF2] rounded-full px-[12px] py-[10px] text-[#9B2033] font-['IBM Plex Sans'] font-medium text-[18px] leading-[140%]">
               Economic Integration
              </div>
              <div className="flex justify-center items-center bg-[#FFEFF2] rounded-full px-[12px] py-[10px] text-[#9B2033] font-['IBM Plex Sans'] font-medium text-[18px] leading-[140%]">
                Digital Cooperation
              </div>
              <div className="flex justify-center items-center bg-[#FFEFF2] rounded-full px-[12px] py-[10px] text-[#9B2033] font-['IBM Plex Sans'] font-medium text-[18px] leading-[140%]">
               Trade Partnerships
              </div>
              <div className="flex justify-center items-center bg-[#FFEFF2] rounded-full px-[12px] py-[10px] text-[#9B2033] font-['IBM Plex Sans'] font-medium text-[18px] leading-[140%]">
                Regional Security
              </div>
            </div>
            <div className="text-[18px] font-semibold font-['IBM Plex Sans'] text-[#282828] leading-[150%]">
              Target Audience
            </div>
            <div className="text-[14px] font-normal font-['IBM Plex Sans'] text-[#424242] leading-[140%]">
              Government officials, policy makers, business leaders, and researchers interested in regional cooperation and economic development.
            </div>
            <div className="text-[18px] font-semibold font-['IBM Plex Sans'] text-[#282828] leading-[150%]">
              Language
            </div>
            <div className="text-[14px] font-normal font-['IBM Plex Sans'] text-[#424242] leading-[140%]">
              English with Arabic translation available
            </div>
          </div>

          {/* Right: Live Poll */}
          <div className="flex flex-col gap-[24px] p-[24px_32px] bg-white border border-gray-300 shadow-lg rounded-[20px] w-[412px] h-[491px]">
            <div className="flex flex-row items-center gap-[24px]">
              <div className="text-[18px] font-semibold font-['IBM Plex Sans'] text-[#282828] leading-[150%]">
                Live Poll
              </div>
              <div className="flex justify-center items-center bg-[#FFEFF2] rounded-full px-[12px] py-[10px] text-[#9B2033] font-['IBM Plex Sans'] font-medium text-[18px] leading-[140%]">
               2:30 left

              </div>
            </div>
            <div className="text-[14px] font-normal font-['IBM Plex Sans'] text-[#424242] leading-[140%]">
              Which technology will have the biggest impact on your industry in the next 5 years?
            </div>
            {/* Poll Options */}
            <div className="flex flex-col gap-[29px]">
              <div className="flex flex-row items-center gap-[24px]">
                <div className="w-[16px] h-[16px] border-2 border-[#9B2033] rounded-full flex items-center justify-center">
                  <div className="w-[6px] h-[6px] bg-[#9B2033] rounded-full"></div>
                </div>
                <div className="flex-1 text-[14px] font-normal font-['IBM Plex Sans'] text-[#282828] leading-[150%]">
                  Artificial Intelligence
                </div>
                <div className="text-[14px] font-normal font-['IBM Plex Sans'] text-[#282828] leading-[150%]">
                  45%
                </div>
              </div>
              <div className="w-full h-[4px] bg-gray-200 rounded-full">
                <div className="w-[45%] h-full bg-[#606C38] rounded-full"></div>
              </div>
              <div className="flex flex-row items-center gap-[24px]">
                <div className="w-[16px] h-[16px] border-2 border-gray-400 rounded-full"></div>
                <div className="flex-1 text-[14px] font-normal font-['IBM Plex Sans'] text-[#282828] leading-[150%]">
                  Blockchain
                </div>
                <div className="text-[14px] font-normal font-['IBM Plex Sans'] text-[#282828] leading-[150%]">
                  25%
                </div>
              </div>
              <div className="w-full h-[4px] bg-gray-200 rounded-full">
                <div className="w-[25%] h-full bg-[#F1AB86] rounded-full"></div>
              </div>
              <div className="flex flex-row items-center gap-[24px]">
                <div className="w-[16px] h-[16px] border-2 border-gray-400 rounded-full"></div>
                <div className="flex-1 text-[14px] font-normal font-['IBM Plex Sans'] text-[#282828] leading-[150%]">
                  Internet of Things
                </div>
                <div className="text-[14px] font-normal font-['IBM Plex Sans'] text-[#282828] leading-[150%]">
                  16%
                </div>
              </div>
              <div className="w-full h-[4px] bg-gray-200 rounded-full">
                <div className="w-[16%] h-full bg-[#9B2033] rounded-full"></div>
              </div>
            </div>
            <button className="flex justify-center items-center bg-[#9B2033] text-white font-['IBM Plex Sans'] font-normal text-[14px] leading-[100%] px-[34px] py-[14px] rounded-[10px]">
             Submit Response
            </button>
          </div>
        </div>

       
               {/* Speakers */}
               <div className="flex flex-col gap-[24px] p-[24px_32px] bg-white border border-gray-300 shadow-lg rounded-[20px] w-[1280px] h-[253px]">
                 <div className="text-[24px] font-medium font-['IBM Plex Sans'] text-[#282828] leading-[100%] tracking-[-0.01em]">
                   Speakers
                 </div>
                 <div className="flex flex-row items-center gap-[30px]">
                   <div className="w-[105px] h-[105px] rounded-full bg-gray-300 overflow-hidden">
                     <Image src="/images/drAhmad.jpg" alt='drahmad' width={105} height={105} className="w-full h-full object-cover rounded-full" />
                   </div>
                   <div className="flex flex-col gap-[24px] flex-1">
                     <div className="flex flex-row items-center gap-[24px]">
                       <div className="text-[18px] font-semibold font-['IBM Plex Sans'] text-[#282828] leading-[150%]">
                         Dr. Johnathan
                       </div>
                       <div className="w-[4px] h-[4px] bg-[#9B2033] rounded-full"></div>
                       <div className="text-[16px] font-normal font-['IBM Plex Sans'] text-[#282828] leading-[150%]">
                         Director of Regional Affairs
                       </div>
                       <div className="w-[4px] h-[4px] bg-[#9B2033] rounded-full"></div>
                       <div className="text-[16px] font-normal font-['IBM Plex Sans'] text-[#282828] leading-[150%] flex-1">
                         Middle East Institute
                       </div>
                       <div className="flex justify-center items-center bg-[#FCDCDC] rounded-full w-[48px] h-[44px]">
                        <Link href="/participants/Masseges"><FaMessage className="text-[#9B2033]" size={20} /></Link>
                       </div>
                       <div className="flex justify-center items-center bg-[#91C6FF] rounded-full px-[12px] py-[10px] text-[#1E40AF] font-['IBM Plex Sans'] font-semibold text-[18px] leading-[140%]">
                        Keynote Speaker
                       </div>
                     </div>
                     <div className="text-[14px] font-normal font-['IBM Plex Sans'] text-[#424242] leading-[140%]">
                       Dr. Johnathan is a professor of Political Science at Cairo University with expertise in international relations and Middle Eastern diplomacy. She has published extensively on regional cooperation and has advised multiple governments and organizations on policy development."
                     </div>
                   </div>
                 </div>
               </div>
       
               {/* Session Forum */}
               <div className="flex flex-col gap-[24px] p-[24px_32px] bg-[#FFEEEE] border border-gray-300 shadow-lg rounded-[20px] w-[1280px] h-[106px] ">
                 <div className="flex flex-row items-center gap-[14px]">
                   <div className="w-[48px] h-[48px] bg-[#FFBEBE] rounded-[8px] flex items-center justify-center">
                     <FiMessageCircle className="text-[#9B2033]" size={24} />
                   </div>
                   <div className="flex flex-col gap-[14px] flex-1">
                     <div className="text-[18px] font-semibold font-['IBM Plex Sans'] text-[#9B2033] leading-[150%]">
                       Session Forum
                     </div>
                     <div className="text-[16px] font-normal font-['IBM Plex Sans'] text-[#9B2033] leading-[150%]">
                       Join the discussion with other attendees, ask questions, and share insights about this session.
                     </div>
                   </div>
                 <Link href="/participants/Forums"><FaArrowRight className="text-[#9B2033]" size={24} /></Link> 
                 </div>
               </div>
             </div>
    </div>
  );
}
