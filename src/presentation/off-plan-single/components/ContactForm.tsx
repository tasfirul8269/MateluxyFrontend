'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';

interface ContactFormProps {
  property: any;
}

export default function ContactForm({ property }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      console.log('Submitting off-plan inquiry:', {
        ...formData,
        projectId: property?._id || property?.id,
        projectTitle: property?.propertyTitle
      });

      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div 
      className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white p-6 relative overflow-hidden border-b border-gray-100">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-400"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-1 text-gray-900">Request consultation</h3>
          <p className="text-gray-500 text-xs">Speak with our off-plan investment specialist about this project</p>
        </div>
      </div>
      
      <div className="p-6 pt-0">
        <form onSubmit={handleSubmit} className="bg-gray-50 p-5 rounded-2xl mt-4">
          {/* Success Message */}
          {submitSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-white rounded-xl text-green-600 flex items-center gap-2 shadow-sm"
            >
              <div className="bg-green-50 p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-semibold">Consultation requested! We will call you soon.</span>
            </motion.div>
          )}
          
          {/* Error Message */}
          {submitError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-white rounded-xl text-red-650 flex items-center gap-2 shadow-sm"
            >
              <span className="text-xs font-semibold">{submitError}</span>
            </motion.div>
          )}
          
          {/* Form Fields */}
          <div className="flex flex-col gap-3 mb-4">
            <div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 shadow-sm text-xs"
                placeholder="Full name"
              />
            </div>
            
            <div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 shadow-sm text-xs"
                placeholder="Email address"
              />
            </div>
            
            <div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 shadow-sm text-xs"
                placeholder="Phone number"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              required
              className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 shadow-sm text-xs"
              placeholder="I'm interested in this project and would like to receive details on pricing, layout, and availability..."
            ></textarea>
          </div>
          
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md text-xs"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Submitting request...</span>
              </>
            ) : (
              <>
                <span>Submit Request</span>
                <ArrowRight size={14} />
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
