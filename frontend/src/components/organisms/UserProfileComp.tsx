import axios from "axios";
import { RootState } from "@/redux/store";
import { setLoading } from "@/redux/authSlice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { USER_API_END_POINT } from "@/lib/constant";
import { ProfileCard } from "../molecules/ProfileCard";

type UserProfile = {
    email: string;
    name?: string,
    firstName?: string,
    lastName?: string,
    role: string;
};

export const UserProfileComp = () => {
    const { loading, user, role } = useSelector((store: RootState) => store.auth)
    const [userData, setUserData] = useState<UserProfile | null>(null);
    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${USER_API_END_POINT}/profile`, {
                    withCredentials: true
                })
                setUserData(response.data.user);
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchProfileData()
    }, [])
    return (
        <>
            {user && role == "user" ? (
                <div className="px-20  lg:px-40 pt-10  h-screen w-full grid grid-cols-1 lg:grid-cols-3 space-x-5">
                    <div className="flex flex-col col-span-2 space-y-5 w-full h-auto">                        
                        <div>
                            <ProfileCard userName={userData?.firstName} profileData={userData}/>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    User profile loading...
                </div>
            )
            }
        </>
    )
}