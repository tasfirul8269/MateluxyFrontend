'use client';

import { Box, Text, Flex } from '@frooxi-labs/adaptive-ui';
import Image from 'next/image';

export interface OffPlanCardProps {
    id?: string | number;
    image: string;
    title: string;
    location: string;
    price: string;
    area: number;
    completion: string;
    developer: {
        name: string;
        logo?: string;
    };
    badges?: string[];
}

export const OffPlanCard = ({
    id,
    image,
    title,
    location,
    price,
    area,
    completion,
    developer,
    badges = []
}: OffPlanCardProps) => {
    return (
        <Box className="bg-white rounded-[20px] border border-[#E6E6E6] overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer w-[417px] h-[531px] flex flex-col pb-[15px]">
            {/* Image Container */}
            <Box className="relative overflow-hidden mx-auto mt-[15px] mb-[20px] rounded-[13px] w-[387px] h-[250px] shrink-0">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Gradient Overlay */}
                <Box className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Arrow Button */}
                <Box className="absolute top-3 right-3 w-[39px] h-[39px] rounded-full bg-[#C6EAFF]/40 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#FF0000] transition-colors">
                    <Image
                        src="/Arrow.svg"
                        alt="View Details"
                        width={13}
                        height={13}
                        className="group-hover:brightness-0 group-hover:invert transition-all"
                    />
                </Box>

                {/* Badges */}
                <Flex className="absolute bottom-[24px] left-3 gap-2">
                    {badges.includes('New Launch') && (
                        <Box className="px-2.5 py-1 bg-[#FF1111]/50 text-white text-[9px] font-semibold rounded-[30px] uppercase tracking-wider backdrop-blur-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            New Launch
                        </Box>
                    )}
                    {badges.includes('Appartment') && (
                        <Box className="px-2.5 py-1 bg-[#FF1111]/50 text-white text-[9px] font-semibold rounded-[30px] uppercase tracking-wider backdrop-blur-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Appartment
                        </Box>
                    )}
                </Flex>

                {/* Price */}
                <Text className="absolute bottom-[17px] right-3 text-white text-[24px] font-bold drop-shadow-md" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {price}
                </Text>
            </Box>

            {/* Content */}
            <Box className="px-5 flex-1 flex flex-col">
                {/* Title */}
                <Text className="text-[24px] font-medium text-black mb-[24px] line-clamp-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {title}
                </Text>

                {/* Location */}
                <Flex className="items-center gap-1.5 mb-4 text-[#888888] text-[16px]">
                    <Image src="/locationround.svg" alt="Location" width={16} height={16} />
                    <Text className="truncate font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>{location}</Text>
                </Flex>

                {/* Info Grid - Two Separate Boxes */}
                <Flex className="gap-[10px] mb-4 items-center justify-between">
                    <Box className="text-center bg-[#F3F3F3] rounded-[8px] p-3 w-[183.5px] h-[55px] flex flex-col justify-center">
                        <Text className="text-[15px] text-[#777777] mb-0.5 font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>Area (sq.ft)</Text>
                        <Text className="text-[16px] font-bold text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>{area}</Text>
                    </Box>
                    <Box className="text-center bg-[#F3F3F3] rounded-[8px] p-3 w-[183.5px] h-[55px] flex flex-col justify-center">
                        <Text className="text-[15px] text-[#777777] mb-0.5 font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>Completion</Text>
                        <Text className="text-[16px] font-bold text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>{completion}</Text>
                    </Box>
                </Flex>

                {/* Divider above footer */}
                <Box className="w-[380px] h-[1px] bg-[#F5F5F5] mx-auto mb-4 mt-auto" />

                {/* Footer */}
                <Flex className="items-center justify-between">
                    {/* WhatsApp Button */}
                    <button className="flex items-center justify-center gap-1.5 bg-[#E9F7F0] text-[#249F62] rounded-[10px] hover:bg-[#00C853] hover:text-white transition-colors w-[170px] h-[48px]">
                        <Image
                            src="/ic_whatsapp.svg"
                            alt="WhatsApp"
                            width={17}
                            height={17}
                            className="w-[17px] h-[17px]"
                            style={{ filter: 'brightness(0) saturate(100%) invert(58%) sepia(62%) saturate(505%) hue-rotate(94deg) brightness(93%) contrast(89%)' }}
                        />
                        <Text className="text-[15px] font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>WhatsApp</Text>
                    </button>

                    {/* Developer Info */}
                    <Box className="text-right mr-[18px]">
                        <Text className="text-[13px] text-[#999999] mb-0.5 font-normal" style={{ fontFamily: 'Poppins, sans-serif' }}>Developed by</Text>
                        {developer.logo ? (
                            <Box className="relative h-[20px] w-[80px]">
                                <Image
                                    src={developer.logo}
                                    alt={developer.name}
                                    fill
                                    className="object-contain object-right opacity-80"
                                />
                            </Box>
                        ) : (
                            <Text className="text-[12px] font-bold text-[#1A1A1A] uppercase tracking-wide">
                                {developer.name}
                            </Text>
                        )}
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
};
