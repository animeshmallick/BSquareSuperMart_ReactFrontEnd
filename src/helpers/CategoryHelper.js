class CategoryHelper {
    filterProductsByCategory = (allProducts, categoryName) => {
        const filteredProducts = allProducts.filter(product => product.category === categoryName);

        const result = {};

        filteredProducts.forEach(product => {
            const {
                id,
                name,
                subcategory,
                size,
                selling_price,
                mrp,
                image_url,
                stock
            } = product;

            if (!result[subcategory]) {
                result[subcategory] = [];
            }

            result[subcategory].push({
                productId: id,
                productName: name,
                productSize: size,
                productPrice: selling_price,
                productMrp: mrp,
                productImg: image_url,
                productInventory: stock
            });
        });

        return result;
    };
}
export default new CategoryHelper();