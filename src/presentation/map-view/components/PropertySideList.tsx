'use client';

import { Box, Flex, Text } from '@frooxi-labs/adaptive-ui';
import PropertyCardReplicated from '../../shared/components/PropertyCardReplicated';
import { PropertyCardSkeletonHorizontal } from '../../shared/components/PropertyCardSkeletonHorizontal';

interface PropertySideListProps {
    properties: any[];
    loading: boolean;
    error: string | null;
}

export const PropertySideList = ({ properties, loading, error }: PropertySideListProps) => {
    return (
        <Box className="w-full h-full overflow-y-auto bg-gray-50 p-6">
            <Text className="text-xl font-bold mb-4">
                Prawira Valley Prawira...
            </Text>
            <Box className="flex items-center text-gray-500 mb-6 text-sm">
                <Box className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                Burj Khalifa, Dubai
            </Box>

            {/* Featured Item (simulated for now based on design) */}
            {!loading && properties.length > 0 && (
                <Box className="mb-6">
                    <PropertyCardReplicated
                        property={properties[0]}
                        loading={false}
                        error={null}
                    />
                </Box>
            )}

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => <PropertyCardSkeletonHorizontal key={i} />)
                ) : error ? (
                    <Box className="text-center py-20 text-red-500">Error: {error}</Box>
                ) : properties.length === 0 ? (
                    <Box className="text-center py-20 text-gray-500">No properties found matching your criteria.</Box>
                ) : (
                    properties.map((property) => (
                        <PropertyCardReplicated
                            key={property._id || property.id}
                            property={property}
                            loading={false}
                            error={null}
                        />
                    ))
                )}
            </div>
        </Box>
    );
};
