import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/header";
import Footer from "../components/footer";
import { motion, AnimatePresence } from "framer-motion";
import CartFooter from "../components/CartFooter";
import CartHelper from "../helpers/CartHelper";
import AuthHelper from "../helpers/AuthHelper";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductPage = () => {
    const { productId } = useParams();
    const [productID, setProductID] = useState(parseInt(productId));
    const [product, setProduct] = useState(null);
    const [cart, setCart] = useState(CartHelper.getStoredCart());
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const validate = async () => {
            const loggedIn = await AuthHelper.isLoggedIn();
            setIsLoggedIn(loggedIn);
        };
        validate();

        axios.get(`https://api.qa.bsquaresupermart.in/product/${productID}`)
            .then((res) => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching product:", err);
                setLoading(false);
            });
    }, [productID]);

    const quantity = CartHelper.getQuantity(cart, productID);
    const addToCart = () => {
        const updatedCart = CartHelper.addToCart(cart, productID);
        setCart(updatedCart);
    };

    const updateQuantity = (delta) => {
        const updatedCart = CartHelper.updateQuantity(cart, productID, delta);
        setCart(updatedCart);
    };

    if (loading || !product) {
        return (
            <div className="flex items-center justify-center min-h-screen text-xl text-gray-600 animate-pulse">
                Loading product details...
            </div>
        );
    }

    const inStock = product.productStock > 0;
    const discount = Math.round(((product.productMrp - product.productPrice) / product.productMrp) * 100);
    const images = product.productImgs?.length ? product.productImgs : [product.productImg];

    const handleNext = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="bg-gradient-to-br from-white to-emerald-50 min-h-screen flex flex-col">
            <Header isLoggedIn={isLoggedIn} />

            <main className="flex-grow px-4 sm:px-8 md:px-16 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Image Carousel */}
                    <motion.div
                        className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="relative w-full max-w-sm h-72 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentImageIndex}
                                    src={images[currentImageIndex]}
                                    alt={`Product ${currentImageIndex + 1}`}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.5 }}
                                    className={`w-full h-full object-contain rounded-lg ${inStock ? "hover:scale-105" : "opacity-50"} transition-transform`}
                                />
                            </AnimatePresence>
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        className="absolute left-0 p-2 bg-white/80 hover:bg-white rounded-full shadow-md"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="absolute right-0 p-2 bg-white/80 hover:bg-white rounded-full shadow-md"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="mt-3 text-sm text-gray-500">
                            {currentImageIndex + 1} / {images.length}
                        </div>
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        className="bg-white rounded-2xl shadow-md p-6 space-y-4"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-800">{product.productName}</h2>
                        <p className="text-gray-600 text-sm">{product.productSize}</p>

                        <div className="space-x-2 flex items-center">
                            <span className="text-emerald-600 font-bold text-xl">₹{product.productPrice}</span>
                            {discount > 0 && (
                                <>
                                    <span className="line-through text-gray-400 text-sm">₹{product.productMrp}</span>
                                    <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-md">{discount}% OFF</span>
                                </>
                            )}
                        </div>

                        {inStock ? (
                            quantity === 0 ? (
                                <button
                                    onClick={addToCart}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all"
                                >
                                    ADD TO CART
                                </button>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => updateQuantity(-1)}
                                        className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold text-lg"
                                    >
                                        −
                                    </button>
                                    <span className="text-gray-800 font-medium text-md">{quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(1)}
                                        className="w-8 h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-lg"
                                    >
                                        +
                                    </button>
                                </div>
                            )
                        ) : (
                            <div className="text-red-600 text-sm font-semibold">OUT OF STOCK</div>
                        )}

                        <div className="mt-4 text-sm text-gray-500">
                            <strong>Brand:</strong> {product.brand || "N/A"}
                            <br />
                            <strong>Category:</strong> {product.category || "N/A"}
                            <br />
                            <strong>Product ID:</strong> {product.productID}
                        </div>
                    </motion.div>
                </div>
            </main>

            <CartFooter
                cart={cart}
                getTotalItems={() => CartHelper.getTotalItems(cart)}
                getTotalPrice={() => CartHelper.getTotalPrice(cart, { [productID]: product })}
            />

            <Footer />
        </div>
    );
};

export default ProductPage;
