import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Fade } from "react-awesome-reveal";
import Header from "../components/header";
import Footer from "../components/footer";
import AuthHelper from "../helpers/AuthHelper";
import CartHelper from "../helpers/CartHelper";
import CartFooter from "../components/CartFooter";

const CategoriesPage = () => {
    const navigate = useNavigate();
    const [categoriesData, setCategoriesData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cart, setCart] = useState(CartHelper.getStoredCart());
    const [allProducts, setAllProducts] = useState({});

    useEffect(() => {
        const validate = async () => {
            const loggedIn = await AuthHelper.isLoggedIn();
            setIsLoggedIn(loggedIn);
        };
        validate();
        axios.get("https://api.qa.bsquaresupermart.in/categories")
            .then((res) => {
                setCategoriesData(res.data || {});
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching categories:", err);
                setLoading(false);
            });
        axios.get(`https://api.qa.bsquaresupermart.in/getAllProducts`)
            .then((res) => {
                const data = res.data;
                setAllProducts(data);
            })
            .catch((err) => {
                console.log("Failed to fetch all products from server");
                setLoading(false);
            })
    }, []);

    if (loading) return <div className="text-center p-10 text-xl animate-pulse">Loading Categories...</div>;

    return (
        <div className="flex flex-col min-h-screen">
            <Header isLoggedIn={isLoggedIn}/>

            {/* Main Content */}
            <main className="flex-grow p-4 md:p-10 bg-gradient-to-b from-lime-50 via-green-50 to-white">
                <motion.h1
                    className="text-4xl font-extrabold text-center mb-14 text-emerald-700 drop-shadow-lg"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Explore Product Categories
                </motion.h1>

                {Object.entries(categoriesData).map(([mainCategory, subCategories], idx) => (
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
                                    onClick={() => navigate(`/Category/${encodeURIComponent(sub.category)}`)}
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
                ))}
            </main>
            <CartFooter
                cart={cart}
                getTotalItems={() => CartHelper.getTotalItems(cart)}
                getTotalPrice={() => CartHelper.getTotalPrice(cart, allProducts)}
            />
            <Footer />
        </div>
    );
};

export default CategoriesPage;
