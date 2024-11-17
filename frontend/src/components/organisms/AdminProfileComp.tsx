import axios from "axios";
import { RootState } from "@/redux/store";
import { setLoading } from "@/redux/authSlice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ADMIN_API_END_POINT } from "@/lib/constant";
import useGetAllAdminProducts from "@/hooks/useGetAllAdminProducts"
import { ProductCard } from "../molecules/ProductCard";
import { ProfileCard } from "../molecules/ProfileCard";

type AdminProfile = {
    email: string;
    name: string;
    role: string;
};

interface Product {
    id: string;
    name: string;
    title: string;
    description: string;
    comments: string[];
    tags: string[];
    adminId: string;
}



export const AdminProfileComp = () => {
    const { loading, user, role } = useSelector((store: RootState) => store.auth)
    const [adminData, setAdminData] = useState<AdminProfile | null>(null);
    const { allAdminProducts, error } = useGetAllAdminProducts();
    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${ADMIN_API_END_POINT}/profile`, {
                    withCredentials: true
                })
                setAdminData(response.data.adminProfile);
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
            {user && role == "Admin" ? (
                <div className="px-20  lg:px-40 pt-10  h-screen w-full grid grid-cols-1 lg:grid-cols-3 space-x-5">
                    <div className="flex flex-col col-span-2 space-y-5 w-full h-auto">
                        <div>
                            <ProfileCard userName={adminData?.name} adminData={adminData} role={role}/>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <div className="p-5 flex justify-between items-center">
                                <div className="font-semibold">
                                    My Product Listing
                                </div>
                                <div className="cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>

                                </div>
                            </div>
                            {
                                allAdminProducts!==undefined && allAdminProducts!==null ?
                                    (
                                        <div>
                                            {allAdminProducts.map((p: Product) => (
                                                <div key={p.id}>
                                                    <ProductCard name={p.name} title={p.title} comments={p.comments} tags={p.tags} />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-5">
                                            {   error || "There are no products to display "}
                                        </div>
                                    )
                            }
                        </div>
                    </div>
                    <div className="hidden lg:block mb-10 w-2/3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-10 font-normal text-xl text-center text-gray-500">
                            Your leadership and efforts are driving the success of our platform. Keep up the great work!
                        </div>
                        <div className="mt-10 flex flex-col space-y-10">
                            <div className="flex flex-col items-center ">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-24 text-green-300">
                                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                                </svg>
                                {error ?
                                    (
                                        <div>
                                            0 Views
                                        </div>
                                    ) : (
                                        <div>
                                            20 Views
                                        </div>
                                    )
                                }
                            </div>
                            <div className="border border-gray-300 shadow-sm mx-5" />
                            <div className="flex flex-col items-center ">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-24 text-orange-300">
                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                </svg>
                                {error ?
                                    (
                                        <div>
                                            0 Reviews
                                        </div>
                                    ) : (
                                        <div>
                                            20 Reviews
                                        </div>
                                    )
                                }
                            </div>
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