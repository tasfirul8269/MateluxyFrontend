'use client';

import { Box, Text, Flex, Stack } from '@frooxi-labs/adaptive-ui';
import Image from 'next/image';

export const PropertyManagementDetails = () => {
    return (
        <Box as="section" className="w-full bg-[#F8F9FA] relative overflow-hidden py-24 px-4 md:px-8 lg:px-16">
            {/* Background Texture - Reusing the texture from assets if available, or a subtle pattern */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <Image
                    src="/Assets/Texture.png"
                    alt="Background Texture"
                    fill
                    className="object-cover"
                />
            </div>

            <Box className="max-w-7xl mx-auto relative z-10 space-y-24">

                {/* Row 1: Image Left, Text Right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">
                    {/* Image Column */}
                    <div className="relative h-[300px] md:h-[400px] lg:h-[450px] w-full rounded-[16px] overflow-hidden shadow-md">
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                            [Team/Model Construction Image Placeholder]
                        </div>
                        {/* UNCOMMENT WHEN ASSET IS AVAILABLE
                        <Image
                            src="/Assets/TeamImage.png" 
                            alt="Choosing The Right Property Management Partner"
                            fill
                            className="object-cover"
                        />
                        */}
                    </div>

                    {/* Content Column */}
                    <div className="flex flex-col gap-6">
                        <Text as="h2" className="text-[32px] md:text-[36px] font-medium text-black leading-tight">
                            Choosing The Right Property<br className="hidden lg:block" /> Management Partner
                        </Text>

                        <div className="space-y-6 text-[#4A4A4A] text-[15px] leading-[1.8] font-normal text-left">
                            <p>
                                Entrusting Your Rental Property To The Right Agency Is A Big Decision. At Mateluxy Real Estate, We Combine Professionalism, RERA Certification, And A Proven Track Record Of Five-Star Client Satisfaction To Give You Absolute Peace Of Mind.
                            </p>
                            <p>
                                We Offer A Complete, High-End Property Management Solution — From Marketing And Advertising Your Villa Or Apartment, Sourcing And Screening Quality Tenants, Handling All Administration, Collecting Payments, Overseeing Leasing Inspections, To Arranging Professional Cleaning, Maintenance, And Full Compliance With Dubai's Latest Real Estate Regulations.
                            </p>
                            <p>
                                With Mateluxy, Your Investment Is In Expert Hands — Managed With Precision, Care, And A Commitment To Excellence.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Row 2: Text Left, Image Right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">
                    {/* Content Column (Order 2 on mobile, Order 1 on desktop) */}
                    <div className="flex flex-col gap-6 order-2 lg:order-1">
                        <Text as="h2" className="text-[32px] md:text-[36px] font-medium text-black leading-tight">
                            What To Expect With Our Property<br className="hidden lg:block" /> Management
                        </Text>

                        <div className="space-y-6 text-[#4A4A4A] text-[15px] leading-[1.8] font-normal text-left">
                            <p>
                                At Mateluxy, We Offer A Range Of Premium Property Management Packages For Villas, Apartments, And Entire Buildings — Or You Can Design A Custom Management Solution Tailored To Your Property's Unique Needs.
                            </p>
                            <p>
                                Your Dedicated Mateluxy Property Manager Will Be Your Single Point Of Contact, Handling Communication With Tenants, Overseeing Daily Operations, And Ensuring Your Rental Property Runs Smoothly, While Keeping You Informed Through Your Preferred Channels.
                            </p>
                            <p>
                                Experience Hassle-Free Ownership With Mateluxy — Where Your Property Is Managed To Perfection.
                            </p>
                        </div>
                    </div>

                    {/* Image Column (Order 1 on mobile, Order 2 on desktop) */}
                    <div className="relative h-[300px] md:h-[400px] lg:h-[450px] w-full rounded-[16px] overflow-hidden shadow-md order-1 lg:order-2">
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                            [Agent with Play Button Image Placeholder]
                        </div>

                        {/* Play Button Overlay (Simulated) */}
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                            <div className="w-16 h-16 rounded-full border-[1.5px] border-white flex items-center justify-center backdrop-blur-md bg-black/10 shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-1">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>

                        {/* UNCOMMENT WHEN ASSET IS AVAILABLE
                        <Image
                            src="/Assets/AgentVideo.png" 
                            alt="What To Expect With Our Property Management"
                            fill
                            className="object-cover"
                        />
                        */}
                    </div>
                </div>

            </Box>
        </Box>
    );
};
