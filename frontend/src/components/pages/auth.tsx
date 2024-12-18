import { Button } from "@/components/atoms/button";
import { setRole } from "@/redux/authSlice"
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";

export const AuthOptions = () => {
    const { role } = useSelector((store: RootState) => store.auth); // null, 'Admin', 'Manager', or 'user'
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div className="bg-[#e9edf6] flex flex-col justify-center h-screen">
            <div className="flex justify-center">
                <div className="border drop-shadow-xl rounded-xl bg-white border-slate-100 pt-5 pb-10 px-10 w-[350px]">
                    <div className="flex flex-col items-center mb-8">
                        <img src="/logo.svg" alt="Logo" className="w-[90px] h-[90px] mb-4" />
                        <h1 className="text-gray-700 text-center font-semibold text-2xl">
                            Welcome to Staxfolio
                        </h1>
                        { !role? (
                            <p className="text-sm font-medium text-gray-500 mt-5">
                                Select your role to continue.
                            </p>
                        ): (
                            <p className="text-sm font-medium text-gray-500 mt-5">
                                Select one of the options.
                            </p>
                        )}
                        
                    </div>
                    {/* Role Selection */}
                    {role === null ? (
                        <div className="flex flex-col space-y-5">
                            <Button onClick={() => dispatch(setRole("admin"))} className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md py-3">
                                I'm a Software Provider
                            </Button>
                            <Button onClick={() => dispatch(setRole("user"))} className="w-full bg-green-500 hover:bg-green-600 text-white rounded-md py-3">
                                I'm a User
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-xl font-medium text-center mb-4">
                                {role === "admin" ? "Admin" : "User"} Signin or Signup
                            </h2>
                            <div className="flex flex-col space-y-3">
                                <Button onClick={() => navigate(`/${role}/signin`)} className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg py-3">
                                    Sign in
                                </Button>
                                <Button onClick={() => navigate(`/${role}/signup`) }  className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg py-3">
                                    Sign up
                                </Button>
                            </div>
                            <Button onClick={() => dispatch(setRole(null))} className="mt-5 text-sm bg-transparent hover:bg-transparent text-blue-600 underline">
                                Back to Role Selection
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
