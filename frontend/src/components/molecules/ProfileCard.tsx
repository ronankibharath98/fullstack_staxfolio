type ProfileData = {
    email: string,
    name?: string,
    firstName?: string,
    lastName?: string,
    role: string,
    profilePhoto: string
};

type ProfileProps = {
    userName: string,
    profileData: ProfileData,
};


export const ProfileCard: React.FC<ProfileProps> = ({ userName, profileData }) => {
    return (
        <div>
            <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="flex justify-end px-4 pt-4">
                    {/* need to create a edit button here */}
                    <button id="dropdownButton" data-dropdown-toggle="dropdown" className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5" type="button">
                        <span className="sr-only">Open dropdown</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                        </svg>
                    </button>
                    {/* <!-- Dropdown menu --> */}
                    <div id="dropdown" className="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                        <ul className="py-2" aria-labelledby="dropdownButton">
                            <li>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Export Data</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex p-4 items-center">
                    <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={profileData? profileData.profilePhoto : "https://github.com/shadcn.png"} alt="Profileimage" />
                    <div className="flex flex-col ml-5">
                        <h5 className="text-2xl font-medium text-gray-900 dark:text-white">{userName}</h5>
                        <span className="text-l text-gray-500 dark:text-gray-400">{profileData?.role}</span>

                        <span>Email: {profileData?.email || "N/A"}</span>

                        {userName ?
                            (
                                <div className="flex space-x-1 items-center">
                                    <span>Active</span>
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                </div>
                            ) : (
                                <div className="flex space-x-1 items-center">
                                    <span>In Active</span>
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div >
        </div>
    )
}