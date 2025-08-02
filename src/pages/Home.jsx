import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Fade } from "react-awesome-reveal";

import Header from "../components/header";
import Footer from "../components/footer";
import CartFooter from "../components/CartFooter";
import CategoryHolder from "../components/CategoryHolder";
import LoadingSkeleton from "../components/Loading/LoadingSkeleton";

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
                    <LoadingSkeleton count={6} variant={"card"} />
                ) : (
                    Object.entries(categoriesData).map(([mainCategory, subCategories]) => (
                        <CategoryHolder
                            key={mainCategory}
                            mainCategory={mainCategory}
                            subCategories={subCategories}
                        />
                    ))

                )}
            </main>

            <CartFooter />
            <Footer />
        </div>
    );
};

export default CategoriesPage;
