'use client';

import { Box, Flex, Text } from '@frooxi-labs/adaptive-ui';
import Image from 'next/image';

interface MemberCardProps {
    name: string;
    role: string;
    department?: string;
    image: string;
    languages: string[];
}

export const MemberCard = ({ name, role, department, image, languages }: MemberCardProps) => {
    return (
        <Box className="group relative w-full h-[440px] bg-white rounded-[40px] overflow-hidden transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.08)]">
            {/* Background Image Area Full Box */}
            <Box className="absolute inset-0 w-full h-full overflow-hidden">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient Overlay for Text Readability - Matching the soft fade */}
                <Box
                    className="absolute inset-x-0 bottom-0 h-3/5 z-10 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 25%, rgba(255,255,255,0.7) 45%, rgba(255,255,255,0) 100%)'
                    }}
                />
            </Box>

            {/* Content Area - Bottom Overlay */}
            <Box className="absolute bottom-0 left-0 right-0 p-6 pt-12 z-20">
                <Text
                    className="text-[24px] font-[600] text-[#1D1D1D] mb-1.5 leading-tight tracking-tight"
                    style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                    {name}
                </Text>

                <Flex className="gap-2.5 items-center mb-5 overflow-hidden w-full">
                    <Text
                        className="text-[13px] text-[#4F4F4F] font-medium tracking-wide whitespace-nowrap"
                        style={{ fontFamily: 'var(--font-montserrat)' }}
                    >
                        {role}
                    </Text>
                    {department && (
                        <Text
                            className="text-[13px] text-[#A3A3A3] font-medium tracking-wide whitespace-nowrap truncate"
                            style={{ fontFamily: 'var(--font-montserrat)' }}
                        >
                            {department}
                        </Text>
                    )}
                </Flex>

                <Flex className="justify-between items-center mt-2">
                    {/* Languages Pills */}
                    <Flex className="gap-2.5 flex-wrap">
                        {languages.slice(0, 2).map((lang, idx) => (
                            <Box
                                key={idx}
                                className="bg-[#F3F3F3] px-4 py-1.5 rounded-full text-[11px] font-semibold text-[#5A5A5A]"
                                style={{ fontFamily: 'var(--font-montserrat)' }}
                            >
                                {lang === 'Chinese' ? 'Chineese' : lang}
                            </Box>
                        ))}
                    </Flex>

                    {/* Arrow Button */}
                    <Box className="w-[38px] h-[38px] bg-[#F8F8F8] rounded-full flex items-center justify-center text-gray-800 transition-colors duration-300 cursor-pointer flex-shrink-0 group-hover:bg-black group-hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
};
