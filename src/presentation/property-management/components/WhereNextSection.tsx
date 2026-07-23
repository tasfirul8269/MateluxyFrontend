'use client';

import { Box, Text } from '@frooxi-labs/adaptive-ui';

interface NavCardProps {
    title: string;
    description: string;
    linkText: string;
}

const NavCard = ({ title, description, linkText }: NavCardProps) => (
    <div className="bg-white rounded-[16px] px-6 py-12 flex flex-col items-center justify-center text-center border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer group">
        <h3 className="text-[22px] font-medium text-black leading-snug mb-3 px-4">
            {title}
        </h3>
        <p className="text-[#7A7A7A] text-[13px] leading-[1.6] font-normal max-w-[240px] mb-8">
            {description}
        </p>

        <button className="inline-flex items-center gap-3 px-6 py-[10px] rounded-full border border-gray-200 text-[13px] font-normal text-[#7A7A7A] group-hover:bg-gray-50 transition-colors">
            {linkText}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
        </button>
    </div>
);

export const WhereNextSection = () => {
    return (
        <Box as="section" className="w-full bg-white pb-24 pt-10 px-4 md:px-8 lg:px-16">
            <Box className="max-w-[1400px] mx-auto space-y-10">

                <Text as="h2" className="text-[36px] font-medium text-black">
                    Where Next with Mateluxy?
                </Text>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <NavCard
                        title="Need expert advice?"
                        description="Connect with our local specialists for personalized property guidance."
                        linkText="Speak to a Consultant"
                    />
                    <NavCard
                        title="New to renting in Dubai?"
                        description="Understand the full process with our step-by-step guide for tenants."
                        linkText="Tenant's Guide"
                    />
                    <NavCard
                        title="Looking to lease your property?"
                        description="Discover how we help landlords secure high-quality, long-term tenants."
                        linkText="Landlord's Handbook"
                    />
                    <NavCard
                        title="Explore the Mateluxy experience"
                        description="Learn what sets us apart in Dubai's luxury real estate market."
                        linkText="Why Mateluxy"
                    />
                </div>

            </Box>
        </Box>
    );
};
