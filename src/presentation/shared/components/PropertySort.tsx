'use client';

import { useState, useRef, useEffect } from 'react';
import { FaSort } from 'react-icons/fa';
import { RiArrowDropDownLine } from 'react-icons/ri';

interface PropertySortProps {
    onFilterChange: (value: string) => void;
}

const PropertySort = ({ onFilterChange }: PropertySortProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentFilter, setCurrentFilter] = useState('Most Recent');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filterOptions = [
        { label: 'Most Recent', value: 'recent' },
        { label: 'Highest Price', value: 'price-desc' },
        { label: 'Lowest Price', value: 'price-asc' },
        { label: 'Most Bedrooms', value: 'bedrooms-desc' },
        { label: 'Least Bedrooms', value: 'bedrooms-asc' }
    ];

    const handleFilterSelect = (filterValue: string, filterLabel: string) => {
        setCurrentFilter(filterLabel);
        setIsOpen(false);
        if (onFilterChange) {
            onFilterChange(filterValue);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center px-4 py-2.5 bg-white text-gray-800 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:border-red-200 min-w-[180px] justify-between"
            >
                <div className="flex items-center">
                    <FaSort className="mr-2 text-red-500 text-sm" />
                    <span className="font-medium text-sm">{currentFilter}</span>
                </div>
                <RiArrowDropDownLine className="text-gray-600 text-2xl" />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full origin-top-right bg-white rounded-lg shadow-md border border-gray-100">
                    <div className="py-1">
                        {filterOptions.map((option) => (
                            <div
                                key={option.value}
                                className={`flex items-center px-4 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer ${option.label === currentFilter ? 'text-red-600 font-medium' : 'text-gray-700'}`}
                                onClick={() => handleFilterSelect(option.value, option.label)}
                            >
                                {option.label === currentFilter && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></div>
                                )}
                                <span className={option.label === currentFilter ? 'ml-0' : 'ml-3.5'}>{option.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertySort;
