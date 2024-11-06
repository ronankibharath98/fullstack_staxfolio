import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store"


export const Navbar = () => {
    const { user } = useSelector((store: RootState) => store.auth);
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    return (
        <div className="border border-b-slate-200 shadow-sm">
            <div className="flex items-center justify-between overflow-hidden my-2 mx-5">
                <div className="flex h-[50px] w-[50px] overflow-hidden">
                    <img src="/logo.svg" alt="Logo" className="object-contain w-auto h-full" />
                </div>
                <div className="flex items-center space-x-5">
                    {user ? (
                        <div>
                            <div>
                                Profile
                            </div>
                            <div>
                                <Popover>
                                    <PopoverTrigger>Open</PopoverTrigger>
                                    <PopoverContent>Place content for the popover here.</PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    ) :
                        (
                            <div>
                                Sign up
                                Sign out
                            </div>
                        )}

                </div>
            </div>
        </div>
    )
}