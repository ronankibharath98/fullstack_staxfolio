import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

export const AdminHome = () => {
  const { loading, user } = useSelector((store: RootState) => store.auth)
  console.log(user)
  return (
    <div className="p-5">
      {user? (
        <div>
          user logged in
        </div>
      ):(
        <div>
          User not logged in
        </div>
      )
      }
    </div>
  )
}

