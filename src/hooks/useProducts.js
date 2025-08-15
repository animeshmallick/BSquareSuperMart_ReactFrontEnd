import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../api/getProducts";

export function useProducts() {
    return useQuery({
        queryKey: ["products"],
        queryFn: getAllProducts,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}
