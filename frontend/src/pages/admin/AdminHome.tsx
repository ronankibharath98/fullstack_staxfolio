import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { ProductGridCard } from "@/components/user/productGridCard"

export const AdminHome = () => {
  const { loading, user } = useSelector((store: RootState) => store.auth)
  console.log(user)
  return (
    <div className="p-10">
      {user? (
        <div>
          <div className="text-2xl font-medium mb-3">
            Top Product Listing 
          </div>
          <div className="border-t-2">
            <ProductGridCard/>
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

