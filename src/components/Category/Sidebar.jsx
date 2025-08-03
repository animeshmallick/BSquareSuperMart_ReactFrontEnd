import React from "react";
import { motion } from "framer-motion";
import { Fade } from "react-awesome-reveal";
import { ChevronRight } from "lucide-react";

const Sidebar = ({ subCategories = [], selected, onSelect }) => {
    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <aside className="bg-gray/70 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl py-3 px-1 h-fit sticky transition-all">
            <motion.ul
                initial="hidden"
                animate="visible"
                variants={{
                    visible: {
                        transition: {
                            staggerChildren: 0.07,
                        },
                    },
                }}
                className="space-y-3"
            >
                {subCategories.map((sub, index) => (
                    <motion.li key={index} variants={itemVariants}>
                        <button
                            onClick={() => onSelect(sub)}
                            className={`w-full flex items-center justify-between px-1 py-3 rounded-xl text-l font-medium group transition-all duration-300 ease-in-out transform hover:scale-[1.015] ${
                                selected === sub
                                    ? "bg-gradient-to-r from-emerald-500 to-emerald-700 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100 hover:text-emerald-800"
                            }`}
                        >
                            <span>{sub}</span>
                            <ChevronRight
                                className={`transform transition-transform duration-300 ${
                                    selected === sub ? "translate-x-1" : "group-hover:translate-x-1"
                                }`}
                            />
                        </button>
                    </motion.li>
                ))}
            </motion.ul>
        </aside>
    );
};

export default Sidebar;
