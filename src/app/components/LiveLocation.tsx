'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Booth {
  boothNumber: string
  boothLocation: string
  mapLink: string
  distance: number
  openTime: string
}

interface LiveLocationProps {
  booth?: Booth // make it optional
}

// Venue icon
const createVenueIcon = (label: string) =>
  L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.80078 9.52764C8.80078 8.94416 9.03257 8.38458 9.44515 7.972C9.85773 7.55942 10.4173 7.32764 11.0008 7.32764C11.5843 7.32764 12.1438 7.55942 12.5564 7.972C12.969 8.38458 13.2008 8.94416 13.2008 9.52764C13.2008 10.1111 12.969 10.6707 12.5564 11.0833C12.1438 11.4959 11.5843 11.7276 11.0008 11.7276C10.4173 11.7276 9.85773 11.4959 9.44515 11.0833C9.03257 10.6707 8.80078 10.1111 8.80078 9.52764Z" fill="#9B2033"/>
          </svg>
        </div>
        <div style="margin-top: 6px; background-color: #9B2033; color: white; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
          ${label}
        </div>
      </div>
    `,
    iconAnchor: [15, 42],
  });

// "You" icon
const createYouIcon = () =>
  L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7" cy="7" r="7" fill="#9B2033"/>
          </svg>
        </div>
        <div style="margin-top: 1px; background-color: #5A0D12; color: white; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); margin-bottom:20px">
          You
        </div>
      </div>
    `,
    iconAnchor: [10, 25],
  });

const LiveLocation: React.FC<LiveLocationProps> = ({ booth }) => {
  const [you, setYou] = useState<{ name: string; position: LatLngTuple }>({
    name: "You",
    position: [40.73061, -73.935242],
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setYou({ name: "You", position: [pos.coords.latitude, pos.coords.longitude] }),
        (err) => console.warn("Geolocation error:", err)
      );
    }
  }, []);

  // fallback position if booth not provided
  let boothPosition: LatLngTuple = [40.7128, -74.006];

  if (booth?.mapLink) {
    const match = booth.mapLink.match(/q=([0-9\.\-]+),([0-9\.\-]+)/);
    if (match) {
      boothPosition = [parseFloat(match[1]), parseFloat(match[2])];
    }
  }

  return (
    <div className="flex flex-row items-start gap-[21px] w-[1280px] h-[410px]">
      <div className="w-[304px] h-[410px] relative bg-white border border-gray-300 shadow-sm rounded-2xl p-6 flex flex-col justify-start">
        <h2 className="text-[24px] font-medium text-[#282828] mb-8">Booth Information</h2>
        {booth ? (
          <div className="flex flex-col gap-[32px]">
            <div>
              <p className="text-[18px] font-semibold text-[#282828]">Booth Number</p>
              <p className="text-[14px] text-[#424242]">{booth.boothNumber}</p>
            </div>
            <div>
              <p className="text-[18px] font-semibold text-[#282828]">Hall Location</p>
              <p className="text-[14px] text-[#424242]">{booth.boothLocation}</p>
            </div>
            <div>
              <p className="text-[18px] font-semibold text-[#282828]">{booth.distance}m</p>
              <p className="text-[14px] text-[#424242]">Walking Distance</p>
            </div>
            <div>
              <p className="text-[18px] font-semibold text-[#282828]">Open</p>
              <p className="text-[14px] text-[#424242]">Until {booth.openTime}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No booth information available</p>
        )}
      </div>

      <div className="w-[955px] h-[410px] relative bg-white border border-gray-300 shadow-sm rounded-2xl overflow-hidden">
        <MapContainer center={boothPosition} zoom={15} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          />
          {booth && <Marker position={boothPosition} icon={createVenueIcon(booth.boothNumber)} />}
          <Marker position={you.position} icon={createYouIcon()} />
        </MapContainer>
      </div>
    </div>
  );
};

export default LiveLocation;
