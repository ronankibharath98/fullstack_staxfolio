import { useState } from "react";
import { Button } from "@/components/ui/button";

export const AuthOptions = () => {
    const [role, setRole] = useState(null); // null, 'provider', or 'user'

    return (
        <div className="bg-[#e9edf6] flex flex-col justify-center h-screen">
            <div className="flex justify-center">
                <div className="border drop-shadow-xl rounded-xl bg-white border-slate-100 pt-5 pb-10 px-10 w-[350px]">
                    <div className="flex flex-col items-center mb-8">
                        <img src="/logo.svg" alt="Logo" className="w-[90px] h-[90px] mb-4" />
                        <h1 className="text-gray-700 text-center font-semibold text-2xl">
                            Welcome to Staxfolio
                        </h1>
                        <p className="text-sm font-medium text-gray-500 mt-5">
                            Select your role to continue.
                        </p>
                    </div>

                    {/* Role Selection */}
                    {role === null ? (
                        <div className="flex flex-col space-y-5">
                            <Button onClick={() => setRole("provider")} className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md py-3">
                                I'm a Software Provider
                            </Button>
                            <Button onClick={() => setRole("user")} className="w-full bg-green-500 hover:bg-green-600 text-white rounded-md py-3">
                                I'm a User
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-xl font-medium text-center mb-4">
                                {role === "provider" ? "Provider" : "User"} Login or Signup
                            </h2>
                            <div className="flex flex-col space-y-3">
                                <Button onClick={() => window.location.href=`/${role}/login`} className="bg-violet-600 text-white rounded-lg py-3">
                                    Login
                                </Button>
                                <Button onClick={() => window.location.href= `/${role}/signup` }  className="bg-violet-700 text-white rounded-lg py-3">
                                    Signup
                                </Button>
                            </div>
                            <Button onClick={() => setRole(null)} className="mt-5 text-sm text-blue-600 underline">
                                Back to Role Selection
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
