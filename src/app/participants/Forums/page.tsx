'use client'; // Only for App Router, remove if using Pages Router
import React,{useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

const tags = ["Networking", "AI", "Innovation", "Sustainability", "Bussinuss"];
const discussions = [
  {
    title: "Future of Regional Cooperation",
    group: "Group By Digital Transformation in MENA Session",
    description:
      "Discuss strategies for regional partnerships and collaborative initiatives.",
    tag: "Networking",
    members: 245,
    posts: 120,
    postedBy: "Dr. Johnathan",
    avatarUrl: "/images/img (13).png",
  },
  {
    title: "Innovations in Technology",
    group: "Group By Digital Transformation in MENA Session",
    description:
      "Explore cutting-edge technologies impacting various sectors.",
    tag: "AI",
    members: 300,
    posts: 200,
    postedBy: "Dr. Emily",
    avatarUrl: "/images/img (13).png",
  },
  {
    title: "Sustainable Practices",
    group: "Group By Digital Transformation in MENA Session",
    description:
      "Hands-on session on implementing sustainability in business.",
    tag: "Innovation",
    members: 150,
    posts: 75,
    postedBy: "Mr. Alex",
    avatarUrl: "/images/img (13).png",
  },
  {
    title: "Economic Recovery Post-COVID",
    group: "Group By Digital Transformation in MENA Session",
    description:
      "Explore post-pandemic recovery strategies for local and global economies.",
    tag: "Sustainability",
    members: 210,
    posts: 90,
    postedBy: "Mr. Haseeb",
    avatarUrl: "/images/img (13).png",
  },
  {
    title: "Connecting Local Entrepreneurs",
    group: "Group By Digital Transformation in MENA Session",
    description:
      "Discuss the role of local entrepreneurs in digital transformation and economic development.",
    tag: "Bussinuss",
    members: 200,
    posts: 110,
    postedBy: "Dr. Ghazi",
    avatarUrl: "/images/img (13).png",
  },
];

const tagColors: Record<string, string> = {
  Networking: "bg-blue-100 text-blue-700",
  AI: "bg-green-300 text-green-700",
  Innovation: "bg-yellow-200 text-yellow-700",
  Sustainability: "bg-[#FCBDFF] text-purple-700",
  Bussinuss: "bg-pink-100 text-pink-700",
};

export default function ForumsPage() {
      const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <div className="min-h-screen bg-[#fafafa] p-4 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5 ml-5">
        {/* Icon */}
        <Link href="/participants/Home">
    <FaArrowLeft className="text-red-800 w-[20px] h-[20px] cursor-pointer" />
  </Link>
        <h1 className="text-xl font-semibold text-black ml-4">Forums</h1>
      </div>

      {/* Search Bar */}
      <div className="mb-4 relative text-gray-600">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {/* Search Icon */}
          {/* (your SVG already pasted above) */}
        </div>
        <input
          type="text"
          placeholder="Search"
          className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Trending Tags */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-black">Trending Topics</h2>
          <div className="flex flex-wrap gap-2 justify-end">
            {tags.map((tag) => (
              <span
                key={tag}
                className={`text-sm px-3 py-1 rounded-full ${tagColors[tag]}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Discussions */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl text-black font-semibold">Featured Discussions</h2>
        
        <button className="bg-red-800 text-white text-sm px-4 py-2 rounded-xl hover:bg-red-700"
            onClick={() => setIsModalOpen(true)}
>
          Create New Topic
        </button>
      </div>

      <div className="space-y-4">
        {discussions.map((discussion, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
          >
            {/* Left Section */}
            <div className="w-full sm:w-[85%]">
              {/* Tag */}
              <div className="mb-2">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${tagColors[discussion.tag]}`}
                >
                  {discussion.tag}
                </span>
              </div>

              {/* Title + Group */}
              <div className="mb-1 text-sm sm:text-base font-semibold text-black flex flex-wrap items-center gap-1">
                {discussion.title}
                <span className="text-red-500 mx-1 ml-5">•</span>
                <span className="font-bold ml-5 text-black">
                  {discussion.group}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 mb-3">
                {discussion.description}
              </p>

              {/* Members & Posts */}
              <div className="flex items-center text-sm text-gray-600 mb-2 gap-4">
                <span className="flex items-center gap-1">
                  <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.375 0C3.87228 0 4.34919 0.197544 4.70083 0.549175C5.05246 0.900805 5.25 1.37772 5.25 1.875C5.25 2.37228 5.05246 2.84919 4.70083 3.20083C4.34919 3.55246 3.87228 3.75 3.375 3.75C2.87772 3.75 2.40081 3.55246 2.04917 3.20083C1.69754 2.84919 1.5 2.37228 1.5 1.875C1.5 1.37772 1.69754 0.900805 2.04917 0.549175C2.40081 0.197544 2.87772 0 3.375 0ZM12 0C12.4973 0 12.9742 0.197544 13.3258 0.549175C13.6775 0.900805 13.875 1.37772 13.875 1.875C13.875 2.37228 13.6775 2.84919 13.3258 3.20083C12.9742 3.55246 12.4973 3.75 12 3.75C11.5027 3.75 11.0258 3.55246 10.6742 3.20083C10.3225 2.84919 10.125 2.37228 10.125 1.875C10.125 1.37772 10.3225 0.900805 10.6742 0.549175C11.0258 0.197544 11.5027 0 12 0ZM0 7.00078C0 5.62031 1.12031 4.5 2.50078 4.5H3.50156C3.87422 4.5 4.22813 4.58203 4.54688 4.72734C4.51641 4.89609 4.50234 5.07188 4.50234 5.25C4.50234 6.14531 4.89609 6.94922 5.51719 7.5C5.5125 7.5 5.50781 7.5 5.50078 7.5H0.499219C0.225 7.5 0 7.275 0 7.00078ZM9.49922 7.5C9.49453 7.5 9.48984 7.5 9.48281 7.5C10.1062 6.94922 10.4977 6.14531 10.4977 5.25C10.4977 5.07188 10.4812 4.89844 10.4531 4.72734C10.7719 4.57969 11.1258 4.5 11.4984 4.5H12.4992C13.8797 4.5 15 5.62031 15 7.00078C15 7.27734 14.775 7.5 14.5008 7.5H9.49922ZM5.25 5.25C5.25 4.65326 5.48705 4.08097 5.90901 3.65901C6.33097 3.23705 6.90326 3 7.5 3C8.09674 3 8.66903 3.23705 9.09099 3.65901C9.51295 4.08097 9.75 4.65326 9.75 5.25C9.75 5.84674 9.51295 6.41903 9.09099 6.84099C8.66903 7.26295 8.09674 7.5 7.5 7.5C6.90326 7.5 6.33097 7.26295 5.90901 6.84099C5.48705 6.41903 5.25 5.84674 5.25 5.25ZM3 11.3742C3 9.64922 4.39922 8.25 6.12422 8.25H8.87578C10.6008 8.25 12 9.64922 12 11.3742C12 11.7188 11.7211 12 11.3742 12H3.62578C3.28125 12 3 11.7211 3 11.3742Z" fill="#9B2033"/>
</svg>
 {discussion.members} Members
                </span>
                <span className="flex items-center gap-1">
                  <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.87526 8.25C7.56823 8.25 9.75026 6.40312 9.75026 4.125C9.75026 1.84688 7.56823 0 4.87526 0C2.18229 0 0.00025651 1.84688 0.00025651 4.125C0.00025651 5.02969 0.344788 5.86641 0.928381 6.54844C0.84635 6.76875 0.724475 6.96328 0.595569 7.12734C0.483069 7.27266 0.368225 7.38516 0.28385 7.4625C0.241663 7.5 0.206507 7.53047 0.183069 7.54922C0.17135 7.55859 0.161975 7.56562 0.157288 7.56797L0.1526 7.57266C0.023694 7.66875 -0.032556 7.8375 0.0190065 7.98984C0.070569 8.14219 0.213538 8.25 0.375257 8.25C0.886194 8.25 1.40182 8.11875 1.83073 7.95703C2.04635 7.875 2.24791 7.78359 2.42369 7.68984C3.14323 8.04609 3.97994 8.25 4.87526 8.25ZM10.5003 4.125C10.5003 6.75703 8.1776 8.73984 5.42604 8.97656C5.99557 10.7203 7.88463 12 10.1253 12C11.0206 12 11.8573 11.7961 12.5792 11.4398C12.7549 11.5336 12.9542 11.625 13.1698 11.707C13.5987 11.8687 14.1143 12 14.6253 12C14.787 12 14.9323 11.8945 14.9815 11.7398C15.0307 11.5852 14.9768 11.4164 14.8456 11.3203L14.8409 11.3156C14.8362 11.3109 14.8268 11.3062 14.8151 11.2969C14.7917 11.2781 14.7565 11.25 14.7143 11.2102C14.6299 11.1328 14.5151 11.0203 14.4026 10.875C14.2737 10.7109 14.1518 10.5141 14.0698 10.2961C14.6534 9.61641 14.9979 8.77969 14.9979 7.87266C14.9979 5.69766 13.0081 3.91406 10.4839 3.75937C10.4932 3.87891 10.4979 4.00078 10.4979 4.12266L10.5003 4.125Z" fill="#9B2033"/>
</svg>
 {discussion.posts} Posts
                </span>
              </div>

              {/* Created By */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <img
                  src={discussion.avatarUrl}
                  alt={discussion.postedBy}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span>
                  Created By:{" "}
                  <span className="font-medium">{discussion.postedBy}</span>
                </span>
              </div>
            </div>

            {/* Join Button */}
          <div className="mt-4 sm:mt-0 sm:ml-4">
            <Link href="/participants/JoinForums">
  <button
    className="text-sm px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700"
  >
    Join Forum
  </button>
  </Link>
</div></div>
        ))}
      </div>
      
    </div>
     {/* Footer Line Image */}
  <div className="w-full mt-20">
    <Image
      src="/images/line.png"
      alt="Footer Line"
      width={1729}
      height={127}
      className="w-full"
    />
  </div>
  
  {isModalOpen && (
  <div className="fixed inset-0  flex items-center justify-center bg-transparent">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black opacity-50"
      onClick={() => setIsModalOpen(false)}
    ></div>

    {/* Modal Content */}
<div className="relative z-50 bg-white w-full max-w-md mx-auto rounded-xl p-6 max-h-[95vh] ">
      {/* Close Button */}
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
      >
        &times;
      </button>

      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img
          src="/images/logo1.png"
          alt="Al Sharq Conference"
          className="h-10"
        />
      </div>

      {/* Heading */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-black">Create New Topic</h2>
        <p className="text-sm text-gray-500">Start a new discussion</p>
      </div>

      {/* Form (unchanged) */}
      <form className="space-y-1">
        {/* Topic Title */}
        <div>
          <label className="text-sm font-medium text-gray-700">Topic Title*</label>
          <input
            type="text"
            placeholder="Enter a clear title"
            className="w-full mt-1 placeholder-gray-400 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Category */}
       {/* Category */}
<div className="relative">
  <label className="text-sm font-medium text-gray-700">Category*</label>

  <div className="relative mt-1">
    <select className="w-full px-4 py-2 border border-gray-300 text-gray-400 rounded-md appearance-none pr-10">
      <option>General Discussion</option>
      <option>Technology</option>
      <option>Innovation</option>
    </select>

    {/* Icon */}
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
          <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clipRule="evenOdd" d="M7.70637 8.15412C7.51884 8.34159 7.26453 8.44691 6.99937 8.44691C6.7342 8.44691 6.47989 8.34159 6.29237 8.15412L0.635367 2.49712C0.539856 2.40487 0.463674 2.29453 0.411265 2.17253C0.358856 2.05052 0.33127 1.9193 0.330116 1.78652C0.328962 1.65374 0.354264 1.52206 0.404545 1.39917C0.454826 1.27627 0.529079 1.16462 0.622972 1.07073C0.716864 0.976832 0.828516 0.902579 0.951412 0.852298C1.07431 0.802017 1.20599 0.776716 1.33877 0.77787C1.47155 0.779024 1.60277 0.80661 1.72477 0.859019C1.84677 0.911428 1.95712 0.98761 2.04937 1.08312L6.99937 6.03312L11.9494 1.08312C12.138 0.900962 12.3906 0.800168 12.6528 0.802446C12.915 0.804724 13.1658 0.909893 13.3512 1.0953C13.5366 1.28071 13.6418 1.53152 13.644 1.79372C13.6463 2.05592 13.5455 2.30852 13.3634 2.49712L7.70637 8.15412Z" fill="#9B2033"/>
</svg>
    </div>
  </div>
</div>

    {/* Group by Session */}
<div className="relative">
  <label className="text-sm font-medium text-gray-700">Group by Session*</label>

  <div className="relative mt-1">
    <select className="w-full px-4 py-2 border text-gray-400 border-gray-300 rounded-md appearance-none pr-10">
      <option>Group By Digital Transformation</option>
      <option>AI & Ethics</option>
      <option>Policy Change</option>
    </select>

    {/* Icon (You can replace this with any SVG or image) */}
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
           <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clipRule="evenodd" d="M7.70637 8.15412C7.51884 8.34159 7.26453 8.44691 6.99937 8.44691C6.7342 8.44691 6.47989 8.34159 6.29237 8.15412L0.635367 2.49712C0.539856 2.40487 0.463674 2.29453 0.411265 2.17253C0.358856 2.05052 0.33127 1.9193 0.330116 1.78652C0.328962 1.65374 0.354264 1.52206 0.404545 1.39917C0.454826 1.27627 0.529079 1.16462 0.622972 1.07073C0.716864 0.976832 0.828516 0.902579 0.951412 0.852298C1.07431 0.802017 1.20599 0.776716 1.33877 0.77787C1.47155 0.779024 1.60277 0.80661 1.72477 0.859019C1.84677 0.911428 1.95712 0.98761 2.04937 1.08312L6.99937 6.03312L11.9494 1.08312C12.138 0.900962 12.3906 0.800168 12.6528 0.802446C12.915 0.804724 13.1658 0.909893 13.3512 1.0953C13.5366 1.28071 13.6418 1.53152 13.644 1.79372C13.6463 2.05592 13.5455 2.30852 13.3634 2.49712L7.70637 8.15412Z" fill="#9B2033"/>
</svg>
    </div>
  </div>
</div>


        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={3}
            placeholder="Describe your topic in detail"
            className="w-full placeholder-gray-400 mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="text-sm font-medium text-gray-700">Tags</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              placeholder="Innovation"
              className="flex-1 placeholder-gray-400 px-4 py-2 border border-gray-300 rounded-md"
            />
            <a href='' 
                        className=" text-red-700 font-bold px-3 py-1 rounded-md  text-sm underline"
  >
              Add
            </a>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm">Innovation</span>
            <span className="bg-pink-300 text-pink-800 px-3 py-1 rounded-full text-sm">Sustainability</span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-4 bg-red-800 text-white py-2 rounded-lg hover:bg-red-700"
        >
          Create
        </button>
      </form>
    </div>
  </div>
)}

    </>
  );
}
