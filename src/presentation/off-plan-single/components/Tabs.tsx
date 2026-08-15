'use client';

import React, { useState } from 'react';

const tabs = [
  { label: 'About', href: '#about' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Location', href: '#location' },
  { label: 'Payment Plan', href: '#payment-plan' }
];

export default function Tabs() {
  const [activeTab, setActiveTab] = useState('About');

  const handleTabClick = (tab: { label: string; href: string }) => {
    setActiveTab(tab.label);
    const element = document.querySelector(tab.href);
    if (element) {
      // Offset for fixed header
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => handleTabClick(tab)}
            className={`py-3 px-6 font-semibold text-sm transition-all rounded-[15px] ${
              activeTab === tab.label
                ? 'text-red-650 bg-red-50 shadow-sm'
                : 'text-gray-650 bg-white border border-gray-150 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
