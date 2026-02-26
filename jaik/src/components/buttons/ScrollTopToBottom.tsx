"use client";

import React, { useEffect, useState } from 'react';
import { FaAnglesUp } from 'react-icons/fa6';
const ScrollTopToBottom: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            className={`fixed bottom-4 right-3 h-9 w-9 bg-black border-2 border-red-500 text-red-500 rounded-full flex items-center justify-center cursor-pointer outline-none z-[99] transition-opacity duration-250 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                } hover:[&>svg]:-translate-y-1`}
            onClick={scrollToTop}
            aria-label="Scroll to top"
        >
            <FaAnglesUp className="text-sm transition-transform duration-300" />
        </button>
    );
};

export default ScrollTopToBottom;