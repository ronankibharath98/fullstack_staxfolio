import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { USER_API_END_POINT } from "../../lib/constant"

export const AdminSignupComp = () => {
  const [input, setInput] = useState({
    orgName: "",
    orgEmail: "",
    otp: "",
    password: ""
  })
  const [file, setFile] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }

  const changeEventHandler = (e) => {
    const { name, value } = e.target

    setInput((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleGenerateOtp = async () => {
    setLoading(true);
    try {
      await axios.post(`${USER_API_END_POINT}/api/v1/admin/email`, { orgEmail: input.orgEmail })
      setStep(2);
    } catch (error: any) {
      setError(error.response?.data?.message || "Error generating OTP, Please try again.")
    } finally {
      setLoading(false)
    }

  }

  const handleVerifyOtp = async () => {
    setLoading(true)
    try {
      const isValid = await axios.post(`${USER_API_END_POINT}/api/v1/admin/email/verify-otp`, { orgEmail: input.orgEmail, otp: input.otp })
      if (isValid) {
        setStep(3);
      } else {
        alert("Invalid OTP. Please try again.");
        setStep(2);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Error verifying OTP, Please try again.")
    } finally {
      setLoading(false);
    }

  }
  
  const uploadFileToS3 = async (file: any, url: string) => {
    try {
      // Upload the file to S3 using the pre-signed URL
      await axios.put(url, file, {
        headers: {
          'Content-Type': file.type, // Set the content type of the file
        },
      });  
      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  

  // Function to handle final registration
  const handleRegistration = async () => {
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append("orgName", input.orgName);
      formData.append("orgEmail", input.orgEmail);
      formData.append("password", input.password);

      if (file) {
        formData.append("file", file); // Append the file to the FormData object
      }

      const response = await axios.post(`${USER_API_END_POINT}/api/v1/admin/signup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      const url = response.data.uploadUrl
      if (file) {
        await uploadFileToS3(file, url);
      }
      navigate("/welcome"); // Redirect after successful registration
    } catch (error: any) {
      setError(error.response?.data?.message || "Registration failed, Try agin.")
    } finally {
      setLoading(false)
    }

  };

  return (
    <div className="bg-[#e9edf6] flex flex-col justify-center h-screen">
      <div className="flex justify-center">
        <div className="border drop-shadow-sm rounded-2xl bg-white border-slate-100 py-5 px-10">
          <div className="flex flex-col items-center mb-8">
            <img src="/logo.svg" alt="Logo" className="w-[80px] h-[80px] mb-4" />
            <h1 className="text-gray-700 text-center font-semibold text-2xl">
              SIGN UP
            </h1>
          </div>
          <div className="space-y-4 text-sm font-medium">
            <button className="w-full mb-8 flex items-center justify-center gap-x-3 py-4 border rounded-lg hover:bg-gray-50 duration-150 active:bg-gray-100">
              <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_17_40)">
                  <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4" />
                  <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853" />
                  <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04" />
                  <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335" />
                </g>
                <defs>
                  <clipPath id="clip0_17_40">
                    <rect width="48" height="48" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Continue with Google
            </button>
          </div>
          <div className="relative">
            <span className="block w-full h-px bg-gray-300"></span>
            <p className="inline-block w-fit text-sm bg-white px-2 absolute -top-2 inset-x-0 mx-auto">Or</p>
          </div>
          {error && <p className="mt-5 text-red-600 text-center">{error}</p>}
          <div className="mt-8">
            {step === 1 && (
              <form className="w-[280px]">
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
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleGenerateOtp}
                    className="mt-5 w-full text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:ring-violet-300 
                      font-medium rounded-lg text-sm px-5 py-4 me-2 mb-2 dark:bg-violet-600 dark:hover:bg-violet-700 
                      focus:outline-none dark:focus:ring-violet-800">
                    {loading ? "Generating..." : "Get OTP"}
                  </button>
                </div>
                <div className="flex justify-center text-sm text-center space-x-1">
                  <p className="font-medium text-gray-600">Already have an account?</p><a href="/admin/signin" className="text-blue-600 hover:underline dark:text-blue-500 font-medium">Login</a>
                </div>
              </form>
            )}
            {step === 2 && (
              <form className="w-[280px]">
                <label className="block">
                  <span className="mt-2 mb-2 block text-sm font-medium text-slate-800">OTP</span>
                  <input
                    type="text"
                    name="otp"
                    value={input.otp}
                    onChange={changeEventHandler}
                    placeholder="Enter your 8 digits OTP"
                    className="mt-1 block w-full px-3 py-4 bg-slate-100 border border-slate-300 rounded-md text-sm 
                  shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                  disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                  invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                  />
                </label>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="mt-8 w-full text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:ring-violet-300 
                    font-medium rounded-lg text-sm px-5 py-4 me-2 mb-2 dark:bg-violet-600 dark:hover:bg-violet-700 
                    focus:outline-none dark:focus:ring-violet-800">
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
                <div className="flex justify-center text-sm text-center space-x-1">
                  <p className="font-medium text-gray-600">Already have an account?</p><a href="/admin/signin" className="text-blue-600 hover:underline dark:text-blue-500 font-medium">Login</a>
                </div>
              </form>
            )}
            {step === 3 && (
              <form className="w-[280px]">
                <label className="block">
                  <span className="mt-5 mb-2 block text-sm font-medium text-slate-800">First name</span>
                  <input
                    type="text"
                    name="orgName"
                    value={input.orgName}
                    onChange={changeEventHandler}
                    placeholder="Robert"
                    className="mt-1 block w-full px-3 py-4 bg-slate-100 border border-slate-300 rounded-md text-sm 
                  shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                  disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                  invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                  />
                </label>
                <label className="block">
                  <span className="mt-3 mb-2 block text-sm font-medium text-slate-800">Password</span>
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
                <label className="block mt-5">
                  <span className="mb-2 block text-sm font-medium text-slate-800">Upload File</span>
                  <input
                    type="file"
                    onChange={handleFileChange} // Add the file change handler
                    className="mt-1 block w-full px-3 py-4 bg-slate-100 border border-slate-300 rounded-md text-sm 
                  shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </label>
                <div className="flex items-start mt-3">
                  <div className="flex items-center h-5">
                    <input id="terms" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                  </div>
                  <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a></label>
                </div>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleRegistration}
                    className="mt-8 w-full text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:ring-violet-300 
                    font-medium rounded-lg text-sm px-5 py-4 me-2 mb-2 dark:bg-violet-600 dark:hover:bg-violet-700 
                    focus:outline-none dark:focus:ring-violet-800">
                    {loading ? "Registering..." : "Register"}
                  </button>
                </div>
                <div className="flex justify-center text-sm text-center space-x-1">
                  <p className="font-medium text-gray-600">Already have an account?</p>
                  <a href="/provider/signin" className="text-blue-600 hover:underline dark:text-blue-500 font-medium">Login</a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
