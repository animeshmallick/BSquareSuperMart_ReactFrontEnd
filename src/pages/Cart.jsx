import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CartHelper from "../helpers/CartHelper";
import Header from "../components/header";
import Footer from "../components/footer";
import AuthHelper from "../helpers/AuthHelper";

const CartPage = () => {
    const [products, setProducts] = useState(CartHelper.getStoredCart());
    const [bill, setBill] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [cart, setCart] = useState(CartHelper.getStoredCart());

    const refreshCart = (cartData = null) => {
        const currentCart = cartData || CartHelper.getStoredCart();
        if (currentCart.length > 0) {
            axios
                .post("https://api.qa.bsquaresupermart.in/cart", currentCart)
                .then((res) => {
                    setProducts(res.data.products);
                    setBill(res.data.bill);
                })
                .catch((err) => console.error(err));
        } else {
            setProducts([]); // Clear products if cart is empty
            setBill(null);
        }
    };


    const handleUpdateQuantity = (productId, change) => {
        const updatedCart = CartHelper.updateQuantity(cart, productId, change);
        setCart(updatedCart);
        refreshCart(updatedCart); // Pass updated cart directly
    };

    useEffect(() => {
        const validate = async () => {
            const loggedIn = await AuthHelper.isLoggedIn();
            setIsLoggedIn(loggedIn);
        };
        validate();
        refreshCart();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50">
            <Header isLoggedIn={isLoggedIn}/>
            <main className="flex-grow px-2 sm:px-6 md:px-12 py-10">
                <h2 className="text-2xl font-bold text-center text-emerald-600 mb-4">
                    🛒 Your Cart
                </h2>
                <div className="max-w-4xl mx-auto space-y-6">
                    {products.length > 0 ? (
                        products.map((item, index) => (
                                <motion.div
                                    key={`${item.id}-${index}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4"
                                >
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">{item.brand}</p>
                                        <div className="mt-1 text-gray-600">
                                            ₹{item.selling_price} × {item.quantity} =
                                            <span className="font-bold ml-1">
                                        ₹{(item.selling_price * item.quantity).toFixed(2)}
                                    </span>
                                        </div>
                                        <div className="mt-2">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, -1)}
                                                    className="bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 text-sm font-bold"
                                                >
                                                    −
                                                </button>
                                                <span className="text-gray-800 font-semibold text-sm">
                                            {item.quantity}
                                        </span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, 1)}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full w-7 h-7 text-sm font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="relative text-center py-16"
                        >
                            {/* Watermark / Illustration */}
                            <div className="absolute inset-0 flex justify-center items-center opacity-10">
                                <img
                                    src="/empty-cart-illustration.svg" // You can use any vector illustration here
                                    alt="Empty Cart"
                                    className="w-64 h-64 object-contain"
                                />
                            </div>

                            {/* Main Message */}
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold text-emerald-600 mb-4">
                                    Your cart is empty 🛒
                                </h3>
                                <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate("/")}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-full shadow-lg transition"
                                >
                                    ← Back to Home
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {bill && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-xl shadow-lg p-5 mt-6"
                        >
                            <h4 className="text-lg font-bold mb-3 text-emerald-700">Bill Summary</h4>
                            <div className="space-y-1 text-gray-700">
                                <div className="flex justify-between">
                                    <span>Cart Total</span>
                                    <span>₹{bill.cart_items_total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span>₹{bill.delivery_fee}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Packaging Fee</span>
                                    <span>₹{bill.packaging_fee}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Platform Fee</span>
                                    <span>₹{bill.platform_fee}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Small Cart Fee</span>
                                    <span>₹{bill.small_cart_fee}</span>
                                </div>
                                <hr className="my-2" />
                                <div className="flex justify-between text-xl font-bold text-emerald-700">
                                    <span>Total</span>
                                    <span>₹{bill.total_bill}</span>
                                </div>
                            </div>
                            <button
                                onClick={() =>
                                    isLoggedIn ? navigate("/checkout") : navigate("/login?source=cart")
                                }
                                className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition-all duration-200 shadow-md hover:scale-[1.02]"
                            >
                                {isLoggedIn ? "Proceed to Checkout →" : "Login to Proceed →"}
                            </button>
                        </motion.div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CartPage;
