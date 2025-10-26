'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Booth info styling imports

const createVenueIcon = (label: string) =>
  L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="margin-right:70px;">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.80078 9.52764C8.80078 8.94416 9.03257 8.38458 9.44515 7.972C9.85773 7.55942 10.4173 7.32764 11.0008 7.32764C11.5843 7.32764 12.1438 7.55942 12.5564 7.972C12.969 8.38458 13.2008 8.94416 13.2008 9.52764C13.2008 10.1111 12.969 10.6707 12.5564 11.0833C12.1438 11.4959 11.5843 11.7276 11.0008 11.7276C10.4173 11.7276 9.85773 11.4959 9.44515 11.0833C9.03257 10.6707 8.80078 10.1111 8.80078 9.52764Z" fill="#9B2033"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M1.46484 9.52747C1.4664 7.00009 2.47149 4.57675 4.25917 2.79017C6.04684 1.0036 8.4708 -4.78557e-07 10.9982 0C16.262 0 20.5315 4.26653 20.5315 9.52747C20.5315 13.4493 18.5691 16.5572 16.4659 18.6575C15.5348 19.5897 14.4931 20.4044 13.3639 21.0833C12.8916 21.362 12.4502 21.582 12.0659 21.7316C11.7036 21.8753 11.3238 21.9868 10.9982 21.9868C10.6726 21.9868 10.2927 21.8753 9.93044 21.7316C9.48194 21.5488 9.04802 21.3321 8.63244 21.0833C7.50327 20.4044 6.46151 19.5897 5.53044 18.6575C3.42724 16.5572 1.46484 13.4493 1.46484 9.52747ZM10.9982 5.86227C10.0257 5.86227 9.09309 6.24858 8.40545 6.93621C7.71782 7.62384 7.33151 8.55647 7.33151 9.52893C7.33151 10.5014 7.71782 11.434 8.40545 12.1217C9.09309 12.8093 10.0257 13.1956 10.9982 13.1956C11.9706 13.1956 12.9033 12.8093 13.5909 12.1217C14.2785 11.434 14.6648 10.5014 14.6648 9.52893C14.6648 8.55647 14.2785 7.62384 13.5909 6.93621C12.9033 6.24858 11.9706 5.86227 10.9982 5.86227Z" fill="#9B2033"/>
          </svg>
        </div>
        <div style="margin-top: 6px; background-color: #9B2033; color: white; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 12px; margin-right:70px; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
          ${label}
        </div>
      </div>
    `,
    iconAnchor: [15, 42],
  });

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

const venues: { id: number; name: string; position: LatLngTuple }[] = [
  { id: 1, name: "Venue01", position: [40.7128, -74.006] as LatLngTuple },
  { id: 2, name: "Venue02", position: [40.6782, -73.9442] as LatLngTuple },
  { id: 3, name: "A12 Hall 1", position: [40.7891, -73.135] as LatLngTuple },
];

const you: { name: string; position: LatLngTuple } = {
  name: "You",
  position: [40.73061, -73.935242] as LatLngTuple,
};


const LiveLocation: React.FC = () => {
  return (
    <div className="flex flex-row items-start gap-[21px] max-w-7xl h-[410px] ml-20">
     

      {/* Dynamic Map Section */}
      <div className="w-[1400px] h-[410px] relative bg-white border border-gray-300 shadow-sm rounded-2xl overflow-hidden">
        <MapContainer
          center={[40.7128, -74.006]}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          />
          {venues.map((venue) => (
            <Marker
              key={venue.id}
              position={venue.position as LatLngTuple}
              icon={createVenueIcon(venue.name)}
            >
              <Popup>{venue.name}</Popup>
            </Marker>
          ))}
          <Marker position={you.position} icon={createYouIcon()}>
            <Popup>{you.name}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default LiveLocation;
