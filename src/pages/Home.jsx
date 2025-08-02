import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Fade } from "react-awesome-reveal";

import Header from "../components/header";
import Footer from "../components/footer";
import CartFooter from "../components/CartFooter";

const CategoriesPage = () => {
    const navigate = useNavigate();
    const [categoriesData, setCategoriesData] = useState({});
    const [loading, setLoading] = useState(true);
    const fetchCategories = async () => {
        try {
            const [categoriesRes] = await Promise.all([
                axios.get(`https://api.qa.bsquaresupermart.in/categories`)
            ]);
            setCategoriesData(categoriesRes.data || {});
        } catch (err) {
            console.error("Error fetching categories:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Preload category images
    useEffect(() => {
        Object.values(categoriesData).flat().forEach((sub) => {
            const img = new Image();
            img.src = `https://cdn.bsquaresupermart.in/images/categories/${encodeURIComponent(sub.image)}`;
        });
    }, [categoriesData]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow p-4 md:p-10 bg-gradient-to-b from-lime-50 via-green-50 to-white">
                <motion.h1
                    className="text-4xl font-extrabold text-center mb-14 text-emerald-700 drop-shadow-lg"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Explore Product Categories
                </motion.h1>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-white h-36 rounded-2xl shadow animate-pulse"
                            />
                        ))}
                    </div>
                ) : (
                    Object.entries(categoriesData).map(([mainCategory, subCategories], idx) => (
                        <div key={idx} className="mb-16">
                            <Fade direction="up" cascade damping={0.1} triggerOnce>
                                <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-l-4 border-emerald-500 pl-3">
                                    {mainCategory}
                                </h2>
                            </Fade>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {subCategories.map((sub, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.07, rotate: 1 }}
                                        className="bg-white rounded-2xl shadow-xl p-4 text-center transition duration-300 hover:shadow-emerald-200 hover:-translate-y-1 cursor-pointer group"
                                        onClick={() => {
                                            console.log("Navigating to category:", sub.category);
                                            navigate(`/Category/${encodeURIComponent(sub.category)}`);
                                        }}
                                    >
                                        <img
                                            src={`https://cdn.bsquaresupermart.in/images/categories/${encodeURIComponent(sub.image)}`}
                                            alt={sub.category}
                                            className="h-20 w-20 mx-auto object-contain mb-3 transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <p className="text-sm font-medium text-gray-700 group-hover:text-emerald-700 transition-colors">
                                            {sub.category}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </main>

            <CartFooter />
            <Footer />
        </div>
    );
};

export default CategoriesPage;
