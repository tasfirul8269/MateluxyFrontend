import { Box, Flex, Text } from '@frooxi-labs/adaptive-ui';
import { useState, useEffect } from 'react';
import { OffPlanCard } from './OffPlanCard';
import Image from 'next/image';
import { api, OffPlanProperty } from '../../../services/api';

const TABS = ['Latest', 'All', 'Apartment', 'Penthouse', 'Townhouse', 'Plot', 'Commercial'];

export const OffPlanListing = () => {
    const [activeTab, setActiveTab] = useState('Latest');
    const [currentPage, setCurrentPage] = useState(1);
    const [properties, setProperties] = useState<OffPlanProperty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                let params: any = { page: currentPage, limit: 9 };

                if (activeTab === 'Latest') {
                    params.sortBy = 'date';
                    params.sortOrder = 'desc';
                } else if (activeTab !== 'All') {
                    params.propertyType = activeTab;
                }

                const data = await api.getOffPlanProperties(params);
                setProperties(data);
            } catch (error) {
                console.error('Error fetching off-plan properties:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [activeTab, currentPage]);

    return (
        <Box className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
            {/* Header / Filter Tabs */}
            <Flex className="flex-col md:flex-row items-center justify-between gap-4 mb-8">
                {/* Tabs */}
                <Flex className="bg-[#F5F5F5] p-1.5 rounded-full overflow-x-auto w-full md:w-auto scrollbar-hide gap-1">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                setCurrentPage(1);
                            }}
                            className={`px-5 py-2.5 rounded-full text-[14px] font-medium transition-all duration-300 whitespace-nowrap ${activeTab === tab
                                ? 'bg-[#FC4F4F] text-white shadow-md' // Using bright red/coral color from screenshot
                                : 'text-[#1A1A1A] hover:bg-gray-200'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </Flex>

                {/* View On Map Button */}
                <button className="flex items-center justify-center gap-2 px-6 py-4 bg-[#F5F5F5] rounded-full hover:bg-gray-200 transition-colors shrink-0">
                    <Image src="/locationround.svg" alt="Map" width={20} height={20} />
                    <Text className="text-[14px] font-medium text-[#555555]">View On Map</Text>
                </button>
            </Flex>

            {/* Grid */}
            {loading ? (
                <Flex className="justify-center items-center h-[500px]">
                    <Text>Loading properties...</Text>
                </Flex>
            ) : (
                <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[34px] mb-12 justify-items-center">
                    {properties.length > 0 ? (
                        properties.map((property) => (
                            <OffPlanCard
                                key={property.id}
                                id={property.id} // Passing ID might be useful for linking
                                image={property.coverPhoto || '/Image/property.png'}
                                title={property.projectTitle || 'Untitled Project'}
                                location={property.address || property.emirate || 'Unknown Location'}
                                price={property.startingPrice ? `AED ${(property.startingPrice / 1000000).toFixed(2)}M` : 'Price on Request'}
                                area={property.area || 0}
                                completion={property.handoverDate || 'TBA'} // Using handoverDate mapped to completion
                                developer={{
                                    name: property.developer?.name || 'Unknown Developer',
                                    logo: property.developer?.logoUrl
                                }}
                                badges={property.projectStatus === 'off_plan_primary' || property.projectStatus === 'off_plan' ? ['New Launch', ...(property.propertyType || [])] : property.propertyType || []}
                            />
                        ))
                    ) : (
                        <Text className="col-span-full text-center">No properties found.</Text>
                    )}
                </Box>
            )}

            {/* Pagination */}
            <Flex className="justify-center items-center gap-3">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black disabled:opacity-50"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>

                {[1, 2, 3].map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-[16px] font-medium transition-all ${currentPage === page
                            ? 'bg-[#FF1111] text-white shadow-lg scale-110'
                            : 'bg-[#F5F5F5] text-[#555555] hover:bg-gray-200'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </Flex>
        </Box>
    );
};
