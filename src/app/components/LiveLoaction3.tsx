'use client';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom red marker icon
const redIcon = new L.Icon({
  iconUrl: '/images/red-marker.png', // Make sure this is inside /public/images
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const venueLocations: { id: number; name: string; position: [number, number] }[] = [
  { id: 1, name: 'Main Hall', position: [40.7128, -74.0060] },
  { id: 2, name: 'Conference Room A', position: [40.73061, -73.935242] },
  { id: 3, name: 'Exhibition Hall', position: [40.7510, -73.9690] },
  { id: 4, name: 'VIP Room', position: [40.7440, -73.9480] },
  { id: 5, name: 'Open Lounge', position: [40.7678, -73.9718] },
];

const LiveLoaction3 = () => {
  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-gray-300">
      <MapContainer
        center={[40.73061, -73.935242]}
        zoom={10}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {venueLocations.map((venue) => (
          <Marker key={venue.id} position={venue.position} icon={redIcon}>
            <Popup>
              <strong>{venue.name}</strong>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LiveLoaction3;
