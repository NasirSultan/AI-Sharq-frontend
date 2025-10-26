import Link from 'next/link'
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import Image from "next/image"

export default function page() {
  return (
    <div>
             {/* Header */}
      <div className="flex items-center gap-2 mb-6 mt-6 ml-5">
 <Link href="/participants/Forums">
    <FaArrowLeft className="text-red-800 w-[20px] h-[20px] cursor-pointer" />
  </Link>
        <h1 className="text-xl font-semibold text-black ml-4">Join Forums</h1>
      </div>

  {/* Workshop Card */}
    <div className="mb-6 p-4 max-w-8xl ml-5 py-8 border border-gray-200 rounded-xl bg-white">
    <div className="flex justify-between items-start mb-">
      <span className="bg-purple-100 text-purple-600 text-xs font-medium px-3 py-1 rounded-full">Workshop</span>
      <div className="text-right text-sm text-red-700 font-semibold">
        <div>10:00 AM - 11:30 AM</div>
        <div className="text-gray-400 text-xs">January 15, 2025</div>
      </div>
    </div>
    <h2 className="font-semibold text-gray-800 mb-2">The Future of Regional Cooperation</h2>
     <div className="flex items-center text-xs text-gray-500  space-x-4 ml-2">
      <div className="flex items-center space-x-2">
  <img src="/images/Vector.png" alt="Hall Icon" className="w-4 h-4" />
  <strong>Hall A</strong>
</div>

<div className="flex items-center space-x-2">
  <img src="/images/Vector (1).png" alt="Duration Icon" className="w-4 h-4" />
 <span>90 Minutes</span>
</div>

<div className="flex items-center space-x-2">
  <img src="/images/Vector (2).png" alt="Capacity Icon" className="w-4 h-4" />
   <span>500 capacity</span>
</div>

</div>
 <p className="text-gray-600 text-sm mt-3">
    Explore the evolving landscape of regional cooperation in the Middle East
    and North Africa. This keynote will examine emerging partnerships,
    economic integration opportunities, and the role of technology in
    fostering collaboration across borders.
  </p>
</div>

  {/* Networking Card */}
    <div className="mb-6 p-4 max-w-8xl ml-5 py-8 border border-gray-200 rounded-xl bg-white">
    <div className="flex justify-between items-start mb-2">
      <span className="bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">Networking</span>
    </div>
    <h2 className="font-semibold text-gray-800">Future of Regional Cooperation</h2>
    <p className="text-gray-600 text-sm mt-1">
      Discuss strategies for regional partnerships and collaborative initiatives
    </p>
    <div className="flex items-center text-gray-500 text-sm mt-2 space-x-7">
  <span className="flex items-center space-x-1">
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.4375 0C5.01766 0 5.57406 0.230468 5.9843 0.640704C6.39453 1.05094 6.625 1.60734 6.625 2.1875C6.625 2.76766 6.39453 3.32406 5.9843 3.7343C5.57406 4.14453 5.01766 4.375 4.4375 4.375C3.85734 4.375 3.30094 4.14453 2.8907 3.7343C2.48047 3.32406 2.25 2.76766 2.25 2.1875C2.25 1.60734 2.48047 1.05094 2.8907 0.640704C3.30094 0.230468 3.85734 0 4.4375 0ZM14.5 0C15.0802 0 15.6366 0.230468 16.0468 0.640704C16.457 1.05094 16.6875 1.60734 16.6875 2.1875C16.6875 2.76766 16.457 3.32406 16.0468 3.7343C15.6366 4.14453 15.0802 4.375 14.5 4.375C13.9198 4.375 13.3634 4.14453 12.9532 3.7343C12.543 3.32406 12.3125 2.76766 12.3125 2.1875C12.3125 1.60734 12.543 1.05094 12.9532 0.640704C13.3634 0.230468 13.9198 0 14.5 0ZM0.5 8.16758C0.5 6.55703 1.80703 5.25 3.41758 5.25H4.58516C5.01992 5.25 5.43281 5.3457 5.80469 5.51523C5.76914 5.71211 5.75273 5.91719 5.75273 6.125C5.75273 7.16953 6.21211 8.10742 6.93672 8.75C6.93125 8.75 6.92578 8.75 6.91758 8.75H1.08242C0.7625 8.75 0.5 8.4875 0.5 8.16758ZM11.5824 8.75C11.577 8.75 11.5715 8.75 11.5633 8.75C12.2906 8.10742 12.7473 7.16953 12.7473 6.125C12.7473 5.91719 12.7281 5.71484 12.6953 5.51523C13.0672 5.34297 13.4801 5.25 13.9148 5.25H15.0824C16.693 5.25 18 6.55703 18 8.16758C18 8.49023 17.7375 8.75 17.4176 8.75H11.5824ZM6.625 6.125C6.625 5.42881 6.90156 4.76113 7.39384 4.26884C7.88613 3.77656 8.55381 3.5 9.25 3.5C9.94619 3.5 10.6139 3.77656 11.1062 4.26884C11.5984 4.76113 11.875 5.42881 11.875 6.125C11.875 6.82119 11.5984 7.48887 11.1062 7.98116C10.6139 8.47344 9.94619 8.75 9.25 8.75C8.55381 8.75 7.88613 8.47344 7.39384 7.98116C6.90156 7.48887 6.625 6.82119 6.625 6.125ZM4 13.2699C4 11.2574 5.63242 9.625 7.64492 9.625H10.8551C12.8676 9.625 14.5 11.2574 14.5 13.2699C14.5 13.6719 14.1746 14 13.7699 14H4.73008C4.32812 14 4 13.6746 4 13.2699Z" fill="#9B2033"/>
</svg>
 245 Members</span>
  <span className="flex items-center space-x-2">
        <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.87526 8.25C7.56823 8.25 9.75026 6.40312 9.75026 4.125C9.75026 1.84688 7.56823 0 4.87526 0C2.18229 0 0.00025651 1.84688 0.00025651 4.125C0.00025651 5.02969 0.344788 5.86641 0.928381 6.54844C0.84635 6.76875 0.724475 6.96328 0.595569 7.12734C0.483069 7.27266 0.368225 7.38516 0.28385 7.4625C0.241663 7.5 0.206507 7.53047 0.183069 7.54922C0.17135 7.55859 0.161975 7.56562 0.157288 7.56797L0.1526 7.57266C0.023694 7.66875 -0.032556 7.8375 0.0190065 7.98984C0.070569 8.14219 0.213538 8.25 0.375257 8.25C0.886194 8.25 1.40182 8.11875 1.83073 7.95703C2.04635 7.875 2.24791 7.78359 2.42369 7.68984C3.14323 8.04609 3.97994 8.25 4.87526 8.25ZM10.5003 4.125C10.5003 6.75703 8.1776 8.73984 5.42604 8.97656C5.99557 10.7203 7.88463 12 10.1253 12C11.0206 12 11.8573 11.7961 12.5792 11.4398C12.7549 11.5336 12.9542 11.625 13.1698 11.707C13.5987 11.8687 14.1143 12 14.6253 12C14.787 12 14.9323 11.8945 14.9815 11.7398C15.0307 11.5852 14.9768 11.4164 14.8456 11.3203L14.8409 11.3156C14.8362 11.3109 14.8268 11.3062 14.8151 11.2969C14.7917 11.2781 14.7565 11.25 14.7143 11.2102C14.6299 11.1328 14.5151 11.0203 14.4026 10.875C14.2737 10.7109 14.1518 10.5141 14.0698 10.2961C14.6534 9.61641 14.9979 8.77969 14.9979 7.87266C14.9979 5.69766 13.0081 3.91406 10.4839 3.75937C10.4932 3.87891 10.4979 4.00078 10.4979 4.12266L10.5003 4.125Z" fill="#9B2033"/>
</svg>
 120 Posts</span>
    </div>
   
<div className="flex items-center text-xs text-gray-400 mt-4 space-x-2">
  <img
    src="/images/img (13).png" // 🔁 Replace this with actual path
    alt="Creator"
    className="w-5 h-5 rounded-full"
  />
  <span>Created By: Dr. Johnathan</span>
</div>
</div>

  {/* Timeline / Join Note */}
  <div className="text-center">
    <div className="text-sm text-gray-500 mb-1">Today</div>
    <div className="inline-block bg-pink-100 text-pink-700 text-xs font-medium px-3 py-1 rounded-full">
      You Joined the forum 10:35 AM
    </div>
  </div><br></br>
  <div className="space-y-6">

  {/* === Comment Box 1 === */}
  <div className="bg-white border rounded-lg p-4 shadow-sm text-sm max-w-8xl ml-4">
    <div className="flex items-start space-x-3">
      <img src="/images/img (13).png" alt="avatar" className="w-8 h-8 rounded-full" />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-800">Dr. Johnathan</span>
          <span className="text-xs text-gray-400">1 hour ago</span>
        </div>
        <div className="mt-1 mb-3 mr-5 text-gray-700">
          Great question Sarah! From my experience, the biggest challenges are:
          <br />
          <span className='font-extrabold text-md mt-2'>Data Privacy Regulations:</span> <span className='text-sm'>GDPR compliance and local data protection laws<br />
          <strong className='font-extrabold text-md mt-2'>Talent Shortage:</strong> Limited AI/ML specialists in the region<br /></span>
          <strong className='font-extrabold text-md mt-2'>Infrastructure:</strong> Legacy systems integration challenges
          <br /><br />
          We've had success with gradual implementation and extensive training programs. What’s been your experience with stakeholder buy-in?
        </div>
        <div className="flex items-center space-x-6 text-xs text-gray-500 mt-3">
          <button className="flex items-center space-x-1 hover:text-red-600">
            <span><svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.56953 0.27668C9.28047 0.418867 9.74258 1.11066 9.60039 1.8216L9.5375 2.13332C9.39258 2.8634 9.12461 3.55793 8.75 4.18957H12.6875C13.4121 4.18957 14 4.77746 14 5.50207C14 6.00793 13.7129 6.44816 13.2918 6.66691C13.5898 6.90754 13.7812 7.27668 13.7812 7.68957C13.7812 8.32941 13.3219 8.86262 12.7176 8.97746C12.8379 9.17707 12.9062 9.40949 12.9062 9.65832C12.9062 10.2407 12.5262 10.7357 12.0012 10.9052C12.0203 10.9954 12.0312 11.0911 12.0312 11.1896C12.0312 11.9142 11.4434 12.5021 10.7188 12.5021H8.05273C7.5332 12.5021 7.02734 12.3489 6.59531 12.0618L5.54258 11.3591C4.8125 10.8724 4.375 10.0521 4.375 9.17434V8.12707V6.81457V6.13371C4.375 5.33527 4.73867 4.58332 5.35938 4.08293L5.56172 3.9216C6.28633 3.34191 6.78125 2.52707 6.96172 1.61926L7.02461 1.30754C7.1668 0.596601 7.85859 0.134492 8.56953 0.27668ZM0.875 4.62707H2.625C3.10898 4.62707 3.5 5.01809 3.5 5.50207V11.6271C3.5 12.1111 3.10898 12.5021 2.625 12.5021H0.875C0.391016 12.5021 0 12.1111 0 11.6271V5.50207C0 5.01809 0.391016 4.62707 0.875 4.62707Z" fill="#9B2033"/>
</svg>
</span><span>12</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-red-600">
          <span>
<svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.60547 0.328578C5.91992 0.468031 6.125 0.782484 6.125 1.12702V2.87702H9.1875C11.8453 2.87702 14 5.0317 14 7.68952C14 10.7876 11.7715 12.1712 11.2602 12.4501C11.1918 12.4883 11.1152 12.502 11.0387 12.502C10.7406 12.502 10.5 12.2587 10.5 11.9633C10.5 11.7583 10.6176 11.5696 10.768 11.4301C11.025 11.1895 11.375 10.7083 11.375 9.87975C11.375 8.43053 10.1992 7.25475 8.75 7.25475H6.125V9.00475C6.125 9.34928 5.92266 9.66373 5.60547 9.80319C5.28828 9.94264 4.92188 9.88522 4.66484 9.65553L0.289844 5.71803C0.106641 5.5485 0 5.31334 0 5.06452C0 4.81569 0.106641 4.58053 0.289844 4.41373L4.66484 0.476235C4.92188 0.243813 5.29102 0.186391 5.60547 0.328578Z" fill="#9B2033"/>
</svg>

</span><span>Replies</span></button>
              <button className="flex items-center space-x-1 hover:text-red-600">

          <span><svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.39453 0.328578C8.08008 0.468031 7.875 0.782484 7.875 1.12702V2.87702H4.8125C2.15469 2.87702 0 5.0317 0 7.68952C0 10.7876 2.22852 12.1712 2.73984 12.4501C2.8082 12.4883 2.88477 12.502 2.96133 12.502C3.25937 12.502 3.5 12.2587 3.5 11.9633C3.5 11.7583 3.38242 11.5696 3.23203 11.4301C2.975 11.1895 2.625 10.7083 2.625 9.87975C2.625 8.43053 3.80078 7.25475 5.25 7.25475H7.875V9.00475C7.875 9.34928 8.07734 9.66373 8.39453 9.80319C8.71172 9.94264 9.07812 9.88522 9.33516 9.65553L13.7102 5.71803C13.8934 5.5485 14 5.31334 14 5.06452C14 4.81569 13.8934 4.58053 13.7102 4.41373L9.33516 0.476235C9.07812 0.243813 8.70898 0.186391 8.39453 0.328578Z" fill="#9B2033"/>
</svg>

</span><span>Share</span></button>

        </div>

        {/* Replies */}
        <div className="mt-4 space-y-3 pl-4">
          {/* Reply 1 */}
          <div className="flex items-start space-x-3">
            <img src="/images/img (13).png" alt="avatar" className="w-7 h-7 rounded-full" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Dr. Johnathan</span>
                <span className="text-xs text-gray-400">1 hour ago</span>
              </div>
              <div className="mt-1 text-gray-700">
                I agree, Emma. I especially liked how they tied the framework back to real-world applications. Too often sessions are just theory, but here I actually feel like I can take the model and use it with my team right away. Did you also find the group activity helpful?
              </div>
            </div>
          </div>

          {/* Reply 2 */}
          <div className="flex items-start space-x-3">
            <img src="/images/img16.jpg" alt="avatar" className="w-7 h-7 rounded-full" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Layla Hassan</span>
                <span className="text-xs text-gray-400">1 hour ago</span>
              </div>
              <div className="mt-1 text-gray-700">
                The talent shortage is real! We’ve been partnering with local universities to create AI training programs. It’s a long-term investment but necessary.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

   {/* === Comment Box 1 === */}
  <div className="bg-white border rounded-lg p-4 shadow-sm text-sm max-w-8xl ml-4">
    <div className="flex items-start space-x-3">
      <img src="/images/img (13).png" alt="avatar" className="w-8 h-8 rounded-full" />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-800">Dr. Johnathan</span>
          <span className="text-xs text-gray-400">1 hour ago</span>
        </div>
        <div className="mt-1 mb-3 mr-5 text-gray-700">
          Great question Sarah! From my experience, the biggest challenges are:
          <br />
          <span className='font-extrabold text-md mt-2'>Data Privacy Regulations:</span> <span className='text-sm'>GDPR compliance and local data protection laws<br />
          <strong className='font-extrabold text-md mt-2'>Talent Shortage:</strong> Limited AI/ML specialists in the region<br /></span>
          <strong className='font-extrabold text-md mt-2'>Infrastructure:</strong> Legacy systems integration challenges
          <br /><br />
          We've had success with gradual implementation and extensive training programs. What’s been your experience with stakeholder buy-in?
        </div>
        <div className="flex items-center space-x-6 text-xs text-gray-500 mt-3">
          <button className="flex items-center space-x-1 hover:text-red-600">
            <span><svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.56953 0.27668C9.28047 0.418867 9.74258 1.11066 9.60039 1.8216L9.5375 2.13332C9.39258 2.8634 9.12461 3.55793 8.75 4.18957H12.6875C13.4121 4.18957 14 4.77746 14 5.50207C14 6.00793 13.7129 6.44816 13.2918 6.66691C13.5898 6.90754 13.7812 7.27668 13.7812 7.68957C13.7812 8.32941 13.3219 8.86262 12.7176 8.97746C12.8379 9.17707 12.9062 9.40949 12.9062 9.65832C12.9062 10.2407 12.5262 10.7357 12.0012 10.9052C12.0203 10.9954 12.0312 11.0911 12.0312 11.1896C12.0312 11.9142 11.4434 12.5021 10.7188 12.5021H8.05273C7.5332 12.5021 7.02734 12.3489 6.59531 12.0618L5.54258 11.3591C4.8125 10.8724 4.375 10.0521 4.375 9.17434V8.12707V6.81457V6.13371C4.375 5.33527 4.73867 4.58332 5.35938 4.08293L5.56172 3.9216C6.28633 3.34191 6.78125 2.52707 6.96172 1.61926L7.02461 1.30754C7.1668 0.596601 7.85859 0.134492 8.56953 0.27668ZM0.875 4.62707H2.625C3.10898 4.62707 3.5 5.01809 3.5 5.50207V11.6271C3.5 12.1111 3.10898 12.5021 2.625 12.5021H0.875C0.391016 12.5021 0 12.1111 0 11.6271V5.50207C0 5.01809 0.391016 4.62707 0.875 4.62707Z" fill="#9B2033"/>
</svg>
</span><span>12</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-red-600">
          <span>
<svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.60547 0.328578C5.91992 0.468031 6.125 0.782484 6.125 1.12702V2.87702H9.1875C11.8453 2.87702 14 5.0317 14 7.68952C14 10.7876 11.7715 12.1712 11.2602 12.4501C11.1918 12.4883 11.1152 12.502 11.0387 12.502C10.7406 12.502 10.5 12.2587 10.5 11.9633C10.5 11.7583 10.6176 11.5696 10.768 11.4301C11.025 11.1895 11.375 10.7083 11.375 9.87975C11.375 8.43053 10.1992 7.25475 8.75 7.25475H6.125V9.00475C6.125 9.34928 5.92266 9.66373 5.60547 9.80319C5.28828 9.94264 4.92188 9.88522 4.66484 9.65553L0.289844 5.71803C0.106641 5.5485 0 5.31334 0 5.06452C0 4.81569 0.106641 4.58053 0.289844 4.41373L4.66484 0.476235C4.92188 0.243813 5.29102 0.186391 5.60547 0.328578Z" fill="#9B2033"/>
</svg>

</span><span>Replies</span></button>
              <button className="flex items-center space-x-1 hover:text-red-600">

          <span><svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.39453 0.328578C8.08008 0.468031 7.875 0.782484 7.875 1.12702V2.87702H4.8125C2.15469 2.87702 0 5.0317 0 7.68952C0 10.7876 2.22852 12.1712 2.73984 12.4501C2.8082 12.4883 2.88477 12.502 2.96133 12.502C3.25937 12.502 3.5 12.2587 3.5 11.9633C3.5 11.7583 3.38242 11.5696 3.23203 11.4301C2.975 11.1895 2.625 10.7083 2.625 9.87975C2.625 8.43053 3.80078 7.25475 5.25 7.25475H7.875V9.00475C7.875 9.34928 8.07734 9.66373 8.39453 9.80319C8.71172 9.94264 9.07812 9.88522 9.33516 9.65553L13.7102 5.71803C13.8934 5.5485 14 5.31334 14 5.06452C14 4.81569 13.8934 4.58053 13.7102 4.41373L9.33516 0.476235C9.07812 0.243813 8.70898 0.186391 8.39453 0.328578Z" fill="#9B2033"/>
</svg>

</span><span>Share</span></button>

        </div>

        {/* Replies */}
        <div className="mt-4 space-y-3 pl-4">
          {/* Reply 1 */}
          <div className="flex items-start space-x-3">
            <img src="/images/img (13).png" alt="avatar" className="w-7 h-7 rounded-full" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Dr. Johnathan</span>
                <span className="text-xs text-gray-400">1 hour ago</span>
              </div>
              <div className="mt-1 text-gray-700">
                I agree, Emma. I especially liked how they tied the framework back to real-world applications. Too often sessions are just theory, but here I actually feel like I can take the model and use it with my team right away. Did you also find the group activity helpful?
              </div>
            </div>
          </div>

          {/* Reply 2 */}
          <div className="flex items-start space-x-3">
            <img src="/images/img16.jpg" alt="avatar" className="w-7 h-7 rounded-full" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Layla Hassan</span>
                <span className="text-xs text-gray-400">1 hour ago</span>
              </div>
              <div className="mt-1 text-gray-700">
                The talent shortage is real! We’ve been partnering with local universities to create AI training programs. It’s a long-term investment but necessary.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

   {/* === Comment Box 1 === */}
  <div className="bg-white border rounded-lg p-4 shadow-sm text-sm max-w-8xl ml-4">
    <div className="flex items-start space-x-3">
      <img src="/images/img (13).png" alt="avatar" className="w-8 h-8 rounded-full" />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-800">Dr. Johnathan</span>
          <span className="text-xs text-gray-400">1 hour ago</span>
        </div>
        <div className="mt-1 mb-3 mr-5 text-gray-700">
          Great question Sarah! From my experience, the biggest challenges are:
          <br />
          <span className='font-extrabold text-md mt-2'>Data Privacy Regulations:</span> <span className='text-sm'>GDPR compliance and local data protection laws<br />
          <strong className='font-extrabold text-md mt-2'>Talent Shortage:</strong> Limited AI/ML specialists in the region<br /></span>
          <strong className='font-extrabold text-md mt-2'>Infrastructure:</strong> Legacy systems integration challenges
          <br /><br />
          We've had success with gradual implementation and extensive training programs. What’s been your experience with stakeholder buy-in?
        </div>
        <div className="flex items-center space-x-6 text-xs text-gray-500 mt-3">
          <button className="flex items-center space-x-1 hover:text-red-600">
            <span><svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.56953 0.27668C9.28047 0.418867 9.74258 1.11066 9.60039 1.8216L9.5375 2.13332C9.39258 2.8634 9.12461 3.55793 8.75 4.18957H12.6875C13.4121 4.18957 14 4.77746 14 5.50207C14 6.00793 13.7129 6.44816 13.2918 6.66691C13.5898 6.90754 13.7812 7.27668 13.7812 7.68957C13.7812 8.32941 13.3219 8.86262 12.7176 8.97746C12.8379 9.17707 12.9062 9.40949 12.9062 9.65832C12.9062 10.2407 12.5262 10.7357 12.0012 10.9052C12.0203 10.9954 12.0312 11.0911 12.0312 11.1896C12.0312 11.9142 11.4434 12.5021 10.7188 12.5021H8.05273C7.5332 12.5021 7.02734 12.3489 6.59531 12.0618L5.54258 11.3591C4.8125 10.8724 4.375 10.0521 4.375 9.17434V8.12707V6.81457V6.13371C4.375 5.33527 4.73867 4.58332 5.35938 4.08293L5.56172 3.9216C6.28633 3.34191 6.78125 2.52707 6.96172 1.61926L7.02461 1.30754C7.1668 0.596601 7.85859 0.134492 8.56953 0.27668ZM0.875 4.62707H2.625C3.10898 4.62707 3.5 5.01809 3.5 5.50207V11.6271C3.5 12.1111 3.10898 12.5021 2.625 12.5021H0.875C0.391016 12.5021 0 12.1111 0 11.6271V5.50207C0 5.01809 0.391016 4.62707 0.875 4.62707Z" fill="#9B2033"/>
</svg>
</span><span>12</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-red-600">
          <span>
<svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.60547 0.328578C5.91992 0.468031 6.125 0.782484 6.125 1.12702V2.87702H9.1875C11.8453 2.87702 14 5.0317 14 7.68952C14 10.7876 11.7715 12.1712 11.2602 12.4501C11.1918 12.4883 11.1152 12.502 11.0387 12.502C10.7406 12.502 10.5 12.2587 10.5 11.9633C10.5 11.7583 10.6176 11.5696 10.768 11.4301C11.025 11.1895 11.375 10.7083 11.375 9.87975C11.375 8.43053 10.1992 7.25475 8.75 7.25475H6.125V9.00475C6.125 9.34928 5.92266 9.66373 5.60547 9.80319C5.28828 9.94264 4.92188 9.88522 4.66484 9.65553L0.289844 5.71803C0.106641 5.5485 0 5.31334 0 5.06452C0 4.81569 0.106641 4.58053 0.289844 4.41373L4.66484 0.476235C4.92188 0.243813 5.29102 0.186391 5.60547 0.328578Z" fill="#9B2033"/>
</svg>

</span><span>Replies</span></button>
              <button className="flex items-center space-x-1 hover:text-red-600">

          <span><svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.39453 0.328578C8.08008 0.468031 7.875 0.782484 7.875 1.12702V2.87702H4.8125C2.15469 2.87702 0 5.0317 0 7.68952C0 10.7876 2.22852 12.1712 2.73984 12.4501C2.8082 12.4883 2.88477 12.502 2.96133 12.502C3.25937 12.502 3.5 12.2587 3.5 11.9633C3.5 11.7583 3.38242 11.5696 3.23203 11.4301C2.975 11.1895 2.625 10.7083 2.625 9.87975C2.625 8.43053 3.80078 7.25475 5.25 7.25475H7.875V9.00475C7.875 9.34928 8.07734 9.66373 8.39453 9.80319C8.71172 9.94264 9.07812 9.88522 9.33516 9.65553L13.7102 5.71803C13.8934 5.5485 14 5.31334 14 5.06452C14 4.81569 13.8934 4.58053 13.7102 4.41373L9.33516 0.476235C9.07812 0.243813 8.70898 0.186391 8.39453 0.328578Z" fill="#9B2033"/>
</svg>

</span><span>Share</span></button>

        </div>

        {/* Replies */}
        <div className="mt-4 space-y-3 pl-4">
          {/* Reply 1 */}
          <div className="flex items-start space-x-3">
            <img src="/images/img (13).png" alt="avatar" className="w-7 h-7 rounded-full" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Dr. Johnathan</span>
                <span className="text-xs text-gray-400">1 hour ago</span>
              </div>
              <div className="mt-1 text-gray-700">
                I agree, Emma. I especially liked how they tied the framework back to real-world applications. Too often sessions are just theory, but here I actually feel like I can take the model and use it with my team right away. Did you also find the group activity helpful?
              </div>
            </div>
          </div>

          {/* Reply 2 */}
          <div className="flex items-start space-x-3">
            <img src="/images/img16.jpg" alt="avatar" className="w-7 h-7 rounded-full" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Layla Hassan</span>
                <span className="text-xs text-gray-400">1 hour ago</span>
              </div>
              <div className="mt-1 text-gray-700">
                The talent shortage is real! We’ve been partnering with local universities to create AI training programs. It’s a long-term investment but necessary.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div><br></br>

                <Image src="/images/line.png" alt="Logo" width={1729} height={127} className="absolute " />

</div>
  )
}
