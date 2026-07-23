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

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const data = await api.getAgents();
                // Filter out inactive agents or specific filtering if needed, 
                // otherwise just set members to the fetched data
                setMembers(data || []);
            } catch (error) {
                console.error('Failed to fetch agents:', error);
                // Fallback to mock data only if API fails
                setMembers(MOCK_AGENTS);
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
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

    if (loading) {
        return (
            <Box className="container mx-auto px-4 py-8">
                <Box className="w-full h-96 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                </Box>
            </Box>
        );
    }
    // Show all members directly
    const currentMembers = filteredMembers;

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

        </Box>
    );
};
