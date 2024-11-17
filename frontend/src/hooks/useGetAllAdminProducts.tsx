import { useDispatch, useSelector } from "react-redux";
import { ADMIN_API_END_POINT } from "@/lib/constant";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { setAllAdminProducts } from "@/redux/productSlice";
import { setLoading } from "@/redux/authSlice";

const useGetAllAdminProducts = () => {
    const dispatch = useDispatch();
    const { allAdminProducts } = useSelector((store: RootState) => store.product);
    const { loading } = useSelector((store: RootState) => store.auth);
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchAllAdminProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${ADMIN_API_END_POINT}/getMyProducts`, {
                    withCredentials: true,
                });
                if (response.data.success) {
                    dispatch(setAllAdminProducts(response.data.adminProducts));
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data?.message || "An error occurred");
                    dispatch(setAllAdminProducts(null));
                } else {
                    setError("An unexpected error occurred");
                    dispatch(setAllAdminProducts(null));
                }
            } finally {
                setLoading(false); // Stop loading
              }
        };
        fetchAllAdminProducts();

        return () => {
            setError(null);
          };

        }, [dispatch])
    return { allAdminProducts, error, loading };
}

export default useGetAllAdminProducts;