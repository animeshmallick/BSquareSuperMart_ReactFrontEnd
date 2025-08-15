import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/header";
import Footer from "../components/footer";
import { motion } from "framer-motion";
import { Fade } from "react-awesome-reveal";
import CartFooter from "../components/CartFooter";
import CartHelper from "../helpers/CartHelper";
import Sidebar from "../components/Category/Sidebar";
import ProductContainer from "../components/Category/ProductContainer";
import LoadingSkeleton from "../components/Loading/LoadingSkeleton";
import PageTitle from "../components/PageTitle";
import {useProducts} from "../hooks/useProducts";
import CategoryHelper from "../helpers/CategoryHelper";

const CategoryPage = () => {
    const { categoryName } = useParams();

    const { data: allProducts, isLoading, error } = useProducts();

    const [categoryData, setCategoryData] = useState({});
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [loading, setLoading] = useState(isLoading);

    useEffect(() => {
        if(allProducts){
            const categories = CategoryHelper.filterProductsByCategory(allProducts, categoryName);
            setCategoryData(categories);
            setSelectedSubCategory(Object.keys(categories)[0]);
            setLoading(false);
        }
    }, [allProducts, categoryName]);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50">
            <Header />
            <main className="flex-grow px-2 sm:px-6 md:px-12 py-3">
                <PageTitle title={`All ${categoryName} Products`} size={"small"}/>
                {loading ? (<LoadingSkeleton />) : (
                    <div className="grid grid-cols-[20%_75%] gap-4 sm:gap-6">
                        <Sidebar
                            subCategories={Object.keys(categoryData)}
                            selected={selectedSubCategory}
                            onSelect={setSelectedSubCategory}
                        />

                        <div>
                            <Fade direction="up" cascade damping={0.1} triggerOnce>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-l-4 border-emerald-500 pl-4">
                                    {selectedSubCategory}
                                </h2>
                            </Fade>

                            <motion.div
                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8 }}
                            >
                                {categoryData[selectedSubCategory]?.map((product) => (
                                    <ProductContainer product={product} />
                                ))}
                            </motion.div>
                        </div>
                    </div>
                )}
            </main>

            <CartFooter />
            <Footer />
        </div>
    );
};

export default CategoryPage;
