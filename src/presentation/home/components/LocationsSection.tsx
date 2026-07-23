'use client';

import { Box, Text, Flex } from '@frooxi-labs/adaptive-ui';
import Image from 'next/image';
import { GoogleMap, useJsApiLoader, Polygon, OverlayView } from '@react-google-maps/api';
import { api, TopLocation, Property } from '../../../services/api';
import React, { useEffect, useState, useCallback } from 'react';
import { GOOGLE_MAPS_LIBRARIES } from '../../../lib/googleMapsConfig';
import { LocationCardSkeleton, LocationSidebarSkeleton } from './LocationSkeleton';
import { PropertyCard } from '../../shared/components/PropertyCard';
import { X, ArrowLeft } from 'lucide-react';

const CACHE_KEY = 'unified_top_locations_cache_v1';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in ms

interface LocationData {
    name: string;
    count: number;
    color: string;
    latitude?: number;
    longitude?: number;
    offPlanCount?: number;
    rentCount?: number;
    sellCount?: number;
}

interface LocationCardProps {
    image: string;
    location: string;
    offPlan?: number;
    forRent?: number;
    forSell?: number;
    onClick?: () => void;
}

const darkMapStyles = [
    { featureType: "all", elementType: "geometry", stylers: [{ color: "#2b2b2b" }] },
    { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
    { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }, { lightness: -20 }] },
    { featureType: "administrative", elementType: "all", stylers: [{ visibility: "on" }] },
    { featureType: "administrative.country", elementType: "all", stylers: [{ visibility: "off" }] },
    { featureType: "administrative.province", elementType: "all", stylers: [{ visibility: "off" }] },
    { featureType: "administrative.locality", elementType: "all", stylers: [{ visibility: "off" }] },
    { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#2b2b2b" }] },
    { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#3d3d3d" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1f1f1f" }] },
    { featureType: "road.arterial", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3d3d3d" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f1f1f" }] },
    { featureType: "road.highway", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "road.local", elementType: "geometry", stylers: [{ color: "#353535" }] },
    { featureType: "transit", elementType: "all", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#1f1f1f" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#6b6b6b" }] }
];

const lightMapStyles = [
    { featureType: "all", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
    { featureType: "all", elementType: "labels.text.stroke", stylers: [{ visibility: "off" }] },
    { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#d6d6d6" }] },
    { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road.arterial", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#e8e8e8" }] },
    { featureType: "road.highway", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "road.local", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "transit", elementType: "all", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#e9e9e9" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#b3b3b3" }] }
];

const LocationCard = ({ image, location, offPlan, forRent, forSell, onClick }: LocationCardProps) => (
    <Box
        onClick={onClick}
        className="min-w-[326px] h-[219px] rounded-[20px] overflow-hidden relative flex-shrink-0 cursor-pointer group"
    >
        <Image
            src={image}
            alt={location}
            fill
            style={{ objectFit: 'cover' }}
            className="group-hover:scale-110 transition-transform duration-300"
        />
        <Box className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <Box
            className="absolute bottom-0 left-0 right-0 h-[120px] backdrop-blur-sm"
            style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
                maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
            }}
        />
        <Box className="absolute top-3 right-3 w-[40px] h-[40px] bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Image src="/Arrow.svg" alt="Arrow" width={13} height={13} />
        </Box>
        <Box className="absolute bottom-[24px] left-[21px] right-3">
            <Text className="text-white font-semibold text-[21px] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>{location}</Text>
            <Flex className="flex items-center gap-[9px] mt-3">
                {offPlan !== undefined && (
                    <Box className="backdrop-blur-md text-white text-[9px] font-medium h-[30px] px-[10px] rounded-full whitespace-nowrap flex items-center" style={{ backgroundColor: 'rgba(200, 200, 200, 0.33)', fontFamily: 'Montserrat, sans-serif' }}>
                        {offPlan} Off Plan
                    </Box>
                )}
                {offPlan !== undefined && forRent !== undefined && <Box className="w-[2px] h-[14px] bg-white" />}
                {forRent !== undefined && (
                    <Box className="backdrop-blur-md text-white text-[9px] font-medium h-[30px] px-[10px] rounded-full whitespace-nowrap flex items-center" style={{ backgroundColor: 'rgba(200, 200, 200, 0.33)', fontFamily: 'Montserrat, sans-serif' }}>
                        {forRent} for Rent
                    </Box>
                )}
                {(forRent !== undefined || offPlan !== undefined) && forSell !== undefined && <Box className="w-[2px] h-[14px] bg-white" />}
                {forSell !== undefined && (
                    <Box className="backdrop-blur-md text-white text-[9px] font-medium h-[30px] px-[10px] rounded-full whitespace-nowrap flex items-center" style={{ backgroundColor: 'rgba(200, 200, 200, 0.33)', fontFamily: 'Montserrat, sans-serif' }}>
                        {forSell} for Sell
                    </Box>
                )}
            </Flex>
        </Box>
    </Box>
);

export const LocationsSection = ({
    customTitle,
    hideTabs = false,
    hideCards = false,
    mapOverlay
}: {
    customTitle?: React.ReactNode;
    hideTabs?: boolean;
    hideCards?: boolean;
    mapOverlay?: React.ReactNode;
} = {}) => {
    const [activeTab, setActiveTab] = useState<'Buy' | 'Rent' | 'Off Plan'>('Buy');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
    const [locationProperties, setLocationProperties] = useState<Property[]>([]);
    const [isSidebarLoading, setIsSidebarLoading] = useState(false);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: GOOGLE_MAPS_LIBRARIES,
    });

    const mapContainerStyle = { width: '100%', height: '100%' };
    const center = { lat: 25.2048, lng: 55.2708 };

    const [topLocations, setTopLocations] = useState<LocationData[]>([]);
    const [boundaryPaths, setBoundaryPaths] = useState<Record<string, any[]>>({});
    const [map, setMap] = useState<google.maps.Map | null>(null);

    const onLoad = useCallback((map: google.maps.Map) => { setMap(map); }, []);
    const onUnmount = useCallback(() => { setMap(null); }, []);

    const [unifiedData, setUnifiedData] = useState<any[]>([]);

    const isInUAE = (lat: number, lng: number) => {
        return lat >= 22.5 && lat <= 26.5 && lng >= 51.5 && lng <= 56.5;
    };

    const handleLocationClick = useCallback(async (loc: LocationData) => {
        setSelectedLocation(loc);
        if (map && loc.latitude && loc.longitude) {
            map.setZoom(14);
            map.panTo({ lat: loc.latitude, lng: loc.longitude });
        }

        setIsSidebarLoading(true);
        try {
            const props = await api.getProperties({
                location: loc.name,
                purpose: activeTab === 'Off Plan' ? undefined : (activeTab === 'Buy' ? 'Sale' : activeTab),
                limit: 20
            });
            setLocationProperties(props);
        } catch (error) {
            console.error('Failed to fetch properties for location:', error);
            setLocationProperties([]);
        } finally {
            setIsSidebarLoading(false);
        }
    }, [map, activeTab]);

    const handleCloseSidebar = () => {
        setSelectedLocation(null);
        setLocationProperties([]);
        if (map && topLocations.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            topLocations.forEach(loc => {
                if (loc.latitude && loc.longitude) {
                    bounds.extend({ lat: loc.latitude, lng: loc.longitude });
                }
            });
            map.fitBounds(bounds);
        }
    };

    useEffect(() => {
        if (map && topLocations.length > 0 && !selectedLocation) {
            const bounds = new window.google.maps.LatLngBounds();
            let hasValidLoc = false;
            topLocations.forEach(loc => {
                if (loc.latitude && loc.longitude && isInUAE(loc.latitude, loc.longitude)) {
                    bounds.extend({ lat: loc.latitude, lng: loc.longitude });
                    hasValidLoc = true;
                }
            });
            if (hasValidLoc) map.fitBounds(bounds);
        }
    }, [map, topLocations, selectedLocation]);

    useEffect(() => {
        const loadStats = async () => {
            setIsLoading(true);
            try {
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    try {
                        const { data, timestamp } = JSON.parse(cached);
                        const isExpired = Date.now() - timestamp > CACHE_DURATION;
                        if (!isExpired && data && data.length > 0) {
                            setUnifiedData(data);
                            return;
                        }
                    } catch (e) { console.error('Failed to parse cache:', e); }
                }

                const data = await api.getUnifiedTopLocations();
                if (data && data.length > 0) {
                    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
                }
                setUnifiedData(data);
            } catch (err) {
                console.error('Failed to load unified stats:', err);
                setIsLoading(false);
            }
        };
        loadStats();
    }, []);

    useEffect(() => {
        const processAndFetchBoundaries = async () => {
            const colors = ['#FF4444', '#7FFF00', '#4A90E2', '#B794F4'];
            let sortKey = 'offPlan';
            if (activeTab === 'Buy') sortKey = 'forSell';
            if (activeTab === 'Rent') sortKey = 'forRent';

            let source = [...unifiedData];
            if (source.length === 0) {
                if (unifiedData.length > 0) setIsLoading(false);
                return;
            }

            source.sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0));
            const candidates = source.filter(item => (item[sortKey] || 0) > 0).slice(0, 8);

            if (candidates.length === 0) {
                setTopLocations([]);
                setIsLoading(false);
                return;
            }

            const results = await Promise.allSettled(candidates.map(async (item) => {
                const loc = {
                    name: (item.name || 'Unknown').split(',')[0].trim(),
                    baseCount: item[sortKey] || 0,
                    offPlan: item.offPlan || 0,
                    forRent: item.forRent || 0,
                    forSell: item.forSell || 0,
                };
                let name = loc.name;
                if (name.toLowerCase() === 'dubai land') name = 'Dubailand';

                const cacheKey = `osm_boundary_v5_${name}`;
                const cached = localStorage.getItem(cacheKey);

                if (cached) {
                    try {
                        const parsed = JSON.parse(cached);
                        if (parsed.paths || parsed.center) {
                            return { ...loc, name: loc.name, paths: parsed.paths, center: parsed.center, count: loc.baseCount };
                        }
                    } catch (e) { }
                }

                const variations = [name.includes('Dubai') ? name : `${name}, Dubai`, `${name}, United Arab Emirates`];
                for (const query of variations) {
                    try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/search.php?q=${encodeURIComponent(query)}&polygon_geojson=1&format=json`);
                        const data = await res.json();
                        if (data && data.length > 0) {
                            const result = data.find((d: any) => d.geojson && (d.geojson.type === 'Polygon' || d.geojson.type === 'MultiPolygon'));
                            if (result) {
                                const lat = parseFloat(result.lat);
                                const lon = parseFloat(result.lon);
                                if (!isInUAE(lat, lon)) continue;
                                const geo = result.geojson;
                                let paths: any[] = [];
                                if (geo.type === 'Polygon') paths = geo.coordinates[0].map((coord: any) => ({ lat: coord[1], lng: coord[0] }));
                                else if (geo.type === 'MultiPolygon') paths = geo.coordinates[0][0].map((coord: any) => ({ lat: coord[1], lng: coord[0] }));
                                if (paths.length > 0) {
                                    localStorage.setItem(cacheKey, JSON.stringify({ paths, center: { lat, lng: lon } }));
                                    return { ...loc, paths, center: { lat, lng: lon }, count: loc.baseCount };
                                }
                            }
                        }
                    } catch (err) { }
                    await new Promise(r => setTimeout(r, 100));
                }

                try {
                    const fallbackQuery = name.includes('Dubai') ? name : `${name}, Dubai`;
                    const res = await fetch(`https://nominatim.openstreetmap.org/search.php?q=${encodeURIComponent(fallbackQuery)}&format=json`);
                    const data = await res.json();
                    if (data && data.length > 0) {
                        const result = data[0];
                        const lat = parseFloat(result.lat);
                        const lon = parseFloat(result.lon);
                        if (isInUAE(lat, lon)) {
                            localStorage.setItem(cacheKey, JSON.stringify({ center: { lat, lng: lon } }));
                            return { ...loc, paths: null, center: { lat, lng: lon }, count: loc.baseCount };
                        }
                    }
                } catch (e) { }
                return null;
            }));

            const validLocations: any[] = [];
            const newBoundaryPaths: Record<string, any[]> = {};
            results.forEach(res => {
                if (res.status === 'fulfilled' && res.value) {
                    const val = res.value;
                    if (val.center) {
                        validLocations.push({
                            name: val.name,
                            count: val.count,
                            latitude: val.center.lat,
                            longitude: val.center.lng,
                            offPlanCount: val.offPlan,
                            rentCount: val.forRent,
                            sellCount: val.forSell,
                            color: '',
                        });
                        if (val.paths) newBoundaryPaths[val.name] = val.paths;
                    }
                }
            });

            const finalLocations = validLocations.slice(0, 4).map((loc, index) => ({ ...loc, color: colors[index % colors.length] }));
            setBoundaryPaths(prev => ({ ...prev, ...newBoundaryPaths }));
            setTopLocations(finalLocations);
            setIsLoading(false);
        };

        if (unifiedData.length > 0) processAndFetchBoundaries();
        else if (unifiedData.length === 0 && !isLoading) setIsLoading(false);
    }, [unifiedData, activeTab]);

    const mapOptions = {
        disableDefaultUI: false, zoomControl: true, mapTypeControl: false, scaleControl: true, streetViewControl: false,
        rotateControl: false, fullscreenControl: false, scrollwheel: true, disableDoubleClickZoom: false,
        gestureHandling: 'auto' as const, styles: isDarkMode ? darkMapStyles : lightMapStyles, minZoom: 8, maxZoom: 20,
        restriction: { latLngBounds: { north: 26.5, south: 22.5, west: 51.5, east: 56.5 }, strictBounds: false }
    };

    return (
        <Box as="section" className="w-full bg-[#FFFFFF] py-16 px-4 md:px-8 lg:px-16">
            <Box className="w-full max-w-[1300px] mx-auto">
                <Flex className="flex flex-col items-start mb-10 gap-6">
                    {customTitle ? customTitle : (
                        <Text className="text-[45px] font-normal text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Discover properties in your <Text as="span" className="font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>Desired Locations</Text>
                        </Text>
                    )}
                    {!hideTabs && (
                        <Box className="bg-[#E1E1E1]/40 p-1.5 rounded-full inline-flex items-center">
                            {(['Buy', 'Rent', 'Off Plan'] as const).map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-2.5 rounded-full text-[16px] font-normal transition-all duration-300 font-montserrat ${activeTab === tab ? 'bg-white text-black' : 'text-[#6D6D6D] hover:text-black'}`}>
                                    {tab}
                                </button>
                            ))}
                        </Box>
                    )}
                </Flex>

                <Box className="w-full max-w-[1280px] h-[549px] bg-gray-100 rounded-[30px] overflow-hidden relative mb-8">
                    <Flex className="w-full h-full relative">
                        {/* Sidebar */}
                        <Box
                            className={`absolute top-0 bottom-0 left-0 w-[450px] bg-white z-20 transition-transform duration-500 ease-in-out border-r border-gray-200 overflow-hidden flex flex-col ${selectedLocation ? 'translate-x-0' : '-translate-x-full'}`}
                        >
                            <Flex className="p-6 border-b border-gray-100 items-center justify-between sticky top-0 bg-white z-30">
                                <Flex className="items-center gap-3">
                                    <button onClick={handleCloseSidebar} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <Box>
                                        <Text className="text-[22px] font-semibold text-black leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                            {selectedLocation?.name}
                                        </Text>
                                        <Text className="text-[14px] text-gray-500">
                                            {locationProperties.length} Properties found
                                        </Text>
                                    </Box>
                                </Flex>
                                <button onClick={handleCloseSidebar} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </Flex>

                            <Box className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                                {isSidebarLoading ? (
                                    <Flex className="flex flex-col gap-6">
                                        {[1, 2, 3].map(i => (
                                            <Box key={i} className="w-full h-[200px] bg-gray-100 rounded-[20px] animate-pulse" />
                                        ))}
                                    </Flex>
                                ) : locationProperties.length > 0 ? (
                                    <Flex className="flex flex-col gap-6">
                                        {locationProperties.map((prop) => (
                                            <PropertyCard
                                                key={prop.id}
                                                image={prop.coverPhoto || '/Image/property.png'}
                                                title={prop.propertyTitle || 'Untitled Property'}
                                                address={prop.address || selectedLocation?.name || ''}
                                                beds={parseInt(prop.bedrooms || '0')}
                                                baths={prop.bathrooms || 0}
                                                sqft={prop.area || 0}
                                                price={prop.price ? `${prop.price.toLocaleString()} AED` : 'Price on Request'}
                                                type={prop.propertyType || ''}
                                                agent={{
                                                    name: prop.assignedAgent?.name || 'Agent',
                                                    languages: prop.assignedAgent?.languages?.join(', ') || 'English',
                                                    avatar: prop.assignedAgent?.photoUrl || '/Assets/agent_placeholder.png'
                                                }}
                                            />
                                        ))}
                                    </Flex>
                                ) : (
                                    <Flex className="w-full h-full items-center justify-center flex-col gap-3 py-12">
                                        <Text className="text-gray-400">No properties found in this location.</Text>
                                    </Flex>
                                )}
                            </Box>
                        </Box>

                        {/* Top Locations Card - Hidden when sidebar is open */}
                        {!selectedLocation && (
                            <Box className="absolute bottom-6 left-6 w-[369px] h-[244px] rounded-[20px] p-5 z-10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.45)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
                                <Text className={`text-[26px] font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>Top Locations</Text>
                                <Box className="w-full h-[1px] mb-4" style={{ backgroundColor: '#E1E1E1' }} />
                                {isLoading ? <LocationSidebarSkeleton /> : topLocations.length > 0 ? (
                                    <Box className="flex flex-col gap-3">
                                        {topLocations.map((location) => (
                                            <Flex
                                                key={location.name}
                                                className="flex items-center justify-between cursor-pointer hover:bg-white/20 p-1 rounded-md transition-colors"
                                                onClick={() => handleLocationClick(location)}
                                            >
                                                <Flex className="flex items-center gap-2">
                                                    <Box className="w-3 h-3 rounded-full" style={{ backgroundColor: location.color }} />
                                                    <Text className={`text-[14px] ${isDarkMode ? 'text-white' : 'text-black'}`}>{location.name}</Text>
                                                </Flex>
                                                <Text className={`text-[13px] ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{location.count} Properties</Text>
                                            </Flex>
                                        ))}
                                    </Box>
                                ) : <Text className="text-gray-500 text-sm">No locations found</Text>}
                            </Box>
                        )}

                        <Box className="w-full h-full relative">
                            {isLoaded ? (
                                <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={11} options={mapOptions} onLoad={onLoad} onUnmount={onUnmount}>
                                    {!isLoading && topLocations.map((loc) => {
                                        if (!loc.latitude || !loc.longitude) return null;
                                        const path = boundaryPaths[loc.name];
                                        return (
                                            <React.Fragment key={`elements-${loc.name}`}>
                                                {path && <Polygon
                                                    onClick={() => handleLocationClick(loc)}
                                                    paths={path}
                                                    options={{ strokeColor: '#B8B8B8', strokeOpacity: 0, strokeWeight: 2, fillColor: loc.color, fillOpacity: 0.15, icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, strokeColor: '#B8B8B8', scale: 4 }, offset: '0', repeat: '20px' }] }}
                                                />}
                                                <OverlayView position={{ lat: loc.latitude, lng: loc.longitude }} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                                                    <Box
                                                        onClick={() => handleLocationClick(loc)}
                                                        className="relative flex flex-col items-center transform -translate-x-1/2 -translate-y-full cursor-pointer pointer-events-auto"
                                                    >
                                                        <Box className="relative">
                                                            <svg width="40" height="48" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                                                                <path d="M17 0C7.61116 0 0 7.61116 0 17C0 29.75 17 42.5 17 42.5C17 42.5 34 29.75 34 17C34 7.61116 26.3888 0 17 0Z" fill={loc.color} />
                                                                <circle cx="17" cy="17" r="6" fill="white" />
                                                            </svg>
                                                        </Box>
                                                        <Box className={`mt-1 px-3 py-1 rounded-full ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                                            <Text className="text-[11px] font-semibold whitespace-nowrap">{loc.count} Properties</Text>
                                                        </Box>
                                                    </Box>
                                                </OverlayView>
                                            </React.Fragment>
                                        );
                                    })}
                                </GoogleMap>
                            ) : <Box className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-200'}`}><Text className={`text-lg ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Loading Map...</Text></Box>}

                            {mapOverlay}

                            <Box className="absolute top-6 right-6 w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform z-10" style={{ backgroundColor: 'rgba(205, 205, 205, 0.5)' }} onClick={() => setIsDarkMode(!isDarkMode)}>
                                {isDarkMode ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                                )}
                            </Box>
                        </Box>
                    </Flex>
                </Box>

                {!hideCards && (
                    <Box className="w-full overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <Flex className="flex gap-5 pb-4">
                            {isLoading ? [1, 2, 3, 4].map((i) => <LocationCardSkeleton key={i} />) : topLocations.length > 0 ? (
                                topLocations.map((loc, index) => (
                                    <LocationCard
                                        key={index}
                                        image="/Image/property.png"
                                        location={loc.name}
                                        offPlan={loc.offPlanCount}
                                        forRent={loc.rentCount}
                                        forSell={loc.sellCount}
                                        onClick={() => handleLocationClick(loc)}
                                    />
                                ))
                            ) : <Text className="text-gray-400 p-4">No location data available.</Text>}
                        </Flex>
                    </Box>
                )}
            </Box>
        </Box>
    );
};
