import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CartHelper from "../../helpers/CartHelper";
import ProductQuantityContainer from "../ProductQuantityContainer";
import { Clock } from "lucide-react"; // Using Lucide for clock icon (optional)

const ProductContainer = ({ product }) => {
    const navigate = useNavigate();
    const discount = Math.round(
        ((product.productMrp - product.productPrice) / product.productMrp) * 100
    );
    const quantity = CartHelper.getQuantity(product.productId);
    const inStock = product.productInventory > 0;

    const goToProductPage = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <motion.div
            key={product.productId}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={inStock ? { scale: 1.03, boxShadow: "0 6px 20px rgba(0,0,0,0.1)" } : {}}
            className={`relative bg-white rounded-2xl shadow-md p-3 transition-all duration-300 group overflow-hidden ${
                !inStock ? "opacity-60 cursor-not-allowed" : "hover:shadow-lg"
            }`}
        >
            {/* Discount badge */}
            {discount > 0 && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-[11px] font-bold py-0.5 px-1.5 rounded-md shadow-sm z-10 animate-pulse">
                    {discount}% OFF
                </div>
            )}

            {/* Out of stock */}
            {!inStock && (
                <div className="absolute top-2 right-2 bg-red-600 text-white text-[11px] font-bold py-0.5 px-1.5 rounded-md shadow-sm z-10">
                    OUT OF STOCK
                </div>
            )}

            {/* Product Image and Details */}
            <div onClick={() => inStock && goToProductPage(product.productId)} className="cursor-pointer">
                <motion.img
                    src={product.productImg}
                    alt={product.productName}
                    className={`h-32 w-full object-contain mb-3 transition-transform duration-300 ${
                        inStock ? "group-hover:scale-105" : ""
                    }`}
                    whileHover={{ scale: 1.08 }}
                />
                <div className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                    {product.productName}
                </div>
                <div className="text-xs text-gray-500 mb-2">{product.productSize}</div>
            </div>

            {/* Pricing */}
            <div className="flex items-center space-x-2 mb-1">
                <span className="text-emerald-600 font-bold text-sm">
                    ₹{product.productPrice}
                </span>
                {discount > 0 && (
                    <span className="text-xs line-through text-gray-400">
                        ₹{product.productMrp}
                    </span>
                )}
            </div>

            {/* Quantity / Add */}
            {inStock ? (
                <ProductQuantityContainer productId={product.productId} />
            ) : (
                <div className="mt-2 text-xs text-red-500 font-semibold">
                    Currently unavailable
                </div>
            )}
        </motion.div>
    );
};

export default ProductContainer;
