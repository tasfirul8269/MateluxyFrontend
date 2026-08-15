'use client';

import { Box, Text, Flex, Stack } from '@frooxi-labs/adaptive-ui';
import Image from 'next/image';
import { useState } from 'react';

export const Footer = () => {
    const [email, setEmail] = useState('');

    return (
        <Box className="w-full px-4 md:px-[26px] py-4">
            <Box as="footer" className="w-full relative overflow-hidden text-white rounded-[30px] mx-auto">
                <Box className="absolute inset-0 bg-[url('/Image/footerbg.png')] bg-cover bg-center bg-no-repeat" />
                <Box className="absolute inset-0 bg-[#D62222]/95" />

                <Box className="relative z-10 w-full px-6 py-8 md:px-[31px] md:pt-[36px] md:pb-[42px] flex flex-col">
                    {/* Newsletter Section */}
                    <Box className="bg-white rounded-[25px] p-6 md:px-12 md:py-8 mb-10 relative overflow-hidden">
                        {/* Texture overlay */}
                        <img
                            src="/Image/TextureFooter.png"
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90"
                        />

                        <Flex className="relative z-10 flex-col lg:flex-row items-center justify-between gap-6 lg:gap-0">
                            {/* Left side - Text content */}
                            <Box className="text-center lg:text-left">
                                <Text className="text-2xl md:text-[32px] font-semibold text-black font-montserrat">
                                    Stay in the loop
                                </Text>
                                <Text className="mt-4 text-[#9F9F9F] text-base md:text-[20px] font-normal">
                                    News and insight straight to your inbox. We
                                    <br className="hidden md:block" /> don't spam.
                                </Text>
                            </Box>

                            {/* Right side - Input */}
                            <Box className="w-full lg:w-auto">
                                <Flex className="gap-2.5 mb-2 w-full lg:w-auto">
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex-1 lg:w-[350px] xl:w-[400px] h-[50px] md:h-[62px] bg-[#EDEDED] text-gray-700 placeholder-[#9D9D9D] outline-none text-base md:text-[20px] px-6 rounded-[20px] font-normal"
                                    />
                                    <button className="w-[50px] h-[50px] md:w-[62px] md:h-[62px] bg-[#EDEDED] rounded-full flex items-center justify-center hover:bg-[#E0E0E0] transition-colors shrink-0">
                                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0.499979 19.5769L19.5769 0.5M19.5769 0.5V19.5769M19.5769 0.5H0.499979" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </Flex>
                                <Text className="text-[#B6B6B6] text-xs md:text-[14px] font-normal text-center lg:text-left mt-1.5 lg:max-w-[400px]">
                                    By submitting you agree to our{' '}
                                    <a href="#" className="text-[#9F9F9F] hover:text-gray-800 font-semibold">Terms & Conditions</a>
                                    {' '}and{' '}
                                    <a href="#" className="text-[#9F9F9F] hover:text-gray-800 font-semibold">Privacy Policy</a>
                                </Text>
                            </Box>
                        </Flex>
                    </Box>

                    {/* Contact Bar */}
                    <Box className="w-full h-px bg-white/20 mb-8" />

                    <Flex className="flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-4 mb-12">
                        <Flex className="flex-col md:flex-row gap-6 md:gap-12 w-full md:w-auto">
                            <Flex className="items-center gap-3">
                                <Image src="/call.svg" alt="" width={30} height={30} className="w-[30px] h-[30px]" />
                                <Box>
                                    <Text className="text-[14px] font-medium font-montserrat text-white opacity-90">Call us for support</Text>
                                    <a href="tel:+97158559085" className="text-[16px] font-medium font-montserrat text-white hover:underline flex items-center gap-1">
                                        +971 58 559 0085 <Image src="/Arrow.svg" alt="" width={10} height={10} className="inline-block" />
                                    </a>
                                </Box>
                            </Flex>

                            <Flex className="items-center gap-3">
                                <Image src="/email.svg" alt="" width={41} height={33} className="w-[35px] h-auto" />
                                <Box>
                                    <Text className="text-[14px] font-medium font-montserrat text-white opacity-90">Send us mail</Text>
                                    <a href="mailto:info@mateluxy.com" className="text-[16px] font-medium font-montserrat text-white hover:underline flex items-center gap-1">
                                        info@mateluxy.com <Image src="/Arrow.svg" alt="" width={10} height={10} className="inline-block" />
                                    </a>
                                </Box>
                            </Flex>
                        </Flex>

                        <Flex className="gap-4">
                            {[
                                { label: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                                { label: 'Twitter', path: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
                                { label: 'Instagram', path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3z' }
                            ].map((social) => (
                                <a key={social.label} href="#" className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors" aria-label={social.label}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                        <path d={social.path} />
                                    </svg>
                                </a>
                            ))}
                        </Flex>
                    </Flex>

                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-12 border-b border-white/20">
                        {/* Logo Column */}
                        <div className="flex flex-col items-start justify-start">
                            <Image
                                src="/Logo.svg"
                                alt="Mateluxy"
                                width={180}
                                height={60}
                                className="object-contain brightness-0 invert w-auto h-[50px] md:h-[60px]"
                            />
                        </div>

                        {/* Visit Our Office */}
                        <div className="flex flex-col">
                            <Text className="text-[21px] font-semibold font-montserrat mb-4">Visit Our Office</Text>
                            <Stack className="space-y-3 text-[16px] md:text-[18px]">
                                <Text className="font-medium opacity-90 leading-relaxed">
                                    Bay Square - Office #601 - Building 13 -<br /> Business Bay
                                </Text>
                                <Text className="font-semibold opacity-100">Dubai - United Arab Emirates</Text>
                                <div className="pt-2 space-y-1">
                                    <Text>
                                        <span className="font-semibold">Mon - Fri :</span> <span className="font-medium opacity-90">9:00 AM to 6:00 PM</span>
                                    </Text>
                                    <Text>
                                        <span className="font-semibold">Saturday :</span> <span className="font-medium opacity-90">9:00 AM to 2:00 PM</span>
                                    </Text>
                                    <Text>
                                        <span className="font-semibold">Sunday :</span> <span className="font-medium opacity-90">Closed</span>
                                    </Text>
                                </div>
                            </Stack>
                        </div>

                        {/* Services */}
                        <div className="flex flex-col">
                            <Text className="text-[21px] font-semibold font-montserrat mb-4">Services</Text>
                            <Stack className="space-y-3">
                                {[
                                    'Residential areas',
                                    'Residential leasing',
                                    'Off Plan Properties',
                                    'Commercial Properties',
                                    'Property Management'
                                ].map((service) => (
                                    <a
                                        key={service}
                                        href="#"
                                        className="text-[16px] md:text-[18px] font-montserrat font-normal opacity-90 hover:opacity-100 hover:underline block transition-opacity"
                                    >
                                        {service}
                                    </a>
                                ))}
                            </Stack>
                        </div>

                        {/* About */}
                        <div className="flex flex-col">
                            <Text className="text-[21px] font-semibold font-montserrat mb-4">About</Text>
                            <Stack className="space-y-3">
                                {[
                                    'Our Story',
                                    'Our Team',
                                    'Client Reviews',
                                    'Careers',
                                    'Contact'
                                ].map((item) => (
                                    <a
                                        key={item}
                                        href="#"
                                        className="text-[16px] md:text-[18px] font-montserrat font-normal opacity-90 hover:opacity-100 hover:underline block transition-opacity"
                                    >
                                        {item}
                                    </a>
                                ))}
                            </Stack>
                        </div>
                    </div>

                    {/* Copyright */}
                    <Box className="mt-8">
                        <Text className="text-center text-[16px] md:text-[18px] font-montserrat font-normal text-white opacity-90">
                            © 2025 MateLuxy. All Rights Reserved.
                        </Text>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
