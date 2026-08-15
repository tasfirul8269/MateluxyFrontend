'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Flex } from '@frooxi-labs/adaptive-ui';
import { Header } from '../shared/components/Header';
import { Footer } from '../shared/components/Footer';
import { ContactHero } from './components/ContactHero';
import ContactForm from './components/ContactForm';
import { 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Twitter, 
  ChevronRight, 
  User, 
  Clock as ClockIcon
} from 'lucide-react';

export const ContactPage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Social media links
  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/mateluxyrealestate", color: "#E1306C", name: "Instagram" },
    { icon: Facebook, href: "https://www.facebook.com/MateLuxy", color: "#1877F2", name: "Facebook" },
    { icon: Linkedin, href: "https://ae.linkedin.com/company/mateluxy-real-estate", color: "#0A66C2", name: "LinkedIn" },
    { icon: Twitter, href: "https://x.com/mateluxy", color: "#1DA1F2", name: "Twitter" }
  ];

  // Contact methods
  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      content: "04 572 5420",
      action: "tel:045725420",
      color: "#4CAF50"
    },
    {
      icon: Mail,
      title: "Email Us",
      content: "info@mateluxy.com",
      action: "mailto:info@mateluxy.com",
      color: "#2196F3"
    },
    {
      icon: Clock,
      title: "Working Hours",
      content: "Mon-Fri: 9AM-6PM",
      subContent: "Sat: 9AM-2PM | Sun: Closed",
      color: "#FF9800"
    }
  ];

  return (
    <Box className="min-h-screen bg-white text-black font-sans relative">
      <Header theme="light" />

      <main className="pt-24">
        {/* Contact Hero banner */}
        <ContactHero />

        {/* Info & Form Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
            {/* Left: Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 flex flex-col justify-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat leading-tight text-gray-900">
                Dubai's Leading <span className="text-red-600">Property Experts</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Our team of property consultants, marketing specialists, and customer service experts is here to guide you toward the best solutions.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-full text-red-500">
                    <ClockIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Quick Response</p>
                    <p className="text-gray-500 text-xs">We typically respond within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-full text-red-500">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Personal Attention</p>
                    <p className="text-gray-500 text-xs">Dedicated agent for your requirements</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
              id="contact-form"
            >
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="h-2 bg-gradient-to-r from-red-600 to-red-400"></div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-red-50 shadow-sm rounded-full text-red-500">
                      <Mail className="h-5 w-5" />
                    </div>
                    <h3 className="text-2xl font-bold font-montserrat text-gray-900">Send a Message</h3>
                  </div>
                  
                  <ContactForm />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Cards section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Visit Office Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 flex flex-col h-full group"
            >
              <div className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-400"></div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-50 rounded-full text-blue-500">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat text-gray-800">Visit Our Office</h3>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-50/20 p-4 rounded-2xl mb-4 border border-blue-100/50">
                  <p className="text-gray-800 font-semibold text-sm">Mateluxy Real Estate</p>
                  <p className="text-gray-650 text-xs mt-1">Bay Square - Office #601 - Building 13</p>
                  <p className="text-gray-650 text-xs">Business Bay - Dubai - UAE</p>
                </div>

                <div className="mb-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-gray-700 font-semibold mb-2 flex items-center gap-1 text-xs">
                    <ClockIcon className="h-3.5 w-3.5 text-blue-500" />
                    <span>Working Hours</span>
                  </p>
                  <div className="grid grid-cols-2 gap-x-2 text-[10px] pl-4 text-gray-600">
                    <div>
                      <p>Mon — Fri:</p>
                      <p>Saturday:</p>
                      <p>Sunday:</p>
                    </div>
                    <div className="text-right font-medium">
                      <p>9:00 AM — 6:00 PM</p>
                      <p>9:00 AM — 2:00 PM</p>
                      <p>Closed</p>
                    </div>
                  </div>
                </div>

                <motion.a 
                  href="https://maps.google.com/?q=Bay+Square+Building+13+Business+Bay+Dubai+UAE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 py-3 rounded-xl text-white hover:shadow-lg transition-all w-full font-semibold text-sm mt-auto"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MapPin className="h-4 w-4" />
                  <span>Get Directions</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Direct Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 flex flex-col h-full"
            >
              <div className="h-1.5 bg-gradient-to-r from-green-500 to-green-400"></div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-50 rounded-full text-green-500">
                    <Phone className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat text-gray-800">Get in Touch</h3>
                </div>

                <div className="space-y-3 mb-5">
                  {contactMethods.map((method, index) => (
                    <div key={index} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3 text-xs">
                      <div className="p-2 rounded-full" style={{ backgroundColor: `${method.color}15` }}>
                        <method.icon className="h-4 w-4" style={{ color: method.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-semibold">{method.content}</p>
                        {method.subContent && (
                          <p className="text-gray-500 text-[10px] mt-0.5">{method.subContent}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-auto">
                  <motion.a 
                    href="tel:+971585590085"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-green-600 to-green-500 py-3 rounded-xl text-white hover:shadow-lg transition-all font-semibold text-xs"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call</span>
                  </motion.a>
                  <motion.a 
                    href="https://wa.me/+971585590085"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] py-3 rounded-xl text-white hover:shadow-lg transition-all font-semibold text-xs"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>WhatsApp</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>

            {/* Social Media Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 flex flex-col h-full"
            >
              <div className="h-1.5 bg-gradient-to-r from-purple-500 to-purple-400"></div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-50 rounded-full text-purple-500">
                    <Instagram className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat text-gray-800">Connect With Us</h3>
                </div>

                <p className="text-gray-500 text-xs mb-4 leading-relaxed">
                  Follow us on social media to stay updated with the latest properties and real estate news in Dubai.
                </p>

                <div className="grid grid-cols-2 gap-2 mb-5">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl flex items-center gap-2 border border-gray-100 bg-gray-50/50 hover:bg-gray-150 transition-all"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="p-1 bg-white rounded-full shadow-sm text-purple-500">
                        <social.icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-semibold text-xs text-gray-700">{social.name}</span>
                    </motion.a>
                  ))}
                </div>

                <motion.a 
                  href="https://www.instagram.com/mateluxyrealestate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-650 to-purple-550 py-3 rounded-xl text-white hover:shadow-lg transition-all w-full font-semibold text-sm mt-auto"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Instagram className="h-4 w-4" />
                  <span>Follow Us</span>
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
            id="map"
          >
            <div className="h-1.5 bg-gradient-to-r from-red-600 to-red-400"></div>
            <div className="p-8">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-50 rounded-full text-red-500 shadow-sm">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-bold font-montserrat text-gray-900">Find Our Office</h3>
                </div>
                <motion.a
                  href="https://maps.google.com/?q=Bay+Square+Building+13+Business+Bay+Dubai+UAE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-red-50 text-red-650 font-semibold text-sm rounded-full flex items-center gap-1 hover:bg-red-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Open Directions</span>
                  <ChevronRight className="h-4 w-4" />
                </motion.a>
              </div>

              <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-inner border border-gray-200">
                <iframe
                  src="https://maps.google.com/maps?q=Bay%20Square%20Building%2013%20Business%20Bay%20Dubai%20UAE&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mateluxy Office Location"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </Box>
  );
};
