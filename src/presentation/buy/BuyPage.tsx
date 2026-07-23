'use client';

import { useState, useEffect, Suspense } from "react";
import { Box, Flex } from '@frooxi-labs/adaptive-ui';
import { Header } from '../shared/components/Header';
import { Footer } from '../shared/components/Footer';
import { BuyHero } from './components/BuyHero';
import PropertySearchBar from "../shared/components/PropertySearchBar";
import CommunitySlider from "../shared/components/CommunitySlider";
import PropertySort from "../shared/components/PropertySort";
import PropertyCardReplicated from "../shared/components/PropertyCardReplicated";
import { PropertyCardSkeletonHorizontal } from "../shared/components/PropertyCardSkeletonHorizontal";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import axios from "axios";

const BuyPageContent = ({ category = "residential" }: { category?: string }) => {
    const [properties, setProperties] = useState<any[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState('recent');

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                const purpose = pathname.includes('/rent') ? 'rent' : 'buy';
                const status = 'published';

                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:6001'}/properties?purpose=${purpose}&status=${status}&category=${category}`);
                const rawProperties = res.data.data || [];

                // Map CRM fields to frontend fields
                const mappedProperties = rawProperties.map((p: any) => ({
                    ...p,
                    propertyPrice: p.price,
                    propertyAddress: p.pfLocationPath || p.address,
                    propertyState: p.emirate,
                    propertyBedrooms: p.bedrooms,
                    propertyBathrooms: p.bathrooms,
                    propertySize: p.area,
                    propertyFeaturedImage: p.coverPhoto,
                    media: p.mediaImages || [],
                    agent: p.assignedAgent,
                }));

                setProperties(mappedProperties);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchProperties();
    }, [pathname, category]);

    useEffect(() => {
        if (properties.length === 0 && !loading) return;

        let filtered = [...properties];

        // Location filter
        const locationQuery = searchParams.get('location');
        if (locationQuery) {
            const search = locationQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.propertyAddress?.toLowerCase().includes(search) ||
                p.propertyState?.toLowerCase().includes(search) ||
                p.propertyCountry?.toLowerCase().includes(search) ||
                p.propertyTitle?.toLowerCase().includes(search) ||
                (p.pfLocationPath && p.pfLocationPath.toLowerCase().includes(search)) ||
                (p.community && p.community.toLowerCase().includes(search))
            );
        }

        // Property type filter
        const typeQuery = searchParams.get('propertyType');
        if (typeQuery) {
            filtered = filtered.filter(p => p.propertyType === typeQuery);
        }

        // Price range filter
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        if (minPrice) filtered = filtered.filter(p => p.propertyPrice >= Number(minPrice));
        if (maxPrice) filtered = filtered.filter(p => p.propertyPrice <= Number(maxPrice));

        // Beds filter
        const bedsQuery = searchParams.get('beds');
        if (bedsQuery && bedsQuery !== 'All' && bedsQuery !== 'Any') {
            if (bedsQuery === 'Studio') {
                filtered = filtered.filter(p => Number(p.propertyBedrooms) === 0);
            } else if (bedsQuery.endsWith('+')) {
                const minBeds = parseInt(bedsQuery);
                filtered = filtered.filter(p => Number(p.propertyBedrooms) >= minBeds);
            } else {
                const targetBeds = parseInt(bedsQuery);
                filtered = filtered.filter(p => Number(p.propertyBedrooms) === targetBeds);
            }
        }

        // Baths filter
        const bathsQuery = searchParams.get('baths');
        if (bathsQuery && bathsQuery !== 'All' && bathsQuery !== 'Any') {
            if (bathsQuery.endsWith('+')) {
                const minBaths = parseInt(bathsQuery);
                filtered = filtered.filter(p => Number(p.propertyBathrooms) >= minBaths);
            } else {
                const targetBaths = parseInt(bathsQuery);
                filtered = filtered.filter(p => Number(p.propertyBathrooms) === targetBaths);
            }
        }

        // Apply sorting
        const sortParam = searchParams.get('sort') || sortOrder;
        filtered = sortProperties(filtered, sortParam);

        setFilteredProperties(filtered);
    }, [searchParams, properties, loading, sortOrder]);

    const sortProperties = (props: any[], param: string) => {
        return [...props].sort((a, b) => {
            switch (param) {
                case 'price-desc': return b.propertyPrice - a.propertyPrice;
                case 'price-asc': return a.propertyPrice - b.propertyPrice;
                case 'bedrooms-desc': return b.propertyBedrooms - a.propertyBedrooms;
                case 'bedrooms-asc': return a.propertyBedrooms - b.propertyBedrooms;
                case 'recent': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default: return 0;
            }
        });
    };

    const handleCommunityClick = (communityName: string) => {
        const query = new URLSearchParams(searchParams.toString());
        query.set('location', communityName);
        router.push(`${pathname}?${query.toString()}`);
    };

    const handleFilterChange = (value: string) => {
        setSortOrder(value);
        const query = new URLSearchParams(searchParams.toString());
        query.set('sort', value);
        router.replace(`${pathname}?${query.toString()}`);
    };

    const handleMapViewClick = () => {
        router.push(`/map-view${pathname}`);
    };

    const isCommercial = category === 'commercial';
    const isRent = pathname.includes('/rent');
    const headingText = isCommercial 
        ? (isRent ? "Commercial properties for rent in Dubai" : "Commercial properties for sale in Dubai")
        : (isRent ? "Properties for rent in Dubai" : "Properties for sale in Dubai");

    return (
        <main className="pt-[100px] md:pt-[120px]">
            <Box className="pt-0 px-4 md:px-0">
                <PropertySearchBar />
                <CommunitySlider onCommunityClick={handleCommunityClick} />

                <Box className="max-w-7xl mx-auto mt-5">
                    <Flex className="flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white rounded-lg border border-[#e6e6e6] mb-5">
                        <Box>
                            <h3 className="text-xl text-black font-bold">
                                {headingText}
                            </h3>
                            <Flex className="items-center mt-2 gap-2">
                                <span className="text-gray-700 font-medium">Results:</span>
                                <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-md text-sm font-medium">
                                    {filteredProperties.length}
                                </span>
                            </Flex>
                        </Box>

                        <Flex className="w-full md:w-auto mt-4 md:mt-0 gap-3">
                            <PropertySort onFilterChange={handleFilterChange} />

                            <Box
                                onClick={handleMapViewClick}
                                className="flex items-center px-4 py-2.5 bg-white text-gray-800 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer hover:border-red-200"
                            >
                                <FaMapMarkerAlt className="mr-2 text-red-500" />
                                <span className="font-medium text-sm">View on Map</span>
                            </Box>
                        </Flex>
                    </Flex>
                </Box>

                <Box className="max-w-7xl mx-auto p-4 md:px-0">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => <PropertyCardSkeletonHorizontal key={i} />)
                    ) : error ? (
                        <Box className="text-center py-20 text-red-500">Error: {error}</Box>
                    ) : filteredProperties.length === 0 ? (
                        <Box className="text-center py-20 text-gray-500">No properties found matching your criteria.</Box>
                    ) : (
                        filteredProperties.map((property) => (
                            <PropertyCardReplicated
                                key={property._id || property.id}
                                property={property}
                                loading={false}
                                error={null}
                            />
                        ))
                    )}
                </Box>
            </Box>
        </main>
    );
};

export const BuyPage = ({ category = "residential" }: { category?: string }) => {
    return (
        <Box className="min-h-screen bg-white text-black font-sans relative">
            <Header theme="dark" />
            <Suspense fallback={<Box className="p-20 text-center">Loading page...</Box>}>
                <BuyPageContent category={category} />
            </Suspense>
            <Footer />
        </Box>
    );
};
