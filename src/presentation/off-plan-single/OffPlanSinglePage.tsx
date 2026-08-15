'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Header } from '../shared/components/Header';
import { Footer } from '../shared/components/Footer';

// Import components
import HeroBanner from './components/HeroBanner';
import AboutSection from './components/AboutSection';
import GallerySection from './components/GallerySection';
import LocationSection from './components/LocationSection';
import PaymentPlanSection from './components/PaymentPlanSection';
import ProjectDetailsCard from './components/ProjectDetailsCard';
import Tabs from './components/Tabs';
import ContactForm from './components/ContactForm';
import { formatPrice } from '@/src/lib/utils';

interface OffPlanSinglePageProps {
  id: string;
}

export const OffPlanSinglePage = ({ id }: OffPlanSinglePageProps) => {
  const [property, setProperty] = useState<any>(null);
  const [agent, setAgent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAgent, setIsLoadingAgent] = useState(false);
  const [relatedProperties, setRelatedProperties] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:6001';

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch off-plan property details
        const response = await axios.get(`${BASE_URL}/off-plan-properties/${id}`);
        const rawProperty = response.data;

        if (!rawProperty) {
          throw new Error('Off-plan property details empty');
        }

        // Map CRM fields to frontend expected UI fields
        const mappedProperty = {
          ...rawProperty,
          propertyTitle: rawProperty.projectTitle || rawProperty.title,
          propertyAddress: rawProperty.address || rawProperty.location,
          propertyPrice: rawProperty.startingPrice || rawProperty.price,
          propertyFeaturedImage: rawProperty.coverPhoto || rawProperty.image,
          propertyType: Array.isArray(rawProperty.propertyType) ? rawProperty.propertyType.join(', ') : rawProperty.propertyType,
          propertyState: rawProperty.emirate,
          propertyBedrooms: rawProperty.bedrooms,
          propertyBathrooms: rawProperty.bathrooms,
          propertySize: rawProperty.area,
          media: rawProperty.mediaImages || [],
          completionDate: rawProperty.handoverDate || rawProperty.completionDate,
          
          // Down payment, during construction, handover percentages
          afterBookingPercentage: rawProperty.afterBookingPercentage || 20,
          duringConstructionPercentage: rawProperty.duringConstructionPercentage || 50,
          afterHandoverPercentage: rawProperty.afterHandoverPercentage || 30,

          // Developer mapping
          developerName: rawProperty.developer?.name || rawProperty.developer || 'Not specified',
          developerLogo: rawProperty.developer?.logoUrl || null,
        };

        setProperty(mappedProperty);

        // Fetch agent if available
        if (mappedProperty.agent || mappedProperty.agentId) {
          setIsLoadingAgent(true);
          const agentId = typeof mappedProperty.agent === 'string' ? mappedProperty.agent : (mappedProperty.agent?._id || mappedProperty.agentId);
          try {
            const agentResponse = await axios.get(`${BASE_URL}/agents/${agentId}`);
            if (agentResponse.data) {
              setAgent(agentResponse.data);
            }
          } catch (agentError) {
            console.error('Error fetching agent for off-plan:', agentError);
          } finally {
            setIsLoadingAgent(false);
          }
        }

        // Fetch related properties (same emirate, off-plan category)
        try {
          const relatedResponse = await axios.get(`${BASE_URL}/off-plan-properties`, {
              params: {
                  limit: 4,
              }
          });
          const rawRelated = relatedResponse.data || [];
          const filteredRelated = rawRelated
              .filter((p: any) => p._id !== id && p.id !== id)
              .map((p: any) => ({
                  ...p,
                  propertyTitle: p.projectTitle || p.title,
                  propertyAddress: p.address || p.location,
                  propertyPrice: p.startingPrice || p.price,
                  propertyFeaturedImage: p.coverPhoto || p.image,
                  propertyType: Array.isArray(p.propertyType) ? p.propertyType.join(', ') : p.propertyType,
                  propertyState: p.emirate,
                  propertyBedrooms: p.bedrooms,
                  propertyBathrooms: p.bathrooms,
                  propertySize: p.area,
                  media: p.mediaImages || [],
              }));
          setRelatedProperties(filteredRelated);
        } catch (relatedError) {
          console.error('Error fetching related off-plan properties:', relatedError);
        }

        setIsLoading(false);
      } catch (err: any) {
        console.error('Error fetching off-plan property data:', err);
        setError(err.message || 'Failed to load off-plan property');
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPropertyData();
    }
  }, [id, BASE_URL]);

  if (isLoading) {
    return (
      <>
        <Header theme="light" />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading property details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !property) {
    return (
      <>
        <Header theme="light" />
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Off-Plan Property</h2>
            <p className="text-gray-600 mb-6">{error || 'The property you are looking for does not exist.'}</p>
            <button
              onClick={() => router.push('/properties')}
              className="bg-red-500 hover:bg-red-650 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Back to Properties
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header theme="light" />
      <div className="bg-gray-50 min-h-screen pt-28 pb-12">
        <main className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HeroBanner property={property} />
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <motion.div 
              className="order-2 lg:order-1 lg:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div id="about">
                <AboutSection property={property} />
              </div>
              
              <div id="gallery">
                <GallerySection property={property} />
              </div>
              
              <div id="location">
                <LocationSection property={property} />
              </div>
              
              <div id="payment-plan">
                <PaymentPlanSection property={property} />
              </div>
              
              {/* Related Properties Section */}
              {relatedProperties.length > 0 && (
                <section className="bg-white rounded-[30px] border border-gray-150 overflow-hidden mb-8 p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Similar Properties</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {relatedProperties.map((relatedProperty, index) => (
                      <motion.div 
                        key={relatedProperty._id || relatedProperty.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.4 }}
                        className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => router.push(`/off-plan-single/${relatedProperty._id || relatedProperty.id}`)}
                      >
                        <div className="h-48 overflow-hidden relative">
                          <img 
                            src={relatedProperty.propertyFeaturedImage || 'https://placehold.co/600x400/eaeaea/999999?text=Property'} 
                            alt={relatedProperty.propertyTitle} 
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-1">{relatedProperty.propertyTitle}</h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-1">{relatedProperty.propertyState || relatedProperty.propertyAddress}</p>
                          <p className="text-red-500 font-medium">{formatPrice(relatedProperty.propertyPrice) || 'Price on request'}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
            
            <motion.div 
              className="order-1 lg:order-2 lg:col-span-1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <aside className="sticky top-24">
                <Tabs />
                <ProjectDetailsCard property={property} agent={agent} isLoadingAgent={isLoadingAgent} />
                <ContactForm property={property} />
              </aside>
            </motion.div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};
