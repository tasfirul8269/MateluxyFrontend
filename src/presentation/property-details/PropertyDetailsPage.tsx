'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Header } from '../shared/components/Header';
import { Footer } from '../shared/components/Footer';

// Import components
import PropertyHeroFixed from './components/PropertyHeroFixed';
import AboutSection from './components/AboutSection';
import GallerySection from './components/GallerySection';
import LocationSection from './components/LocationSection';
import PropertyDetailsCard from './components/PropertyDetailsCard';
import Tabs from './components/Tabs';
import { formatPrice } from '@/src/lib/utils';

interface PropertyDetailsPageProps {
    id: string;
}

export const PropertyDetailsPage = ({ id }: PropertyDetailsPageProps) => {
    const [property, setProperty] = useState<any>(null);
    const [agent, setAgent] = useState<any>(null);
    const [relatedProperties, setRelatedProperties] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:6001';

    useEffect(() => {
        const fetchPropertyData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Fetch property details
                const propertyResponse = await axios.get(`${BASE_URL}/properties/${id}`);
                const raw = propertyResponse.data;

                if (!raw) {
                    throw new Error('Property details empty');
                }

                // Map CRM backend fields → reference frontend component field names
                const mappedProperty = {
                    ...raw,
                    _id: raw._id || raw.id,
                    propertyTitle: raw.propertyTitle || raw.title,
                    propertyPrice: raw.price || raw.propertyPrice,
                    propertyAddress: raw.pfLocationPath || raw.address || raw.propertyAddress,
                    propertyState: raw.emirate || raw.propertyState,
                    propertyBedrooms: raw.bedrooms || raw.propertyBedrooms,
                    propertyBathrooms: raw.bathrooms || raw.propertyBathrooms,
                    propertySize: raw.area || raw.propertySize,
                    propertyFeaturedImage: raw.coverPhoto || raw.propertyFeaturedImage,
                    propertyType: raw.propertyType,
                    propertyDescription: raw.description || raw.propertyDescription,
                    media: raw.mediaImages || raw.media || [],
                    category: raw.category,
                    purpose: raw.purpose,
                    permitNumber: raw.permitNumber || raw.dldPermitNumber,
                    agent: raw.assignedAgent || raw.agent,
                    features: raw.amenities || raw.features || [],
                };

                setProperty(mappedProperty);

                // If agent is populated/assigned, set agent state
                if (mappedProperty.agent && typeof mappedProperty.agent === 'object') {
                    setAgent(mappedProperty.agent);
                } else if (mappedProperty.agent && typeof mappedProperty.agent === 'string') {
                    // Agent is just an ID string — fetch it
                    try {
                        const agentRes = await axios.get(`${BASE_URL}/agents/${mappedProperty.agent}`);
                        if (agentRes.data) setAgent(agentRes.data);
                    } catch (agentErr) {
                        console.error('Error fetching agent:', agentErr);
                    }
                }

                // Fetch related properties (same purpose and category)
                try {
                    const purpose = mappedProperty.purpose || 'buy';
                    const category = mappedProperty.category || 'residential';
                    const relatedResponse = await axios.get(`${BASE_URL}/properties`, {
                        params: {
                            purpose,
                            category,
                            status: 'published',
                            limit: 4,
                        }
                    });
                    const rawRelated = relatedResponse.data.data || relatedResponse.data || [];
                    const filteredRelated = (Array.isArray(rawRelated) ? rawRelated : [])
                        .filter((p: any) => (p._id || p.id) !== id)
                        .slice(0, 4)
                        .map((p: any) => ({
                            ...p,
                            _id: p._id || p.id,
                            propertyTitle: p.propertyTitle || p.title,
                            propertyPrice: p.price || p.propertyPrice,
                            propertyAddress: p.pfLocationPath || p.address || p.propertyAddress,
                            propertyState: p.emirate || p.propertyState,
                            propertyBedrooms: p.bedrooms || p.propertyBedrooms,
                            propertyBathrooms: p.bathrooms || p.propertyBathrooms,
                            propertySize: p.area || p.propertySize,
                            propertyFeaturedImage: p.coverPhoto || p.propertyFeaturedImage,
                            media: p.mediaImages || p.media || [],
                            agent: p.assignedAgent || p.agent,
                        }));
                    setRelatedProperties(filteredRelated);
                } catch (relatedError) {
                    console.error('Error fetching related properties:', relatedError);
                }

                setIsLoading(false);
            } catch (err: any) {
                console.error('Error fetching property data:', err);
                setError(err.message || 'Failed to load property');
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
                <Header theme="dark" />
                <div className="flex items-center justify-center h-screen bg-gray-50">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading property details...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !property) {
        return (
            <>
                <Header theme="dark" />
                <div className="flex items-center justify-center h-screen bg-gray-50">
                    <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Property</h2>
                        <p className="text-gray-600 mb-6">{error || 'The property you are looking for does not exist.'}</p>
                        <button
                            onClick={() => router.push('/properties')}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
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
            <Header />
            <div className="bg-gray-50 min-h-screen pt-0 pb-12">
                <main className="container mx-auto px-4 max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <PropertyHeroFixed property={property} />
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

                            {/* Related Properties Section */}
                            {relatedProperties.length > 0 && (
                                <section className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8 p-8 border border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Similar Properties</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {relatedProperties.map((relatedProperty, index) => (
                                            <motion.div
                                                key={relatedProperty._id || relatedProperty.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 * index, duration: 0.4 }}
                                                className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-150 hover:shadow-md transition-all cursor-pointer"
                                                onClick={() => router.push(`/property-details/${relatedProperty._id || relatedProperty.id}`)}
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
                                <PropertyDetailsCard property={property} agent={agent} />
                            </aside>
                        </motion.div>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
};
