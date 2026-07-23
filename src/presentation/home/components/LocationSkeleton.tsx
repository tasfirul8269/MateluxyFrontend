'use client';

import { Box, Flex } from '@frooxi-labs/adaptive-ui';

export const LocationCardSkeleton = () => (
    <Box className="min-w-[326px] h-[219px] rounded-[20px] bg-gray-200 animate-pulse flex-shrink-0 relative overflow-hidden">
        <Box className="absolute bottom-[24px] left-[21px] right-3">
            <Box className="h-7 bg-gray-300 rounded-md w-2/3 mb-4" />
            <Flex className="flex items-center gap-[9px]">
                <Box className="h-[30px] w-20 bg-gray-300 rounded-full" />
                <Box className="w-[2px] h-[14px] bg-gray-300" />
                <Box className="h-[30px] w-20 bg-gray-300 rounded-full" />
                <Box className="w-[2px] h-[14px] bg-gray-300" />
                <Box className="h-[30px] w-20 bg-gray-300 rounded-full" />
            </Flex>
        </Box>
    </Box>
);

export const LocationSidebarSkeleton = () => (
    <Box className="flex flex-col gap-3 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
            <Flex key={i} className="flex items-center justify-between">
                <Flex className="flex items-center gap-2">
                    <Box className="w-3 h-3 rounded-full bg-gray-300" />
                    <Box className="h-4 bg-gray-300 rounded w-24" />
                </Flex>
                <Box className="h-4 bg-gray-300 rounded w-16" />
            </Flex>
        ))}
    </Box>
);
