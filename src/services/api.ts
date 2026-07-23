const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:6001';

export interface Property {
    id: string;
    propertyTitle?: string;
    address?: string;
    bedrooms?: string;
    bathrooms?: number;
    area?: number;
    price?: number;
    coverPhoto?: string;
    mediaImages?: string[];
    category?: string; // 'Buy', 'Rent'
    purpose?: string;
    propertyType?: string; // 'Apartment', 'Villa'
    pfLocationPath?: string;
    emirate?: string;
    isActive: boolean;
    createdAt: string;
    agent?: {
        name: string;
        photoUrl?: string;
    };
    assignedAgent?: {
        name: string;
        photoUrl?: string;
        languages?: string[];
    };
}

export interface OffPlanProperty {
    id: string;
    projectTitle?: string;
    address?: string;
    bedrooms?: string;
    bathrooms?: number;
    area?: number;
    startingPrice?: number;
    coverPhoto?: string;
    propertyType?: string[];
    developer?: {
        name: string;
        logoUrl?: string;
    };
    isActive: boolean;
    createdAt: string;
    projectStatus?: string;
    handoverDate?: string;
    emirate?: string;
}

interface FetchPropertiesParams {
    status?: string;
    category?: string; // 'Buy', 'Rent'
    purpose?: string;
    limit?: number;
    page?: number;
    sortBy?: 'price' | 'date' | 'name';
    sortOrder?: 'asc' | 'desc';
    propertyType?: string;
    location?: string;
}

interface FetchOffPlanParams {
    limit?: number;
    page?: number;
    sortBy?: 'price' | 'date' | 'name';
    sortOrder?: 'asc' | 'desc';
    propertyType?: string;
}

export const api = {
    getProperties: async (params?: FetchPropertiesParams): Promise<Property[]> => {
        const query = new URLSearchParams();
        // Strict Active Listings: Default to 'published' if not specified
        const status = params?.status || 'published';
        query.append('status', status);

        if (params?.category) query.append('category', params.category);
        if (params?.purpose) query.append('purpose', params.purpose);
        if (params?.limit) query.append('limit', params.limit.toString());
        if (params?.page) query.append('page', params.page.toString());
        if (params?.sortBy) query.append('sortBy', params.sortBy);
        if (params?.sortOrder) query.append('sortOrder', params.sortOrder);
        if (params?.propertyType) query.append('propertyTypes', params.propertyType);
        if (params?.location) query.append('location', params.location);

        try {
            const res = await fetch(`${BASE_URL}/properties?${query.toString()}`, {
                next: { revalidate: 60 }, // Cache for 60 seconds (ISR) to reduce API costs
            });
            if (!res.ok) throw new Error('Failed to fetch properties');
            const json = await res.json();
            return json.data || [];
        } catch (error) {
            console.error('Error fetching properties:', error);
            return [];
        }
    },

    getOffPlanProperties: async (params?: FetchOffPlanParams): Promise<OffPlanProperty[]> => {
        const query = new URLSearchParams();
        if (params?.limit) query.append('limit', params.limit.toString());
        if (params?.page) query.append('page', params.page.toString());
        if (params?.sortBy) query.append('sortBy', params.sortBy);
        if (params?.sortOrder) query.append('sortOrder', params.sortOrder);
        if (params?.propertyType) query.append('propertyType', params.propertyType);

        try {
            const res = await fetch(`${BASE_URL}/off-plan-properties?${query.toString()}`, {
                next: { revalidate: 60 }, // Cache for 60 seconds (ISR)
            });
            if (!res.ok) throw new Error('Failed to fetch off-plan properties');
            return res.json();
        } catch (error) {
            console.error('Error fetching off-plan properties:', error);
            return [];
        }
    },

    getTopLocations: async (limit: number = 4): Promise<TopLocation[]> => {
        try {
            const res = await fetch(`${BASE_URL}/off-plan-properties/top-locations?limit=${limit}`, {
                next: { revalidate: 300 }, // Cache for 5 minutes
            });
            if (!res.ok) throw new Error('Failed to fetch top locations');
            return res.json();
        } catch (error) {
            console.error('Error fetching top locations:', error);
            return [];
        }
    },

    getUnifiedTopLocations: async (): Promise<UnifiedLocationStats[]> => {
        try {
            const res = await fetch(`${BASE_URL}/properties/top-locations?viewBy=listing`, {
                next: { revalidate: 300 },
            });
            if (!res.ok) throw new Error('Failed to fetch unified locations');
            return res.json();
        } catch (error) {
            console.error('Error fetching unified locations:', error);
            return [];
        }
    },

    getAgents: async (): Promise<Agent[]> => {
        const res = await fetch(`${BASE_URL}/agents/public`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) throw new Error('Failed to fetch agents');
        return res.json();
    },

    getAgentsByArea: async (area: string): Promise<Agent[]> => {
        try {
            const res = await fetch(`${BASE_URL}/agents/by-area?area=${encodeURIComponent(area)}`, {
                next: { revalidate: 60 },
            });
            if (!res.ok) throw new Error('Failed to fetch agents by area');
            return res.json();
        } catch (error) {
            console.error('Error fetching agents by area:', error);
            return [];
        }
    },

    getDevelopers: async (): Promise<Developer[]> => {
        try {
            const res = await fetch(`${BASE_URL}/developers/public`, {
                next: { revalidate: 300 }, // Cache for 5 minutes
            });
            if (!res.ok) throw new Error('Failed to fetch developers');
            return res.json();
        } catch (error) {
            console.error('Error fetching developers:', error);
            return [];
        }
    }
};

export interface Developer {
    id: string;
    name: string;
    logoUrl?: string;
}

export interface Agent {
    id: string;
    name: string;
    position: string;
    department?: string;
    photoUrl?: string;
    languages: string[];
    nationality?: string;
    phone?: string;
    email?: string;
    whatsapp?: string;
    linkedinAddress?: string;
    areasExpertIn?: string[];
    experienceSince?: number;
}

export interface TopLocation {
    name: string;
    count: number; // Used for the pin label (filtered count)
    latitude: number;
    longitude: number;
    offPlanCount?: number;
    rentCount?: number;
    sellCount?: number;
    subLocations?: {
        name: string;
        latitude: number;
        longitude: number;
    }[];
}

export interface UnifiedLocationStats {
    name: string;
    offPlan: number;
    forRent: number;
    forSell: number;
    total: number;
}
