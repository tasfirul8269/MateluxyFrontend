import { Box, Flex, Text } from '@frooxi-labs/adaptive-ui';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { api, Developer } from '../../../services/api';

export const DeveloperShowcase = () => {
    const [developers, setDevelopers] = useState<Developer[]>([]);

    useEffect(() => {
        const fetchDevelopers = async () => {
            try {
                const data = await api.getDevelopers();
                setDevelopers(data);
            } catch (error) {
                console.error('Error fetching developers:', error);
            }
        };
        fetchDevelopers();
    }, []);

    return (
        <Box className="w-full py-16 bg-white">
            <Box className="px-4 md:px-8 xl:pl-[94px]">
                {/* Header Section */}
                <Flex className="justify-between items-start mb-12 flex-col md:flex-row gap-4">
                    <Box>
                        <Text
                            className="text-[45px] font-semibold text-black mb-2 leading-tight"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                            Meet the Masters Behind the Projects
                        </Text>
                        <Text
                            className="text-[18px] text-[#6B6B6B] font-normal mb-4"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                            Get to know Dubai's leading developers and what sets their visions apart.
                        </Text>
                        {/* Red underline decoration */}
                        <Box className="w-[63px] h-[4px] bg-[#FF0000]" />
                    </Box>

                    {/* All Developers Button */}
                    <button className="px-8 py-3 bg-[#F5F5F5] text-[#333333] rounded-[10px] text-[16px] font-medium hover:bg-[#E5E5E5] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        All Developers
                    </button>
                </Flex>

                {/* Developer Logos */}
                <Flex className="gap-12 items-center justify-start flex-wrap">
                    {developers.length > 0 ? (
                        developers.map((developer) => (
                            developer.logoUrl ? (
                                <Box
                                    key={developer.id}
                                    className="relative h-[60px] w-[120px] grayscale hover:grayscale-0 transition-all cursor-pointer opacity-70 hover:opacity-100"
                                >
                                    <Image
                                        src={developer.logoUrl}
                                        alt={developer.name}
                                        fill
                                        className="object-contain"
                                    />
                                </Box>
                            ) : null
                        ))
                    ) : (
                        <Text>Loading developers...</Text>
                    )}
                </Flex>

                {/* Pagination Dots */}
                <Flex className="gap-3 justify-center mt-8">
                    <Box className="w-[78px] h-[4px] bg-[#FF0000] rounded-full" />
                    <Box className="w-[40px] h-[4px] bg-[#D9D9D9] rounded-full" />
                </Flex>
            </Box>
        </Box>
    );
};
