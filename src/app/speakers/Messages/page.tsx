import React from "react";
import Image from "next/image"
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";



export default function ChatPage() {
  return (
    <>
     <div className="flex items-center gap-2 mt-6 ml-5">
 <Link href="/speakers/ManageSessions">
    <FaArrowLeft className="text-red-800 w-[20px] h-[20px] cursor-pointer" />
  </Link>
        <h1 className="text-xl font-semibold text-black ml-4">Chats</h1>
      </div>
    <div className="h-screen flex items-center justify-center  p-6">
      
     
      <div className="flex w-full mt-70 h-[897px] space-x-7">
        {/* Sidebar */}
        <div className="w-1/3 bg-white rounded-2xl shadow border flex flex-col">
          <h2 className="px-6 py-4 text-lg font-semibold border-b border-b-gray-300 text-black">Chat List</h2>
          
          {/* Search */}
   <div className="px-4 py-2 border-b border-b-gray-300 text-gray-400">
  <div className="relative">
    <input
      type="text"
      placeholder="Search"
      className="w-full text-black pl-4 pr-10 py-2 text-sm focus:outline-none"
    />
    {/* Search Icon */}
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
    >
      <path
        d="M14.5962 14.6248L17.8046 17.8332M16.791 8.979C16.791 11.051 15.9679 13.0381 14.5028 14.5033C13.0377 15.9684 11.0505 16.7915 8.97852 16.7915C6.90651 16.7915 4.91937 15.9684 3.45424 14.5033C1.98912 13.0381 1.16602 11.051 1.16602 8.979C1.16602 6.907 1.98912 4.91986 3.45424 3.45473C4.91937 1.9896 6.90651 1.1665 8.97852 1.1665C11.0505 1.1665 13.0377 1.9896 14.5028 3.45473C15.9679 4.91986 16.791 6.907 16.791 8.979Z"
        stroke="#9B2033"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
</div>



          {/* Chat list */}
          <ul className="flex-1 overflow-y-auto space-y-5">
            {[
              {
                name: "Dr. Johnathan",
                lastMessage: "Remember to review your...",
                time: "2 days ago",
                active: false,
              image: "/images/img (13).png", // example

              },
              {
                name: "Sarah Johnson",
                lastMessage: "Remember to review your...",
                time: "2 days ago",
                active: true,
                      image: "/images/img (7).png", // example

              },
              {
                name: "Michael Chen",
                lastMessage: "Remember to review your...",
                time: "2 days ago",
                active: false,
                image: "/images/img15.jpg", // example

              },
              {
                name: "Dr. Emma Wilson",
                lastMessage: "Remember to review your...",
                time: "2 days ago",
                active: false,
                      image: "/images/img16.jpg", // example

              },
              {
                name: "David Rodriguez",
                lastMessage: "Remember to review your...",
                time: "2 days ago",
                active: false,
                      image: "/images/img17.jpg", // example

              },
              {
                name: "Lisa Park",
                lastMessage: "Remember to review your...",
                time: "2 days ago",
                active: false,
                      image: "/images/img18.jpg", // example

              },
                {
                name: "Michael Chen",
                lastMessage: "Remember to review your...",
                time: "2 days ago",
                active: false,
                image: "/images/img15.jpg", // example

              },
              {
                name: "Dr. Emma Wilson",
                lastMessage: "Remember to review your...",
                time: "2 days ago",
                active: false,
                      image: "/images/img16.jpg", // example

              },
                {
                name: "Dr. Johnathan",
                lastMessage: "Remember to review your...",
                time: "2 days ago",
                active: false,
              image: "/images/img (13).png", // example

              },
            ].map((chat, i) => (
              <li
                key={i}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer ${
                  chat.active ? "bg-red-800 text-white" : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-3 text-black">
        <img
          src={chat.image}
          alt={chat.name}
          className="h-10 w-10 rounded-full"
        />
        <div>
<p className={`font-medium ${chat.active ? "text-white" : "text-black"}`}>
  {chat.name}
</p>
                    <p
                      className={`text-sm truncate w-40 ${
                        chat.active ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs ${
                    chat.active ? "text-white" : "text-gray-400"
                  }`}
                >
                  {chat.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
{/* Chat Window */}
<div className="flex-1 bg-white rounded-2xl shadow border flex flex-col">
  {/* Chat Header */}
  <div className="flex items-center px-6 py-4 border-b">
    <img
      src="/images/img (13).png"
      alt="avatar"
      className="h-10 w-10 rounded-full"
    />
    <div className="ml-3">
      <p className="font-semibold text-black">Dr. Johnathan</p>
      <p className="text-sm text-gray-500">Director of Regional Affairs</p>
    </div>
  </div>

  {/* Messages */}
  <div className="flex-1 p-6 overflow-y-auto flex flex-col-reverse space-y-6 space-y-reverse">
    
    {/* Sent message */}
    <div className="flex items-start justify-end space-x-3">
      <div>
        <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl max-w-md">
          Same here. I noted down two approaches from that breakout that I’d like to test in our department. 
          What really stood out to me was the emphasis on collaboration and listening, rather than rushing to fix things individually. 
          That’s something I can see shifting our culture if we apply it properly.
        </div>
        <p className="text-xs text-gray-400 mt-1 text-right">Today, 10:50 AM</p>
      </div>
      <img
        src="/images/img15.jpg"
        alt="avatar"
        className="h-8 w-8 rounded-full"
      />
    </div>

    {/* Received message */}
    <div className="flex items-start space-x-3">
      <img
        src="/images/img (13).png"
        alt="avatar"
        className="h-8 w-8 rounded-full"
      />
      <div>
        <div className="bg-red-600 text-white px-4 py-2 rounded-xl max-w-md">
          Absolutely. The group discussion gave me a chance to hear how others in completely different industries approach the same challenges. 
          Some of their solutions were so creative! It really pushed me to think outside of my usual process.
        </div>
        <p className="text-xs text-gray-400 mt-1">Today, 10:42 AM</p>
      </div>
    </div>

    {/* Sent message */}
    <div className="flex items-start justify-end space-x-3">
      <div>
        <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl max-w-md">
          I agree, Emma. I especially liked how they tied the framework back to real-world applications. 
          Too often sessions are just theory, but here it actually felt like I can take the model and use it with my team right away. 
          Did you also find the group activity helpful?
        </div>
        <p className="text-xs text-gray-400 mt-1 text-right">Today, 10:35 AM</p>
      </div>
      <img
        src="/images/img15.jpg"
        alt="avatar"
        className="h-8 w-8 rounded-full"
      />
    </div>

    {/* Received message */}
    <div className="flex items-start space-x-3">
      <img
        src="/images/img (13).png"
        alt="avatar"
        className="h-8 w-8 rounded-full"
      />
      <div>
        <div className="bg-red-600 text-white px-4 py-2 rounded-xl max-w-md">
          I really appreciate how today’s session broke down such a complex topic into manageable steps. 
          The framework the speaker shared makes it much easier to visualize how we can integrate this 
          into our own projects. Definitely one of the most practical workshops I’ve attended in a while.
        </div>
        <p className="text-xs text-gray-400 mt-1">Today, 10:32 AM</p>
      </div>
    </div>

  </div>

  {/* Input */}
  <div className="border-t px-6 py-3 flex items-center space-x-3 text-gray-400">
    <input
      type="text"
      placeholder="Type a message..."
className="flex-1 placeholder-gray-400 text-black rounded-full px-4 py-2 focus:outline-none"
    />
   <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.0693 0.0839524C21.2155 -0.316532 22.3165 0.784518 21.916 1.93069L15.2318 21.0298C14.7974 22.2685 13.0714 22.3385 12.5389 21.1393L9.31353 13.8832L13.8532 9.34247C14.0026 9.18208 14.084 8.96994 14.0801 8.75075C14.0763 8.53155 13.9875 8.32241 13.8325 8.16739C13.6774 8.01237 13.4683 7.92358 13.2491 7.91971C13.0299 7.91584 12.8177 7.99721 12.6574 8.14666L8.11657 12.6862L0.860336 9.46093C-0.338883 8.92732 -0.26781 7.20242 0.969766 6.76809L20.0693 0.0839524Z" fill="#9B2033"/>
</svg>

  </div>
</div>



</div>

</div><br></br>
<>

  {/* Footer Line Image */}
  <div className="w-full mt-60">
    <Image
      src="/images/line.png"
      alt="Footer Line"
      width={1729}
      height={127}
      className="w-full"
    />
  </div>
</>

    </>
  );
}
