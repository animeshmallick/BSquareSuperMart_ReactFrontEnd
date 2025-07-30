import React from 'react';

const SPC = ({ address, payment, onBack }) => {
    return (
        <div className="pl-5 pr-5">
            <h2 className="text-2xl font-semibold mb-4">🧾 Review & Confirm</h2>
            <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
                <div>
                    <h3 className="text-lg font-semibold">📍 Address</h3>
                    <p>{address?.addr_line1}, {address?.addr_line2}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">💳 Payment</h3>
                    <p>{payment?.name}</p>
                </div>
            </div>

            <div className="mt-6 flex justify-between">
                <button onClick={onBack} className="text-gray-600 hover:text-black">← Back</button>
                <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg shadow-lg transition">
                    ✅ Place Order
                </button>
            </div>
        </div>
    );
};

export default SPC;
