'use client';

import { Box, Flex, Text } from '@frooxi-labs/adaptive-ui';
import { MemberCard } from './MemberCard';
import { useEffect, useState } from 'react';
import { api, Agent } from '../../../services/api';
import { MOCK_AGENTS } from '../../../services/mockAgents';

interface TeamGridProps {
    searchQuery?: string;
    department?: string;
    activeTab?: 'agents' | 'team';
}

export const TeamGrid = ({ searchQuery = '', department = 'All', activeTab = 'agents' }: TeamGridProps) => {
    const [members, setMembers] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 8; // 2 rows * 4 columns

    useEffect(() => {
        // Force use of mock data for development/demo purposes to show pagination
        console.log('Total Agents:', MOCK_AGENTS.length);
        setMembers(MOCK_AGENTS);
        setLoading(false);

        /* 
        const fetchAgents = async () => {
            try {
                const data = await api.getAgents();
                setMembers(data);
            } catch (error) {
                console.error('Failed to fetch agents:', error);
                setMembers(MOCK_AGENTS);
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
        */
    }, []);


    // Filter Logic
    const filteredMembers = members.filter(member => {
        // Tab Filtering (Optional Extension)
        if (activeTab === 'team' && member.department !== 'Management') {
            // ...
        }

        const query = searchQuery.toLowerCase();
        const matchesSearch = member.name.toLowerCase().includes(query) ||
            member.position.toLowerCase().includes(query);

        const matchesDept = department === 'All' || !department ||
            (member.department && member.department === department);

        return matchesSearch && matchesDept;
    });

    console.log('TeamGrid Debug: Total:', members.length, 'Filtered:', filteredMembers.length, 'Dept:', department, 'Tab:', activeTab);



    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, department, activeTab]);

    if (loading) {
        return (
            <Box className="container mx-auto px-4 py-8">
                <Box className="w-full h-96 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                </Box>
            </Box>
        );
    }

    // Pagination Logic
    const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentMembers = filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            // Optional: Scroll to top of grid
            // window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <Box className="container mx-auto px-4 py-8">
            {filteredMembers.length === 0 ? (
                <Box className="text-center py-20 text-gray-500">
                    <Text className="text-lg">No agents found matching your criteria.</Text>
                </Box>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {currentMembers.map((member) => (
                        <MemberCard
                            key={member.id}
                            name={member.name}
                            role={member.position}
                            department={member.department}
                            image={member.photoUrl || '/Image/profile_1.png'} // Fallback image
                            languages={member.languages && member.languages.length > 0 ? member.languages : ['English']}
                        />
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <Flex className="justify-center mt-16 gap-3 items-center">
                    {/* Previous Button */}
                    <Box
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`w-8 h-8 flex items-center justify-center cursor-pointer transition-all duration-300 ${currentPage === 1 ? 'text-gray-300 pointer-events-none' : 'text-[#BBBBBB] hover:text-black'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </Box>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Box
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${currentPage === page
                                ? 'w-[48px] h-[48px] bg-[#FF0000] text-white text-[16px] font-medium'
                                : 'w-[48px] h-[48px] bg-[#F2F2F2] text-[#333333] text-[16px] font-normal hover:bg-gray-200'
                                }`}
                            style={{ fontFamily: 'var(--font-montserrat)' }}
                        >
                            {page}
                        </Box>
                    ))}

                    {/* Next Button */}
                    <Box
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`w-8 h-8 flex items-center justify-center cursor-pointer transition-all duration-300 ${currentPage === totalPages ? 'text-gray-300 pointer-events-none' : 'text-[#BBBBBB] hover:text-black'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </Box>
                </Flex>
            )}
        </Box>
    );
};
