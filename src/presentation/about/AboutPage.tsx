'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Flex } from '@frooxi-labs/adaptive-ui';
import { Header } from '../shared/components/Header';
import { Footer } from '../shared/components/Footer';
import { 
  Award, 
  Users, 
  TrendingUp, 
  MapPin, 
  ShieldCheck, 
  HeartHandshake,
  Compass,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export const AboutPage = () => {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { label: 'Properties Sold', value: '1,200+' },
    { label: 'Happy Clients', value: '98%' },
    { label: 'Years of Excellence', value: '8+' },
    { label: 'Professional Brokers', value: '45+' }
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: 'Trust & Transparency',
      description: 'We believe in honest, open communications and strict adherence to regulatory standards.'
    },
    {
      icon: Compass,
      title: 'Expert Guidance',
      description: 'Our consultants are certified experts with deep knowledge of Dubai\'s dynamic property market.'
    },
    {
      icon: HeartHandshake,
      title: 'Client-Centric Care',
      description: 'We tailor every experience to your personal dreams, investment profiles, and timelines.'
    }
  ];

  return (
    <Box className="min-h-screen bg-white text-black font-sans relative">
      <Header theme="light" />

      <main className="pt-24 pb-16">
        {/* Banner Section */}
        <section className="relative h-[55vh] md:h-[65vh] overflow-hidden bg-gray-900 mx-4 mt-4 rounded-[30px]">
          <Image 
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Dubai Skyline"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30"></div>
          
          <div className="absolute inset-0 flex flex-col justify-center max-w-7xl mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl text-white"
            >
              <span className="text-red-500 font-bold text-xs uppercase tracking-widest mb-3 block">
                Who We Are
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-montserrat leading-tight mb-4">
                Redefining Luxury Living In Dubai
              </h1>
              <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-lg mb-6">
                Mateluxy Real Estate is a boutique agency specializing in premier residential properties, luxury waterfront living, and high-yielding off-plan investments.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-4xl font-bold font-montserrat text-gray-900 mb-6">
                Our Story: A Journey Of Integrity & Excellence
              </h2>
              <div className="space-y-4 text-gray-650 text-sm md:text-base leading-relaxed">
                <p>
                  Founded with a vision to provide bespoke property advisory services, MateLuxy Real Estate has grown into a leading name in Dubai's high-end property sector. We bridge the gap between global buyers and the most exclusive waterfront residences, penthouses, and developers.
                </p>
                <p>
                  Our office in Business Bay serves as the hub for our expert advisors, who collectively speak over 15 languages, ensuring client care that spans across the globe. From initial inquiries to structural walkthroughs and handover keys, we guide you at every single step.
                </p>
              </div>
            </motion.div>

            {/* Stats grid */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center shadow-sm">
                  <div className="text-red-550 text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-gray-500 text-xs font-semibold">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl md:text-4xl font-bold font-montserrat text-gray-900 mb-4">
                Our Pillars of Success
              </h2>
              <p className="text-gray-500 text-sm md:text-base">
                We build long-term relationships through values that put transparency, trust, and premium care first.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <motion.div 
                    key={idx}
                    className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * idx, duration: 0.5 }}
                  >
                    <div className="bg-red-50 p-4 rounded-full text-red-500 mb-4 shadow-sm">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{val.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{val.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 text-center">
          <div className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-3xl p-8 md:p-12 shadow-xl flex flex-col items-center">
            <h2 className="text-2xl md:text-4xl font-bold font-montserrat mb-4">
              Find Your Next Masterpiece Property in Dubai
            </h2>
            <p className="text-white/80 max-w-xl mb-8 text-sm md:text-base">
              Explore our verified listings of luxury penthouses, custom villas, and premier off-plan properties.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => router.push('/properties')}
                className="px-8 py-3.5 bg-white text-red-600 rounded-xl hover:bg-gray-100 transition-colors font-bold text-sm shadow-md flex items-center gap-1.5 justify-center"
              >
                <span>Browse Properties</span>
                <ArrowRight size={16} />
              </button>
              <button 
                onClick={() => router.push('/contact')}
                className="px-8 py-3.5 bg-red-700 text-white rounded-xl hover:bg-red-800 transition-colors font-bold text-sm shadow-md flex items-center gap-1.5 justify-center border border-red-500"
              >
                <span>Speak with an Advisor</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </Box>
  );
};
