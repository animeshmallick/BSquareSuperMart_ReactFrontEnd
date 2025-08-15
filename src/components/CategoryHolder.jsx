// src/components/Category.jsx
import React from "react";
import { Fade } from "react-awesome-reveal";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CategoryHolder = ({ mainCategory, subCategories }) => {
    const navigate = useNavigate();
    return (
        <div className="mb-6">
            <Fade direction="up" cascade damping={0.1} triggerOnce>
                <h2 className="text-2xl font-semibold mb-3 text-gray-800 border-l-4 border-emerald-500 pl-3">
                    {mainCategory || "Category"}
                </h2>
            </Fade>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
                {subCategories?.map((sub, i) => (
                    <motion.div
                        key={`${sub.category}-${i}`}
                        whileHover={{ scale: 1.07, rotate: 1 }}
                        className="bg-white rounded-2xl shadow-xl py-2 text-center transition duration-300 hover:shadow-emerald-200 hover:-translate-y-1 cursor-pointer group"
                        onClick={() => {
                            if (sub?.category) {
                                navigate(`/Category/${encodeURIComponent(sub.category)}`);
                            }
                        }}
                    >
                        <img src={"https://bsquaresupermart-images.s3.ap-south-1.amazonaws.com/productImages/thumbnail/" + sub?.image || "default.png"} alt={sub?.category || "Category"} loading="lazy"
                             className="h-20 w-20 mx-auto object-contain mb-1 transition-transform duration-300 group-hover:scale-110"
                        />
                        <p className="text-l font-medium text-gray-700 group-hover:text-emerald-700 transition-colors">
                            {sub?.category || "Subcategory"}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CategoryHolder;
