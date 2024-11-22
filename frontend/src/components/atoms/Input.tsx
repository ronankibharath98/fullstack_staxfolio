import React from "react"

type InputProps = {
    type: string
    name: string
    lable: string
    placeholder: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input = ({ type, name,  lable, placeholder, value, onChange }: InputProps) => {
    return (
        <div>
            <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{lable}</label>
                <input 
                    type={type} 
                    name={name} 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
}

export const LargeInput = ({ type, lable, placeholder }: InputProps) => {
    return (
        <div>
            <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{lable}</label>
                <textarea id={type} rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder}></textarea>
            </div>
        </div>
    )
}

