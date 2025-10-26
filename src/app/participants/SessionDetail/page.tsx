"use client"
// import { Speaker } from "./Speaker";
import  SessionDetails  from "../../components/SessionDetails";
// import { RelatedSessions } from "./RelatedSessions";
// import { ActionButtons } from "./ActionButtons";
import { SessionHeader } from "../../components/SessionHeader";
import Speaker from "../../components/Speaker";
import RelatedSessions from "../../components/RelatedSessions";
import SessionForums from "../../components/SessionForums";

import Image from "next/image";
import WhosAttending from "../../components/Attending";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import RelatedSessionsGrid from "../../components/RelatedSessions";

const sessionData = {
  title: "The Future of Regional Cooperation",
  time: "10:00 AM - 11:30 AM",
  hall: "Hall A",
  duration: "90 minutes",
  capacity: "500 capacity",
  description:
    "Explore the evolving landscape of regional cooperation in the Middle East and North Africa. This keynote will examine emerging partnerships, economic integration opportunities, and the role of technology in fostering collaboration across borders.",
};

const speakerData = {
  name: "Dr. Johnathan",
  image: "/images/img (13).png",
  title: "Director of Regional Affairs",
  organization: "Middle East Institute",
    affiliation: "Tech Corp", // add this

  bio: `Dr. Johnathan is a professor of Political Science at Cairo University with expertise in international relations and Middle Eastern diplomacy. She has published extensively on regional cooperation and has advised multiple governments and organizations on policy development.`,
};

const sessionDetailsData = {
  keyTopics: [
    "Economic Integration",
    "Digital Cooperation",
    "Trade Partnerships",
    "Regional Security",
  ],
  targetAudience:
    "Government officials, policy makers, business leaders, and researchers interested in regional cooperation and economic development.",
  language: "English with Arabic translation available",
};

const relatedSessionsData = [
  {
    title: "Digital Transformation in MENA",
    speaker: "Dr. Sarah Hassan",
    speakerImage: "/images/speakers/sarah.png",
    time: "2:00 PM - 3:30 PM",
    tag: "Keynote",
    tagColor: "bg-blue-100 text-blue-700",
    duration: "90 minutes",
    room: "Hall B",
    description:
      "Exploring the role of diplomacy and collaboration in shaping future policies",
  },
  {
    title: "The Future of Regional Cooperation",
    speaker: "Prof. Omar Khalil",
    speakerImage: "/images/speakers/omar.png",
    time: "10:00 AM - 11:30 AM",
    tag: "Panel",
    tagColor: "bg-yellow-100 text-yellow-700",
    duration: "90 minutes",
    room: "Hall B",
    description:
      "Exploring the role of diplomacy and collaboration in shaping future policies",
  },
  {
    title: "Innovation in Sustainable Energy",
    speaker: "Dr. Mathew",
    speakerImage: "/images/speakers/mathew.png",
    time: "4:00 PM - 5:00 PM",
    tag: "Workshop",
    tagColor: "bg-purple-100 text-purple-700",
    duration: "90 minutes",
    room: "Room C2",
    description:
      "Exploring the role of diplomacy and collaboration in shaping future policies",
  },
];

export default function SessionDetailsPage() {
  return (
    <>
    <div className="max-w-7xl mx-auto p-6 ">
           {/* Header */}
      <div className="flex items-center gap-2 mb-6">
 <Link href="/participants/MyAgenda">
    <FaArrowLeft className="text-red-800 w-[20px] h-[20px] cursor-pointer" />
  </Link>
        <h1 className="text-xl font-semibold text-black ml-4">Session Details</h1>
      </div><br></br>
      <SessionHeader session={sessionData} />

      <SessionForums />













      <Speaker speaker={speakerData} />
      <SessionDetails details={sessionDetailsData} />
<RelatedSessionsGrid /> ✅
      <WhosAttending />
    </div>
              <Image src="/images/line.png" alt="Logo" width={1729} height={127} className="absolute " />
    </>
  );
}
