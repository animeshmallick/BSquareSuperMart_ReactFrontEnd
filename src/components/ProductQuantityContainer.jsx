import CartHelper from "../helpers/CartHelper";
import {useState} from "react";

const ProductQuantityContainer = ({productId, quantity}) => {
    const [productQuantity, setProductQuantity] = useState(quantity);
    return (
        productQuantity === 0 ? (
            <button
                onClick={() => {
                    CartHelper.addToCart(productId);
                    setProductQuantity(productQuantity + 1);
                }}
                className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg font-medium transition-all mt-2"
            >
                ADD
            </button>
        ) : (
            <div className="flex items-center space-x-2 mt-2">
                <button
                    onClick={() => {
                        CartHelper.updateQuantity(productId, -1);
                        setProductQuantity(productQuantity - 1);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 text-sm font-bold"
                >
                    −
                </button>
                <span className="text-gray-800 font-semibold text-sm">{productQuantity}</span>
                <button
                    onClick={() => {
                        CartHelper.updateQuantity(productId, 1);
                        setProductQuantity(productQuantity + 1);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full w-7 h-7 text-sm font-bold"
                >
                    +
                </button>
            </div>
        )
    )
}
export default ProductQuantityContainer;