import { FileUpload } from "../atoms/FileUpload"
import { Button } from "../atoms/button"
import { Input, LargeInput } from "../atoms/Input"

export const AddProductCard = () => {
    return(
        <div className="p-10">
            <form className="max-w-sm mr-auto">
                <Input type="Product" lable="Product" placeholder="Enter product name"/>
                <Input type="Title" lable="Title" placeholder="Enter title name "/>
                <LargeInput type="Description" lable="Description" placeholder="Enter description details"/>
                <Input type="Tags" lable="Tags" placeholder="Enter tags seperated with commas"/>
                <FileUpload/>
                <Button className="mt-5">Add Product</Button>
            </form>          
        </div>
    )
}