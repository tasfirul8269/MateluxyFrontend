'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

interface PaymentPlanSectionProps {
  property: any;
}

export default function PaymentPlanSection({ property }: PaymentPlanSectionProps) {
  // Get payment plan percentages from property data with fallback to default values
  const downPayment = property.afterBookingPercentage || 20;
  const onConstruction = property.duringConstructionPercentage || 50;
  const onHandover = property.afterHandoverPercentage || 30;
  
  return (
    <motion.section 
      id="payment-plan"
      className="bg-white rounded-[30px] shadow-sm overflow-hidden mb-8 p-8 border border-gray-150"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Wallet className="text-[#FF2626]" size={28} />
          <span>Payment plan</span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center md:text-left">
        {/* Down Payment */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <div className="text-[#FF2626] text-3xl font-bold mb-1">
            {downPayment}%
          </div>
          <div className="text-gray-700 font-semibold text-sm">
            Down Payment
          </div>
        </div>
        
        {/* On Construction */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <div className="text-[#FF2626] text-3xl font-bold mb-1">
            {onConstruction}%
          </div>
          <div className="text-gray-700 font-semibold text-sm">
            On Construction
          </div>
        </div>
        
        {/* On Handover */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <div className="text-[#FF2626] text-3xl font-bold mb-1">
            {onHandover}%
          </div>
          <div className="text-gray-700 font-semibold text-sm">
            On Handover
          </div>
        </div>
      </div>
      
      {/* Additional payment plan details */}
      {property.paymentPlan && (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mt-6 text-sm md:text-base">
          <h3 className="text-lg font-bold mb-3 text-gray-800">Additional Payment Details</h3>
          <p className="text-gray-750 leading-relaxed whitespace-pre-line">{property.paymentPlan}</p>
        </div>
      )}
    </motion.section>
  );
}
