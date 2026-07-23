'use client';

import React, { useState, useEffect } from "react";
import { FaPhone, FaWhatsapp, FaCalendarAlt, FaHeart } from "react-icons/fa";
import { IoIosExpand } from "react-icons/io";
import { LiaBathSolid, LiaBedSolid } from "react-icons/lia";
import { MdLocationOn } from "react-icons/md";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { Box, Flex } from "@frooxi-labs/adaptive-ui";

interface PropertyCardReplicatedProps {
    property: any;
    loading?: boolean;
    error?: string | null;
}

const PropertyCardReplicated = ({ property, loading, error }: PropertyCardReplicatedProps) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [agentData, setAgentData] = useState<any>(null);
    const [agentLoading, setAgentLoading] = useState(false);

    useEffect(() => {
        if (property && property.agent) {
            if (typeof property.agent === 'object' && property.agent !== null) {
                setAgentData(property.agent);
            } else if (typeof property.agent === 'string') {
                setAgentLoading(true);
                axios.get(`http://127.0.0.1:6001/api/agents/${property.agent}`)
                    .then(res => {
                        setAgentData(res.data);
                        setAgentLoading(false);
                    })
                    .catch(err => {
                        console.error("Error fetching agent data:", err);
                        setAgentLoading(false);
                    });
            }
        }
    }, [property]);

    if (loading) {
        return (
            <div className="text-center py-20 animate-pulse">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-500">
                Error: {error}
            </div>
        );
    }

    if (!property) return null;

    const isVideo = (url: string) => url?.match(/\.(mp4|mov|avi)$/i);

    return (
        <div className="container mx-auto p-0 bg-white rounded-xl grid md:grid-cols-2 gap-4 border border-gray-200 my-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-red-100 overflow-hidden">
            {/* Image container with overlay */}
            <div className="relative group min-h-[300px]">
                <Link
                    href={`/property-details/${property._id}`}
                    className="flex gap-1 rounded-md w-full h-full"
                >
                    {/* Main Media */}
                    <div className="w-2/3 h-full relative">
                        {isVideo(property.propertyFeaturedImage) ? (
                            <video
                                src={property.propertyFeaturedImage}
                                className="w-full h-full object-cover rounded-l-xl"
                                controls
                                muted
                                loop
                            />
                        ) : (
                            <Image
                                src={property.propertyFeaturedImage || "/Assets/Logo_Color.svg"}
                                alt={property.propertyTitle}
                                fill
                                className="object-cover rounded-l-xl"
                            />
                        )}
                    </div>

                    <div className="flex w-1/3 flex-col gap-1">
                        {property.media?.slice(0, 2).map((media: string, index: number) => (
                            <div key={index} className="w-full h-1/2 relative">
                                {isVideo(media) ? (
                                    <video
                                        src={media}
                                        className={`w-full h-full object-cover ${index === 0 ? 'rounded-tr-xl' : ''}`}
                                        controls
                                        muted
                                        loop
                                    />
                                ) : (
                                    <Image
                                        src={media || "/Assets/Logo_Color.svg"}
                                        alt=""
                                        fill
                                        className={`object-cover ${index === 0 ? 'rounded-tr-xl' : ''}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </Link>

                {/* Favorite button overlay */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsFavorite(!isFavorite);
                    }}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md z-10 transition-transform duration-300 hover:scale-110"
                >
                    <FaHeart className={isFavorite ? 'text-red-500' : 'text-gray-300'} />
                </button>

                {/* Category tag */}
                <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full shadow-sm z-10">
                    <span className="text-xs font-medium text-gray-700">{property.category}</span>
                </div>
            </div>

            {/* Property details container */}
            <div className="flex flex-col items-start justify-start h-full overflow-y-auto p-4">
                {/* Price and Location */}
                <div className="w-full">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="text-2xl font-bold text-red-600">
                                AED {property.propertyPrice?.toLocaleString() || property.propertyPrice}
                                <span className="text-xs text-gray-500 font-normal ml-1">{property.category === 'Rent' ? '/month' : ''}</span>
                            </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                            <MdLocationOn className="mr-1 text-gray-500 flex-shrink-0" />
                            <span className="text-gray-600 truncate">
                                {property.propertyAddress}
                            </span>
                        </div>

                        {/* Property Title */}
                        <h3 className="font-semibold text-gray-800 text-lg">{property.propertyTitle || `${property.propertyBedrooms} Bedroom ${property.propertyType}`}</h3>

                        {/* Property Description - Truncated */}
                        <p className="text-gray-600 text-sm line-clamp-2">
                            {property.propertyDescription}
                        </p>

                        {/* Property Type */}
                        <div className="flex gap-2 flex-wrap">
                            <span className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                                {property.propertyType}
                            </span>
                            {property.isNewLaunch && (
                                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                                    New Launch
                                </span>
                            )}
                        </div>

                        {/* Property Features */}
                        <div className="flex items-center gap-5 py-3 border-t border-b border-gray-100">
                            <p className="flex text-gray-700 items-center gap-1.5 font-medium">
                                <LiaBedSolid className="text-xl text-gray-500" />
                                <span>{property.propertyBedrooms} <span className="text-sm font-normal">Beds</span></span>
                            </p>
                            <p className="flex text-gray-700 items-center gap-1.5 font-medium">
                                <LiaBathSolid className="text-xl text-gray-500" />
                                <span>{property.propertyBathrooms} <span className="text-sm font-normal">Baths</span></span>
                            </p>
                            <p className="flex text-gray-700 items-center gap-1.5 font-medium">
                                <IoIosExpand className="text-xl text-gray-500" />
                                <span>{property.propertySize} <span className="text-sm font-normal">sq.ft</span></span>
                            </p>
                        </div>
                    </div>

                    {/* Agent Information (if available) */}
                    {(property.agent || agentData) && (
                        <div className="flex items-center gap-4 mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-red-100 shadow-sm relative">
                                {agentLoading ? (
                                    <span className="text-gray-500 font-medium text-xs">Loading</span>
                                ) : agentData && (agentData.profileImage || agentData.photoUrl) ? (
                                    <Image src={agentData.profileImage || agentData.photoUrl} alt={agentData.fullName || agentData.name} fill className="object-cover" />
                                ) : (
                                    <span className="text-gray-500 font-medium text-xs">Agent</span>
                                )}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-800">
                                    {agentData ? agentData.fullName || agentData.name : "Property Agent"}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {agentData ? agentData.position || agentData.title || "Real Estate Consultant" : "Loading agent info..."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex w-full items-center justify-between md:justify-start gap-3 border-t border-gray-200 mt-4 pt-4">
                    <button
                        onClick={() => window.location.href = `tel:${agentData?.contactNumber || agentData?.phone || '+1234567890'}`}
                        className="cursor-pointer flex justify-center items-center gap-2 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-lg transition-colors duration-200 flex-1"
                    >
                        <FaPhone className="text-sm text-gray-500" />
                        <span className="font-normal text-sm">Call</span>
                    </button>

                    <button
                        onClick={() => window.location.href = `https://wa.me/${(agentData?.whatsapp || agentData?.contactNumber || agentData?.phone || '+1234567890').replace(/[^0-9]/g, '')}`}
                        className="flex cursor-pointer justify-center items-center gap-2 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-lg transition-colors duration-200 flex-1"
                    >
                        <FaWhatsapp className="text-green-500" />
                        <span className="font-normal text-sm">WhatsApp</span>
                    </button>

                    <button className="hidden md:flex cursor-pointer justify-center items-center gap-2 text-white bg-red-600 hover:bg-red-700 px-4 py-2.5 rounded-lg transition-colors duration-200 flex-1 shadow-sm">
                        <FaCalendarAlt className="text-sm" />
                        <span className="font-medium text-sm">Book Viewing</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PropertyCardReplicated;
