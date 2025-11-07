'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import ChartStatistics from '../../../components/ChartStatistics';
import ExportCsv from '../../../components/ExportCsv';
import { FaArrowLeft, FaBuilding, FaCalendar, FaCheck, FaMicrophone, FaUsers } from 'react-icons/fa';
import { FaPeopleGroup } from 'react-icons/fa6';
import Link from 'next/link';

const ReportPage = () => {
  // Sample data for charts
  const dailyAttendanceData = [
    { day: 'Mon', attendees: 200 },
    { day: 'Tue', attendees: 400 },
    { day: 'Wed', attendees: 600 },
    { day: 'Thu', attendees: 800 },
    { day: 'Fri', attendees: 1000 },
    { day: 'Sat', attendees: 600 },
    { day: 'Sun', attendees: 300 }
  ];

  const engagementData = [
    { name: 'Sessions', value: 40, color: '#9B2033' },
    { name: 'Networking', value: 30, color: '#C85C6D' },
    { name: 'Forums', value: 20, color: '#FA889A' },
    { name: 'Other', value: 10, color: '#FEA5B3' }
  ];

  const participants = [
    {
      name: 'Dr. Johnathan',
      role: 'Director of Regional Affairs',
      email: 'johnathan@gmail.com',
      avatar: '/images/drAhmad.jpg'
    },
    {
      name: 'Sarah Mitchell',
      role: 'Innovation Labs',
      email: 'sarah@gmail.com',
      avatar: '/images/Sara.png'
    },
    {
      name: 'Emily Torres',
      role: 'Design Gurus',
      email: 'emily@gmail.com',
      avatar: '/images/Emily.png'
    },
    {
      name: 'Michael Chen',
      role: 'Data Analytics Team',
      email: 'michael.chen@gmail.com',
      avatar: '/images/Daniel.png'
    },
    {
      name: 'Ava Robinson',
      role: 'User Experience Research',
      email: 'ava.robinson@gmail.com',
      avatar: '/images/Ahmed.png'
    }
  ];

  // Icon definitions
  const totalRegistrationsIcon = (
    <FaUsers className="text-blue-700 w-5 h-5" />
  );

  const checkedInTodayIcon = (
    <FaCheck className="text-green-700 w-5 h-5" />
  );

  const activeSessionsIcon = (
    <FaCalendar className="text-purple-700 w-5 h-5" />
  );

  const totalSpeakersIcon = (
    <FaMicrophone className="text-red-700 w-5 h-5" />
  );

  const totalSponsorsIcon = (
    <FaBuilding className="text-yellow-700 w-5 h-5" />
  );

  const totalParticipantsIcon = (
   <FaPeopleGroup className="text-orange-700 w-5 h-5" />
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

         {/* Header */}
            <div className="flex flex-row items-center p-0 gap-8 w-[1280px] h-6  mb-5">
              <div className="flex flex-row items-center p-0 gap-8 w-[1280px] h-6">
              <Link href="/Organizer/Dashboard"> <FaArrowLeft className="w-9 h-9 text-[#7e0505]" /></Link> 
                <h1 className=" font-medium text-4xl leading-6 text-[#282828]">
Reports                </h1>
              </div>
            </div>
      {/* Main Container */}
      <div className="flex flex-col items-start gap-6 md:gap-8 w-full max-w-[1280px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-start gap-6 w-full h-[490px] mb-8">
          {/* Search and Filter Row */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full">
            {/* Search Bar */}
            <div className="flex justify-center items-center p-4 gap-2.5 border border-gray-200 rounded-xl w-full lg:w-[378px] h-11">
              <div className="flex flex-row items-center gap-3 w-full lg:w-[338px] h-6">
                {/* Search Icon */}
                <div className="flex items-center justify-center w-6 h-6">
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                    <path d="M16.6667 14.5833H15.625L15.2083 14.1667C16.6667 12.5 17.5 10.4167 17.5 8.33333C17.5 3.75 13.75 0 9.16667 0C4.58333 0 0.833333 3.75 0.833333 8.33333C0.833333 12.9167 4.58333 16.6667 9.16667 16.6667C11.25 16.6667 13.3333 15.8333 14.1667 14.375L14.5833 14.7917V15.8333L20.8333 22.0833L22.0833 20.8333L16.6667 14.5833ZM9.16667 14.5833C5.83333 14.5833 3.16667 11.9167 3.16667 8.33333C3.16667 4.75 5.83333 2.08333 9.16667 2.08333C12.5 2.08333 15.1667 4.75 15.1667 8.33333C15.1667 11.9167 12.5 14.5833 9.16667 14.5833Z" fill="#9B2033"/>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  className="flex-1 text-gray-400 text-base font-normal leading-[150%] font-['IBM_Plex_Sans']"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 lg:gap-4 w-full lg:w-auto">
              <button className="flex flex-row items-center p-4 gap-3 bg-red-700 border border-red-700 rounded-xl w-full sm:w-[74px] h-11">
                <span className="text-white font-bold text-sm leading-[100%] font-['IBM_Plex_Sans']">
                  All
                </span>
              </button>

              <button className="flex flex-row items-center p-4 gap-3 border border-gray-200 rounded-xl w-full sm:w-[87px] h-11">
                <span className="text-black font-medium text-sm leading-[100%] font-['IBM_Plex_Sans']">
                  Today
                </span>
              </button>

              <button className="flex flex-row items-center p-4 gap-3 border border-gray-200 rounded-xl w-full sm:w-[99px] h-11">
                <span className="text-black font-medium text-sm leading-[100%] font-['IBM_Plex_Sans']">
                  This Week
                </span>
              </button>

              <button className="flex flex-row items-center p-4 gap-3 border border-gray-200 rounded-xl w-full sm:w-[105px] h-11">
                <span className="text-black font-medium text-sm leading-[100%] font-['IBM_Plex_Sans']">
                  This Month
                </span>
              </button>

              <button className="flex flex-row items-center p-4 gap-3 border border-gray-200 rounded-xl w-full sm:w-[69px] h-11">
                <span className="text-black font-medium text-sm leading-[100%] font-['IBM_Plex_Sans']">
                  Year
                </span>
              </button>

              <button className="flex flex-row items-center p-4 gap-3 border border-gray-200 rounded-xl w-full sm:w-[73px] h-11">
                <span className="text-black font-medium text-sm leading-[100%] font-['IBM_Plex_Sans']">
                  Custom
                </span>
              </button>

              {/* Filter Icon */}
              <div className="flex flex-row items-center justify-center p-4 gap-3 border border-gray-200 rounded-xl w-full sm:w-16 h-11">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 4V6H21V4H3ZM3 11V13H21V11H3ZM3 18V20H21V18H3Z" fill="#9B2033"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <ChartStatistics
              icon={totalRegistrationsIcon}
              title="Total Registrations"
              value="1,250"
              badgeChange="17.4%"
              valueChange="+2"
              changeColor="text-green-600"
              iconBgColor="bg-blue-100"
            />
            <ChartStatistics
              icon={checkedInTodayIcon}
              title="Checked In Today"
              value="830"
              badgeChange="28.4%"
              valueChange="+11"
              changeColor="text-green-600"
              iconBgColor="bg-green-100"
            />
            <ChartStatistics
              icon={activeSessionsIcon}
              title="Active Sessions"
              value="5"
              badgeChange="28.4%"
              valueChange="+1"
              changeColor="text-green-600"
              iconBgColor="bg-purple-100"
            />
            <ChartStatistics
              icon={totalSpeakersIcon}
              title="Total Speakers"
              value="205"
              badgeChange="17.4%"
              valueChange="+2"
              changeColor="text-green-600"
              iconBgColor="bg-red-100"
            />
            <ChartStatistics
              icon={totalSponsorsIcon}
              title="Total Sponsors"
              value="455"
              badgeChange="17.4%"
              valueChange="+2"
              changeColor="text-green-600"
              iconBgColor="bg-yellow-100"
            />
            <ChartStatistics
              icon={totalParticipantsIcon}
              title="Total Participants"
              value="1,850"
              badgeChange="17.4%"
              valueChange="+32"
              changeColor="text-green-600"
              iconBgColor="bg-orange-100"
            />
          </div>
        </div>

        {/* Daily Attendance Chart */}
        <div className="bg-white border border-gray-300 shadow-sm rounded-xl w-full h-[490px] flex flex-col">
          <div className="p-6">
            <h2 className="text-black font-semibold text-lg leading-[150%] font-['IBM_Plex_Sans']">
              Daily Attendance
            </h2>
          </div>
          <div className="px-6 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyAttendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 14, fill: '#282828', fontFamily: "'IBM Plex Sans', sans-serif" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 14, fill: '#282828', fontFamily: "'IBM Plex Sans', sans-serif" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #F3F4F6',
                    borderRadius: '8px',
                    fontFamily: "'IBM Plex Sans', sans-serif"
                  }}
                />
                <Line dataKey="attendees" stroke="#9B2033" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Popular Sessions and Engagement Metrics */}
        <div className="flex flex-col lg:flex-row items-start gap-8 w-full">
          {/* Most Popular Sessions */}
          <div className="flex flex-col items-center p-8 gap-8 bg-white border border-gray-400 shadow-sm rounded-2xl w-full lg:w-[621px] h-[369px]">
            <h2 className="text-black font-semibold text-lg leading-[150%] font-['IBM_Plex_Sans']">
              Most Popular Sessions
            </h2>

            {/* Session 1 */}
            <div className="flex flex-row justify-between items-center gap-20 w-full max-w-[519px] h-8">
              <div className="flex flex-col items-start gap-1 w-[119px] h-7">
                <span className="text-black font-medium text-base leading-[150%] font-['IBM_Plex_Sans']">
                 <b>AI in Healthcare</b> 
                </span>
                <span className="text-black font-normal text-sm leading-[143%] font-['IBM_Plex_Sans']">
                  Dr. Sarah Ahmed
                </span>
              </div>
              <div className="flex flex-col items-end gap-0.5 w-[65px] h-8">
                <span className="text-red-700 font-semibold text-2xl leading-[140%] font-['IBM_Plex_Sans']">
                  324
                </span>
                <span className="text-black font-normal text-sm leading-[143%] font-['IBM_Plex_Sans']">
                  Attendees
                </span>
              </div>
            </div>

            {/* Session 2 */}
            <div className="flex flex-row justify-between items-center gap-20 w-full max-w-[519px] h-[42px]">
              <div className="flex flex-col items-start gap-1 w-[189px] h-7">
                <span className="text-black font-medium text-base leading-[150%] font-['IBM_Plex_Sans']">
                 <b>Sustainable Development</b> 
                </span>
                <span className="text-black font-normal text-sm leading-[143%] font-['IBM_Plex_Sans']">
                  Prof. Michael Chen
                </span>
              </div>
              <div className="flex flex-col items-end gap-0.5 w-[65px] h-8">
                <span className="text-red-700 font-semibold text-2xl leading-[140%] font-['IBM_Plex_Sans']">
                  298
                </span>
                <span className="text-black font-normal text-sm leading-[143%] font-['IBM_Plex_Sans']">
                  Attendees
                </span>
              </div>
            </div>

            {/* Session 3 */}
            <div className="flex flex-row justify-between items-center gap-20 w-full max-w-[519px] h-8">
              <div className="flex flex-col items-start gap-1 w-[189px] h-7">
                <span className="text-black font-medium text-base leading-[150%] font-['IBM_Plex_Sans']">
                 <b>Sustainable Development</b> 
                </span>
                <span className="text-black font-normal text-sm leading-[143%] font-['IBM_Plex_Sans']">
                  Prof. Michael Chen
                </span>
              </div>
              <div className="flex flex-col items-end gap-0.5 w-[65px] h-8">
                <span className="text-red-700 font-semibold text-2xl leading-[140%] font-['IBM_Plex_Sans']">
                  285
                </span>
                <span className="text-black font-normal text-sm leading-[143%] font-['IBM_Plex_Sans']">
                  Attendees
                </span>
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="flex flex-col items-center p-8 gap-8 bg-white border border-gray-400 shadow-sm rounded-2xl w-full lg:w-[621px] h-[400px]">
            <h2 className="text-black font-semibold text-lg leading-[150%] font-['IBM_Plex_Sans']">
              Engagement Metrics
            </h2>

            <div className="w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4">
              {engagementData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Participant Demographics */}
        <div className="bg-white border border-gray-300 shadow-sm rounded-2xl w-[1278px] h-[374px] p-8 flex flex-col gap-8 mt-8">
          <h2 className="font-ibm-plex-sans flex justify-center font-semibold text-[18px] leading-[150%] text-[#282828]">
            Participant Demographics
          </h2>
          <div className="flex flex-row gap-[88px] w-[1230px] h-[215px]">
            {/* By Organization Type */}
            <div className="flex flex-col  gap-8 w-[351.33px] h-[215px]">
              <h3 className="font-ibm-plex-sans flex justify-center font-medium text-[16px] leading-[24px] text-[#282828]">
                <b>By Organization Type</b>
              </h3>
              <div className="flex flex-col gap-8">
                {/* Universities */}
                <div className="relative w-[351.33px] h-[36px]">
                  <div className="absolute top-0 left-0 w-full h-[20px] flex justify-between items-center">
                    <span className="font-ibm-plex-sans font-normal text-[14px] leading-[20px] text-[#282828]">Universities</span>
                    <span className="font-ibm-plex-sans font-medium text-[16px] leading-[24px] text-[#282828]">42%</span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-[8px] bg-gray-200 rounded-full">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
                {/* Corporations */}
                <div className="relative w-[351.33px] h-[36px]">
                  <div className="absolute top-0 left-0 w-full h-[20px] flex justify-between items-center">
                    <span className="font-ibm-plex-sans font-normal text-[14px] leading-[20px] text-[#282828]">Corporations</span>
                    <span className="font-ibm-plex-sans font-medium text-[16px] leading-[24px] text-[#282828]">35%</span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-[8px] bg-gray-200 rounded-full">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
                {/* Government */}
                <div className="relative w-[351.33px] h-[36px]">
                  <div className="absolute top-0 left-0 w-full h-[20px] flex justify-between items-center">
                    <span className="font-ibm-plex-sans font-normal text-[14px] leading-[20px] text-[#282828]">Government</span>
                    <span className="font-ibm-plex-sans font-medium text-[16px] leading-[24px] text-[#282828]">23%</span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-[8px] bg-gray-200 rounded-full">
                    <div className="h-full bg-orange-600 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            {/* By Region */}
            <div className="flex flex-col gap-8 w-[351.33px] h-[215px]">
              <h3 className="font-ibm-plex-sans flex justify-center font-medium text-[16px] leading-[24px] text-[#282828]">
                <b>By Region</b>
              </h3>
              <div className="flex flex-col gap-[35px]">
                {/* Middle East */}
                <div className="flex justify-between items-center w-[351.33px] h-[17px]">
                  <span className="font-ibm-plex-sans font-normal text-[14px] leading-[20px] text-[#282828]">Middle East</span>
                  <span className="font-ibm-plex-sans font-semibold text-[24px] leading-[140%] text-[#9B2033]">456</span>
                </div>
                {/* North America */}
                <div className="flex justify-between items-center w-[351.33px] h-[17px]">
                  <span className="font-ibm-plex-sans font-normal text-[14px] leading-[20px] text-[#282828]">North America</span>
                  <span className="font-ibm-plex-sans font-semibold text-[24px] leading-[140%] text-[#9B2033]">342</span>
                </div>
                {/* Europe */}
                <div className="flex justify-between items-center w-[351.33px] h-[17px]">
                  <span className="font-ibm-plex-sans font-normal text-[14px] leading-[20px] text-[#282828]">Europe</span>
                  <span className="font-ibm-plex-sans font-semibold text-[24px] leading-[140%] text-[#9B2033]">289</span>
                </div>
                {/* Asia Pacific */}
                <div className="flex justify-between items-end w-[351.33px] h-[17px]">
                  <span className="font-ibm-plex-sans font-normal text-[14px] leading-[20px] text-[#282828]">Asia Pacific</span>
                  <span className="font-ibm-plex-sans font-semibold text-[24px] leading-[140%] text-[#9B2033]">160</span>
                </div>
              </div>
            </div>
            {/* Experience Level */}
            <div className="flex flex-col gap-8 w-[351.34px] h-[215px]">
              <h3 className="font-ibm-plex-sans flex justify-center font-medium text-[16px] leading-[24px] text-[#282828]">
                <b>Experience Level</b>
              </h3>
              <div className="flex flex-col gap-8">
                {/* Senior */}
                <div className="relative w-[351.34px] h-[20px]">
                  <div className="absolute top-0 left-0 w-full flex justify-between items-center">
                    <span className="font-ibm-plex-sans font-normal text-[14px] leading-[20px] text-[#282828]">Senior (10+ years)</span>
                    <span className="font-ibm-plex-sans font-medium text-[16px] leading-[24px] text-[#282828]">38%</span>
                  </div>
                </div>
                {/* Mid-level */}
                <div className="relative w-[351.34px] h-[20px]">
                  <div className="absolute top-0 left-0 w-full flex justify-between items-center">
                    <span className="font-ibm-plex-sans font-normal text-[14px] leading-[20px] text-[#282828]">Mid-level (5-10 years)</span>
                    <span className="font-ibm-plex-sans font-medium text-[16px] leading-[24px] text-[#282828]">35%</span>
                  </div>
                </div>
                {/* Junior */}
                <div className="relative w-[351.34px] h-[20px]">
                  <div className="absolute top-0 left-0 w-full flex justify-between items-center">
                    <span className="font-ibm-plex-sans font-normal text-[14px] leading-[20px] text-[#282828]">Junior (0-5 years)</span>
                    <span className="font-ibm-plex-sans font-medium text-[16px] leading-[24px] text-[#282828]">27%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Participants */}
        <div className="bg-white border border-gray-300 shadow-sm rounded-xl w-[1280px] h-auto max-h-[400px] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-black font-semibold text-lg mb-6 leading-[150%] font-['IBM_Plex_Sans']">
              Recent Participants
            </h2>

            <div className="space-y-4">
              {participants.map((participant, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{participant.name}</div>
                      <div className="text-sm text-gray-600">{participant.role}</div>
                      <div className="text-sm text-gray-500">{participant.email}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm bg-red-700 text-white rounded-lg hover:bg-red-800">
                      View Profile
                    </button>
                    <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white border border-gray-300 shadow-sm rounded-xl w-[1280px] h-[120px]">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-black font-semibold text-lg mb-2 leading-[150%] font-['IBM_Plex_Sans']">
                  Export Report
                </h2>
                <p className="text-gray-600 text-sm">
                  Download a comprehensive report of all conference data and analytics.
                </p>
              </div>
              <ExportCsv />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
