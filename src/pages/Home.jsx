import React from "react";

import Header from "../components/header";
import Footer from "../components/footer";
import CartFooter from "../components/CartFooter";
import CategoryHolder from "../components/CategoryHolder";
import LoadingSkeleton from "../components/Loading/LoadingSkeleton";
import PageTitle from "../components/PageTitle";
import {useProducts} from "../hooks/useProducts";
import {getAllCategories} from "../helpers/HomePageHelper";

const CategoriesPage = () => {
    const {data, isLoading, error} = useProducts();
    const categoriesData = getAllCategories(data);
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow p-4 md:p-10 bg-gradient-to-b from-lime-50 via-green-50 to-white">
                <PageTitle title={"Explore Product Categories"} />
                {isLoading ? (
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
