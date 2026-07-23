'use client';

import { Box, Text, Flex } from '@frooxi-labs/adaptive-ui';
import Image from 'next/image';
import { Phone } from 'lucide-react';

export interface PropertyCardProps {
    image: string;
    title: string;
    address: string;
    beds: number;
    baths: number;
    sqft: number;
    price: string;
    type: string;
    badge?: string;
    agent: {
        name: string;
        languages: string;
        avatar: string;
    };
    developer?: {
        name: string;
        logo?: string;
    };
}

export const PropertyCard = ({
    image,
    title,
    address,
    beds,
    baths,
    sqft,
    price,
    type,
    badge,
    agent,
    developer
}: PropertyCardProps) => (
    <Box className="bg-white rounded-[20px] border border-[#E6E6E6] transition-all duration-300 group flex flex-col w-full overflow-hidden cursor-pointer hover:shadow-lg p-[15px]">
        {/* Image Section */}
        <Box className="relative w-full aspect-[1.548/1] rounded-[13px] overflow-hidden bg-gray-100">
            <Image
                src={image}
                alt={title || 'Property Image'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Dark Gradient Overlay */}
            <Box className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent pointer-events-none" />

            {/* Top Badges */}
            <Flex className="absolute top-3 left-3 gap-2">
                {badge && (
                    <Box className="px-[10px] h-[22px] py-[4px] bg-[#FF111180] text-white text-[11px] font-semibold rounded-full tracking-wide backdrop-blur-sm flex items-center">
                        {badge}
                    </Box>
                )}
            </Flex>

            {/* Bottom Overlay Info */}
            <Flex className="absolute bottom-3 left-3 right-3 justify-between items-end">
                {/* Property Type Badge */}
                <Box className="px-2.5 py-1 bg-[#C6EAFF]/40 border-[0.5px] border-[#25AFFF]/20 text-white text-[11px] font-medium rounded-md backdrop-blur-sm">
                    {type}
                </Box>

                {/* Price */}
                <Text className="text-white font-semibold text-[18px] drop-shadow-lg tracking-tight font-[family-name:var(--font-poppins)]">
                    {price}
                </Text>
            </Flex>
        </Box>

        {/* Content Section */}
        <Box className="pt-4 flex-1 flex flex-col">
            {/* Title */}
            <h3 className="text-[24px] font-medium text-[#1A1A1A] mb-2 line-clamp-1 tracking-tight font-[family-name:var(--font-montserrat)]">
                {title}
            </h3>

            {/* Location */}
            <Flex className="flex font-medium items-center gap-1.5 text-[#000000]/40 text-[16px] mb-4 font-[family-name:var(--font-montserrat)]">
                <Image
                    src="/Assets/location_icon.svg"
                    alt="Location"
                    width={16}
                    height={16}
                    className="shrink-0"
                />
                <Text className="truncate line-clamp-1">{address}</Text>
            </Flex>

            {/* Specs */}
            <Flex className="flex items-center gap-4 mb-5 font-[family-name:var(--font-montserrat)]">
                <Flex className="flex items-center gap-1.5 text-gray-400">
                    <Image
                        src="/ic_bed.svg"
                        alt="Beds"
                        width={18}
                        height={15}
                    />
                    <Text className="text-[16px] font-medium">
                        {beds.toString().padStart(2, '0')}
                    </Text>
                </Flex>
                <Box className="w-[1px] h-3 bg-gray-200" />
                <Flex className="flex items-center gap-1.5 text-gray-400">
                    <Image
                        src="/ic_bath.svg"
                        alt="Baths"
                        width={23.92}
                        height={12.5}
                    />
                    <Text className="text-[16px] font-medium">
                        {baths.toString().padStart(2, '0')}
                    </Text>
                </Flex>
                <Box className="w-[1px] h-3 bg-gray-200" />
                <Flex className="flex items-center gap-1.5 text-gray-400">
                    <Image
                        src="/ic_area.svg"
                        alt="Area"
                        width={16}
                        height={16}
                    />
                    <Text className="text-[16px] font-medium">
                        {sqft} sq.ft
                    </Text>
                </Flex>
            </Flex>

            {/* Agent/Developer Info */}
            <Flex className="flex items-center justify-between mt-auto">
                {developer ? (
                    <Box>
                        <Text className="text-gray-400 text-[13px] font-normal mb-1">Developed by</Text>
                        {developer.logo ? (
                            <Box className="w-[100px] h-[35px] relative opacity-90">
                                <Image
                                    src={developer.logo}
                                    alt={developer.name || 'Developer Logo'}
                                    fill
                                    className="object-contain object-left"
                                />
                            </Box>
                        ) : (
                            <Text className="font-semibold text-[13px] text-[#1A1A1A]">{developer.name}</Text>
                        )}
                    </Box>
                ) : (
                    <Flex className="flex items-center gap-2.5">
                        <Box className="relative h-[50px] w-[50px] rounded-full overflow-hidden border border-gray-100">
                            <Image
                                src={agent.avatar}
                                alt={agent.name || 'Agent Avatar'}
                                fill
                                className="object-cover"
                            />
                        </Box>
                        <Flex className="flex flex-col">
                            <Text className="text-[16px] font-normal text-[#000000] leading-tight">
                                {agent.name}
                            </Text>
                            <Text className="text-[13px] text-[#000000]/40">
                                {agent.languages}
                            </Text>
                        </Flex>
                    </Flex>
                )}

                <Flex className="flex gap-2">
                    <button className="h-8 w-8 flex items-center justify-center rounded-full bg-[#E0F7FA] text-[#00C853] hover:bg-[#00C853] hover:text-white transition-all duration-300">
                        {/* WhatsApp Icon */}
                        <Image
                            src="/ic_whatsapp.svg"
                            alt="WhatsApp"
                            width={18}
                            height={18}
                        />
                    </button>
                    <button className="h-8 w-8 flex items-center justify-center rounded-full bg-[#F7F9FC] text-[#8F9BB3] hover:bg-[#EDF1F7] hover:text-[#1A1A1A] transition-all duration-300">
                        <Phone className="h-3.5 w-3.5" />
                    </button>
                </Flex>
            </Flex>
        </Box>
    </Box>
);
