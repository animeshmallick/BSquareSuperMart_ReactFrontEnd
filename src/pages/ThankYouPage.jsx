import React, { useEffect, useState } from "react";
import {useParams, Link, useNavigate} from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Header from "../components/header";
import Footer from "../components/footer";
import { CheckCircle, Truck, PackageCheck, CreditCard, Clock } from "lucide-react";
import AuthHelper from "../helpers/AuthHelper";

const STATUS_STAGES = [
    "PLACED",
    "CONFIRMED",
    "PACKAGING",
    "READY_TO_SHIP",
    "OUT_FOR_DELIVERY",
    "DELIVERED"
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
                `https://qa.api.bsquaresupermart.in/getPurchaseDoc/${purchaseId}`,
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

    if (loading) return <div className="text-center py-16 text-lg animate-pulse">Loading your order...</div>;
    if (error) return <div className="text-center py-16 text-red-600">{error}</div>;

    const currentStageIndex = STATUS_STAGES.indexOf(purchaseDoc.status);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-lime-50 text-gray-800 flex flex-col">
            <Header isLoggedIn={isLoggedIn}/>
            <main className="flex-grow px-3 py-3 flex justify-center items-start">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-4 sm:p-8 space-y-6"
                >
                    {/* ✅ Success Emoji */}
                    <div className="text-center space-y-2">
                        <motion.div
                            className="text-5xl animate-bounce"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                        >
                            🎉
                        </motion.div>
                        <h1 className="text-2xl font-bold text-green-700">Thank you for your order!</h1>
                        <div className="text-sm text-gray-500">ID: <strong>{purchaseDoc.purchase_id}</strong></div>
                    </div>

                    {/* ✅ Animated Status Tracker */}
                    <div className="flex items-center justify-between relative mt-6 mb-4">
                        {STATUS_STAGES.map((stage, index) => (
                            <div key={stage} className="flex flex-col items-center w-full relative">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold z-10 ${index <= currentStageIndex ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {index + 1}
                                </div>
                                <div className="text-[10px] sm:text-xs text-center mt-1 text-gray-600">{stage.replace(/_/g, " ")}</div>
                                {index !== STATUS_STAGES.length - 1 && (
                                    <div className={`absolute top-3 left-full h-1 w-full border-b ${index < currentStageIndex ? 'border-green-400' : 'border-gray-300'}`}></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ✅ Product List */}
                    <div className="space-y-2">
                        {purchaseDoc.orders.map((order) => (
                            <motion.div
                                key={order.order_id}
                                className="flex items-center gap-4 p-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <img
                                    src={order.product.image_url}
                                    alt={order.product.name}
                                    className="w-14 h-14 object-cover rounded-lg border"
                                />
                                <div className="text-m">
                                    <div className="font-medium">{order.product.name}</div>
                                    <div className="text-m text-gray-500">
                                        {order.quantity} × ₹{order.product.selling_price.toFixed(2)}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* ✅ Delivery Details Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-green-50/70 backdrop-blur-md rounded-2xl p-5 border border-green-200 shadow-md hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center gap-2 mb-2 text-green-800">
                            <Truck size={16} />
                            <span className="font-semibold">Delivery:</span>
                            <span className="text-gray-700">{purchaseDoc.address.address_line_1}, {purchaseDoc.address.address_line_2}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2 text-green-800">
                            <CreditCard size={16} />
                            <span className="font-semibold">Payment:</span>
                            <span className="text-gray-700">{purchaseDoc.payment.payment}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-800">
                            <Clock size={16} />
                            <span className="font-semibold">Placed At:</span>
                            <span className="text-gray-700">{new Date(purchaseDoc.purchased_at).toLocaleString()}</span>
                        </div>
                    </motion.div>

                    {/* ✅ CTA */}
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
