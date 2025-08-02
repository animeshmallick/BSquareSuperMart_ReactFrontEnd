// src/helpers/CartHelper.js
import ProductHelper from "./ProductHelper";

class CartHelper {
    getStoredCart() {
        const stored = localStorage.getItem("cart");
        return stored ? JSON.parse(stored) : [];
    }

    saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    getQuantity(cart, productId) {
        const item = cart.find((p) => p.ProductID === productId);
        return item ? item.Quantity : 0;
    }

    addToCart(cart, productId) {
        const existing = cart.find((p) => p.ProductID === productId);
        const updatedCart = existing
            ? this.updateQuantity(cart, productId, 1)
            : [...cart, { ProductID: productId, Quantity: 1 }];

        this.saveCart(updatedCart);
        return updatedCart;
    }

    updateQuantity(cart, productId, delta) {
        const updatedCart = cart
            .map((item) =>
                item.ProductID === productId
                    ? { ...item, Quantity: item.Quantity + delta }
                    : item
            )
            .filter((item) => item.Quantity > 0);

        this.saveCart(updatedCart);
        return updatedCart;
    }

    getTotalItems(cart) {
        return cart.reduce((acc, item) => acc + item.Quantity, 0);
    }

    async getTotalPrice() {
        try {
            const allProducts = await ProductHelper.getAllProducts();
            const cart = this.getStoredCart();

            if (!Array.isArray(cart) || !Array.isArray(allProducts)) return 0;

            const productMap = new Map();
            for (const product of allProducts) {
                if (product?.id != null) {
                    productMap.set(product.id, product);
                }
            }
            let total = 0;
            for (const item of cart) {
                const product = productMap.get(item.ProductID);
                const price = Number(product?.selling_price || 0);
                const quantity = Number(item.Quantity || 0);
                total += price * quantity;
            }

            return total;
        } catch (err) {
            console.error("Error calculating total price:", err);
            return 0;
        }
    }
}

export default new CartHelper();
