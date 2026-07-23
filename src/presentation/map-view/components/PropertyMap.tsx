'use client';

import { GoogleMap, Marker, Polygon } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

interface PropertyMapProps {
    properties: any[];
    center?: google.maps.LatLngLiteral;
    bounds?: google.maps.LatLngBounds;
    onMapLoad?: (map: google.maps.Map) => void;
    boundaryPath?: { lat: number; lng: number }[] | null;
}

const containerStyle = {
    width: '100%',
    height: '100%',
};

const defaultCenter = {
    lat: 25.1972,
    lng: 55.2744,
};

// Custom Clean White style
const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    scrollwheel: true,
    styles: [
        { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
        { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
        { featureType: 'all', elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
        { featureType: 'all', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
        { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }] },
        { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#e3e3e3' }] },
        { featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }] },
        { featureType: 'road.local', elementType: 'geometry.fill', stylers: [{ color: '#fbfbfb' }] },
        { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e9e9e9' }] },
        { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
    ],
};

export const PropertyMap = ({ properties, center, bounds, onMapLoad, boundaryPath }: PropertyMapProps) => {
    const [map, setMap] = useState<google.maps.Map | null>(null);

    const handleLoad = (mapInstance: google.maps.Map) => {
        setMap(mapInstance);
        if (onMapLoad) onMapLoad(mapInstance);
    };

    // Handle map navigation when center/bounds change
    useEffect(() => {
        if (map && bounds) {
            map.fitBounds(bounds);
        } else if (map && center) {
            map.panTo(center);
            map.setZoom(14);
        }
    }, [map, bounds, center]);

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center || defaultCenter}
            zoom={13}
            options={mapOptions}
            onLoad={handleLoad}
        >
            {/* Property Markers */}
            {properties.map((property: any, index: number) => (
                property.location?.lat && property.location?.lng ? (
                    <Marker
                        key={index}
                        position={{ lat: property.location.lat, lng: property.location.lng }}
                        icon={{
                            path: 'M10.5,0C4.7,0,0,4.7,0,10.5c0,10.2,10.5,19.8,10.5,19.8s10.5-9.6,10.5-19.8C21,4.7,16.3,0,10.5,0z M10.5,14c-1.9,0-3.5-1.6-3.5-3.5s1.6-3.5,3.5-3.5s3.5,1.6,3.5,3.5S12.4,14,10.5,14z',
                            fillColor: '#FF4444',
                            fillOpacity: 1,
                            strokeColor: '#FFFFFF',
                            strokeWeight: 2,
                            scale: 1.5,
                            anchor: new google.maps.Point(10.5, 30),
                        }}
                    />
                ) : null
            ))}

            {/* Location Boundary Polygon */}
            {boundaryPath && boundaryPath.length > 0 && (
                <Polygon
                    paths={boundaryPath}
                    options={{
                        strokeColor: '#B8B8B8',
                        strokeOpacity: 0,
                        strokeWeight: 2,
                        fillColor: '#FF4444',
                        fillOpacity: 0.15,
                        // @ts-ignore - dashed border icons
                        icons: [{
                            icon: {
                                path: 'M 0,-1 0,1',
                                strokeOpacity: 1,
                                strokeColor: '#B8B8B8',
                                scale: 4,
                            },
                            offset: '0',
                            repeat: '20px',
                        }],
                    }}
                />
            )}
        </GoogleMap>
    );
};
