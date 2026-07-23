'use client';

import { Box, Text, Stack, Flex } from '@frooxi-labs/adaptive-ui';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Header } from '../../shared/components/Header';
import { useJsApiLoader } from '@react-google-maps/api';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import { useRouter } from 'next/navigation';
import { GOOGLE_MAPS_LIBRARIES } from '../../../lib/googleMapsConfig';

const SearchBar = () => {
    const [activeTab, setActiveTab] = useState('Rent');
    const [propertyType, setPropertyType] = useState('Residential');
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [location, setLocation] = useState('');
    const router = useRouter();

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: GOOGLE_MAPS_LIBRARIES,
    });

    const handleSearch = () => {
        const query = new URLSearchParams();
        if (location) query.append('location', location);

        // Map UI 'Buy'/'Rent' to API 'Sale'/'Rent' for 'purpose'
        const purposeValue = activeTab === 'Buy' ? 'Sale' : 'Rent';
        query.append('purpose', purposeValue);

        // Map UI 'Residential'/'Commercial' to API 'residential'/'commercial' for 'category'
        // The user calls this "Property Type" in UI, but data shows it matches 'category' field.
        if (propertyType) {
            query.append('category', propertyType.toLowerCase());
        }

        router.push(`/properties?${query.toString()}`);
    };

    return (
        <Box
            className="bg-white rounded-[20px] py-5 px-5 shadow-[0px_0px_30px_-10px_rgba(0,0,0,0.25)] w-full lg:w-3/4 xl:w-3/5 max-w-4xl border border-[#000000]/10 absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-1/2 z-20"
        >
            <Flex className="flex flex-col md:flex-row items-center gap-6 relative">
                {/* Rent/Buy Toggle - Box with stroke only */}
                <Flex className="flex shrink-0 items-center gap-2 border border-[#F3F3F3] rounded-[10px] px-4 py-4">
                    <Box
                        as="button"
                        onClick={() => setActiveTab('Rent')}
                        className={`px-2 py-0 text-[16px] transition-all border-b-2 ${activeTab === 'Rent'
                            ? 'font-medium text-[#FF0000] border-[#FF0000]'
                            : 'font-normal text-[#000000]/60 hover:text-gray-900 border-transparent'
                            }`}
                    >
                        Rent
                    </Box>
                    <Box
                        as="button"
                        onClick={() => setActiveTab('Buy')}
                        className={`px-2 py-0 text-[16px] transition-all border-b-2 ${activeTab === 'Buy'
                            ? 'font-medium text-[#FF0000] border-[#FF0000]'
                            : 'font-normal text-[#000000]/60 hover:text-gray-900 border-transparent'
                            }`}
                    >
                        Buy
                    </Box>
                </Flex>


                {/* Locations with Autocomplete */}
                <Box className="flex-1 cursor-pointer group px-4 ml-6 relative z-30 w-full">
                    <Text className="font-semibold text-[18px] text-black mb-1">Locations</Text>
                    {isLoaded ? (
                        <CityAutocomplete onLocationSelect={setLocation} />
                    ) : (
                        <Flex className="flex items-center gap-3">
                            <Text className="text-gray-500 font-normal text-[16px]">Loading...</Text>
                        </Flex>
                    )}
                </Box>

                {/* Vertical Divider */}
                <Box className="hidden md:block w-[2px] h-12 bg-[#999999]" />

                {/* Property type */}
                <Box className="flex-1 cursor-pointer group px-4 w-full relative">
                    <Text className="font-semibold text-[18px] text-black mb-1">Property type</Text>

                    <div className="relative">
                        <Flex
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setIsTypeOpen(!isTypeOpen)}
                        >
                            <Text className={`font-normal text-[16px] transition-colors ${propertyType ? 'text-black' : 'text-gray-500'}`}>
                                {propertyType || 'Select property type'}
                            </Text>
                            <Image
                                src="/downarrow.svg"
                                alt="Drop down"
                                width={12}
                                height={12}
                                className={`transition-transform duration-200 ${isTypeOpen ? 'rotate-180' : ''}`}
                            />
                        </Flex>

                        {/* Property Type Dropdown */}
                        {isTypeOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsTypeOpen(false)} />
                                <div className="absolute top-full left-0 mt-2 w-full min-w-[180px] bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {['Residential', 'Commercial'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => {
                                                setPropertyType(type);
                                                setIsTypeOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-[15px] ${propertyType === type ? 'text-red-600 font-medium' : 'text-gray-700'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </Box>

                {/* Search Button */}
                <Flex
                    as="button"
                    onClick={handleSearch}
                    className="flex bg-[#FF0000] text-white px-8 py-4 rounded-[10px] items-center gap-2 w-full md:w-auto justify-center hover:bg-red-700 transition-all font-medium shrink-0 active:scale-95 ml-1"
                >
                    Search
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </Flex>
            </Flex>
        </Box>
    );
};

interface CityAutocompleteProps {
    onLocationSelect: (location: string) => void;
}

const CityAutocomplete = ({ onLocationSelect }: CityAutocompleteProps) => {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            // types: ['(cities)'], // Removed to allow all types (establishments, addresses, etc.)
            componentRestrictions: { country: "ae" } // Restrict to UAE
        },
        debounce: 300,
    });

    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        onLocationSelect(e.target.value); // Update parent state on type as well? Or only on select? Let's update on type for now, but usually standardized on select.
        setIsOpen(true);
    };

    const handleSelect = ({ description, structured_formatting: { main_text } }: { description: string, structured_formatting: { main_text: string } }) => () => {
        // When user selects a place, we can replace the keyword without request logic from Google Maps API server.
        setValue(main_text, false);
        onLocationSelect(main_text);
        clearSuggestions();
        setIsOpen(false);

        // Get latitude and longitude via utility functions if needed for map integration in future
        getGeocode({ address: description }).then((results) => {
            const { lat, lng } = getLatLng(results[0]);
            console.log("📍 Coordinates: ", { lat, lng });
        });
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <Flex className="flex items-center gap-2 w-full">
                <input
                    value={value}
                    onChange={handleInput}
                    disabled={!ready}
                    placeholder="Search location..."
                    className="w-full text-gray-500 font-normal text-[16px] placeholder-gray-400 focus:outline-none focus:text-black bg-transparent border-b border-transparent focus:border-red-500 transition-all font-montserrat"
                />
                <Image src="/locationround.svg" alt="Location" width={16} height={16} className={`group-hover:scale-110 transition-transform ${value ? 'opacity-100' : 'opacity-60'}`} />
            </Flex>

            {/* Suggestions Dropdown */}
            {status === "OK" && isOpen && (
                <ul className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[9999] max-h-[250px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    {data.map((suggestion) => {
                        const {
                            place_id,
                            structured_formatting: { main_text, secondary_text },
                        } = suggestion;

                        return (
                            <li
                                key={place_id}
                                onClick={handleSelect(suggestion)}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between group transition-colors"
                            >
                                <div>
                                    <span className="block text-[#000000] text-[15px] font-medium group-hover:text-red-600 transition-colors">
                                        {main_text}
                                    </span>
                                    <span className="block text-[#888888] text-[12px]">
                                        {secondary_text}
                                    </span>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

interface HeroSectionProps {
    showSearchBar?: boolean;
}

export const HeroSection = ({ showSearchBar = true }: HeroSectionProps) => {
    return (
        <Box
            as="section"
            className="w-full aspect-[1.83963494133] relative bg-white p-4 flex items-center justify-center"
        >
            {/* Background Image Container - Rounded 30px */}
            <Box className="absolute inset-4 rounded-[30px] overflow-hidden z-0">
                <Image
                    src="/Image/BGimage.png"
                    alt="Luxury Home"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
                <Box
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 30%, rgba(0,0,0,0) 100%)'
                    }}
                />
            </Box>

            {/* Content Container */}
            <Flex
                className="flex relative z-10 w-full h-full px-4 md:px-8 lg:px-16 flex-col items-start pt-[135px]"
            >
                <Header />

                <Box className="max-w-6xl w-full pl-4 md:pl-[60px] lg:pl-[125px]">

                    {/* Hero Text Content */}
                    <Stack className="flex flex-col gap-0 max-w-3xl">
                        <Box>
                            <Text as="h1" className="text-[40px] md:text-[60px] lg:text-[80px] font-medium text-white leading-tight">
                                Altan: Waterfront <br />
                                Living Redefined
                            </Text>
                        </Box>

                        <Stack className="flex flex-col gap-2">
                            <Text className="text-white/90 text-[22px] font-medium">Flexible 80/20 Plan</Text>
                            <Text className="text-gray-200 text-[20px] font-normal max-w-xl">
                                We provide a complete service for the sale, purchase or rental of real estate.
                            </Text>
                        </Stack>

                        <Flex className="flex gap-4 mt-4 flex-col md:flex-row">
                            <Box
                                as="button"
                                className="border border-white text-white px-8 h-[63px] rounded-[20px] hover:bg-white hover:text-black transition-all flex items-center justify-center font-medium text-[18px]"
                            >
                                Learn More
                            </Box>
                            <Box
                                as="button"
                                className="bg-[#FF0000] text-white px-8 h-[63px] rounded-[20px] font-medium text-[18px] hover:bg-red-700 transition-all flex items-center justify-center"
                            >
                                Browse Properties
                            </Box>
                        </Flex>
                    </Stack>
                </Box>
            </Flex>

            {/* Floating Search Bar - Positioned relative to main section */}
            {showSearchBar && <SearchBar />}
        </Box>
    );
};

