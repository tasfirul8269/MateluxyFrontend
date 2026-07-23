'use client';

import { Box, Text, Flex } from '@frooxi-labs/adaptive-ui';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, Agent } from '../../../services/api';

export const GuidesSection = () => {
    const [agents, setAgents] = useState<Agent[]>([]);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const data = await api.getAgents();
                // Take first 6 agents
                setAgents(data.slice(0, 6));
            } catch (error) {
                console.error('Failed to fetch agents for guides section:', error);
            }
        };

        fetchAgents();
    }, []);

    // Fallback if no agents loaded yet
    const displayAgents = agents.length > 0 ? agents : Array(6).fill(null);

    return (
        <Box as="section" className="w-full relative py-20 overflow-hidden">
            {/* Background Image */}
            <Box className="absolute inset-0 w-full h-full z-0">
                <Image
                    src="/Image/guidepagebg.png"
                    alt="Background"
                    fill
                    className="object-fill object-center"
                    priority
                />
            </Box>

            <Box className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">
                {/* Header Content */}
                <Flex className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 md:gap-0">
                    <Box>
                        <Text as="h2" className="text-[45px] font-medium text-black leading-tight font-montserrat">
                            Guides that help you <span className="text-[#FF0000] font-semibold">grow</span>
                        </Text>
                    </Box>
                    <Box className="max-w-md text-right w-full md:w-auto">
                        <Text className="text-[#AAAAAA] text-[18px] font-semibold font-montserrat leading-relaxed text-right">
                            Discover properties with your desired features
                            <br className="hidden md:block" />
                            and amenities to find your perfect home
                        </Text>
                    </Box>
                </Flex>

                {/* Team Cards - Overlapping Layout */}
                <Box className="relative h-[400px] w-full flex justify-center items-center mb-16">
                    <Flex className="items-center justify-center -space-x-[50px] py-10 px-4 w-full">
                        {displayAgents.map((agent, index) => {
                            // Random rotations for horizontal layout
                            const rotations = [
                                'rotate-[-3deg]',
                                'rotate-[3deg]',
                                'rotate-[-4deg]',
                                'rotate-[4deg]',
                                'rotate-[-2deg]',
                                'rotate-[2deg]'
                            ];
                            const rotationClass = rotations[index % rotations.length];

                            return (
                                <Box
                                    key={agent?.id || index}
                                    className={`relative w-[192px] h-[243px] rounded-[24px] overflow-hidden shadow-2xl flex-shrink-0 ${rotationClass} transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-0 hover:z-[100] cursor-pointer`}
                                    style={{
                                        zIndex: index, // Stack natural usage
                                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)'
                                    }}
                                >
                                    <Image
                                        src={agent?.photoUrl || `/Image/profile_${(index % 5) + 1}.png`}
                                        alt={agent?.name || `Team Member ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Name Overlay - REMOVED */}
                                </Box>
                            );
                        })}
                    </Flex>
                </Box>

                {/* CTA Button */}
                <Flex className="justify-center">
                    <Link href="/team">
                        <button className="group relative flex items-center justify-start pl-[20px] bg-[#FF0000] text-white w-[254px] h-[59px] rounded-full text-[18px] font-semibold font-montserrat transition-all hover:bg-[#D60000] hover:shadow-lg cursor-pointer">
                            Choose Your Guide
                            <Box className="absolute right-[10px] top-1/2 -translate-y-1/2 bg-white rounded-full w-[39px] h-[39px] flex items-center justify-center">
                                <Image
                                    src="/Arrow.svg"
                                    alt=""
                                    width={12}
                                    height={12}
                                    className="w-[12px] h-[12px]"
                                    style={{ filter: 'brightness(0) saturate(100%) invert(19%) sepia(88%) saturate(7495%) hue-rotate(356deg) brightness(96%) contrast(116%)' }}
                                />
                            </Box>
                        </button>
                    </Link>
                </Flex>
            </Box>
        </Box>
    );
};
