export const FileUpload = () => {
    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="product_img">Upload file</label>
            <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="product_img_help" id="product_img" type="file"/>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="product_ing_help">A profile picture is useful to confirm your are logged into your account</div>
        </div>
    )
}