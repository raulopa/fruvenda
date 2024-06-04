import SellProductCard from "./sell-product-card/SellProductCard";

export default function SellProductCommerce({ products }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {products.map((product, index) => (
                <SellProductCard key={index} product={product} />
            ))}
        </div>
    );
}
