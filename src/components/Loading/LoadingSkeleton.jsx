// src/components/LoadingSkeleton.jsx
import React from "react";
import { motion } from "framer-motion";
import "./LoadingSkeleton.css"; // custom shimmer styles
import AOS from "aos";
import "aos/dist/aos.css";

// Initialize AOS globally
AOS.init({ once: true });

const LoadingSkeleton = ({ count = 6, variant = "card" }) => {
    const renderSkeleton = (i) => {
        switch (variant) {
            case "text":
                return (
                    <div key={i} className="w-full space-y-3">
                        <div className="skeleton shimmer h-4 w-2/3 rounded" />
                        <div className="skeleton shimmer h-4 w-1/2 rounded" />
                    </div>
                );
            case "product":
                return (
                    <div key={i} className="animate-pulse bg-white rounded-xl shadow p-4 space-y-3">
                        <div className="skeleton shimmer h-40 w-full rounded-lg" />
                        <div className="skeleton shimmer h-4 w-3/4 rounded" />
                        <div className="skeleton shimmer h-4 w-1/2 rounded" />
                    </div>
                );
            default:
            case "card":
                return (
                    <div
                        key={i}
                        className="animate-pulse bg-white rounded-2xl shadow-md p-4 flex flex-col items-center space-y-3"
                        data-aos="fade-up"
                        data-aos-delay={i * 50}
                    >
                        <div className="skeleton shimmer h-20 w-20 rounded-full" />
                        <div className="skeleton shimmer h-4 w-3/4 rounded" />
                    </div>
                );
        }
    };

    return (
        <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
        </motion.div>
    );
};

export default LoadingSkeleton;
