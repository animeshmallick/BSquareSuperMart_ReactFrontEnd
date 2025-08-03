import { motion } from "framer-motion";
import CartHelper from "../../helpers/CartHelper";
import {useNavigate} from "react-router-dom";
import ProductQuantityContainer from "../ProductQuantityContainer";
const ProductContainer = ({product}) => {
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
            className={`relative bg-white rounded-2xl shadow-md ${
                !inStock ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"
            } p-3 transition-all duration-300 group`}
            whileHover={inStock ? { scale: 1.03 } : {}}
        >
            {discount > 0 && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-[11px] font-bold py-0.5 px-1.5 rounded-md shadow-sm z-10">
                    {discount}% OFF
                </div>
            )}

            {!inStock && (
                <div className="absolute top-2 right-2 bg-red-600 text-white text-[11px] font-bold py-0.5 px-1.5 rounded-md shadow-sm z-10">
                    OUT OF STOCK
                </div>
            )}

            <div onClick={() => inStock && goToProductPage(product.productId)} className="cursor-pointer">
                <img
                    src={product.productImg}
                    alt={product.productName}
                    className={`h-22 w-full object-contain mb-3 transition-transform duration-300 ${
                        inStock ? "group-hover:scale-105" : ""
                    }`}
                />
                <div className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                    {product.productName}
                </div>
                <div className="text-xs text-gray-500 mb-2">{product.productSize}</div>
            </div>

            <div>
                <div className="flex space-x-2 items-center">
                        <span className="text-emerald-600 font-bold text-sm">
                          ₹{product.productPrice}
                        </span>
                    {discount > 0 && (
                        <span className="text-xs line-through text-gray-400">
                            ₹{product.productMrp}
                          </span>
                    )}
                </div>

                {inStock ? (
                    <ProductQuantityContainer productId={product.productId} quantity={quantity} />
                ) : (
                    <div className="mt-2 text-xs text-red-500 font-semibold">
                        Currently unavailable
                    </div>
                )}
            </div>
        </motion.div>
    );
}
export default ProductContainer;