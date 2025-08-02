import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/header";
import Footer from "../components/footer";
import { motion } from "framer-motion";
import CartFooter from "../components/CartFooter";
import CartHelper from "../helpers/CartHelper";
import AuthHelper from "../helpers/AuthHelper";

const ProductPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [cart, setCart] = useState(CartHelper.getStoredCart());
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const validate = async () => {
            const loggedIn = await AuthHelper.isLoggedIn();
            setIsLoggedIn(loggedIn);
        };
        validate();

        axios.get(`https://api.qa.bsquaresupermart.in/product/${productId}`)
            .then((res) => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching product:", err);
                setLoading(false);
            });
    }, [productId]);

    const quantity = CartHelper.getQuantity(cart, productId);
    const addToCart = () => {
        const updatedCart = CartHelper.addToCart(cart, productId);
        setCart(updatedCart);
    };

    const updateQuantity = (delta) => {
        const updatedCart = CartHelper.updateQuantity(cart, productId, delta);
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

    return (
        <div className="bg-gradient-to-br from-white to-emerald-50 min-h-screen flex flex-col">
            <Header isLoggedIn={isLoggedIn} />

            <main className="flex-grow px-4 sm:px-8 md:px-16 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <motion.div
                        className="bg-white rounded-2xl shadow-md p-6 flex justify-center items-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <img
                            src={product.productImg}
                            alt={product.productName}
                            className={`w-full max-w-sm object-contain ${inStock ? "scale-100 hover:scale-105 transition-transform" : "opacity-50"}`}
                        />
                    </motion.div>

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
                            <strong>Product ID:</strong> {product.productId}
                        </div>
                    </motion.div>
                </div>
            </main>

            <CartFooter
                cart={cart}
                getTotalItems={() => CartHelper.getTotalItems(cart)}
                getTotalPrice={() => CartHelper.getTotalPrice(cart, { [productId]: product })}
            />

            <Footer />
        </div>
    );
};

export default ProductPage;
