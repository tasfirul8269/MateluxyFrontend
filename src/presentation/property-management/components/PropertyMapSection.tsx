'use client';

import { Text } from '@frooxi-labs/adaptive-ui';
import { LocationsSection } from '../../home/components/LocationsSection';
import Image from 'next/image';

const STATIC_LOCATIONS = [
    { name: "Burj Khalifa", img: "/Image/property.png", count: "128" },
    { name: "Dubai Mall", img: "/Image/property.png", count: "153" },
    { name: "Dubai Marina", img: "/Image/property.png", count: "78" },
    { name: "Jabel Ali", img: "/Image/property.png", count: "34" },
    { name: "Business Bay", img: "/Image/property.png", count: "315" },
    { name: "Dubai Creek", img: "/Image/property.png", count: "145" },
];

const PillCard = ({ img, title, count }: { img: string, title: string, count: string }) => (
    <div className="flex items-center gap-2.5 bg-white rounded-full p-2 pr-6 shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-gray-50 flex-shrink-0 cursor-pointer">
        <div className="w-[34px] h-[34px] rounded-full overflow-hidden relative flex-shrink-0 bg-gray-100">
            <Image src={img} fill style={{ objectFit: 'cover' }} alt={title} />
        </div>
        <div className="flex flex-col">
            <span className="text-[13px] font-bold text-black leading-tight tracking-tight">{title}</span>
            <span className="text-[10px] text-gray-400 font-medium mt-[1px]">{count} properties</span>
        </div>
    </div>
);

export const PropertyMapSection = () => {
    return (
        <div className="flex flex-col w-full bg-white relative">
            <LocationsSection 
                customTitle={
                    <Text as="h2" className="text-[32px] md:text-[40px] font-medium text-black leading-tight max-w-2xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Trusted by Landlords Across Dubai's Top Locations
                    </Text>
                }
                hideTabs={true}
                hideCards={true}
                mapOverlay={
                    <div 
                        className="absolute bottom-6 left-[390px] right-0 z-10 flex flex-col gap-4 pointer-events-none"
                        style={{
                            maskImage: 'linear-gradient(to right, transparent, black 15%)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%)'
                        }}
                    >
                        <style>{`
                            @keyframes pill-scroll {
                                0% { transform: translateX(0); }
                                100% { transform: translateX(-50%); }
                            }
                            .animate-pill-scroll {
                                animation: pill-scroll 45s linear infinite;
                            }
                            .animate-pill-scroll-slow {
                                animation: pill-scroll 55s linear infinite;
                            }
                        `}</style>
                        
                        {/* Top Row */}
                        <div className="flex w-max animate-pill-scroll gap-4 px-4 pointer-events-auto hover:[animation-play-state:paused]">
                            {[...STATIC_LOCATIONS, ...STATIC_LOCATIONS, ...STATIC_LOCATIONS].map((loc, i) => (
                                <PillCard key={`top-${i}`} img={loc.img} title={loc.name} count={loc.count} />
                            ))}
                        </div>

                        {/* Bottom Row (Offset) */}
                        <div className="flex w-max animate-pill-scroll-slow gap-4 px-4 ml-12 pointer-events-auto hover:[animation-play-state:paused]">
                            {[...STATIC_LOCATIONS, ...STATIC_LOCATIONS, ...STATIC_LOCATIONS].reverse().map((loc, i) => (
                                <PillCard key={`bottom-${i}`} img={loc.img} title={loc.name} count={loc.count} />
                            ))}
                        </div>
                    </div>
                }
            />
        </div>
    );
};
