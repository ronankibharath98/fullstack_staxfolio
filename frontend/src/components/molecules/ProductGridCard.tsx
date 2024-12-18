import { ProductCard } from "./ProductCard"
import useGetAllProducts  from "@/hooks/useGetAllProducts"


interface Product {
    id: string;
    name: string;
    title: string;
    description: string;
    comments: string[];
    tags: string[];
    adminId: string;
  }

export const ProductGridCard = () => {
    const {allProducts, loading, error} = useGetAllProducts();
    
    return (
        <div>
        { allProducts ? (
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div>
                        {allProducts.map((p: Product) => (
                            <div key={p.id}>
                                <ProductCard name={p.name} title={p.title} comments={p.comments} tags={p.tags}/>
                            </div>
                        ))}    
                    </div>
                <div>

                </div>
            </div>
        ): (
            <div>
                {error}   
            </div>
        )}
        </div>
    )
}

