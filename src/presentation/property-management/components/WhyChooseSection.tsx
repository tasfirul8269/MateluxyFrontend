'use client';

import { Box, Text, Flex, Stack } from '@frooxi-labs/adaptive-ui';
import Image from 'next/image';

export const WhyChooseSection = () => {
    return (
        <Box as="section" className="w-full bg-white py-16 px-4 md:px-8 lg:px-16">
            <Box className="max-w-7xl mx-auto">
                <Text as="h2" className="text-[32px] md:text-[45px] font-medium mb-10 text-black leading-tight">
                    Why Choose Our Property Management?
                </Text>

                <div className="grid grid-cols-1 lg:grid-cols-[295fr_314fr_295fr_296fr] lg:grid-rows-[285fr_254fr] gap-[16px] h-auto lg:h-[555px] w-full">
                    {/* 1. Hassle-Free Ownership (Black) */}
                    <div className="bg-black rounded-[16px] p-6 lg:p-8 flex flex-col shadow-sm h-full w-full relative overflow-hidden">
                        <div className="space-y-2 relative z-10">
                            <h3 className="text-white text-[20px] font-medium">Hassle-Free Ownership</h3>
                            <p className="text-[#E5E5E5] text-[12px] font-normal leading-[18px] max-w-[90%]">
                                We handle tenants, contracts, and renewals.
                            </p>
                        </div>
                        {/* Scattered pills pinned to the absolute bottom bounds of the parent card */}
                        <div className="absolute inset-x-0 bottom-0 pointer-events-none flex justify-center pb-2">
                            <div className="relative w-[260px] h-[100px] pointer-events-auto">
                                {/* Tenants */}
                                <button className="absolute left-[0px] bottom-[8px] -rotate-[40deg] bg-white text-black px-[30px] py-[10px] rounded-full text-[15px] font-medium transition-transform hover:scale-105 hover:z-40 z-20 w-fit">
                                    Tenants
                                </button>
                                {/* Contracts - Base Layer */}
                                <button className="absolute left-[50%] -translate-x-[50%] bottom-[-15px] bg-white text-black px-[30px] py-[10px] rounded-full text-[15px] font-medium transition-transform hover:scale-105 hover:z-40 z-10 w-fit">
                                    Contracts
                                </button>
                                {/* Renewals */}
                                <button className="absolute right-[5px] bottom-[8px] rotate-[15deg] bg-white text-black px-[30px] py-[10px] rounded-full text-[15px] font-medium transition-transform hover:scale-105 hover:z-40 z-20 w-fit">
                                    Renewals
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 2. Trusted Experience (Vertical Image) */}
                    <div className="bg-gray-100 rounded-[16px] relative overflow-hidden lg:row-span-2 group h-full w-full">
                        <Image
                            src="/Assets/Office work.png"
                            alt="Trusted Experience"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Gradient overlay to ensure text is readable */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300"></div>

                        <div className="absolute bottom-0 left-0 p-6 lg:p-8 w-full z-10 transition-transform duration-300">
                            <h3 className="text-white text-2xl font-medium mb-2">Trusted Experience</h3>
                            <p className="text-gray-200 text-sm leading-relaxed">
                                Over a decade of proven expertise in Dubai's property market.
                            </p>
                        </div>
                    </div>

                    {/* 3. 24/7 (Gradient Peach/Orange) */}
                    <div className="bg-gradient-to-b from-[#ffffff] to-[#FDE3C8] rounded-[16px] p-6 lg:p-8 flex flex-col justify-between border border-gray-100 shadow-sm relative overflow-hidden h-full w-full">
                        <div className="flex gap-3 mb-6 relative z-10">
                            {/* Icons minimal style */}
                            <Image src="/Assets/Building Icon.png" alt="Building" width={44} height={44} className="w-[44px] h-[44px] opacity-80 object-contain shrink-0" />
                            <Image src="/Assets/Support Icon.png" alt="Support" width={44} height={44} className="w-[44px] h-[44px] opacity-80 object-contain shrink-0" />
                            <Image src="/Assets/Sheild Icon.png" alt="Protection" width={44} height={44} className="w-[44px] h-[44px] opacity-80 object-contain shrink-0" />
                        </div>
                        <div className="mt-auto relative z-10">
                            <h3 className="text-black text-[40px] font-medium mb-2">24/7</h3>
                            <p className="text-[#6E6E6E] text-[13px] leading-relaxed">
                                Maintenance Support - Quick solutions to keep tenants satisfied and assets safe.
                            </p>
                        </div>
                    </div>

                    {/* 4. Maximized Returns (Wide/Image) */}
                    <div className="bg-gradient-to-b from-[#ffffff] to-[#EDFBE8] rounded-[16px] flex flex-col border border-gray-100 shadow-sm relative overflow-hidden group h-full w-full">
                        <div className="relative h-[60%] w-full shrink-0">
                            <Image
                                src="/Assets/image 68.png"
                                alt="Key Handover"
                                fill
                                className="object-cover object-top"
                            />
                            {/* Gradient to blend image bottom into the background exactly like the screenshot */}
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F0F8F1] via-[#F0F8F1]/80 to-transparent"></div>
                        </div>
                        <div className="px-6 lg:px-8 pb-6 lg:pb-8 flex flex-col relative z-10 mt-auto">
                            <h3 className="text-black text-[22px] font-medium mb-1.5">Maximized Returns</h3>
                            <p className="text-[#3a3a3a] text-[14px] font-medium leading-relaxed max-w-[90%]">
                                Professional rent evaluations to ensure competitive pricing.
                            </p>
                        </div>
                    </div>

                    {/* 5. Legal Compliance (Texture Background) */}
                    <div className="bg-[#f2f2f2] border border-gray-100 rounded-[16px] p-6 lg:p-8 flex flex-col items-center text-center shadow-sm relative overflow-hidden h-full w-full">
                        <Image
                            src="/Assets/Texture.png"
                            alt="Texture Background"
                            fill
                            className="object-cover opacity-80 pointer-events-none"
                        />
                        <div className="space-y-3 relative z-10 pt-2">
                            <h3 className="text-black text-[26px] font-medium">Legal Compliance</h3>
                            <p className="text-[#6E6E6E] text-[13px] font-normal leading-[18px] max-w-[95%] mx-auto">
                                We make sure your property complies with Dubai's real estate regulations.
                            </p>
                        </div>
                        <div className="mt-[0px] pt-6 flex gap-3 relative z-10 justify-center w-full pb-2">
                            <button className="bg-white text-black px-[20px] py-[10px] rounded-full text-[14px] font-medium transition-transform hover:scale-105 w-fit">Dubai Law</button>
                            <button className="bg-white text-black px-[20px] py-[10px] rounded-full text-[14px] font-medium transition-transform hover:scale-105 w-fit">Regulations</button>
                        </div>
                    </div>

                    {/* 6. Our Process (Blue) */}
                    <div className="bg-[#E3F2FD] rounded-[16px] p-6 lg:p-8 lg:col-span-2 flex flex-col shadow-sm border border-blue-50/50 h-full w-full">
                        <div className="mb-4">
                            <h3 className="text-black text-[26px] font-medium mb-1">Our Process</h3>
                            <p className="text-[#6E6E6E] text-[14px]">Steps to a successful property journey</p>
                        </div>

                        {/* Timeline */}
                        <div className="flex flex-col gap-3 relative mt-auto px-2 lg:px-4">
                            {/* Top row: Track (Dots and Connections) */}
                            <div className="flex items-center w-full">
                                {/* Step 1 */}
                                <span className="text-black font-medium text-[15px] shrink-0">Onboard</span>
                                <div className="w-[5px] h-[5px] rounded-full bg-black shrink-0 ml-2"></div>

                                {/* Connecting Line 1 */}
                                <div className="h-[2px] bg-black/60 flex-1 mx-0"></div>

                                {/* Step 2 */}
                                <div className="w-[5px] h-[5px] rounded-full bg-black shrink-0 mr-2"></div>
                                <span className="text-black font-medium text-[15px] shrink-0">Optimize</span>
                                <div className="w-[5px] h-[5px] rounded-full bg-black shrink-0 ml-2"></div>

                                {/* Connecting Line 2 */}
                                <div className="h-[2px] bg-black/60 flex-1 mx-0"></div>

                                {/* Step 3 */}
                                <div className="w-[5px] h-[5px] rounded-full bg-black shrink-0 mr-2"></div>
                                <span className="text-black font-medium text-[15px] shrink-0">Comply</span>
                                <div className="w-[5px] h-[5px] rounded-full bg-black shrink-0 ml-2"></div>
                            </div>

                            {/* Bottom row: Text Descriptions */}
                            <div className="flex justify-between items-start w-full gap-2">
                                <p className="text-[#6E6E6E] text-[12px] leading-tight max-w-[120px] text-left">
                                    Seamless start - we handle tenants, contracts, and setup.
                                </p>
                                <p className="text-[#6E6E6E] text-[12px] leading-tight max-w-[140px] text-center pr-2">
                                    Turn your property into a profit engine with expert care.
                                </p>
                                <p className="text-[#6E6E6E] text-[12px] leading-tight max-w-[120px] text-right">
                                    Stay stress-free as we ensure full legal protection.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Box>
        </Box>
    );
};
