'use client';

import { Box, Flex, Text } from '@frooxi-labs/adaptive-ui';
import { FiSearch } from 'react-icons/fi';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/src/presentation/shared/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from 'use-places-autocomplete';

interface MapFilterBarProps {
    onSearch: (query: string) => void;
    onPriceChange: (min: number | null, max: number | null) => void;
    onAreaChange: (min: number | null, max: number | null) => void;
    onTypeChange: (type: 'buy' | 'rent' | 'off_plan') => void;
    currentType: 'buy' | 'rent' | 'off_plan';
    currentPriceRange: { min: number | null, max: number | null };
    currentAreaRange: { min: number | null, max: number | null };
    onLocationSelect?: (locationName: string, lat: number, lng: number) => void;
    isScriptLoaded?: boolean;
}

export const MapFilterBar = ({
    onSearch,
    onPriceChange,
    onAreaChange,
    onTypeChange,
    currentType,
    currentPriceRange,
    currentAreaRange,
    onLocationSelect,
    isScriptLoaded
}: MapFilterBarProps) => {
    const [priceMin, setPriceMin] = useState<string>('');
    const [priceMax, setPriceMax] = useState<string>('');
    const [areaMin, setAreaMin] = useState<string>('');
    const [areaMax, setAreaMax] = useState<string>('');

    const handlePriceApply = () => {
        const min = priceMin ? parseFloat(priceMin) : null;
        const max = priceMax ? parseFloat(priceMax) : null;
        onPriceChange(min, max);
    };

    const handleAreaApply = () => {
        const min = areaMin ? parseFloat(areaMin) : null;
        const max = areaMax ? parseFloat(areaMax) : null;
        onAreaChange(min, max);
    };

    return (
        <Box className="pointer-events-none flex flex-col gap-4">
            {/* Filter Pills Row */}
            <Flex className="gap-3 pointer-events-auto">
                {/* Type Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <Box className="h-[44px] px-5 bg-white text-[#1A1A1A] rounded-[12px] flex items-center justify-between gap-3 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer min-w-[120px]">
                            <Text className="text-[14px] font-medium capitalize">
                                {currentType.replace('_', ' ')}
                            </Text>
                            <ChevronDown size={16} className="text-gray-400" />
                        </Box>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[160px] p-1.5">
                        <DropdownMenuItem onClick={() => onTypeChange('buy')} className="text-[14px] font-medium cursor-pointer py-2">Buy</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onTypeChange('rent')} className="text-[14px] font-medium cursor-pointer py-2">Rent</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onTypeChange('off_plan')} className="text-[14px] font-medium cursor-pointer py-2">Off Plan</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Price Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <Box className={`h-[44px] px-5 rounded-[12px] flex items-center justify-between gap-3 shadow-sm transition-colors cursor-pointer min-w-[140px] ${currentPriceRange.min || currentPriceRange.max ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#1A1A1A] hover:bg-gray-50'}`}>
                            <Text className="text-[14px] font-medium whitespace-nowrap">
                                {currentPriceRange.min || currentPriceRange.max ? 'Price: Custom' : 'Price'}
                            </Text>
                            <ChevronDown size={16} className={currentPriceRange.min || currentPriceRange.max ? 'text-white' : 'text-gray-400'} />
                        </Box>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[280px] p-4">
                        <Text className="text-[14px] font-semibold mb-3">Price Range (AED)</Text>
                        <Flex className="gap-3 mb-4">
                            <input
                                type="number"
                                placeholder="Min"
                                className="w-full h-10 px-3 bg-gray-50 rounded-lg text-sm outline-none border border-transparent focus:border-blue-500 transition-all"
                                value={priceMin}
                                onChange={(e) => setPriceMin(e.target.value)}
                            />
                            <Box className="self-center text-gray-400">-</Box>
                            <input
                                type="number"
                                placeholder="Max"
                                className="w-full h-10 px-3 bg-gray-50 rounded-lg text-sm outline-none border border-transparent focus:border-blue-500 transition-all"
                                value={priceMax}
                                onChange={(e) => setPriceMax(e.target.value)}
                            />
                        </Flex>
                        <button
                            onClick={handlePriceApply}
                            className="w-full h-10 bg-[#1A1A1A] text-white rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors"
                        >
                            Apply
                        </button>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Area Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <Box className={`h-[44px] px-5 rounded-[12px] flex items-center justify-between gap-3 shadow-sm transition-colors cursor-pointer min-w-[130px] ${currentAreaRange.min || currentAreaRange.max ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#1A1A1A] hover:bg-gray-50'}`}>
                            <Text className="text-[14px] font-medium whitespace-nowrap">
                                {currentAreaRange.min || currentAreaRange.max ? 'Area: Custom' : 'Area'}
                            </Text>
                            <ChevronDown size={16} className={currentAreaRange.min || currentAreaRange.max ? 'text-white' : 'text-gray-400'} />
                        </Box>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[280px] p-4">
                        <Text className="text-[14px] font-semibold mb-3">Area (sq.ft)</Text>
                        <Flex className="gap-3 mb-4">
                            <input
                                type="number"
                                placeholder="Min"
                                className="w-full h-10 px-3 bg-gray-50 rounded-lg text-sm outline-none border border-transparent focus:border-blue-500 transition-all"
                                value={areaMin}
                                onChange={(e) => setAreaMin(e.target.value)}
                            />
                            <Box className="self-center text-gray-400">-</Box>
                            <input
                                type="number"
                                placeholder="Max"
                                className="w-full h-10 px-3 bg-gray-50 rounded-lg text-sm outline-none border border-transparent focus:border-blue-500 transition-all"
                                value={areaMax}
                                onChange={(e) => setAreaMax(e.target.value)}
                            />
                        </Flex>
                        <button
                            onClick={handleAreaApply}
                            className="w-full h-10 bg-[#1A1A1A] text-white rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors"
                        >
                            Apply
                        </button>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Flex>

            {/* Search Bar Row - Hero-style with use-places-autocomplete */}
            <Box className="pointer-events-auto">
                {isScriptLoaded ? (
                    <MapLocationSearch onLocationSelect={onLocationSelect} onSearch={onSearch} />
                ) : (
                    <Box className="w-[340px] h-[60px] bg-white rounded-[16px] shadow-sm flex items-center px-5">
                        <FiSearch className="text-gray-400 w-5 h-5 mr-3 shrink-0" />
                        <Text className="text-[15px] text-gray-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>Loading search...</Text>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

/* ── Hero-style Location Search (use-places-autocomplete) ── */
interface MapLocationSearchProps {
    onLocationSelect?: (locationName: string, lat: number, lng: number) => void;
    onSearch?: (query: string) => void;
}

const MapLocationSearch = ({ onLocationSelect, onSearch }: MapLocationSearchProps) => {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            componentRestrictions: { country: 'ae' },
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
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        setIsOpen(true);
    };

    const handleSelect = (suggestion: any) => async () => {
        const { description, structured_formatting: { main_text } } = suggestion;
        setValue(main_text, false);
        clearSuggestions();
        setIsOpen(false);

        if (onSearch) onSearch(main_text);

        try {
            const results = await getGeocode({ address: description });
            const { lat, lng } = getLatLng(results[0]);
            if (onLocationSelect) {
                onLocationSelect(main_text, lat, lng);
            }
        } catch (error) {
            console.error('Error getting geocode:', error);
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-[340px]">
            <Box className="h-[60px] bg-white rounded-[16px] shadow-sm flex items-center px-5">
                <FiSearch className="text-gray-400 w-5 h-5 mr-3 shrink-0" />
                <Box className="flex-1 flex flex-col justify-center">
                    <Text className="text-[11px] text-gray-500 font-medium mb-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>Location</Text>
                    <input
                        value={value}
                        onChange={handleInput}
                        disabled={!ready}
                        placeholder="Search location..."
                        className="w-full text-[15px] font-bold text-gray-900 outline-none bg-transparent placeholder-gray-400"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                    />
                </Box>
            </Box>

            {/* Suggestions Dropdown - Hero style */}
            {status === 'OK' && isOpen && (
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
