"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import { FaArrowLeft, FaCrown, FaFilter, FaMedal, FaSearch } from 'react-icons/fa';
import { FaMapLocationDot, FaShop } from 'react-icons/fa6';

interface SponsorExhibitor {
  id: number;
  name: string;
  category: string;
  description: string;
  logoUrl: string;
  hall?: string;
  Link :string;
}

const sponsorsExhibitorsData: SponsorExhibitor[] = [
  {
    id: 1,
    name: 'TechCorp',
    category: 'Gold Sponsor',
    description: 'Leading provider of enterprise software solutions and digital transformation services.',
    logoUrl: '/images/TechCorp.png',
        Link:''

  },
  {
    id: 2,
    name: 'InnovateLab',
    category: 'Gold Sponsor',
    description: 'Pioneering AI and machine learning technologies for business automation and intelligence.',
    logoUrl: '/images/InnovateLab.png',
    Link:''
  },
  {
    id: 3,
    name: 'DataFlow',
    category: 'Silver Sponsor',
    description: 'Leading provider of enterprise software solutions and digital transformation services.',
    logoUrl: '/images/DataFlow.png',
        Link:''

  },
  {
    id: 4,
    name: 'SecureNet',
    category: 'Silver Sponsor',
    description: 'Pioneering AI and machine learning technologies for business automation and intelligence.',
    logoUrl: '/images/SecureNet.png',
        Link:''

  },
  {
    id: 5,
    name: 'CloudTech',
    category: 'Exhibitor',
    description: 'Leading provider of enterprise software solutions and digital transformation services.',
    logoUrl: '/images/CloudTech.png',
    hall: 'Hall B',
    Link:'/ExhibitorsDetailsScreen',
  },
  {
    id: 6,
    name: 'SmartDev',
    category: 'Exhibitor',
    description: 'Leading provider of enterprise software solutions and digital transformation services.',
    logoUrl: '/images/SmartDev.png',
    hall: 'Hall B',
        Link:''

  },
  {
    id: 7,
    name: 'NextGen',
    category: 'Exhibitor',
    description: 'Leading provider of enterprise software solutions and digital transformation services.',
    logoUrl: '/images/NextGen.png',
    hall: 'Hall B',
        Link:''

  },
  {
    id: 8,
    name: 'FinTech',
    category: 'Exhibitor',
    description: 'Leading provider of enterprise software solutions and digital transformation services.',
    logoUrl: '/images/FinTech.png',
    hall: 'Hall B',
        Link:''

  },
];

const SponsorsExhibitorsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredData = sponsorsExhibitorsData.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const goldSponsors = filteredData.filter(item => item.category === 'Gold Sponsor');
  const silverSponsors = filteredData.filter(item => item.category === 'Silver Sponsor');
  const exhibitors = filteredData.filter(item => item.category === 'Exhibitor');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-start justify-between mb-8">
        <div className="flex items-center gap-4 mb-[50px]">
 <Link href="/sponsors/ManageSessions">
    <FaArrowLeft className="text-red-800 w-[20px] h-[20px] cursor-pointer" />
  </Link>          <h1 className="text-3xl font-bold text-black ">Sponsors & Exhibitors</h1>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 gap-2 w-80">
            <FaSearch className="text-red-600" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none text-black"
            />
          </div>

          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-6 py-2 rounded-lg font-medium ${selectedCategory === 'All' ? 'bg-red-600 text-white' : 'border border-gray-300 text-black'}`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedCategory('Gold Sponsor')}
            className={`px-6 py-2 rounded-lg font-medium ${selectedCategory === 'Gold Sponsor' ? 'bg-red-600 text-white' : 'border border-gray-300 text-black'}`}
          >
            Gold Sponsors
          </button>
          <button
            onClick={() => setSelectedCategory('Silver Sponsor')}
            className={`px-6 py-2 rounded-lg font-medium ${selectedCategory === 'Silver Sponsor' ? 'bg-red-600 text-white' : 'border border-gray-300 text-black'}`}
          >
            Silver Sponsors
          </button>
          <button
            onClick={() => setSelectedCategory('Exhibitor')}
            className={`px-6 py-2 rounded-lg font-medium ${selectedCategory === 'Exhibitor' ? 'bg-red-600 text-white' : 'border border-gray-300 text-black'}`}
          >
            Exhibitors
          </button>
          <FaFilter className="text-red-600 cursor-pointer" />
        </div>
      </div>

      {/* Gold Sponsors */}
      {goldSponsors.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
           <FaCrown className="text-yellow-500 w-6 h-6" />
            <h2 className="text-2xl font-bold text-black">Gold Sponsors</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goldSponsors.map((sponsor, index) => (
              <div key={sponsor.id} className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm flex items-center gap-6">
                <div className={`w-24 h-24 ${index === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-purple-500 to-purple-600'} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{sponsor.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-black">{sponsor.name} Solutions</h3>
                  <p className="text-black mb-4">{sponsor.description}</p>
                  <div className="flex items-center gap-4">
                    <Link href="/sponsors/SponsorsDetailScreen">
                      <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold">Visit Booth</button>
                    </Link>
                    <Link href="/sponsors/SponsorsDetailScreen">
                      <button className="border border-gray-300 text-black px-6 py-2 rounded-lg">Learn More</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Silver Sponsors */}
      {silverSponsors.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <FaMedal className="text-gray-400 w-6 h-6" />
            <h2 className="text-2xl font-bold text-black">Silver Sponsors</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {silverSponsors.map((sponsor, index) => (
              <div key={sponsor.id} className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm flex items-center gap-6">
                <div className={`w-24 h-24 ${index === 0 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-orange-500 to-orange-600'} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{sponsor.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-black">{sponsor.name} Inc.</h3>
                  <p className="text-black mb-4">{sponsor.description}</p>
                  <div className="flex items-center gap-4">
                    <Link href="/sponsors/SponsorsDetailScreen">
                      <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold">Visit Booth</button>
                    </Link>
                    <Link href="/sponsors/SponsorsDetailScreen">
                      <button className="border border-gray-300 text-black px-6 py-2 rounded-lg">Learn More</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    {/* Exhibitors */}
{/* Exhibitors */}
{exhibitors.length > 0 && (
  <div className="mb-8">
    <div className="flex items-center gap-4 mb-4">
      <FaShop className="text-green-500 w-6 h-6" />
      <h2 className="text-2xl font-bold text-black">Exhibitors</h2>
    </div>

    {/* Split exhibitors into chunks of 3 */}
    {[...Array(Math.ceil(exhibitors.length / 6))].map((_, rowIndex) => {
      const rowItems = exhibitors.slice(rowIndex * 3, rowIndex * 3 + 3);
      return (
        <div key={rowIndex} className="grid grid-cols-3 gap-10 mb-6">
          {rowItems.map((exhibitor, index) => {
            const colors = [
              'bg-[#FF8A65]', // orange
              'bg-[#4DB6AC]', // teal
              'bg-[#9575CD]', // purple
              'bg-[#EC4899]',
            ];
            const colorClass = colors[index % colors.length];

            return (
              <Link href="/sponsors/ExhibitorsDetailsScreen" key={exhibitor.id}>
                <div className="w-full bg-white border border-gray-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between h-[200px]">
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-bold text-md">{exhibitor.name.charAt(0)}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-black">{exhibitor.name} Studio</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <FaMapLocationDot className="text-red-500" />
                    <span className="text-sm font-semibold text-black">{exhibitor.hall}</span>
                  </div>
                  <p className="text-sm text-black">
                    {exhibitor.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      );
    })}
  </div>
)}
 {/* Split exhibitors into chunks of 3 */}
    {[...Array(Math.ceil(exhibitors.length / 6))].map((_, rowIndex) => {
      const rowItems = exhibitors.slice(rowIndex * 3, rowIndex * 3 + 3);
      return (
        <div key={rowIndex} className="grid grid-cols-3 gap-10 mb-6">
          {rowItems.map((exhibitor, index) => {
            const colors = [
              'bg-[#EC4899]', // orange
              'bg-[#FF8A65]', // teal
              'bg-[#4DB6AC]', // purple
              'bg-[#EC4899]',
            ];
            const colorClass = colors[index % colors.length];

            return (
              <Link href={`/exhibitor/${exhibitor.id}`} key={exhibitor.id}>
                <div className="w-full bg-white border border-gray-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between h-[200px]">
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-bold text-md">{exhibitor.name.charAt(0)}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-black">{exhibitor.name} Studio</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <FaMapLocationDot className="text-red-500" />
                    <span className="text-sm font-semibold text-black">{exhibitor.hall}</span>
                  </div>
                  <p className="text-sm text-black">
                    {exhibitor.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      );
    })}
  


    </div>
  );
};

export default SponsorsExhibitorsPage;
