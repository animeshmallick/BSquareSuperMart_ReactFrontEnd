import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import AuthHelper from "../helpers/AuthHelper";
import {useNavigate} from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";

const MyOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const validate = async () => {
            const loggedIn = await AuthHelper.isLoggedIn();
            setIsLoggedIn(loggedIn);
            if (!loggedIn) navigate("/login?source=orders");
        };
        validate();
        AOS.init({ duration: 800 });
        const token = AuthHelper.getToken();
        axios.get("https://api.qa.bsquaresupermart.in/getUserPurchases", {
                headers: {
                    "x-authorization": `Bearer ${token}`,
                    Accept: "application/json",
                },
            })
            .then((res) => setOrders(res.data))
            .catch((err) => console.error("Failed to fetch orders:", err));
    }, []);

    const statusColor = (status) => {
        if (status.includes("DELIVERED")) return "bg-green-100 text-green-700";
        if (status.includes("PLACED")) return "bg-yellow-100 text-yellow-700";
        return "bg-gray-100 text-gray-700";
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 via-white to-emerald-50">
            <Header isLoggedIn={isLoggedIn}/>
            <main className="flex-grow px-3 py-3 justify-center items-start">
                <h1 className="text-3xl font-bold text-center text-indigo-700 mb-5">
                    🧾 My Orders
                </h1>

                {orders.length === 0 ? (
                    <motion.div
                        className="text-center text-gray-600 text-lg mt-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p>No orders found.</p>
                    </motion.div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {orders.map((order, idx) => (
                            <motion.div
                                key={order.purchase_id}
                                className="bg-white rounded-xl shadow-md p-3 border hover:shadow-lg transition"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                data-aos="fade-up"
                                onTap={() => navigate(`/thankyou/${order.purchase_id}`)}
                            >
                                <div className="mb-1 flex justify-between">
                                    <p className="font-semibold text-gray-500">Order ID : </p>
                                    <p className="font-semibold text-indigo-700">
                                        {order.purchase_id}
                                    </p>
                                </div>

                                <div className="mb-2 flex justify-between items-center">
                                    <p className="text-sm text-gray-500">Status</p>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                                            order.status
                                        )}`}
                                    >
                      {order.status.replace(/_/g, " ")}
                    </span>
                                </div>

                                <div className="mb-1 flex justify-between">
                                    <p className="text-sm text-gray-500">Placed On</p>
                                    <p className="text-gray-700">
                                        {new Date(order.placed_on).toLocaleString()}
                                    </p>
                                </div>

                                <div className="mb-1 flex justify-between">
                                    <p className="text-sm text-gray-500">Total Quantity</p>
                                    <p className="text-gray-700">{order.total_quantity}</p>
                                </div>

                                <div className="mb-1 flex justify-between">
                                    <p className="text-sm text-gray-500">Payment</p>
                                    <p className="text-gray-700">
                                        {order.payment?.payment || "N/A"}
                                    </p>
                                </div>

                                <div className="mb-1 flex justify-between">
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="text-gray-700">
                                        {order.address?.address_line1}, {order.address?.address_line2}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default MyOrders;
