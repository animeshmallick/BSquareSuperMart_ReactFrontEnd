import React, { useEffect, useState } from "react";
import axios from "axios";

import Header from "../components/header";
import Footer from "../components/footer";
import CartFooter from "../components/CartFooter";
import CategoryHolder from "../components/CategoryHolder";
import LoadingSkeleton from "../components/Loading/LoadingSkeleton";
import PageTitle from "../components/PageTitle";

const CategoriesPage = () => {
    const [categoriesData, setCategoriesData] = useState({});
    const [loading, setLoading] = useState(true);
    const fetchCategories = async () => {
        try {
            const [categoriesRes] = await Promise.all([
                axios.get(`https://api.qa.bsquaresupermart.in/categories`)
            ]);
            setCategoriesData(categoriesRes.data || {});
        } catch (err) {
            console.error("Error fetching categories:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Preload category images
    useEffect(() => {
        Object.values(categoriesData).flat().forEach((sub) => {
            const img = new Image();
            img.src = `https://cdn.bsquaresupermart.in/images/categories/${encodeURIComponent(sub.image)}`;
        });
    }, [categoriesData]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow p-4 md:p-10 bg-gradient-to-b from-lime-50 via-green-50 to-white">
                <PageTitle title={"Explore Product Categories"} />
                {loading ? (
                    <LoadingSkeleton count={6} variant={"card"} />
                ) : (
                    Object.entries(categoriesData).map(([mainCategory, subCategories]) => (
                        <CategoryHolder
                            key={mainCategory}
                            mainCategory={mainCategory}
                            subCategories={subCategories}
                        />
                    ))
                )}
            </main>
            <CartFooter />
            <Footer />
        </div>
    );
};

export default CategoriesPage;
