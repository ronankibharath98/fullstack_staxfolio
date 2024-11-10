interface ProductCardType {
    name: string,
    title: string,
    comments: string[],
    tags: string[]
}

export const ProductCard = ({name, title,comments,tags}: ProductCardType) => {
    return(
        <div className="p-3 border-b-2 flex justify-start space-x-3 cursor-pointer hover:shadow-sm">
                <div className="h-auto w-[60px] rounded-lg">
                    <img src="data:image/png;base64,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" alt="img" />
                </div>
                <div className="flex flex-col justify-center">
                    <div className="flex justify-start space-x-1">
                        <div className="font-semibold text-gray-700">
                            {name}
                        </div>
                        <div className="w-3 h-px my-3 bg-gray-300 border-0 rounded dark:bg-gray-700" />
                        <div className="break-words whitespace-normal overflow-wrap-anywhere">
                            {title}
                        </div>
                    </div>
                    <div className="flex justify-start space-x-3 font-light text-sm text-slate-500">
                        <div className="flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 ">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                            </svg>
                            <div>
                                {comments.length}
                            </div>
                        </div>
                        
                        {tags.map((tag, index) => (
                            <div key={index} className="flex">
                                <div className="flex items-center">
                                    <CircleComp h={1} w={1} />
                                </div>
                                <div className="ml-3 hover:underline">
                                    {tag}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
    )
}

export const CircleComp = ({ h, w }: { h: number, w: number }) => {
    return (
        <div className={`h-${h} w-${w} rounded-full bg-slate-300`}>
        </div>
    )
}