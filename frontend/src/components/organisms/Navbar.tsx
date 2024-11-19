import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/atoms/popover"
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Avatar, AvatarImage } from "../atoms/avatar";
import axios from "axios";
import { ADMIN_API_END_POINT } from "../../lib/constant";
import { setLoading, setRole, setUser } from "@/redux/authSlice";
import { Button } from "../atoms/button";
import { useNavigate } from "react-router-dom";
import { setAllAdminProducts, setAllProducts } from "@/redux/productSlice";


export const Navbar = () => {
    const { loading, user, role } = useSelector((store: RootState) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const logoutHandler = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${ADMIN_API_END_POINT}/signout`, { withCredentials: true })
            if (response.data.success) {
                dispatch(setUser(null));
                dispatch(setRole(null));
                dispatch(setAllProducts([]));
                dispatch(setAllAdminProducts([]));
                navigate("/authoptions");
            }
        } catch (error) {
            alert(error || "Error occured")
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="border border-b-slate-200 shadow-sm">
            <div className="flex items-center justify-between overflow-hidden my-2 mx-5">
                <div className="flex h-[50px] w-auto overflow-hidden">
                    <div>
                        <img src="/logo.svg" alt="Logo" className="object-contain w-auto h-full" />
                    </div>
                    <div className="hidden sm:flex items-center justify-center font-semibold text-xl text-black">
                        Staxfolio
                    </div>
                </div>
                <div>
                    {user ? (
                        <div className="hidden md:flex font-medium text-gray-700 space-x-5">
                            <div className="cursor-pointer hover:text-violet-500">
                                Launches
                            </div>
                            <div onClick={() => navigate("/welcome")} className="cursor-pointer hover:text-violet-500">
                                Products
                            </div>
                            <div className="cursor-pointer hover:text-violet-500">
                                Community
                            </div>
                        </div>
                    ) : (
                        <div>
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-5">
                    {user && (role == "admin" || role == "user") ? (
                        <div className="flex items-center space-x-8">
                            {role == "admin" ? (
                                <div>
                                <Button onClick={(() => navigate("/admin/add-product"))}>
                                    Add Product
                                </Button>
                            </div>
                            ):(
                                <>
                                </>
                            )}
                            {/* <!-- component --> */}
                            <button className="inline-block relative cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="animate-ping absolute top-1 right-0.5 block h-1 w-1 rounded-full ring-2 ring-green-400 bg-green-600"></span>
                            </button>
                            <div>
                                <Popover>
                                    <PopoverTrigger>
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage
                                                src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                                                alt={user?.fullname || "Profile Image"}
                                            />
                                        </Avatar>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className='flex items-center gap-2 space-y-2'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage
                                                    src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                                                    alt={user?.firstName || "Profile Image"}
                                                />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium'>{user?.firstName}</h4>
                                                <p className='text-sm text-muted-foreground'>{user.role || `${role} Profile`}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col mt-3 space-y-3 text-gray-600">
                                            {role == "admin" ? (
                                                <div className='flex w-fit items-center gap-2 cursor-pointer hover:text-violet-800'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    </svg>
                                                    <div onClick={() => navigate("/admin/profile")}>
                                                        Profile
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='flex w-fit items-center gap-2 cursor-pointer hover:text-violet-800'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    </svg>
                                                    <div onClick={() => navigate("/profile")}>
                                                        Profile
                                                    </div>
                                                </div>
                                            )}
                                            {role == "admin" ? (
                                                <div className='flex w-fit items-center gap-2 cursor-pointer hover:text-violet-800'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
                                                    </svg>
                                                    <div onClick={() => navigate("/admin/myProducts")}>
                                                        My Products
                                                    </div>
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                            <div className='flex w-fit items-center gap-2 cursor-pointer hover:text-violet-800'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
                                                </svg>
                                                Dashboard
                                            </div>
                                            <div className='flex w-fit items-center gap-2 cursor-pointer hover:text-violet-800'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>
                                                Settings
                                            </div>
                                            <div className='flex items-center gap-2 w-fit cursor-pointer hover:text-red-600'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                                </svg>
                                                <a onClick={logoutHandler}>Logout</a>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    ) :
                        (
                            <div className="flex space-x-5">
                                <div>
                                    <button
                                        onClick={() => window.location.href = "/authoptions"}
                                        type="button"
                                        className="focus:outline-none text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
                                        Sign up
                                    </button>
                                </div>
                                <div>
                                    <button
                                        onClick={() => window.location.href = "/authoptions"}
                                        type="button"
                                        className="focus:outline-none text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
                                        Sign in
                                    </button>
                                </div>

                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}