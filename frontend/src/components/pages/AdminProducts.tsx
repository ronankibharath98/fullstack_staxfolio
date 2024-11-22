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
    // If there is an error, display it
    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    // If data is still loading, show a loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    // If there are no products, display nothing
    if (!allAdminProducts || allAdminProducts.length === 0) {
        return(
            <div className="flex h-screen text-xl font-semibold items-center justify-center">
                You do not have products to display
            </div>
        );
    }

    // If products exist, render the content
    return (
        <div className="p-10">
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
    )
}