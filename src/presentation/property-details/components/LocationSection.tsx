'use client';

import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

interface LocationSectionProps {
  property: any;
}

export default function LocationSection({ property }: LocationSectionProps) {
  // Get location name
  const locationName = property?.propertyAddress || property?.propertyState || 'Dubai, UAE';

  // Generate Google Maps search URL
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;

  // Generate standard search embed URL (does not require API key or billing)
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(locationName)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="location" className="bg-white rounded-2xl shadow-sm overflow-hidden p-8 mb-8 border border-gray-150">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <MapPin className="text-red-500" size={24} />
        Location
      </h2>
      
      <div className="mb-6">
        <div className="flex items-start gap-2 mb-4">
          <MapPin className="text-red-500 mt-1" size={20} />
          <p className="text-gray-700 font-medium">
            {locationName}
          </p>
        </div>
        
        <a 
          href={googleMapsUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className="text-red-500 font-semibold hover:text-red-650 transition-colors flex items-center gap-1.5"
        >
          <ExternalLink size={16} />
          View on Google Maps
        </a>
      </div>
      
      <div className="rounded-xl overflow-hidden h-[400px] border border-gray-200 shadow-inner">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Property Location Map"
        ></iframe>
      </div>
    </section>
  );
}
