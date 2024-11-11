import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { ProductGridCard } from "@/components/user/ProductGridCard"

export const AdminHome = () => {
  const { loading, user } = useSelector((store: RootState) => store.auth)
  
  return (
    <div className="p-10">
      {user? (
        <div>
          <div className="text-2xl font-medium mb-3">
            Top Product Listing 
          </div>
          <div className="border-t-2">
            <ProductGridCard/>
          </div>
        </div>
      ):(
        <div>
          Please login to checkout the products
        </div>
      )
      }
    </div>
  )
}

