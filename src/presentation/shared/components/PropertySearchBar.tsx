'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FiSearch, FiSliders, FiMapPin, FiHome } from "react-icons/fi";
import * as DropdownMenu from "./ui/dropdown-menu";
import { Slider } from "./ui/slider";
import Image from "next/image";

const PropertySearchBar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParamsHook = useSearchParams();

    const [activeTab, setActiveTab] = useState(0);
    const [searchParams, setSearchParams] = useState({
        location: "",
        propertyType: "",
        priceRange: [100, 5000000] as [number, number],
        beds: "",
        baths: "",
        amenities: [] as string[],
    });
    const [minMaxPrices, setMinMaxPrices] = useState({ min: 100, max: 5000000 });
    const [amenitiesOptions, setAmenitiesOptions] = useState<{ id: string, label: string }[]>([]);

    // Set the active tab based on the current path
    useEffect(() => {
        if (pathname.includes('/rent')) {
            setActiveTab(1);
        } else {
            setActiveTab(0);
        }
    }, [pathname]);

    // Fetch dynamic amenities and price ranges from all properties
    useEffect(() => {
        const fetchPropertyData = async () => {
            try {
                const category = activeTab === 0 ? 'Buy' : 'Rent';

                // Use the API URL from services or default
                const response = await fetch(`http://127.0.0.1:6001/properties`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch properties`);
                }

                const json = await response.json();
                const allProperties = json.data || [];

                // Filter properties by category
                const properties = allProperties.filter((property: any) => property.category === category);

                // Extract unique amenities
                const allAmenities = new Set<string>();
                properties.forEach((property: any) => {
                    if (property.amenities && Array.isArray(property.amenities)) {
                        property.amenities.forEach((amenity: string) => allAmenities.add(amenity));
                    }
                });

                // Format amenities for display
                const formattedAmenities = Array.from(allAmenities).map(amenity => ({
                    id: amenity.toLowerCase().replace(/\s+/g, '_'),
                    label: amenity
                }));

                if (formattedAmenities.length > 0) {
                    setAmenitiesOptions(formattedAmenities);
                }

                // Find min and max prices
                const validPrices: number[] = [];
                properties.forEach((property: any) => {
                    if (property.propertyPrice !== undefined && property.propertyPrice !== null) {
                        const price = Number(property.propertyPrice);
                        if (!isNaN(price) && price > 0) {
                            validPrices.push(price);
                        }
                    }
                });

                if (validPrices.length > 0) {
                    const minPrice = Math.floor(Math.min(...validPrices));
                    const maxPrice = Math.ceil(Math.max(...validPrices));

                    setMinMaxPrices({ min: minPrice, max: maxPrice });
                    setSearchParams(prev => ({
                        ...prev,
                        priceRange: [minPrice, maxPrice]
                    }));
                }
            } catch (error) {
                console.error("Error fetching property data:", error);
            }
        };

        fetchPropertyData();
    }, [activeTab]);

    const residentialPropertyTypes = [
        "Apartment",
        "Penthouse",
        "Villa",
        "Land",
        "Townhouse",
        "Duplex",
    ];

    const propertyTypes = residentialPropertyTypes;
    const bedOptions = ["Any", "Studio", "1", "2", "3", "4", "5", "6+"];
    const bathOptions = ["Any", "1", "2", "3", "4", "5", "6+"];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePriceRangeChange = (values: number[]) => {
        setSearchParams((prev) => ({
            ...prev,
            priceRange: values as [number, number],
        }));
    };

    const handleAmenityToggle = (amenityId: string) => {
        setSearchParams((prev) => {
            const currentAmenities = [...prev.amenities];
            let newAmenities;
            if (currentAmenities.includes(amenityId)) {
                newAmenities = currentAmenities.filter(id => id !== amenityId);
            } else {
                newAmenities = [...currentAmenities, amenityId];
            }
            const newParams = { ...prev, amenities: newAmenities };
            updateURL(newParams);
            return newParams;
        });
    };

    const isCommercialContext = pathname.includes('/commercial');

    const getBasePath = (tabIndex: number) => {
        if (isCommercialContext) {
            return tabIndex === 0 ? '/commercial/sell' : '/commercial/rent';
        }
        return tabIndex === 0 ? '/buy' : '/rent';
    };

    const updateURL = (params: typeof searchParams) => {
        const searchQuery = new URLSearchParams();

        if (params.location) searchQuery.append('location', params.location);
        if (params.propertyType) searchQuery.append('propertyType', params.propertyType);
        if (params.beds && params.beds !== 'Any') searchQuery.append('beds', params.beds);
        if (params.baths && params.baths !== 'Any') searchQuery.append('baths', params.baths);

        if (params.priceRange[0] > minMaxPrices.min) {
            searchQuery.append('minPrice', params.priceRange[0].toString());
        }
        if (params.priceRange[1] < minMaxPrices.max) {
            searchQuery.append('maxPrice', params.priceRange[1].toString());
        }

        if (params.amenities.length > 0) {
            searchQuery.append('amenities', params.amenities.join(','));
        }

        const basePath = getBasePath(activeTab);
        router.push(`${basePath}?${searchQuery.toString()}`);
    };

    const handleSearch = () => {
        updateURL(searchParams);
    };

    const clearFilters = () => {
        setSearchParams(prev => ({
            ...prev,
            beds: "",
            baths: "",
            amenities: [],
        }));

        const currentURL = new URL(window.location.href);
        currentURL.searchParams.delete('beds');
        currentURL.searchParams.delete('baths');
        currentURL.searchParams.delete('amenities');
        router.replace(currentURL.pathname + currentURL.search);
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (searchParams.propertyType) count++;
        if (searchParams.beds) count++;
        if (searchParams.baths) count++;
        if (searchParams.priceRange[0] > minMaxPrices.min) count++;
        if (searchParams.priceRange[1] < minMaxPrices.max) count++;
        count += searchParams.amenities.length;
        return count;
    };

    const formatPrice = (price: number) => {
        return `$${Math.round(price).toLocaleString()}`;
    };

    return (
        <div className="relative bg-gray-50 flex justify-center w-full mx-auto">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 max-w-6xl rounded-xl p-5 w-full"
            >
                <div className="flex flex-col md:flex-row gap-3 items-center">
                    <div className="flex bg-white border border-[#e6e6e6] p-1 rounded-lg md:w-auto w-full md:self-auto self-stretch">
                        <button
                            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 0
                                ? "bg-red-600 text-white shadow-sm"
                                : "text-gray-700 hover:bg-gray-200"
                                }`}
                            onClick={() => {
                                setActiveTab(0);
                                router.push(getBasePath(0));
                            }}
                        >
                            Buy
                        </button>
                        <button
                            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 1
                                ? "bg-red-600 text-white shadow-sm"
                                : "text-gray-700 hover:bg-gray-200"
                                }`}
                            onClick={() => {
                                setActiveTab(1);
                                router.push(getBasePath(1));
                            }}
                        >
                            Rent
                        </button>
                    </div>

                    <div className="relative flex-1 min-w-[200px] w-full">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <FiMapPin className="text-red-500" />
                        </div>
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={searchParams.location}
                            onChange={(e) => {
                                handleInputChange(e);
                                // Debounce location search if needed, or update on blur/enter.
                                // For now, we keep it as manual search or add a debounce effect.
                                // Given request "realtime", we can update URL on change but it might be too frequent.
                                // Let's update URL on blur or enter for text input, or debounce properly.
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="relative flex-1 min-w-[200px] w-full">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <FiHome className="text-red-500" />
                        </div>
                        <select
                            name="propertyType"
                            value={searchParams.propertyType}
                            onChange={(e) => {
                                handleInputChange(e);
                                const newParams = { ...searchParams, propertyType: e.target.value };
                                updateURL(newParams);
                            }}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Property Type</option>
                            {propertyTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>

                    <div className="relative flex-1 min-w-[200px] w-full">
                        <DropdownMenu.DropdownMenu>
                            <DropdownMenu.DropdownMenuTrigger asChild>
                                <button className="w-full flex items-center justify-between pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all">
                                    <div className="flex items-center">
                                        <div className="w-5 absolute left-3 flex items-center justify-center">
                                            <Image src="/Assets/uae-dirham.png" width={20} height={20} alt="AED" />
                                        </div>
                                        <span className="text-gray-700 ml-1">
                                            {(searchParams.priceRange[0] > minMaxPrices.min || searchParams.priceRange[1] < minMaxPrices.max)
                                                ? `${formatPrice(searchParams.priceRange[0])} - ${formatPrice(searchParams.priceRange[1])}`
                                                : "Price (Any)"}
                                        </span>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                            </DropdownMenu.DropdownMenuTrigger>

                            <DropdownMenu.DropdownMenuContent className="w-72 p-4" sideOffset={5}>
                                <div className="flex justify-between items-center">
                                    <DropdownMenu.DropdownMenuLabel>Price Range</DropdownMenu.DropdownMenuLabel>
                                    {(searchParams.priceRange[0] > minMaxPrices.min || searchParams.priceRange[1] < minMaxPrices.max) && (
                                        <button
                                            onClick={() => {
                                                const newParams = { ...searchParams, priceRange: [minMaxPrices.min, minMaxPrices.max] as [number, number] };
                                                setSearchParams(newParams);
                                                updateURL(newParams);
                                            }}
                                            className="text-gray-500 hover:text-red-600 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <DropdownMenu.DropdownMenuSeparator />

                                <div className="mt-4 mb-8">
                                    <div className="flex justify-between text-xs text-gray-700 mb-2">
                                        <span>{formatPrice(searchParams.priceRange[0])}</span>
                                        <span>{formatPrice(searchParams.priceRange[1])}</span>
                                    </div>

                                    <Slider
                                        defaultValue={searchParams.priceRange}
                                        min={minMaxPrices.min}
                                        max={minMaxPrices.max}
                                        step={(minMaxPrices.max - minMaxPrices.min) / 100}
                                        color="red"
                                        onValueChange={(values) => {
                                            handlePriceRangeChange(values);
                                        }}
                                        onValueCommit={(values) => {
                                            // Update URL only when user stops sliding
                                            const newParams = { ...searchParams, priceRange: values as [number, number] };
                                            updateURL(newParams);
                                        }}
                                        className="mt-6"
                                    />
                                </div>
                            </DropdownMenu.DropdownMenuContent>
                        </DropdownMenu.DropdownMenu>
                    </div>

                    <div className="relative flex-1 min-w-[200px] w-full">
                        <DropdownMenu.DropdownMenu>
                            <DropdownMenu.DropdownMenuTrigger asChild>
                                <button className="w-full flex items-center justify-between pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all">
                                    <div className="flex items-center">
                                        <FiSliders className="absolute left-3 text-red-500" />
                                        <span className="text-gray-700">Filters</span>
                                    </div>
                                    {getActiveFilterCount() > 0 && (
                                        <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                                            {getActiveFilterCount()}
                                        </span>
                                    )}
                                </button>
                            </DropdownMenu.DropdownMenuTrigger>

                            <DropdownMenu.DropdownMenuContent className="w-72 p-4 max-h-[80vh] overflow-y-auto" sideOffset={5} align="end">
                                <div className="sticky top-0 bg-white pb-2 z-10">
                                    <div className="flex justify-between items-center mb-3">
                                        <button
                                            onClick={clearFilters}
                                            className="px-3 py-1.5 border border-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                    <DropdownMenu.DropdownMenuLabel>Bedrooms</DropdownMenu.DropdownMenuLabel>
                                    <DropdownMenu.DropdownMenuSeparator />
                                </div>

                                <div className="flex flex-wrap gap-2 my-2">
                                    {bedOptions.map((bed) => (
                                        <button
                                            key={bed}
                                            onClick={() => {
                                                const newValue = (searchParams.beds === bed || bed === 'Any') && searchParams.beds === bed ? '' : (bed === 'Any' ? '' : bed);
                                                handleInputChange({ target: { name: 'beds', value: newValue } } as any);
                                                const newParams = { ...searchParams, beds: newValue };
                                                updateURL(newParams);
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium ${(bed === 'Any' && !searchParams.beds) || searchParams.beds === bed
                                                ? "bg-red-100 text-red-600 border border-red-200"
                                                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                                                }`}
                                        >
                                            {bed}
                                        </button>
                                    ))}
                                </div>

                                <div className="sticky top-0 bg-white pt-3 pb-2 z-10">
                                    <DropdownMenu.DropdownMenuLabel>Bathrooms</DropdownMenu.DropdownMenuLabel>
                                    <DropdownMenu.DropdownMenuSeparator />
                                </div>

                                <div className="flex flex-wrap gap-2 my-2">
                                    {bathOptions.map((bath) => (
                                        <button
                                            key={bath}
                                            onClick={() => {
                                                const newValue = (searchParams.baths === bath || bath === 'Any') && searchParams.baths === bath ? '' : (bath === 'Any' ? '' : bath);
                                                handleInputChange({ target: { name: 'baths', value: newValue } } as any);
                                                const newParams = { ...searchParams, baths: newValue };
                                                updateURL(newParams);
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium ${(bath === 'Any' && !searchParams.baths) || searchParams.baths === bath
                                                ? "bg-red-100 text-red-600 border border-red-200"
                                                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                                                }`}
                                        >
                                            {bath}
                                        </button>
                                    ))}
                                </div>

                                {amenitiesOptions.length > 0 && (
                                    <>
                                        <div className="sticky top-0 bg-white pt-3 pb-2 z-10">
                                            <DropdownMenu.DropdownMenuLabel>Amenities</DropdownMenu.DropdownMenuLabel>
                                            <DropdownMenu.DropdownMenuSeparator />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 my-2">
                                            {amenitiesOptions.map((amenity) => (
                                                <button
                                                    key={amenity.id}
                                                    onClick={() => handleAmenityToggle(amenity.id)}
                                                    className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${searchParams.amenities.includes(amenity.id)
                                                        ? "bg-red-100 text-red-600 border border-red-200"
                                                        : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    <span>{amenity.label}</span>
                                                    {searchParams.amenities.includes(amenity.id) && (
                                                        <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </DropdownMenu.DropdownMenuContent>
                        </DropdownMenu.DropdownMenu>
                    </div>

                    {/* Mobile Search Button */}
                    <div className="md:hidden">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSearch}
                            className="flex-shrink-0 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center shadow-md w-full"
                        >
                            <FiSearch className="text-xl" />
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PropertySearchBar;
