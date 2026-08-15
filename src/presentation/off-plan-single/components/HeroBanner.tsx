'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft,
  ChevronRight,
  Heart, 
  MapPin, 
  Tag, 
  Maximize,
  Share2,
  X,
  Calendar,
  Building,
  ArrowRight,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/src/lib/utils';

interface HeroBannerProps {
  property: any;
}

export default function HeroBanner({ property }: HeroBannerProps) {
  // Create images array from property data
  const getImages = () => {
    const images: any[] = [];
    const fallbackImage = 'https://placehold.co/1200x800/eaeaea/999999?text=Off+Plan+Project';
    
    if (property?.propertyFeaturedImage) {
      images.push({
        src: property.propertyFeaturedImage,
        alt: property.propertyTitle || 'Property image'
      });
    }

    if (property?.media && Array.isArray(property.media) && property.media.length > 0) {
      property.media.forEach((img: string, index: number) => {
        if (img && img.trim() !== '') {
          images.push({
            src: img,
            alt: `${property.propertyTitle || 'Property'} image ${index + 1}`
          });
        }
      });
    }

    // Fallback if empty
    if (images.length === 0) {
      images.push({
        src: fallbackImage,
        alt: 'Project placeholder'
      });
    }

    return images;
  };

  const images = getImages();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Reset loading state when image changes
  useEffect(() => {
    setIsLoading(true);
    
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  }, [currentIndex]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  
  // Handle touch events for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      goToNext();
    }
    if (touchEnd - touchStart > 100) {
      goToPrevious();
    }
  };
  
  // Toggle fullscreen gallery
  const toggleFullscreen = () => {
    const newState = !isFullscreen;
    setIsFullscreen(newState);
    if (newState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };
  
  // Clean up body overflow when unmounted
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Toggle favorite
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Get all property details dynamically
  const projectName = property?.propertyTitle;
  const price = property?.propertyPrice ? formatPrice(property.propertyPrice) : 'Price on request';
  const area = property?.propertySize ? `${property.propertySize} sq. ft` : 'Area not specified';
  const bedrooms = property?.propertyBedrooms?.toString() || 'Not specified';
  const location = property?.propertyState || property?.propertyAddress || 'Location not specified';
  const developer = property?.developerName || 'Developer not specified';
  const brochureFile = property?.brochureFile || null;
  const completionDate = property?.completionDate;
  const propertyType = property?.propertyType || 'Project';
  const tags = property?.tags || [];
  
  // Format completion date if available
  const formattedCompletionDate = completionDate 
    ? (completionDate.includes('-') 
        ? new Date(completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : completionDate)
    : 'Not specified';

  return (
    <>
      {/* Fullscreen Gallery */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[9999] flex flex-col"
          >
            <div className="flex justify-between items-center p-4 text-white">
              <h3 className="text-xl font-semibold truncate pr-4">{property?.propertyTitle || 'Project Gallery'}</h3>
              <button 
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 p-3 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors z-10"
              >
                <ChevronLeft size={32} />
              </button>
              
              <div className="w-full h-full flex items-center justify-center p-4">
                <img 
                  src={images[currentIndex]?.src} 
                  alt={images[currentIndex]?.alt}
                  className="max-h-full max-w-full object-contain"
                  onError={(e: any) => {
                    e.target.src = 'https://placehold.co/1200x800/eaeaea/999999?text=Off+Plan+Project';
                  }}
                />
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 p-3 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors z-10"
              >
                <ChevronRight size={32} />
              </button>
            </div>
            
            {/* Thumbnail gallery */}
            <div className="p-4 bg-black/70">
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 cursor-pointer ${index === currentIndex ? 'border-red-500' : 'border-transparent'}`}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.src = 'https://placehold.co/1200x800/eaeaea/999999?text=Off+Plan+Project';
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-white mt-2 text-sm font-semibold">
                <div>{currentIndex + 1} / {images.length}</div>
                <div>{property?.propertyType || 'Project'}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <section className="relative">
        <div className="relative">
          <div 
            className="relative h-[65vh] md:h-[75vh] overflow-hidden rounded-[30px] group border border-gray-150"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Image Gallery */}
            <div className="absolute inset-0">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="h-full w-full relative"
                >
                  <img 
                    src={images[currentIndex]?.src} 
                    alt={images[currentIndex]?.alt} 
                    className="w-full h-full object-cover"
                    onLoad={() => setIsLoading(false)}
                    onError={(e: any) => {
                      e.target.src = 'https://placehold.co/1200x800/eaeaea/999999?text=Off+Plan+Project';
                      setIsLoading(false);
                    }}
                  />
                  
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100/20 backdrop-blur-sm">
                      <div className="w-10 h-10 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/75"></div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Navigation buttons */}
            {!isFullscreen && (
              <>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 hover:bg-black/50 rounded-full text-white transition-all z-50 cursor-pointer opacity-0 group-hover:opacity-100 hidden md:block"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 hover:bg-black/50 rounded-full text-white transition-all z-50 cursor-pointer opacity-0 group-hover:opacity-100 hidden md:block"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            
            {/* Action buttons */}
            {!isFullscreen && (
              <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  className="p-3 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors cursor-pointer"
                  aria-label="View all photos"
                >
                  <Maximize size={20} />
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(e);
                  }}
                  className={`p-3 rounded-full text-white transition-colors cursor-pointer ${isFavorite ? 'bg-red-500 hover:bg-red-600' : 'bg-black/30 hover:bg-black/50'}`}
                  aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart size={20} fill={isFavorite ? 'white' : 'none'} />
                </button>
              </div>
            )}
            
            {/* Image counter and view all button */}
            {!isFullscreen && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2 z-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  className="bg-black/50 hover:bg-black/70 text-white px-4 py-1.5 rounded-full text-sm flex items-center gap-1 transition-colors cursor-pointer"
                  aria-label="View all photos"
                >
                  <Maximize size={16} />
                  <span>View All</span>
                </button>
                <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentIndex + 1} / {images.length}
                </div>
              </div>
            )}
            
            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10">
              <div className="w-full">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-white max-w-4xl"
                >
                  {/* Property Type / Off-Plan Tag */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Off Plan
                    </span>
                    <span className="bg-black/30 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-white/20">
                      {propertyType}
                    </span>
                  </div>
                  
                  {/* Project Title */}
                  <h1 className="text-2xl md:text-4xl font-bold mb-2 leading-tight drop-shadow-md">{projectName}</h1>
                  
                  {/* Location & Developer */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6 drop-shadow-sm text-sm md:text-base">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={18} className="text-red-400" />
                      <span className="text-white/90">{location}</span>
                    </div>
                    {developer && developer !== 'Developer not specified' && (
                      <div className="flex items-center gap-1.5">
                        <Building size={16} className="text-red-400" />
                        <span className="text-white/80 font-medium">Developed by {developer}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Project Key Info */}
                  <div className="flex flex-wrap gap-x-4 gap-y-3 mb-6">
                    {price && (
                      <div className="flex items-center gap-2 bg-black/35 backdrop-blur-md px-5 py-2.5 rounded-xl shadow-lg border border-red-500/20">
                        <span className="text-xs text-gray-300 uppercase tracking-wider block font-medium">Starting from</span>
                        <span className="font-bold text-lg md:text-xl text-white">{price}</span>
                      </div>
                    )}
                    {area && (
                      <div className="flex items-center gap-2 bg-black/35 backdrop-blur-md px-5 py-2.5 rounded-xl shadow-lg border border-white/10">
                        <span className="font-semibold text-sm md:text-base">{area}</span>
                      </div>
                    )}
                    {bedrooms && (
                      <div className="flex items-center gap-2 bg-black/35 backdrop-blur-md px-5 py-2.5 rounded-xl shadow-lg border border-white/10">
                        <span className="font-semibold text-sm md:text-base">{bedrooms} Bed Available</span>
                      </div>
                    )}
                    {completionDate && (
                      <div className="flex items-center gap-2 bg-black/35 backdrop-blur-md px-5 py-2.5 rounded-xl shadow-lg border border-white/10">
                        <Calendar className="text-red-400" size={16} />
                        <span className="font-semibold text-sm md:text-base">Handover: {formattedCompletionDate}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 mt-6">
                    <motion.button 
                      onClick={() => {
                        const bookingForm = document.getElementById('booking-form');
                        if (bookingForm) {
                          bookingForm.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="cursor-pointer bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3.5 px-6 md:px-8 rounded-xl transition-all text-center flex items-center gap-3 shadow-lg font-semibold border border-red-400/20 text-sm md:text-base"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Calendar size={18} />
                      Request Details
                    </motion.button>
                    {brochureFile && (
                      <motion.a 
                        href={brochureFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer bg-white/15 hover:bg-white/25 text-white py-3.5 px-6 md:px-8 rounded-xl transition-all flex items-center gap-3 backdrop-blur-md shadow-lg font-semibold border border-white/20 text-sm md:text-base"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Download size={18} />
                        Brochure
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2.5 mb-6 mt-4">
            {tags.map((tag: string, index: number) => (
              <span key={index} className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors shadow-sm border border-red-100">
                <Tag size={14} className="text-red-500" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
