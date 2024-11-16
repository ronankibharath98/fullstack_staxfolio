import { ProductCard } from "@/components/molecules/ProductCard";
import useGetAllAdminProducts from "@/hooks/useGetAllAdminProducts"

interface Product {
    id: string;
    name: string;
    title: string;
    description: string;
    comments: string[];
    tags: string[];
    adminId: string;
}


export const AdminProducts = () => {
    const { allAdminProducts, error, loading } = useGetAllAdminProducts()
    console.log(allAdminProducts)
    return (
        <div className="p-10">
            {allAdminProducts ? (
                <div>
                    <div className="text-2xl border-b-2 font-medium mb-3 pb-1">
                        My Products<span className="text-">({allAdminProducts.length})</span> 
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div>
                        {allAdminProducts.map((p: Product) => (
                            <div key={p.id}>
                                <ProductCard name={p.name} title={p.title} comments={p.comments} tags={p.tags} />
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    {error}
                </div>
            )
            }
        </div>
    )
}