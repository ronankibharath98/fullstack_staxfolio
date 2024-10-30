import axios from "axios"
import { useState } from "react"
import { USER_API_END_POINT } from "../utils/constant"
import { useNavigate } from "react-router-dom"


export const AdminSigninComp = () => {
    const [input, setInput] = useState({
        orgEmail: "",
        password: ""
    })
    const[ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null)
    const navigate = useNavigate();

    const changeEventHandler = (e: any) => {
        const {name, value} = e.target
        setInput((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }
    
    const handleSignin = async(e: any) => {
        e.preventDefault();
        setLoading(true)
        setError(null)

        if ( !input.orgEmail || !input.password) {
            setError("Email and password are required")
            setLoading(false)
            return
        }
        try {
            await axios.post(`${USER_API_END_POINT}/api/v1/admin/signin`, input);
            navigate("/welcome");
        } catch (error: any ) {
            setError(error.response?.data?.message || "An error occured");
        } finally{
            setLoading(false);
        }
    }
    
    return (
        <div className="bg-[#e9edf6] flex flex-col justify-center h-screen">
            <div className="flex justify-center">
                <div className="border drop-shadow-xl rounded-xl bg-white border-slate-100 pt-5 pb-10 px-10">
                    <div className="flex flex-col items-center mb-8">
                        <img src="/logo.svg" alt="Logo" className="w-[90px] h-[90px] mb-4" />
                        <h1 className="text-gray-700 text-center font-semibold text-2xl">
                            Welcome Admin
                        </h1>
                        <p className="text-sm font-medium text-gray-500 mt-5">Sign in to Staxfolio admin panel.</p>
                    </div>
                    {error && <p className="text-red-600 text-center">{error}</p>}
                    <div>
                        <form className="w-[300px]" onSubmit={handleSignin}>
                            <label className="block">
                                <span className="mt-5 mb-2 block text-sm font-medium text-slate-800">Email</span>
                                <input
                                    type="text"
                                    name="orgEmail"
                                    value={input.orgEmail}
                                    onChange={changeEventHandler}
                                    placeholder="admin@domain.com"
                                    className="mt-1 block w-full px-3 py-4 bg-slate-100 border border-slate-300 rounded-md text-sm 
                  shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                  disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                  invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                                />
                            </label>
                            <label className="block">
                                <span className="mt-5 mb-2 block text-sm font-medium text-slate-800">Password</span>
                                <input
                                    type="password"
                                    name="password"
                                    value={input.password}
                                    onChange={changeEventHandler}
                                    placeholder="*********"
                                    className="mt-1 block w-full px-3 py-4 bg-slate-100 border border-slate-300 rounded-md text-sm 
                  shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                  disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                  invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                                />
                            </label>
                            <div className="flex text-sm text-left mt-3">
                                <p className="text-blue-600 hover:underline dark:text-blue-500 font-medium">Forgot password?</p>
                            </div>
                            <div className="flex items-start mt-3">
                                <div className="flex items-center h-5">
                                    <input id="terms" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                                </div>
                                <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a></label>
                            </div>
                            <div className="flex justify-center">
                            <button
                                    type="submit" 
                                    disabled={loading} 
                                    className="mt-5 w-full text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:ring-violet-300 
                                    font-medium rounded-lg text-sm px-5 py-4 me-2 mb-2 dark:bg-violet-600 dark:hover:bg-violet-700 
                                    focus:outline-none dark:focus:ring-violet-800">
                                    {loading ? "Signing in..." : "Sign in"} 
                                </button>
                            </div>
                            <div className="flex text-sm text-left space-x-1">
                                <p className="font-medium text-gray-600">Dont't have an account?</p><a href="/signin" className="text-blue-600 hover:underline dark:text-blue-500 font-medium">Signup</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>)
}