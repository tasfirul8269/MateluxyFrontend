import { Box, Flex, Text } from '@frooxi-labs/adaptive-ui';
import { MemberCard } from '../../team/components/MemberCard';
import { useState, useEffect } from 'react';
import { api, Agent, TopLocation } from '../../../services/api';

export const OffPlanSpecialists = () => {
    const [activeFilter, setActiveFilter] = useState("");
    const [locations, setLocations] = useState<TopLocation[]>([]);
    const [specialists, setSpecialists] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch sidebar locations
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const data = await api.getTopLocations(5); // Get more locations for sidebar
                setLocations(data);
                if (data.length > 0) {
                    setActiveFilter(data[0].name);
                }
            } catch (error) {
                console.error('Error fetching locations for specialists:', error);
            }
        };
        fetchLocations();
    }, []);

    // Fetch agents when filter changes
    useEffect(() => {
        if (!activeFilter) return;

        const fetchAgents = async () => {
            setLoading(true);
            try {
                const data = await api.getAgentsByArea(activeFilter);
                setSpecialists(data);
            } catch (error) {
                console.error('Error fetching specialists:', error);
                setSpecialists([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, [activeFilter]);

    return (
        <Box className="w-full py-16">
            <Text
                className="text-[41px] font-medium mb-8 text-black px-4 md:px-8 xl:pl-[94px]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
                Our Off Plan Specialists
            </Text>

            <Flex className="px-4 md:px-8 xl:pl-[94px] gap-[30px] flex-col md:flex-row">
                {/* Filter Sidebar Container */}
                <Box className="w-full md:w-[335px] h-auto md:h-[430px] bg-white border-2 border-[#E2E2E2] rounded-[20px] p-6 flex-shrink-0">
                    <Flex className="flex-row md:flex-col gap-[10px] md:gap-[20px] justify-start md:justify-center h-full overflow-x-auto md:overflow-visible">
                        {locations.length > 0 ? locations.map((location) => (
                            <Box
                                key={location.name}
                                onClick={() => setActiveFilter(location.name)}
                                className={`
                                    px-6 py-4 rounded-[14px] cursor-pointer transition-all whitespace-nowrap
                                    ${activeFilter === location.name
                                        ? 'bg-[#00A8FF] text-white'
                                        : 'bg-transparent text-[#333333] hover:bg-gray-50'
                                    }
                                `}
                            >
                                <Text
                                    className="text-[16px] font-medium"
                                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                                >
                                    {location.name}
                                </Text>
                            </Box>
                        )) : (
                            <Text>Loading locations...</Text>
                        )}
                    </Flex>
                </Box>

                {/* Cards Grid */}
                <Box className="flex-1">
                    {loading ? (
                        <Text>Loading specialists...</Text>
                    ) : (
                        <Flex className="flex-wrap gap-[40px] justify-center md:justify-start">
                            {specialists.length > 0 ? (
                                specialists.map((specialist) => (
                                    <MemberCard
                                        key={specialist.id}
                                        name={specialist.name}
                                        role={specialist.position}
                                        department={specialist.department || 'Sales'}
                                        image={specialist.photoUrl || '/Image/profile_4.png'}
                                        languages={specialist.languages}
                                    />
                                ))
                            ) : (
                                <Text>No specialists found for {activeFilter}</Text>
                            )}
                        </Flex>
                    )}
                </Box>
            </Flex>
        </Box>
    );
};
