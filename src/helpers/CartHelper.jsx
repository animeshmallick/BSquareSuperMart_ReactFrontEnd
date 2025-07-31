// src/helpers/CartHelper.js

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
        const updatedCart = cart.map((item) =>
            item.ProductID === productId
                ? { ...item, Quantity: item.Quantity + delta }
                : item
        ).filter((item) => item.Quantity > 0);

        this.saveCart(updatedCart);
        return updatedCart;
    }

    getTotalItems(cart) {
        return cart.reduce((acc, item) => acc + item.Quantity, 0);
    }

    getTotalPrice(cart, allProducts) {
        try {
            return cart.reduce((acc, item) => {
                const product = allProducts.find(p => p.id === item.ProductID);
                return acc + (product?.selling_price || 0) * item.Quantity;
            }, 0);
        }catch (err){
            return "---"
        }
    }

}
export default new CartHelper();