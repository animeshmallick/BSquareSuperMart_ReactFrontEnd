import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Header from "../components/header";
import Footer from "../components/footer";
import {
    CheckCircle,
    Truck,
    PackageCheck,
    CreditCard,
    Clock,
    ShoppingBag,
    Box,
    Bike,
    Home
} from "lucide-react";
import AuthHelper from "../helpers/AuthHelper";

const STATUS_STAGES = [
    { key: "PLACED", icon: ShoppingBag, label: "Placed" },
    { key: "CONFIRMED", icon: CheckCircle, label: "Confirmed" },
    { key: "PACKAGING", icon: Box, label: "Packaging" },
    { key: "READY_TO_SHIP", icon: PackageCheck, label: "Ready" },
    { key: "OUT_FOR_DELIVERY", icon: Bike, label: "On the way" },
    { key: "DELIVERED", icon: Home, label: "Delivered" }
];

const ThankYou = () => {
    const { purchaseId } = useParams();
    const [purchaseDoc, setPurchaseDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const fetchPurchaseDoc = async () => {
        try {
            const token = sessionStorage.getItem("authToken");
            const response = await axios.get(
                `https://api.qa.bsquaresupermart.in/getPurchaseDoc/${purchaseId}`,
                {
                    headers: {
                        accept: "application/json",
                        "x-authorization": `Bearer ${token}`,
                    },
                }
            );
            setPurchaseDoc(response.data);
        } catch (err) {
            setError("Unable to load your order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const validate = async () => {
            const loggedIn = await AuthHelper.isLoggedIn();
            setIsLoggedIn(loggedIn);
            if (!loggedIn) navigate("/login?source=cart");
        };
        validate();
        fetchPurchaseDoc();
        const interval = setInterval(fetchPurchaseDoc, 15000);
        return () => clearInterval(interval);
    }, [purchaseId]);

    if (loading)
        return (
            <div className="text-center py-16 text-lg animate-pulse">
                Loading your order...
            </div>
        );
    if (error)
        return <div className="text-center py-16 text-red-600">{error}</div>;

    const currentStageIndex = STATUS_STAGES.findIndex(
        (s) => s.key === purchaseDoc.status
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-lime-100 via-white to-lime-50 flex flex-col">
            <Header />
            <main className="flex-grow px-3 py-3 flex justify-center items-start">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-3xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-2 sm:p-8 space-y-4"
                >
                    {/* 🎉 Success Animation */}
                    <div className="text-center space-y-2">
                        <motion.div
                            className="text-6xl"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 1.2 }}
                        >
                            🎉
                        </motion.div>
                        <h1 className="text-2xl font-bold text-green-700">
                            Thank you for your order!
                        </h1>
                        <div className="text-sm text-gray-500">
                            Order ID: <strong>{purchaseDoc.purchase_id}</strong>
                        </div>
                    </div>

                    {/* 🚚 Blinkit-style Progress Tracker */}
                    <div className="relative w-full pt-8">
                        <div className="flex justify-between relative z-10">
                            {STATUS_STAGES.map((stage, index) => {
                                const Icon = stage.icon;
                                return (
                                    <motion.div
                                        key={stage.key}
                                        className="flex flex-col items-center"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div
                                            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                                                index <= currentStageIndex
                                                    ? "bg-green-500 border-green-500 text-white"
                                                    : "bg-white border-gray-300 text-gray-400"
                                            }`}
                                        >
                                            <Icon size={18} />
                                        </div>
                                        <span className="text-[10px] mt-1 text-gray-600">
                      {stage.label}
                    </span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 🛒 Product List (Horizontal Scroll like Blinkit) */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
                        <AnimatePresence>
                            {purchaseDoc.orders.map((order, i) => (
                                <motion.div
                                    key={order.order_id}
                                    className="bg-white border border-gray-200 rounded-xl shadow-sm p-1 flex flex-col items-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div>
                                        <div className="flex justify-between">
                                            <div>
                                                <img
                                                    src={order.product.image_url}
                                                    alt={order.product.name}
                                                    className="w-10 h-10 object-cover rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                x <span className="text-xl font-semibold">{order.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-center">
                                            <div className="font-medium text-sm">
                                                {order.product.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {order.quantity} × ₹{order.product.selling_price}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* 📦 Delivery Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50/70 rounded-2xl p-2 border border-green-200 shadow-md"
                    >
                        <div className="flex items-center gap-2 mb-2 text-green-800">
                            <Truck size={16} />
                            <span className="font-semibold">Delivery:</span>
                            <span className="text-gray-700">
                {purchaseDoc.address.address_line_1},{" "}
                                {purchaseDoc.address.address_line_2}
              </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2 text-green-800">
                            <CreditCard size={16} />
                            <span className="font-semibold">Payment:</span>
                            <span className="text-gray-700">
                {purchaseDoc.payment.payment}
              </span>
                        </div>
                        <div className="flex items-center gap-2 text-green-800">
                            <Clock size={16} />
                            <span className="font-semibold">Placed At:</span>
                            <span className="text-gray-700">
                {new Date(purchaseDoc.purchased_at).toLocaleString()}
              </span>
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <div className="text-center pt-4">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-full transition-all shadow-md"
                        >
                            <PackageCheck size={16} />
                            Continue Shopping
                        </Link>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default ThankYou;
