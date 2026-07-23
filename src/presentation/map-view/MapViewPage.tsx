'use client';

import { Box, Flex, Text } from '@frooxi-labs/adaptive-ui';
import { Header } from '../shared/components/Header';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapFilterBar } from './components/MapFilterBar';
import { PropertyMap } from './components/PropertyMap';
import { MapPropertyOverlay } from './components/MapPropertyOverlay';
import { useJsApiLoader } from '@react-google-maps/api';
import { GOOGLE_MAPS_LIBRARIES } from '../../lib/googleMapsConfig';

interface MapViewPageProps {
    purpose: 'buy' | 'rent';
}

export const MapViewPage = ({ purpose }: MapViewPageProps) => {
    // Load Google Maps API
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: GOOGLE_MAPS_LIBRARIES,
    });

    const [properties, setProperties] = useState<any[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Map Navigation State
    const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral | undefined>(undefined);
    const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds | undefined>(undefined);

    // Boundary polygon for searched location
    const [boundaryPath, setBoundaryPath] = useState<{ lat: number; lng: number }[] | null>(null);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
    const [areaRange, setAreaRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
    const [listingType, setListingType] = useState<'buy' | 'rent' | 'off_plan'>(purpose === 'rent' ? 'rent' : 'buy');

    useEffect(() => {
        setListingType(purpose === 'rent' ? 'rent' : 'buy');
    }, [purpose]);

    /* ── Fetch boundary from Nominatim (same approach as LocationsSection) ── */
    const fetchLocationBoundary = async (locationName: string) => {
        try {
            const cacheKey = `osm_boundary_map_${locationName}`;
            const cached = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null;
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed.paths && parsed.paths.length > 0) {
                    setBoundaryPath(parsed.paths);
                    return;
                }
            }

            const variations = [
                locationName.includes('Dubai') ? locationName : `${locationName}, Dubai`,
                `${locationName}, United Arab Emirates`,
            ];

            for (const query of variations) {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search.php?q=${encodeURIComponent(query)}&polygon_geojson=1&format=json`
                );
                const data = await res.json();
                if (data && data.length > 0) {
                    const result = data.find(
                        (d: any) => d.geojson && (d.geojson.type === 'Polygon' || d.geojson.type === 'MultiPolygon')
                    );
                    if (result) {
                        const geo = result.geojson;
                        let paths: { lat: number; lng: number }[] = [];
                        if (geo.type === 'Polygon') {
                            paths = geo.coordinates[0].map((coord: number[]) => ({ lat: coord[1], lng: coord[0] }));
                        } else if (geo.type === 'MultiPolygon') {
                            paths = geo.coordinates[0][0].map((coord: number[]) => ({ lat: coord[1], lng: coord[0] }));
                        }
                        if (paths.length > 0) {
                            localStorage.setItem(cacheKey, JSON.stringify({ paths }));
                            setBoundaryPath(paths);
                            return;
                        }
                    }
                }
                await new Promise((r) => setTimeout(r, 200));
            }

            // No boundary found — clear any old boundary
            setBoundaryPath(null);
        } catch (err) {
            console.error('Error fetching boundary:', err);
            setBoundaryPath(null);
        }
    };

    /* ── Handle Location Selection from search ── */
    const handleLocationSelect = (locationName: string, lat: number, lng: number) => {
        setMapCenter({ lat, lng });
        // Clear old bounds so panTo with center works
        setMapBounds(undefined);
        // Fetch and draw boundary polygon
        fetchLocationBoundary(locationName);
    };

    /* ── Fetch properties ── */
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                const status = 'published';
                const res = await axios.get(
                    `http://127.0.0.1:6001/properties?purpose=${purpose}&status=${status}&category=residential`
                );
                const rawProperties = res.data.data || [];

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
                    agent: {
                        name: p.assignedAgent?.name || 'Mateluxy Team',
                        photo: p.assignedAgent?.profileImage || p.assignedAgent?.avatar || '',
                        languages: p.assignedAgent?.languages
                            ? Array.isArray(p.assignedAgent.languages)
                                ? p.assignedAgent.languages.join(', ')
                                : p.assignedAgent.languages
                            : 'English',
                    },
                    location: {
                        lat: parseFloat(p.latitude || '0'),
                        lng: parseFloat(p.longitude || '0'),
                    },
                }));

                setProperties(mappedProperties);
                setFilteredProperties(mappedProperties);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchProperties();
    }, [purpose]);

    /* ── Filter Logic ── */
    useEffect(() => {
        let result = properties;

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.title?.toLowerCase().includes(lowerQuery) ||
                    p.propertyAddress?.toLowerCase().includes(lowerQuery)
            );
        }

        if (listingType === 'off_plan') {
            result = result.filter((p) => p.category === 'off_plan');
        } else if (listingType === 'buy') {
            // API returns purpose as 'Sale' (capital S) — match case-insensitively
            result = result.filter(
                (p) => {
                    const pp = (p.purpose || '').toLowerCase();
                    return pp === 'buy' || pp === 'sale';
                }
            );
        } else if (listingType === 'rent') {
            result = result.filter(
                (p) => (p.purpose || '').toLowerCase() === 'rent'
            );
        }

        if (priceRange.min !== null) {
            result = result.filter((p) => parseFloat(p.propertyPrice || '0') >= (priceRange.min as number));
        }
        if (priceRange.max !== null) {
            result = result.filter((p) => parseFloat(p.propertyPrice || '0') <= (priceRange.max as number));
        }

        if (areaRange.min !== null) {
            result = result.filter((p) => parseFloat(p.propertySize || '0') >= (areaRange.min as number));
        }
        if (areaRange.max !== null) {
            result = result.filter((p) => parseFloat(p.propertySize || '0') <= (areaRange.max as number));
        }

        setFilteredProperties(result);
    }, [properties, searchQuery, priceRange, areaRange, listingType]);

    /* ── Loading ── */
    if (!isLoaded)
        return (
            <Box className="h-screen w-screen bg-white flex items-center justify-center">
                <Text className="text-gray-500 text-lg">Loading Maps...</Text>
            </Box>
        );

    return (
        <Box className="h-screen w-screen flex flex-col bg-white overflow-hidden">
            {/* Header */}
            <Box className="relative w-full h-[90px] z-50 bg-white shadow-sm shrink-0">
                <Header theme="dark" />
            </Box>

            {/* Main Content */}
            <Box className="flex-1 relative w-full overflow-hidden">
                {/* Map Layer */}
                <Box className="absolute inset-0 z-0">
                    <PropertyMap
                        properties={filteredProperties}
                        center={mapCenter}
                        bounds={mapBounds}
                        boundaryPath={boundaryPath}
                    />
                </Box>

                {/* Overlay Layer */}
                <Box className="absolute inset-0 z-10 pointer-events-none p-6">
                    <Flex className="h-full w-full justify-between items-start">
                        {/* Left: Filter Bar */}
                        <Box className="pointer-events-auto">
                            <MapFilterBar
                                onSearch={setSearchQuery}
                                onPriceChange={(min, max) => setPriceRange({ min, max })}
                                onAreaChange={(min, max) => setAreaRange({ min, max })}
                                onTypeChange={setListingType}
                                currentType={listingType}
                                currentPriceRange={priceRange}
                                currentAreaRange={areaRange}
                                onLocationSelect={handleLocationSelect}
                                isScriptLoaded={isLoaded}
                            />
                        </Box>

                        {/* Right: Property Overlay */}
                        <Box className="pointer-events-auto h-full flex flex-col justify-center">
                            {loading ? (
                                <Box className="w-[500px] bg-white rounded-[24px] shadow-2xl p-6 flex items-center justify-center" style={{ boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.05)' }}>
                                    <Text className="text-gray-400 text-sm">Loading properties...</Text>
                                </Box>
                            ) : filteredProperties.length > 0 ? (
                                <MapPropertyOverlay properties={filteredProperties} />
                            ) : (
                                <Box className="w-[500px] bg-white rounded-[24px] shadow-2xl p-6 flex flex-col items-center justify-center gap-3" style={{ boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.05)' }}>
                                    <Text className="text-gray-500 text-lg font-semibold">No Properties Found</Text>
                                    <Text className="text-gray-400 text-sm text-center">Try adjusting your filters or search for a different location.</Text>
                                </Box>
                            )}
                        </Box>
                    </Flex>
                </Box>
            </Box>
        </Box>
    );
};
