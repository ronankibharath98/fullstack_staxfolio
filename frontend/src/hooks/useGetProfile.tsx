import { ADMIN_API_END_POINT, USER_API_END_POINT } from "@/lib/constant"
import { setLoading, setUser } from "@/redux/authSlice"
import { RootState } from "@/redux/store"
import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const useGetProfile = () => {
    const dispatch = useDispatch();
    const { loading, role } = useSelector((store: RootState) => store.auth);
    const [ error, setError ] = useState<String | null>(null);

    useEffect(() => {
        const getProfile = async() => {
            dispatch(setLoading(true));
            
            try {
                let endpoint = role === "admin" ? `${ADMIN_API_END_POINT}/profile` : `${USER_API_END_POINT}/profile`;
                const response = await axios.get(endpoint, { withCredentials: true });                
                dispatch(setUser(response.data.user));
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data?.message || "An error occurred");
                } else {
                    setError("An unexpected error occurred");
                }
            } finally {
                dispatch(setLoading(false));
            }
        }
        if(role) getProfile();   
    },[role, dispatch])
    return {loading, error}
}

export default useGetProfile;