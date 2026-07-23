// Shared Google Maps configuration — use this in ALL components that call useJsApiLoader
// This ensures the loader is only called once with one set of options.

export const GOOGLE_MAPS_LIBRARIES: ('places' | 'geometry')[] = ['places', 'geometry'];

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export const GOOGLE_MAPS_LOADER_OPTIONS = {
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
} as const;
