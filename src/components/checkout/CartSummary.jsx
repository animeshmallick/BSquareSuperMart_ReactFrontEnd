import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CartSummary = ({ products = [], bill, onUpdate }) => {
    const [showBill, setShowBill] = useState(false); // collapsed by default

    if (!products.length || !bill) return null;

    const handleQuantityChange = (id, delta) => {
        const updated = products.map(p =>
            p.id === id
                ? { ...p, quantity: Math.max(1, p.quantity + delta) }
                : p
        );
        onUpdate(updated);
    };

    const handleRemove = (id) => {
        const filtered = products.filter(p => p.id !== id);
        onUpdate(filtered);
    };

    return (
        <motion.div
            className="max-w-3xl m-3 px-4 py-3 mt-4 bg-white shadow-lg rounded-2xl border border-green-500"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">🛒 Your Cart</h2>

            <div className="space-y-5">
                <AnimatePresence>
                    {products.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="flex justify-between items-center gap-3 border-b pb-4"
                        >
                            <div className="flex-1">
                                <div className="font-medium text-lg">{item.name}</div>
                                <div className="text-sm text-gray-500">{item.brand} • {item.size}</div>
                            </div>
                            <div className="flex items-center gap-3 mt-2 my-2">
                                <button
                                    onClick={() => handleQuantityChange(item.id, -1)}
                                    className="bg-gray-200 hover:bg-gray-300 rounded px-2 text-lg"
                                >−</button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(item.id, 1)}
                                    className="bg-gray-200 hover:bg-gray-300 rounded px-2 text-lg"
                                >+</button>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <span className="text-green-600 font-semibold text-lg">
                                    ₹{(item.selling_price * item.quantity).toFixed(2)}
                                </span>
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="mt-1 text-sm text-red-500 hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Toggle Button */}
            <div className="flex justify-between items-center border-t pt-2">
                <button
                    onClick={() => setShowBill(!showBill)}
                    className="flex items-center gap-2 text-emerald-700 font-medium text-sm hover:underline transition"
                >
                    {showBill ? "Hide Charges" : "Show Charges"}
                    <motion.div
                        animate={{ rotate: showBill ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {showBill ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </motion.div>
                </button>

                {/* Always show Total Bill */}
                <div className="text-lg font-bold text-gray-900">
                    Total: ₹{bill.total_bill.toFixed(2)}
                </div>
            </div>

            {/* Collapsible Charges */}
            <AnimatePresence>
                {showBill && (
                    <motion.div
                        key="charges"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="overflow-hidden mt-3"
                    >
                        <div className="space-y-1 text-sm text-gray-700">
                            <div className="flex justify-between">
                                <span>Cart Items Total</span>
                                <span>₹{bill.cart_items_total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span>₹{bill.delivery_fee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Packaging Fee</span>
                                <span>₹{bill.packaging_fee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Platform Fee</span>
                                <span>₹{bill.platform_fee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Small Cart Fee</span>
                                <span>₹{bill.small_cart_fee.toFixed(2)}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CartSummary;
