import SellProductCard from "./sell-product-card/SellProductCard";

export default function SellProductCommerce({ products }) {
    return (
        <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {products.map((product, index) => (
                <SellProductCard key={index} product={product} />
            ))}
        </div>
    );
}
