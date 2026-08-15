'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, User, Mail, Phone, MessageSquare, ArrowRight } from 'lucide-react';

export default function ContactForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'general',
    message: '',
    contactPhone: false,
    contactWhatsApp: false,
    contactEmail: true
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const steps = [
    { title: 'Personal Details', description: 'Tell us about yourself' },
    { title: 'Your Requirements', description: 'What are you looking for?' },
    { title: 'Contact Preferences', description: 'How should we reach you?' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear validation error when typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateStep = () => {
    const errors: Record<string, string> = {};
    
    if (activeStep === 0) {
      if (!formData.name.trim()) errors.name = 'Full name is required';
      else if (formData.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
      
      if (!formData.email.trim()) errors.email = 'Email address is required';
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())) {
        errors.email = 'Invalid email address';
      }
      
      if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
        errors.phone = 'Invalid phone number format';
      }
    } else if (activeStep === 1) {
      if (!formData.message.trim()) errors.message = 'Message is required';
    } else if (activeStep === 2) {
      if (!formData.contactPhone && !formData.contactWhatsApp && !formData.contactEmail) {
        errors.contactMethod = 'Please select at least one contact method';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep() && activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (activeStep < steps.length - 1) {
      handleNext();
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    
    try {
      console.log('Submitting Contact Request:', formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFormSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        interest: 'general',
        message: '',
        contactPhone: false,
        contactWhatsApp: false,
        contactEmail: true
      });
      
      // Auto reset success state after 5 seconds
      setTimeout(() => {
        setFormSuccess(false);
        setActiveStep(0);
      }, 5000);
    } catch (err: any) {
      setFormError('There was a problem submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const interestOptions = [
    { value: 'buying', label: 'Buying Property' },
    { value: 'selling', label: 'Selling Property' },
    { value: 'renting', label: 'Renting' },
    { value: 'investment', label: 'Investment Opportunities' },
    { value: 'management', label: 'Property Management' },
    { value: 'general', label: 'General Inquiry' },
  ];

  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden shadow-inner p-6 md:p-8">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 px-2">
        {steps.map((step, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center relative">
            {activeStep > idx ? (
              <div className="w-10 h-10 flex items-center justify-center rounded-full text-base font-bold mb-1 shadow bg-green-500 text-white">
                <CheckCircle className="h-6 w-6" />
              </div>
            ) : activeStep === idx ? (
              <div className="w-10 h-10 flex items-center justify-center rounded-full text-base font-bold mb-1 shadow bg-red-650 text-white shadow-lg">
                {idx + 1}
              </div>
            ) : (
              <div className="w-10 h-10 flex items-center justify-center rounded-full text-base font-bold mb-1 shadow bg-gray-100 text-gray-400">
                {idx + 1}
              </div>
            )}
            <div className={`text-[10px] md:text-xs font-semibold ${activeStep === idx ? 'text-red-650' : activeStep > idx ? 'text-green-500' : 'text-gray-400'}`}>
              {step.title}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {formSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-green-50 border border-green-100 rounded-lg p-6 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
            <p className="text-green-600 text-sm mb-6">Thank you for reaching out. An expert from MateLuxy will contact you shortly.</p>
            <button
              onClick={() => setFormSuccess(false)}
              className="px-6 py-2.5 bg-white border border-green-200 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-semibold shadow-sm"
            >
              Send Another Message
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={`step-${activeStep}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {formError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 flex items-center gap-3 text-sm">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Details */}
              {activeStep === 0 && (
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </span>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-3 py-3 border ${validationErrors.name ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-red-500'} rounded-xl bg-white shadow-sm focus:outline-none focus:ring-1 text-sm text-gray-800 placeholder-gray-450`}
                        placeholder="Your full name"
                      />
                    </div>
                    {validationErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-3 py-3 border ${validationErrors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-red-500'} rounded-xl bg-white shadow-sm focus:outline-none focus:ring-1 text-sm text-gray-800 placeholder-gray-450`}
                        placeholder="Your email address"
                      />
                    </div>
                    {validationErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 mb-1">Phone Number (Optional)</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-3 py-3 border ${validationErrors.phone ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-red-500'} rounded-xl bg-white shadow-sm focus:outline-none focus:ring-1 text-sm text-gray-800 placeholder-gray-450`}
                        placeholder="Your contact number"
                      />
                    </div>
                    {validationErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Requirements */}
              {activeStep === 1 && (
                <div className="space-y-4">
                  {/* Interest */}
                  <div>
                    <label htmlFor="interest" className="block text-xs font-semibold text-gray-700 mb-1">What are you interested in?</label>
                    <div className="relative">
                      <select
                        id="interest"
                        name="interest"
                        value={formData.interest}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-red-550 text-sm text-gray-850"
                      >
                        {interestOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-gray-700 mb-1">Your Message *</label>
                    <div className="relative">
                      <span className="absolute top-3 left-0 flex items-center pl-4 pointer-events-none">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                      </span>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="Please tell us about your requirements..."
                        className={`block w-full pl-10 pr-3 py-3 border ${validationErrors.message ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-red-505'} rounded-xl bg-white shadow-sm focus:outline-none focus:ring-1 text-sm text-gray-800 resize-none`}
                      ></textarea>
                    </div>
                    {validationErrors.message && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Contact Preferences */}
              {activeStep === 2 && (
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">How would you like us to contact you?</label>
                  
                  <div className="space-y-3">
                    {/* Phone call */}
                    <label className="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer transition-all hover:bg-gray-50/50">
                      <input
                        type="checkbox"
                        name="contactPhone"
                        checked={formData.contactPhone}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-red-500 mr-3"
                      />
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">Phone Call</div>
                        <div className="text-[10px] text-gray-400">Call during business hours</div>
                      </div>
                    </label>

                    {/* WhatsApp */}
                    <label className="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer transition-all hover:bg-gray-50/50">
                      <input
                        type="checkbox"
                        name="contactWhatsApp"
                        checked={formData.contactWhatsApp}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-red-500 mr-3"
                      />
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">WhatsApp Message</div>
                        <div className="text-[10px] text-gray-400">Direct WhatsApp messaging</div>
                      </div>
                    </label>

                    {/* Email */}
                    <label className="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer transition-all hover:bg-gray-50/50">
                      <input
                        type="checkbox"
                        name="contactEmail"
                        checked={formData.contactEmail}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-red-500 mr-3"
                      />
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">Email</div>
                        <div className="text-[10px] text-gray-400">Detailed email responses</div>
                      </div>
                    </label>
                  </div>
                  
                  {validationErrors.contactMethod && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.contactMethod}</p>
                  )}

                  {/* Agree Checkbox */}
                  <div className="flex items-start mt-4 gap-2">
                    <input
                      type="checkbox"
                      id="agree"
                      required
                      className="h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-red-500 mt-0.5"
                    />
                    <label htmlFor="agree" className="text-xs text-gray-600 leading-normal select-none">
                      I agree to the <span className="text-red-600 font-semibold underline cursor-pointer">Privacy Policy</span> and consent to being contacted regarding my inquiry.
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
                {activeStep > 0 ? (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-700 bg-white shadow-sm hover:bg-gray-50 font-semibold transition-all text-sm"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 flex items-center gap-1.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{activeStep < steps.length - 1 ? 'Continue' : 'Submit'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
