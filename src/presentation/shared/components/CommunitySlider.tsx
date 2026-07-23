'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/navigation';
import axios from 'axios';

interface CommunitySliderProps {
    onCommunityClick: (name: string) => void;
}

const CommunitySlider = ({ onCommunityClick }: CommunitySliderProps) => {
    const swiperRef = useRef<any>(null);
    const [communities, setCommunities] = useState<{ name: string }[]>([
        { name: 'Downtown Dubai' },
        { name: 'Business Bay' },
        { name: 'Dubai Marina' },
        { name: 'Dubai Creek Harbour' },
        { name: 'Dubai Hills Estate' },
        { name: 'Emirates Living' },
        { name: 'Jumeirah Village Circle' },
        { name: 'Jumeirah Village Triangle' }
    ]);

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                // Try to fetch top locations from CRM
                const res = await axios.get('http://127.0.0.1:6001/properties/top-locations?viewBy=listing');
                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                    setCommunities(res.data.map((loc: any) => ({ name: loc.name })));
                }
            } catch (error) {
                console.error("Failed to fetch top locations, using defaults", error);
            }
        };

        fetchCommunities();
    }, []);

    return (
        <div className="w-full py-6 relative">
            <div className="max-w-7xl mx-auto relative px-4 md:px-10">
                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    slidesPerView={1}
                    spaceBetween={16}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 }
                    }}
                    modules={[Navigation]}
                    className="w-full"
                >
                    {communities.map((community, index) => (
                        <SwiperSlide key={index}>
                            <div
                                onClick={() => onCommunityClick(community.name)}
                                className="p-2 cursor-pointer h-full"
                            >
                                <div className="border border-gray-200 hover:border-red-500 rounded-[10px] px-0 py-3 h-full flex items-center justify-center transition-colors duration-200">
                                    <span className="text-sm text-gray-700 hover:text-red-600 transition-colors duration-200">
                                        {community.name}
                                    </span>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <button
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-red-500 p-1 transition-colors duration-200"
                    aria-label="Previous slide"
                >
                    <FiChevronLeft className="h-5 w-5" />
                </button>
                <button
                    onClick={() => swiperRef.current?.slideNext()}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-red-500 p-1 transition-colors duration-200"
                    aria-label="Next slide"
                >
                    <FiChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default CommunitySlider;
