const CACHE_KEY = "allProducts";
const CACHE_TIMESTAMP_KEY = `${CACHE_KEY}_timestamp`;
const CACHE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

const ProductHelper = {
    getCachedProducts() {
        try {
            const cached = sessionStorage.getItem(CACHE_KEY);
            const timestamp = sessionStorage.getItem(CACHE_TIMESTAMP_KEY);

            if (!cached || !timestamp) return null;

            const now = Date.now();
            if (now - parseInt(timestamp, 10) > CACHE_EXPIRY_MS) {
                ProductHelper.clearCache();
                return null;
            }

            return JSON.parse(cached);
        } catch (err) {
            console.error("Error reading cached products:", err);
            ProductHelper.clearCache();
            return null;
        }
    },

    setCachedProducts(data) {
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
            sessionStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        } catch (err) {
            console.error("Error saving products to cache:", err);
        }
    },

    clearCache() {
        sessionStorage.removeItem(CACHE_KEY);
        sessionStorage.removeItem(CACHE_TIMESTAMP_KEY);
    },

    async fetchAllProducts() {
        try {
            const res = await fetch(`https://api.qa.bsquaresupermart.in/getAllProducts`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (!Array.isArray(data)) throw new Error("Invalid product data");
            ProductHelper.setCachedProducts(data);
            return data;
        } catch (err) {
            console.error("Failed to fetch all products:", err);
            return null;
        }
    },

    /**
     * Public method to get all products (cached or fetched)
     * @returns {Promise<Array|null>}
     */
    async getAllProducts() {
        const cached = ProductHelper.getCachedProducts();
        if (cached) return cached;

        // Fetch and cache if not found
        return await ProductHelper.fetchAllProducts();
    }
};

export default ProductHelper;
