import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/header";
import Footer from "../components/footer";
import { motion } from "framer-motion";
import { Fade } from "react-awesome-reveal";
import CartFooter from "../components/CartFooter";
import CartHelper from "../helpers/CartHelper";
import Sidebar from "../components/Sidebar";
import AuthHelper from "../helpers/AuthHelper";

const CategoryPage = () => {
    const { categoryName } = useParams();
    const navigate = useNavigate();

    const [categoryData, setCategoryData] = useState({});
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(CartHelper.getStoredCart());
    const [allProducts, setAllProducts] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const validate = async () => {
            const loggedIn = await AuthHelper.isLoggedIn();
            setIsLoggedIn(loggedIn);
        };
        validate();

        axios.get(`https://qa.api.bsquaresupermart.in/category/${categoryName}`)
            .then((res) => {
                const data = res.data || {};
                setCategoryData(data);
                const firstSubCategory = Object.keys(data)[0];
                setSelectedSubCategory(firstSubCategory);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching products:", err);
                setLoading(false);
            });

        axios.get(`https://qa.api.bsquaresupermart.in/getAllProducts`)
            .then((res) => setAllProducts(res.data))
            .catch((err) => {
                console.log("Failed to fetch all products from server");
                setLoading(false);
            });
    }, [categoryName]);

    const addToCart = (productId) => {
        const updatedCart = CartHelper.addToCart(cart, productId);
        setCart(updatedCart);
    };

    const updateQuantity = (productId, delta) => {
        const updatedCart = CartHelper.updateQuantity(cart, productId, delta);
        setCart(updatedCart);
    };

    const goToProductPage = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-xl text-gray-700 animate-pulse">
                Loading products...
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50">
            <Header isLoggedIn={isLoggedIn} />
            <main className="flex-grow px-2 sm:px-6 md:px-12 py-10">
                <div className="grid grid-cols-[20%_75%] gap-4 sm:gap-6">
                    <Sidebar
                        subCategories={Object.keys(categoryData)}
                        selected={selectedSubCategory}
                        onSelect={setSelectedSubCategory}
                    />

                    <div>
                        <Fade direction="up" cascade damping={0.1} triggerOnce>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-l-4 border-emerald-500 pl-4">
                                {selectedSubCategory}
                            </h2>
                        </Fade>

                        <motion.div
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            {categoryData[selectedSubCategory]?.map((product) => {
                                const discount = Math.round(
                                    ((product.productMrp - product.productPrice) / product.productMrp) * 100
                                );
                                const quantity = CartHelper.getQuantity(cart, product.productId);
                                const fullProductInfo = allProducts[product.productId];
                                const inStock = fullProductInfo && fullProductInfo.stock > 0;

                                return (
                                    <motion.div
                                        key={product.productId}
                                        className={`relative bg-white rounded-2xl shadow-md ${
                                            !inStock ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"
                                        } p-3 transition-all duration-300 group`}
                                        whileHover={inStock ? { scale: 1.03 } : {}}
                                    >
                                        {discount > 0 && (
                                            <div className="absolute top-2 left-2 bg-blue-600 text-white text-[11px] font-bold py-0.5 px-1.5 rounded-md shadow-sm z-10">
                                                {discount}% OFF
                                            </div>
                                        )}

                                        {!inStock && (
                                            <div className="absolute top-2 right-2 bg-red-600 text-white text-[11px] font-bold py-0.5 px-1.5 rounded-md shadow-sm z-10">
                                                OUT OF STOCK
                                            </div>
                                        )}

                                        <div onClick={() => inStock && goToProductPage(product.productId)} className="cursor-pointer">
                                            <img
                                                src={product.productImg}
                                                alt={product.productName}
                                                className={`h-22 w-full object-contain mb-3 transition-transform duration-300 ${
                                                    inStock ? "group-hover:scale-105" : ""
                                                }`}
                                            />
                                            <div className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                                                {product.productName}
                                            </div>
                                            <div className="text-xs text-gray-500 mb-2">{product.productSize}</div>
                                        </div>

                                        <div>
                                            <div className="flex space-x-2 items-center">
                        <span className="text-emerald-600 font-bold text-sm">
                          ₹{product.productPrice}
                        </span>
                                                {discount > 0 && (
                                                    <span className="text-xs line-through text-gray-400">
                            ₹{product.productMrp}
                          </span>
                                                )}
                                            </div>

                                            {inStock ? (
                                                quantity === 0 ? (
                                                    <button
                                                        onClick={() => addToCart(product.productId)}
                                                        className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg font-medium transition-all mt-2"
                                                    >
                                                        ADD
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center space-x-2 mt-2">
                                                        <button
                                                            onClick={() => updateQuantity(product.productId, -1)}
                                                            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 text-sm font-bold"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="text-gray-800 font-semibold text-sm">{quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(product.productId, 1)}
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full w-7 h-7 text-sm font-bold"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                )
                                            ) : (
                                                <div className="mt-2 text-xs text-red-500 font-semibold">
                                                    Currently unavailable
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>
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

export default CategoryPage;
