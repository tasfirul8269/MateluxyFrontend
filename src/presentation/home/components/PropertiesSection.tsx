'use client';

import { Box, Text, Flex, Stack } from '@frooxi-labs/adaptive-ui';
import { useState, useEffect, useRef } from 'react';
import { api, Property, OffPlanProperty } from '../../../services/api';

import { PropertyCard, PropertyCardProps } from '../../shared/components/PropertyCard';
import { PropertyCardSkeleton } from '../../shared/components/PropertyCardSkeleton';

export const PropertiesSection = () => {
    const [activeTab, setActiveTab] = useState<'Buy' | 'Rent' | 'Off Plan'>('Buy');
    const [properties, setProperties] = useState<PropertyCardProps[]>([]);
    const [loading, setLoading] = useState(false);

    const cache = useRef<Record<string, PropertyCardProps[]>>({});

    useEffect(() => {
        const fetchData = async () => {
            // Check cache first
            if (cache.current[activeTab]) {
                setProperties(cache.current[activeTab]);
                return;
            }

            setLoading(true);
            try {
                let data: PropertyCardProps[] = [];

                if (activeTab === 'Off Plan') {
                    const res = await api.getOffPlanProperties({ limit: 6, sortBy: 'price', sortOrder: 'desc' });
                    data = res.map((p: OffPlanProperty) => ({
                        image: p.coverPhoto || '/Image/property.png', // Fallback image
                        title: p.projectTitle || 'Untitled Project',
                        address: p.address || 'Dubai, UAE',
                        beds: Number(p.bedrooms) || 0,
                        baths: p.bathrooms || 0,
                        sqft: p.area || 0,
                        price: p.startingPrice ? `${p.startingPrice.toLocaleString()} AED` : 'Price on Request',
                        type: p.propertyType?.[0] || 'Project',
                        badge: 'Off Plan',
                        developer: {
                            name: p.developer?.name || 'Developer',
                            logo: p.developer?.logoUrl
                        },
                        agent: {
                            name: 'Mateluxy',
                            languages: 'English, Arabic',
                            avatar: '/Logo_Color.svg' // Default avatar or brand logo
                        }
                    }));
                } else {
                    // Buy or Rent
                    // Buy or Rent
                    const res = await api.getProperties({
                        purpose: activeTab === 'Buy' ? 'sale' : 'rent', // Explicitly map to 'sale' (backend checks for sale/sell/buy) or 'rent'
                        category: 'residential', // Match BuyPage logic
                        limit: 6,
                        sortBy: 'price',
                        sortOrder: 'desc'
                    });

                    data = res.map((p: Property) => {
                        const getAddress = () => {
                            const title = p.propertyTitle?.trim()?.toLowerCase();
                            const addr = p.address?.trim();
                            if (addr && addr.toLowerCase() !== title) return addr;
                            const pfPath = p.pfLocationPath?.trim();
                            if (pfPath && pfPath.toLowerCase() !== title) return pfPath;
                            const emirate = p.emirate?.trim();
                            if (emirate && emirate.toLowerCase() !== title) return emirate;
                            return 'Dubai, UAE';
                        };

                        return {
                            image: p.coverPhoto || '/Image/property.png',
                            title: p.propertyTitle || 'Untitled Property',
                            address: getAddress(),
                            beds: Number(p.bedrooms) || 0,
                            baths: p.bathrooms || 0,
                            sqft: p.area || 0,
                            price: p.price ? `${p.price.toLocaleString()} AED` : 'Price on Request',
                            type: p.propertyType || 'Property',
                            badge: p.purpose || activeTab,
                            agent: {
                                name: p.assignedAgent?.name || 'Tanvir Almas',
                                languages: p.assignedAgent?.languages?.join(', ') || 'Speaks English, Bengali',
                                avatar: p.assignedAgent?.photoUrl || '/Image/BGimage.png'
                            }
                        };
                    });
                }

                // Update Cache
                cache.current[activeTab] = data;
                setProperties(data);
            } catch (error) {
                console.error('Failed to fetch properties', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    return (
        <Box as="section" className="w-full bg-[#FFFFFF] py-16 px-4 md:px-8 lg:px-16">
            <Box className="w-full max-w-[1300px] mx-auto">
                {/* Header */}
                <Flex className="flex justify-between items-center mb-10">
                    <Text className="text-[45px] font-medium text-black">Premium Properties</Text>

                    {/* Tabs */}
                    <Box className="bg-[#E1E1E1]/40 p-1.5 rounded-full inline-flex items-center">
                        {(['Buy', 'Rent', 'Off Plan'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                                    px-8 py-2.5 rounded-full text-[16px] font-normal transition-all duration-300 font-montserrat
                                    ${activeTab === tab
                                        ? 'bg-white text-black'
                                        : 'text-[#6D6D6D] hover:text-black'
                                    }
                                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </Box>
                </Flex>

                {/* Property Grid */}
                <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] min-h-[400px]">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <PropertyCardSkeleton key={`skeleton-${index}`} />
                        ))
                    ) : properties.length > 0 ? (
                        properties.map((property, index) => (
                            <PropertyCard key={index} {...property} />
                        ))
                    ) : (
                        <Flex className="col-span-full h-full items-center justify-center min-h-[300px]">
                            <Text className="text-gray-500">No properties found.</Text>
                        </Flex>
                    )}
                </Box>
            </Box>
        </Box>
    );
};
