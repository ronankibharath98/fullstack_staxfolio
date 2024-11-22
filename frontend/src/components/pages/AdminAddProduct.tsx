import { useSelector } from "react-redux"
import { AddProductCard } from "../molecules/AddProductCard"
import { RootState } from "@/redux/store"

export const AdminAddProduct = () => {
    const { role, loading } = useSelector((store : RootState)=>store.auth)

    //need to add backend apis to update product

    if(loading){
        return(
            <div className="flex justify-center items-center">
                loading...
            </div>
        )
    }
    return(
        <div className="flex justify-center items-center">
            {
                role == "admin" ? (
                    <AddProductCard/>
                ) : (
                    <h1 className="text-red-500 text-xl font-medium flex h-screen items-center justify-center">
                        Restricted to admins only
                    </h1>
                )
            }
        </div>
    )
}