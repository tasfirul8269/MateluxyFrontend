'use client';

import { Box, Flex, Text } from '@frooxi-labs/adaptive-ui';
import Image from 'next/image';
import { PropertyCard } from '../../shared/components/PropertyCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Phone } from 'lucide-react';

interface MapPropertyOverlayProps {
    properties: any[];
}

export const MapPropertyOverlay = ({ properties }: MapPropertyOverlayProps) => {
    if (!properties || properties.length === 0) return null;

    const featured = properties[0];

    const agentPhoto = featured.agent?.photo || '';
    const agentName = featured.agent?.name || 'Mateluxy Team';
    const agentLanguages = featured.agent?.languages || 'English';

    // Strip HTML tags from description
    const cleanDescription = (html: string) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '').trim();
    };

    const description = cleanDescription(
        featured.description || featured.propertyDescription || featured.propertyTitle || ''
    );

    return (
        <Box
            className="w-[580px] bg-white rounded-[24px] shadow-2xl p-7 flex flex-col gap-6 max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-hide"
            style={{
                boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.08)'
            }}
        >
            {/* Featured Property — First property, always static */}
            <Flex className="w-full gap-5">
                {/* Left: Large Property Image */}
                <Box className="relative w-[240px] h-[340px] rounded-[18px] overflow-hidden shrink-0 group">
                    <Image
                        src={featured.propertyFeaturedImage || '/placeholder.jpg'}
                        alt={featured.title || 'Property'}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* GP Badge */}
                    <Box className="absolute top-3 left-3 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center z-10 shadow-sm">
                        <Text className="text-black font-bold text-[11px] tracking-tighter">GP</Text>
                    </Box>
                </Box>

                {/* Right: Details */}
                <Box className="flex-1 flex flex-col pt-1">
                    {/* Title */}
                    <Text className="text-[22px] font-bold text-[#1A1A1A] mb-2 leading-[1.3] line-clamp-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {featured.title || featured.propertyTitle || 'Property'}
                    </Text>

                    {/* Location */}
                    <Flex className="items-center gap-1.5 mb-5">
                        <Image src="/Assets/location_icon.svg" alt="Location" width={14} height={14} className="opacity-40" />
                        <Text className="text-[12px] text-[#888888] font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {featured.propertyAddress || featured.propertyState || 'Dubai'}
                        </Text>
                    </Flex>

                    {/* Stats Row */}
                    <Flex className="items-center gap-0 mb-5 bg-[#F8F8F8] rounded-[10px] py-3 w-full justify-evenly border border-gray-50">
                        <Flex className="items-center gap-2">
                            <Image src="/ic_bed.svg" alt="Bed" width={16} height={16} className="opacity-50" />
                            <Text className="text-[14px] font-bold text-[#1A1A1A]">{featured.propertyBedrooms || '0'}</Text>
                        </Flex>
                        <Box className="w-[1px] h-3 bg-gray-200" />
                        <Flex className="items-center gap-2">
                            <Image src="/ic_bath.svg" alt="Bath" width={16} height={16} className="opacity-50" />
                            <Text className="text-[14px] font-bold text-[#1A1A1A]">{featured.propertyBathrooms || '0'}</Text>
                        </Flex>
                        <Box className="w-[1px] h-3 bg-gray-200" />
                        <Flex className="items-center gap-2">
                            <Image src="/ic_area.svg" alt="Area" width={16} height={16} className="opacity-50" />
                            <Text className="text-[14px] font-bold text-[#1A1A1A]">{featured.propertySize || '0'} sq.ft</Text>
                        </Flex>
                    </Flex>

                    {/* Description */}
                    {description && (
                        <>
                            <Text className="text-[12px] text-[#666666] leading-relaxed mb-1 line-clamp-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                {description}
                            </Text>
                            <button className="text-[12px] text-[#25AFFF] font-semibold text-left mb-5 hover:underline">
                                see more
                            </button>
                        </>
                    )}

                    {/* Agent & Price Row */}
                    <Flex className="items-center justify-between mb-5">
                        <Flex className="items-center gap-2.5">
                            <Box className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-100 bg-gray-100 shrink-0">
                                {agentPhoto ? (
                                    <Image
                                        src={agentPhoto}
                                        alt={agentName}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <Flex className="w-full h-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                                        <Text className="text-[14px] font-bold text-gray-500">{agentName.charAt(0)}</Text>
                                    </Flex>
                                )}
                            </Box>
                            <Box>
                                <Text className="text-[13px] font-bold text-[#1A1A1A] leading-none mb-1">
                                    {agentName}
                                </Text>
                                <Text className="text-[10px] text-[#999999] leading-none font-medium">
                                    Speaks {agentLanguages}
                                </Text>
                            </Box>
                        </Flex>

                        <Text className="text-[18px] font-bold text-[#1A1A1A]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {Number(featured.propertyPrice).toLocaleString()} AED
                        </Text>
                    </Flex>

                    {/* Action Buttons */}
                    <Flex className="gap-3">
                        <button className="flex-1 h-[42px] bg-[#E9F7F0] text-[#00C853] rounded-[10px] flex items-center justify-center gap-2 hover:bg-[#00C853] hover:text-white transition-all font-semibold text-[14px] border border-[#00C853]/20">
                            <Image
                                src="/ic_whatsapp.svg"
                                alt="WhatsApp"
                                width={16}
                                height={16}
                                className="brightness-0 saturate-100 invert-[58%] sepia-[62%] saturate-[505%] hue-rotate-[94deg] brightness-[93%] contrast-[89%]"
                            />
                            WhatsApp
                        </button>
                        <button className="flex-1 h-[42px] bg-[#F5F5F5] text-[#1A1A1A] rounded-[10px] flex items-center justify-center gap-2 hover:bg-gray-200 transition-all font-semibold text-[14px] border border-gray-200">
                            <Phone size={15} className="text-[#666666]" />
                            Call
                        </button>
                    </Flex>
                </Box>
            </Flex>

            {/* Property Cards Carousel — Independent cards, no selection */}
            <Box className="w-full">
                <Flex className="justify-between items-center mb-3">
                    <Flex className="gap-2">
                        <button className="map-swiper-prev w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                            <span className="text-gray-600">←</span>
                        </button>
                        <button className="map-swiper-next w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                            <span className="text-gray-600">→</span>
                        </button>
                    </Flex>
                </Flex>

                <Swiper
                    modules={[Navigation]}
                    spaceBetween={12}
                    slidesPerView={2.2}
                    navigation={{
                        prevEl: '.map-swiper-prev',
                        nextEl: '.map-swiper-next'
                    }}
                    className="w-full"
                >
                    {properties.map((property, index) => (
                        <SwiperSlide key={index}>
                            <PropertyCard
                                image={property.propertyFeaturedImage || '/placeholder.jpg'}
                                title={property.title}
                                address={property.propertyAddress}
                                beds={property.propertyBedrooms || 0}
                                baths={property.propertyBathrooms || 0}
                                sqft={property.propertySize || 0}
                                price={`${Number(property.propertyPrice).toLocaleString()} AED`}
                                type={property.category === 'off_plan' ? 'Off Plan' : 'Ready'}
                                badge={property.category === 'off_plan' ? 'New Launch' : undefined}
                                agent={{
                                    name: property.agent?.name || 'Mateluxy Team',
                                    languages: property.agent?.languages || 'English',
                                    avatar: property.agent?.photo || ''
                                }}
                                developer={property.developer ? {
                                    name: property.developer.name,
                                    logo: property.developer.logo
                                } : undefined}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
        </Box>
    );
};
