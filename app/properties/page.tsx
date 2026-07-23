'use client';

import { Box, Flex, Text } from '@frooxi-labs/adaptive-ui';
import { Header } from '@/src/presentation/shared/components/Header';
import { PropertyFilter } from '@/src/presentation/shared/components/PropertyFilter';
import { PropertyCard, PropertyCardProps } from '@/src/presentation/shared/components/PropertyCard';
import { PropertyCardSkeleton } from '@/src/presentation/shared/components/PropertyCardSkeleton';
import { useState, useEffect, Suspense } from 'react';
import { api, Property, OffPlanProperty } from '@/src/services/api';
import { useSearchParams } from 'next/navigation';

function PropertiesContent() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [sortBy, setSortBy] = useState('Newest');
    const [isSortOpen, setIsSortOpen] = useState(false);

    const [properties, setProperties] = useState<PropertyCardProps[]>([]);
    const [loading, setLoading] = useState(true);

    const sortOptions = ['Newest', 'Oldest', 'A-Z', 'Z-A', 'Price: Low to High', 'Price: High to Low'];

    const searchParams = useSearchParams();
    const purposeParam = searchParams.get('purpose');
    const categoryParam = searchParams.get('category');
    const locationParam = searchParams.get('location');

    useEffect(() => {
        const fetchAllProperties = async () => {
            setLoading(true);
            try {
                // Fetch properties with filters
                const apiParams: any = {
                    limit: 1000,
                    sortBy: 'date',
                    sortOrder: 'desc'
                };

                if (purposeParam) apiParams.purpose = purposeParam;
                if (categoryParam) apiParams.category = categoryParam;

                // User requested "this search is not for off plan", so if we are searching (have filters), we might skip off-plan?
                // Or just always fetch standard properties, and only fetch off-plan if NO filters?
                // Providing a consistent experience: If "Buy" selected, could include off-plan?
                // User said: "and the purpose is Buy or rent... and this search is not for off plan"
                // So if we have search params, we ONLY fetch standard properties.

                const isSearching = !!(locationParam || purposeParam || categoryParam);

                const promises: Promise<any>[] = [
                    api.getProperties(apiParams)
                ];

                if (!isSearching) {
                    promises.push(api.getOffPlanProperties(apiParams));
                }

                const results = await Promise.all(promises);
                const standardProps = results[0];
                const offPlanProps = results[1] || [];

                const mappedStandard = standardProps.map((p: Property) => {
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
                        badge: p.purpose || 'Exclusive',
                        agent: {
                            name: p.assignedAgent?.name || 'Mateluxy Agent',
                            languages: p.assignedAgent?.languages?.join(', ') || 'English, Arabic',
                            avatar: p.assignedAgent?.photoUrl || '/Logo_Color.svg'
                        }
                    };
                });

                const mappedOffPlan = offPlanProps.map((p: OffPlanProperty) => ({
                    image: p.coverPhoto || '/Image/property.png',
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
                        avatar: '/Logo_Color.svg'
                    }
                }));

                // Combine and filter by location if provided (Client-side filtering for now)
                let combined = [...mappedOffPlan, ...mappedStandard];

                if (locationParam) {
                    const locLower = locationParam.toLowerCase();
                    combined = combined.filter(p =>
                        p.address.toLowerCase().includes(locLower) ||
                        p.title.toLowerCase().includes(locLower)
                    );
                }

                setProperties(combined);
            } catch (error) {
                console.error('Failed to fetch properties', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllProperties();
    }, [searchParams, purposeParam, categoryParam, locationParam]);

    const handleCloseFilter = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsFilterOpen(false);
            setIsClosing(false);
        }, 300); // Match animation duration
    };

    return (
        <main className="bg-white min-h-screen">
            <Header theme="dark" />

            <Box className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 pt-[140px] pb-10 text-center">
                <Text
                    as="h1"
                    className="text-[30px] md:text-[40px] lg:text-[45px] font-medium text-[#8F8F8F] leading-tight"
                >
                    Uncover a Wide Selection & Match
                    <br />
                    <span className="text-black font-bold">with Your Dream House</span>
                </Text>
            </Box>

            <Box className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 pb-20">
                <Flex className="flex flex-col lg:flex-row gap-8 lg:items-stretch w-full">
                    {/* Filter Sidebar Column - stretches to match grid height (DESKTOP ONLY) */}
                    <Box className="hidden lg:block w-full lg:w-[300px] shrink-0 self-stretch">
                        {/* This inner div IS sticky */}
                        <div className="lg:sticky lg:top-8">
                            <PropertyFilter />
                        </div>
                    </Box>

                    {/* Properties Grid Area */}
                    <Box className="flex-1 w-full min-w-0">
                        {/* Results Header */}
                        <Flex className="flex justify-between items-center mb-6">
                            <Text className="text-gray-500 text-[16px]">{properties.length} properties found</Text>
                            <Flex className="flex items-center gap-3">
                                {/* Mobile Filter Button */}
                                <button
                                    onClick={() => setIsFilterOpen(true)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[#E6E6E6] rounded-[8px] text-[14px] text-gray-600 hover:border-[#00A1FF] hover:text-[#00A1FF] transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                                    </svg>
                                    Filter
                                </button>
                                {/* Sort By Dropdown */}
                                <Box className="relative">
                                    <Flex
                                        onClick={() => setIsSortOpen(!isSortOpen)}
                                        className="flex items-center gap-2 cursor-pointer group whitespace-nowrap px-3 py-2 border border-transparent hover:border-[#E6E6E6] rounded-[8px] transition-colors"
                                    >
                                        <Text className="text-gray-500 text-[14px] group-hover:text-black transition-colors">Sort by: {sortBy}</Text>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`}>
                                            <path d="M6 9l6 6 6-6" />
                                        </svg>
                                    </Flex>
                                    {isSortOpen && (
                                        <>
                                            <Box className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                                            <Box className="absolute right-0 top-full mt-2 bg-white border border-[#E6E6E6] rounded-[10px] shadow-lg py-2 min-w-[180px] z-50">
                                                {sortOptions.map((option) => (
                                                    <button
                                                        key={option}
                                                        onClick={() => {
                                                            setSortBy(option);
                                                            setIsSortOpen(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-2.5 text-[14px] hover:bg-[#F7F7F7] transition-colors ${sortBy === option ? 'text-[#00A1FF] font-medium' : 'text-gray-600'}`}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </Box>
                                        </>
                                    )}
                                </Box>
                            </Flex>
                        </Flex>

                        {/* Grid */}
                        <Box className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[15px] min-h-[400px]">
                            {loading ? (
                                Array.from({ length: 9 }).map((_, index) => (
                                    <PropertyCardSkeleton key={`skeleton-${index}`} />
                                ))
                            ) : properties.length > 0 ? (
                                properties.map((property, index) => (
                                    <PropertyCard key={index} {...property} />
                                ))
                            ) : (
                                <Flex className="col-span-full h-full items-center justify-center py-20">
                                    <Text className="text-gray-500 text-lg">No properties available at the moment.</Text>
                                </Flex>
                            )}
                        </Box>
                    </Box>
                </Flex>
            </Box>

            {/* Mobile Filter Modal */}
            {(isFilterOpen || isClosing) && (
                <Box className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <Box
                        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
                        onClick={handleCloseFilter}
                    />
                    {/* Modal Content */}
                    <Box className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[20px] max-h-[90vh] overflow-y-auto ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}`}>
                        <Box className="p-4">
                            <PropertyFilter onClose={handleCloseFilter} isMobile={true} />
                        </Box>
                    </Box>
                </Box>
            )}
        </main>
    );
}

export default function PropertiesPage() {
    return (
        <Suspense fallback={<main className="bg-white min-h-screen flex items-center justify-center">Loading properties...</main>}>
            <PropertiesContent />
        </Suspense>
    );
}
