import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CartHelper from "../../helpers/CartHelper";
import {useNavigate} from "react-router-dom";

const CartSummary = ({ products = [], bill = {}, onUpdate, showBillFlag = false }) => {
    const navigate = useNavigate();
    const [showBill, setShowBill] = useState(showBillFlag);


    if (!products.length || !bill) return null;

    const handleRemove = (id) => {
        const filtered = products.filter(p => p.id !== id);
        onUpdate(filtered);
    };

    return (
        <motion.div
            className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Cart Header */}
            <motion.div
                className="bg-emerald-100/40 py-1 px-6 border-b border-emerald-400/30"
                initial={{ backgroundColor: "#f0fdf4" }}
                animate={{ backgroundColor: "#e1fbee" }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-lg font-bold text-emerald-800">
                    🛒 Your Cart has {products.length} item{products.length > 1 && 's'}
                </h2>
            </motion.div>

            {/* Product List */}
            <div className="p-1 space-y-2">
                <AnimatePresence>
                    {products.map(item => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="grid grid-cols-12 items-center gap-3 p-1 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                        >
                                {/* Image (1/4) */}
                                <motion.img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="col-span-2 w-16 h-16 object-contain rounded-lg"
                                    whileHover={{ scale: 1.08, rotate: 1 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    onTap={() => navigate(`/product/${item.id}`)}
                                />

                                {/* Details (2/4) */}
                                <div className="col-span-7" onClick={() => navigate(`/product/${item.id}`)}>
                                    <div className="font-semibold text-base text-gray-800">{item.name}</div>
                                    <div className="text-sm text-gray-500">{item.brand} • {item.size}</div>
                                </div>

                            {/* Actions (1/4) */}
                            <div className="col-span-3 flex flex-col justify-between h-full mb-2">
                                {/* Quantity Control */}
                                <div className="flex items-center justify-center gap-1">
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => {
                                            CartHelper.updateQuantity(item.id, -1);
                                            onUpdate()
                                        }}
                                        className="bg-gray-200 hover:bg-gray-300 active:scale-95 rounded-lg px-2 py-1 text-lg shadow-inner"
                                    >
                                        −
                                    </motion.button>
                                    <span className="min-w-[24px] text-center font-medium">{item.quantity}</span>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => {
                                            CartHelper.updateQuantity(item.id, 1);
                                            onUpdate()
                                        }}
                                        className="bg-gray-200 hover:bg-gray-300 active:scale-95 rounded-lg px-2 py-1 text-lg shadow-inner"
                                    >
                                        +
                                    </motion.button>
                                </div>

                                {/* Remove Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleRemove(item.id)}
                                    className="text-xs text-red-500 hover:underline text-center transition-colors duration-200"
                                >
                                    Remove
                                </motion.button>

                                {/* Amount */}
                                <div className="text-green-600 font-bold text-base text-center">
                                    ₹{(item.selling_price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        </motion.div>

                    ))}
                </AnimatePresence>
            </div>

            {/* Toggle Charges & Total */}
            <div className="border-t px-4 py-2 bg-gray-50 flex justify-between items-center">
                <button
                    onClick={() => setShowBill(!showBill)}
                    className="flex items-center gap-2 text-sm text-emerald-700 hover:underline"
                >
                    {showBill ? "Hide Charges" : "Show Charges"}
                    <motion.div animate={{ rotate: showBill ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        {showBill ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </motion.div>
                </button>

                <div className="text-lg font-bold text-gray-900">
                    Total: ₹{bill.total_bill.toFixed(2)}
                </div>
            </div>

            {/* Bill Details */}
            <AnimatePresence>
                {showBill && (
                    <motion.div
                        key="charges"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="px-6 py-1 overflow-hidden bg-white text-sm text-gray-700 mb-1"
                    >
                        <div className="space-y-1">
                            <div className="flex justify-between"><span>Cart Items Total</span><span>₹{bill.cart_items_total.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Delivery Fee</span><span>₹{bill.delivery_fee.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Packaging Fee</span><span>₹{bill.packaging_fee.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Platform Fee</span><span>₹{bill.platform_fee.toFixed(2)}</span></div>
                            {bill.small_cart_fee > 0 && (
                                <div className="flex justify-between"><span>Small Cart Fee</span><span>₹{bill.small_cart_fee.toFixed(2)}</span></div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CartSummary;
