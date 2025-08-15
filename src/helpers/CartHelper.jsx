// src/helpers/CartHelper.js

class CartHelper {
    getStoredCart() {
        const stored = localStorage.getItem("cart");
        return stored ? JSON.parse(stored) : [];
    }
    clearCart(){
        localStorage.removeItem("cart");
    }

    saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    getQuantity(productId) {
        const item = this.getStoredCart().find((p) => p.ProductID === productId);
        return item ? item.Quantity : 0;
    }
    removeProduct(id){
        this.updateQuantity(id, this.getQuantity(id) * -1);
    }

    addToCart(productId) {
        const cart = this.getStoredCart();
        const existing = cart.find((p) => p.ProductID === productId);
        const updatedCart = existing
            ? this.updateQuantity(productId, 1)
            : [...cart, { ProductID: productId, Quantity: 1 }];

        this.saveCart(updatedCart);
        return updatedCart;
    }

    updateQuantity(productId, delta) {
        const updatedCart = this.getStoredCart()
            .map((item) =>
                item.ProductID === productId
                    ? { ...item, Quantity: item.Quantity + delta }
                    : item
            )
            .filter((item) => item.Quantity > 0);

        this.saveCart(updatedCart);
        return updatedCart;
    }

    getTotalItems() {
        return this.getStoredCart().reduce((acc, item) => acc + item.Quantity, 0);
    }

    getTotalPrice = (allProducts, cart) => {
        try {
            if (!Array.isArray(cart) || !Array.isArray(allProducts)) {
                return 0;
            }

            const productMap = new Map(
                allProducts.map(product => [product.id, product])
            );

            const total = cart.reduce((acc, item) => {
                const product = productMap.get(item.ProductID);
                const price = Number(product?.selling_price || 0);
                const quantity = Number(item.Quantity || 0);
                return acc + (price * quantity);
            }, 0);

            return parseFloat(total.toFixed(2));
        } catch (err) {
            console.error("Error calculating total price:", err);
            return 0;
        }
    };
}

export default new CartHelper();
