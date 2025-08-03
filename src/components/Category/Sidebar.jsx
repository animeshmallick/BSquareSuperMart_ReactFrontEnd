import React from "react";
import { motion } from "framer-motion";
import { Fade } from "react-awesome-reveal";

const Sidebar = ({ subCategories = [], selected, onSelect }) => {
    return (
        <aside className="bg-white rounded-2xl shadow-md py-4 px-3 h-fit sticky top-24 overflow-hidden">
            <Fade cascade direction="left" damping={0.1} triggerOnce>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Sub-Categories</h3>
            </Fade>

            <motion.ul
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
            >
                {subCategories.map((sub, index) => (
                    <li key={index}>
                        <button
                            onClick={() => onSelect(sub)}
                            className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                selected === sub
                                    ? "bg-emerald-600 text-white shadow"
                                    : "bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
                            }`}
                        >
                            {sub}
                        </button>
                    </li>
                ))}
            </motion.ul>
        </aside>
    );
};

export default Sidebar;
