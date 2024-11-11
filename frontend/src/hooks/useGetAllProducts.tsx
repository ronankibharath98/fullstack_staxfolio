import { useDispatch, useSelector } from "react-redux";
import { STACK_API_END_POINT } from "@/lib/constant";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { setAllProducts } from "@/redux/productSlice";
import { setLoading } from "@/redux/authSlice";

const useGetAllProducts = () => {
    const dispatch = useDispatch();
    const { allProducts } = useSelector((store: RootState) => store.product);
    const { loading } = useSelector((store: RootState) => store.auth);
    const [ error, setError ] = useState<string | null>(null)

    useEffect( () => {
        const fetchAllProducts = async() => {
            setLoading(true)
            try {
                const response = await axios.get(`${STACK_API_END_POINT}/getProducts`, {
                    withCredentials: true,
                });
                if(response.data.success){
                    dispatch(setAllProducts(response.data.products));
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data?.message || "An error occurred");
                } else {
                    setError("An unexpected error occurred");
                }
            } finally{
                setLoading(false)
            }
        };
        fetchAllProducts();
        return () => {
            setError(null);
        }
    }, [dispatch])
    return { allProducts, error, loading };
}

export default useGetAllProducts;