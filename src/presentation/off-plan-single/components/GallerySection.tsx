'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Grid } from 'lucide-react';

interface GallerySectionProps {
  property: any;
}

export default function GallerySection({ property }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // Get images from property data
  const getImages = () => {
    const images: any[] = [];
    
    if (property?.propertyFeaturedImage) {
      images.push({
        src: property.propertyFeaturedImage,
        alt: property.propertyTitle || 'Property image'
      });
    }

    if (property?.media?.length > 0) {
      property.media.forEach((img: string) => {
        if (img && img.trim() !== '') {
          images.push({
            src: img,
            alt: property.propertyTitle || 'Property image'
          });
        }
      });
    }

    return images.length > 0 ? images : [];
  };

  const images = getImages();
  
  // Open lightbox
  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setSelectedImage(images[index]);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  // Close lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
    setIsLightboxOpen(false);
    document.body.style.overflow = '';
  };
  
  // Navigate to next image in lightbox
  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  };
  
  // Navigate to previous image in lightbox
  const goToPrevious = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, currentIndex, images]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  
  // If no images, don't render the section
  if (images.length === 0) {
    return null;
  }
  
  return (
    <section id="gallery" className="bg-white rounded-[30px] border border-[#e6e6e6] overflow-hidden mb-8 p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <ImageIcon className="text-red-500" size={24} />
          Gallery
        </h2>
        {images.length > 0 && (
          <button 
            onClick={() => openLightbox(0)}
            className="flex items-center gap-2 text-red-500 hover:text-red-650 transition-colors"
          >
            <Grid size={18} />
            <span className="text-sm font-medium">View All Photos</span>
          </button>
        )}
      </div>
      
      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div 
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group border border-gray-100"
            onClick={() => openLightbox(index)}
          >
            <img 
              src={image.src} 
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        ))}
      </div>
      
      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[9999] flex flex-col"
          >
            <div className="flex justify-between items-center p-4 text-white">
              <h3 className="text-xl font-semibold">{property?.propertyTitle || 'Property Gallery'}</h3>
              <button 
                onClick={closeLightbox}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
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
                  src={selectedImage.src} 
                  alt={selectedImage.alt}
                  className="max-h-full max-w-full object-contain"
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
            
            <div className="p-4 text-white text-center">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
