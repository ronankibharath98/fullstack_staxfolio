import { useDispatch, useSelector } from "react-redux";
import { STACK_API_END_POINT } from "@/lib/constant";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { setAllProducts } from "@/redux/productSlice";

const useGetAllProducts = () => {
    const dispatch = useDispatch();
    const { allProducts } = useSelector((store: RootState) => store.product);
    const [ error, setError ] = useState<string | null>(null)

    useEffect( () => {
        const fetchAllProducts = async() => {
            try {
                const response = await axios.get(`${STACK_API_END_POINT}/getProducts`, {
                    withCredentials: true,
                });
                if(response.data.success){
                    dispatch(setAllProducts(response.data.products));
                }
            } catch (error: any) {
                setError(error.response?.data?.message || "An error occured")
            }
        }
        fetchAllProducts();
    }, [dispatch])
    return { allProducts, error };
}

export default useGetAllProducts;