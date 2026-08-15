'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CircleDollarSign, Ruler, Bed, MapPin, Calendar, User, Phone, Mail, MessageCircle, Loader2 } from 'lucide-react';
import { formatPrice } from '@/src/lib/utils';

interface ProjectDetailsCardProps {
  property: any;
  agent: any;
  isLoadingAgent: boolean;
}

export default function ProjectDetailsCard({ property, agent, isLoadingAgent }: ProjectDetailsCardProps) {
  // Format completion date if available
  const formattedCompletionDate = property?.completionDate 
    ? (property.completionDate.includes('-') 
        ? new Date(property.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : property.completionDate)
    : 'Not specified';
    
  // Dynamic details derived from property data with icons
  const details = [
    { 
      label: 'Starting Price', 
      value: property?.propertyPrice ? formatPrice(property.propertyPrice) : 'Price not specified',
      icon: <CircleDollarSign size={18} className="text-red-500" />
    },
    { 
      label: 'Area from', 
      value: property?.propertySize ? `${property.propertySize} sq. ft` : 'Size not specified',
      icon: <Ruler size={18} className="text-red-500" />
    },
    { 
      label: 'Bedrooms', 
      value: property?.propertyBedrooms || 'Not specified',
      icon: <Bed size={18} className="text-red-500" />
    },
    { 
      label: 'Location', 
      value: property?.propertyState || property?.propertyAddress || 'Location not specified',
      icon: <MapPin size={18} className="text-red-500" />
    },
    { 
      label: 'Completion Date', 
      value: formattedCompletionDate,
      icon: <Calendar size={18} className="text-red-500" />
    }
  ];

  return (
    <motion.div 
      className="bg-white rounded-[30px] border border-[#e6e6e6] p-6 mb-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Project details</h2>
      
      <div className="space-y-4">
        {details.map((detail, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              {detail.icon}
              <span className="text-gray-600 font-medium">{detail.label}</span>
            </div>
            <span className="font-semibold text-red-550">
              {detail.value}
            </span>
          </div>
        ))}
      </div>
      
      {property?.brochureFile && (
        <motion.a 
          href={property.brochureFile} 
          target="_blank" 
          rel="noopener noreferrer"
          className="cursor-pointer w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-[15px] transition-colors font-semibold mt-6 block text-center flex items-center justify-center gap-2 text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download Brochure
        </motion.a>
      )}
      
      {/* Agent Info */}
      <div className="bg-gradient-to-br from-red-50 to-white p-5 rounded-2xl border border-red-100/50 mt-6">
        <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
          <User size={18} className="text-red-500" />
          <span>Project Specialist</span>
        </h4>
        
        {isLoadingAgent ? (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            <span className="ml-2 text-gray-550 text-sm">Loading agent...</span>
          </div>
        ) : agent ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-red-100/50 relative bg-gray-100 flex-shrink-0">
                <img 
                  src={agent.profileImage || agent.photoUrl || 'https://placehold.co/400x400/eaeaea/999999?text=Agent'} 
                  alt={agent.fullName || 'Agent'}
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    e.target.src = 'https://placehold.co/400x400/eaeaea/999999?text=Agent';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h5 className="font-bold text-gray-800 text-sm truncate">{agent.fullName || agent.name}</h5>
                  {(agent.contactNumber || agent.phone) && (
                    <a 
                      href={`tel:${agent.contactNumber || agent.phone}`}
                      className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors flex-shrink-0"
                    >
                      <Phone size={12} />
                    </a>
                  )}
                </div>
                {agent.position && <p className="text-gray-500 text-xs truncate">{agent.position}</p>}
              </div>
            </div>
            
            {/* Agent Contact Info */}
            <div className="space-y-2 bg-white p-3 rounded-xl border border-gray-100 text-xs">
              <div className="flex items-center gap-2 text-gray-655">
                <Phone size={13} className="text-red-500" />
                <span className="truncate">{agent.contactNumber || agent.phone}</span>
              </div>
              {agent.email && (
                <div className="flex items-center gap-2 text-gray-655">
                  <Mail size={13} className="text-red-500" />
                  <span className="truncate">{agent.email}</span>
                </div>
              )}
            </div>
            
            {/* Agent Contact Buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a 
                href={`https://wa.me/${(agent.whatsapp || agent.contactNumber || agent.phone || '').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors font-semibold"
              >
                <MessageCircle size={16} />
                <span>WhatsApp</span>
              </a>
              <a 
                href={`mailto:${agent.email}`}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-semibold border border-gray-200"
              >
                <Mail size={16} className="text-red-500" />
                <span>Email</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            <p className="text-gray-500 text-xs">No specific specialist assigned.</p>
            <p className="text-gray-400 text-xs mt-1">Please contact MateLuxy directly for details.</p>
          </div>
        )}
      </div>
      
      {/* DLD Verification */}
      {(property?.dldPermitNumber || property?.dldQrCode) && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-semibold text-gray-800 text-xs">DLD Verification</h5>
            <div className="bg-red-50 px-2 py-0.5 rounded text-[10px] text-red-600 font-bold">
              {property?.dldPermitNumber || 'Permit Verified'}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-white p-3 rounded-lg border border-gray-200 w-28 h-28 flex items-center justify-center relative shadow-sm">
              {property?.dldQrCode ? (
                <img 
                  src={property.dldQrCode} 
                  alt="DLD QR Code" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] text-center p-1 font-semibold">
                  DLD QR Code
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
