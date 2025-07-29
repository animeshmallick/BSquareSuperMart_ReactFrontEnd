import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CartHelper from "../helpers/CartHelper";
import Header from "../components/header";
import Footer from "../components/footer";

const CartPage = () => {
    const [products, setProducts] = useState([]);
    const [bill, setBill] = useState(null);
    const navigate = useNavigate();
    const [cart, setCart] = useState(CartHelper.getStoredCart());

    const refreshCart = () => {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        if (localCart.length > 0) {
            axios
                .post("https://qa.api.bsquaresupermart.in/cart", localCart)
                .then((res) => {
                    setProducts(res.data.products);
                    setBill(res.data.bill);
                })
                .catch((err) => console.error(err));
        }
    };

    useEffect(() => {
        refreshCart();
    }, []);

    const handleUpdateQuantity = (productId, change) => {
        setCart(CartHelper.updateQuantity(cart, productId, change));
        refreshCart();
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50">
            <Header />
            <main className="flex-grow px-2 sm:px-6 md:px-12 py-10">
                <h2 className="text-2xl font-bold text-center text-emerald-600 mb-4">
                    🛒 Your Cart
                </h2>
                <div className="max-w-4xl mx-auto space-y-6">
                    {products.map((item, index) => (
                        <motion.div
                            key={item.id}
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
                    ))}

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
                                onClick={() => navigate("/checkout")}
                                className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition-all duration-200 shadow-md hover:scale-[1.02]"
                            >
                                Proceed to Checkout →
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