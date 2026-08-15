'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag, MapPin, Calendar, User, Phone, Mail, Loader2 } from 'lucide-react';
import { IoBedOutline } from "react-icons/io5";
import { LiaBathSolid } from "react-icons/lia";
import axios from 'axios';
import { formatPrice } from '@/src/lib/utils';

interface PropertyDetailsCardProps {
  property: any;
  agent: any;
}

export default function PropertyDetailsCard({ property, agent: agentFromProps }: PropertyDetailsCardProps) {
  const [agent, setAgent] = useState<any>({
    name: 'No agent assigned',
    position: '',
    phone: '',
    whatsapp: '',
    email: '',
    image: ''
  });
  const [isLoadingAgent, setIsLoadingAgent] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:6001';

  // Get property details with proper error handling
  const size = property?.propertySize ? `${property.propertySize} sq. ft` : 'Not specified';
  const bedrooms = property?.propertyBedrooms || 'Not specified';
  const bathrooms = property?.propertyBathrooms?.toString() || 'Not specified';
  const propertyType = property?.propertyType || 'Not specified';
  const listedDate = property?.createdAt ? new Date(property.createdAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : 'Not specified';

  useEffect(() => {
    if (agentFromProps) {
      setAgent({
        name: agentFromProps.fullName || agentFromProps.name || 'No agent assigned',
        position: agentFromProps.position || '',
        phone: agentFromProps.contactNumber || agentFromProps.phone || '',
        whatsapp: agentFromProps.whatsapp || agentFromProps.contactNumber || agentFromProps.phone || '',
        email: agentFromProps.email || '',
        image: agentFromProps.profileImage || agentFromProps.photoUrl || ''
      });
      setIsLoadingAgent(false);
      return;
    }

    const fetchAgentDetails = async () => {
      if (!property) return;
      
      let agentId = null;
      if (typeof property.agent === 'string') {
        agentId = property.agent;
      } else if (property.agent && property.agent._id) {
        agentId = property.agent._id;
      } else if (property.agentId) {
        agentId = property.agentId;
      }

      if (agentId) {
        setIsLoadingAgent(true);
        try {
          const response = await axios.get(`${BASE_URL}/agents/${agentId}`);
          if (response.data) {
            setAgent({
              name: response.data.fullName || response.data.name || 'No agent assigned',
              position: response.data.position || '',
              phone: response.data.contactNumber || response.data.phone || '',
              whatsapp: response.data.whatsapp || response.data.contactNumber || '',
              email: response.data.email || '',
              image: response.data.profileImage || response.data.photoUrl || ''
            });
          }
        } catch (error) {
          console.error('Error fetching agent details:', error);
        } finally {
          setIsLoadingAgent(false);
        }
      }
    };

    fetchAgentDetails();
  }, [property, agentFromProps, BASE_URL]);

  if (!property) return null;

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8 border border-gray-150"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-150">
        <h3 className="text-xl font-bold text-gray-800 mb-0">Additional Details</h3>
      </div>
      
      <div className="p-6">
        {/* Agent Info */}
        <div className="bg-gradient-to-br from-red-50 to-white p-5 rounded-2xl border border-red-100/50">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User size={18} className="text-red-500" />
            <span>Property Specialist</span>
          </h4>
          
          {isLoadingAgent ? (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
              <span className="ml-2 text-gray-550 text-sm">Loading agent information...</span>
            </div>
          ) : agent.name === 'No agent assigned' ? (
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-500 text-sm">No agent assigned</h5>
                <p className="text-xs text-gray-400">This property is currently not assigned to an agent</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-red-100/50 relative bg-gray-100 flex-shrink-0">
                  <img 
                    src={agent.image || 'https://placehold.co/400x400/eaeaea/999999?text=Agent'} 
                    alt={agent.name}
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.src = 'https://placehold.co/400x400/eaeaea/999999?text=Agent';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-semibold text-gray-800 text-base truncate">{agent.name}</h5>
                    {agent.phone && (
                      <a 
                        href={`tel:${agent.phone}`}
                        className="p-2 bg-red-500 hover:bg-red-655 text-white rounded-full transition-colors flex-shrink-0"
                      >
                        <Phone size={14} />
                      </a>
                    )}
                  </div>
                  {agent.position && <p className="text-gray-500 text-xs truncate">{agent.position}</p>}
                </div>
              </div>
              
              {/* Agent Contact Info */}
              {(agent.phone || agent.email) && (
                <div className="space-y-2 bg-white p-3 rounded-xl border border-gray-100 text-sm">
                  {agent.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={14} className="text-red-500" />
                      <span className="truncate">{agent.phone}</span>
                    </div>
                  )}
                  {agent.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={14} className="text-red-500" />
                      <span className="truncate">{agent.email}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4 mt-6">
          {/* Listed Date */}
          <div className="flex items-start gap-3">
            <div className="bg-red-50 p-2 rounded-lg text-red-500">
              <Calendar size={18} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Listed Date</h4>
              <p className="text-gray-800 font-semibold">{listedDate}</p>
            </div>
          </div>
        </div>
        
        {/* DLD Verification */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-gray-850 text-sm">DLD Verification</h5>
            <div className="bg-red-50 px-2.5 py-1 rounded text-xs text-red-600 font-semibold">
              {property?.dldPermitNumber || 'Permit Verified'}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-white p-3 rounded-lg border border-gray-250 w-32 h-32 flex items-center justify-center relative shadow-sm">
              {property?.dldQrCode ? (
                <img 
                  src={property.dldQrCode} 
                  alt="DLD QR Code" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs text-center p-2 font-medium">
                  DLD Verified
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-500 text-xs text-center mt-3 font-medium">
            Verified properties are registerd under Dubai Land Department (DLD).
          </p>
        </div>
      </div>
    </motion.div>
  );
}
