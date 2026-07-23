import { Box, Text, Flex } from '@frooxi-labs/adaptive-ui';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { api, TopLocation } from '../../../services/api';

export const OffPlanIntro = () => {
    const [locations, setLocations] = useState<TopLocation[]>([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const data = await api.getTopLocations(4);
                setLocations(data);
            } catch (error) {
                console.error('Error loading top locations:', error);
            }
        };

        fetchLocations();
    }, []);

    return (
        <Box className="w-full bg-white py-16" style={{ paddingLeft: '52px', paddingRight: '52px' }}>
            <Flex className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                {/* Left Side - Text Content */}
                <Box className="max-w-xl">
                    <Text className="text-[45px] font-medium text-[#414141] leading-tight mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Start your <span className="text-[#FF0000] font-semibold">Off Plan</span> journey with Mateluxy.{' '}
                        <span className="text-[#b1b1b1] font-normal">
                            Let us help you find the perfect one.
                        </span>
                    </Text>
                </Box>

                {/* Right Side - Description */}
                <Box className="max-w-md">
                    <Text className="text-[#B1B1B1] text-[21px] font-medium leading-relaxed text-right" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        From stunning waterfront developments and iconic luxury towers to vibrant family-friendly communities - Dubai's off-plan market has it all.
                    </Text>
                </Box>
            </Flex>

            {/* Location Cards */}
            <Flex className="max-w-7xl mx-auto mt-12 flex flex-wrap gap-[32px] justify-center">
                {locations.length > 0 ? (
                    locations.map((location, index) => (
                        <Flex
                            key={index}
                            className="group relative bg-white border-[2px] border-[#E9E9E9] rounded-[10px] p-2 w-[270px] h-[98px] items-center gap-3 cursor-pointer hover:shadow-lg transition-all hover:border-[#FF0000]/20 justify-start"
                        >
                            {/* Circular Image */}
                            <Box className="relative w-[78px] h-[78px] rounded-full overflow-hidden shrink-0">
                                {/* Using placeholder as API doesn't provide image for top locations endpoint currently, or check if it does */}
                                <Image
                                    src={'/Image/property.png'}
                                    alt={location.name}
                                    fill
                                    className="object-cover"
                                />
                            </Box>

                            {/* Text Content */}
                            <Box className="flex-1 min-w-0 pr-8">
                                <Text className="text-[19px] font-semibold text-black mb-1 whitespace-nowrap truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    {location.name}
                                </Text>
                                <Text className="text-[12px] text-[#919191] font-medium flex items-center gap-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    <Image
                                        src="/building.svg"
                                        alt="Properties"
                                        width={10}
                                        height={10}
                                        className="opacity-60"
                                    />
                                    {location.count} Properties
                                </Text>
                            </Box>

                            {/* Arrow Button */}
                            <Box className="absolute bottom-3 right-3 w-[19px] h-[19px] rounded-full bg-[#F5F5F5] flex items-center justify-center group-hover:bg-[#FF0000] transition-colors">
                                <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#000000"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="group-hover:stroke-white transition-colors"
                                >
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </Box>
                        </Flex>
                    ))
                ) : (
                    <Text>Loading popular locations...</Text>
                )}
            </Flex>
        </Box>
    );
};
