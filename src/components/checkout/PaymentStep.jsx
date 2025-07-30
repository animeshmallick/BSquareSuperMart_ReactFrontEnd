import React from 'react';
import { Fade } from 'react-awesome-reveal';

const PaymentSelector = ({ methods, selected, onSelect, onNext, onBack }) => {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">💳 Select Payment Method</h2>
            <Fade cascade>
                <div className="grid gap-4">
                    {methods.map((method) => (
                        <div
                            key={method.id}
                            onClick={() => onSelect(method)}
                            className={`p-4 rounded-xl border shadow-sm cursor-pointer transition-all duration-200 ${
                                selected?.id === method.id
                                    ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            <p>{method.name}</p>
                        </div>
                    ))}
                </div>
            </Fade>

            <div className="mt-6 flex justify-between">
                <button onClick={onBack} className="text-gray-600 hover:text-black">← Back</button>
                <button
                    onClick={onNext}
                    disabled={!selected}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg shadow-lg transition"
                >
                    Next →
                </button>
            </div>
        </div>
    );
};

export default PaymentSelector;
