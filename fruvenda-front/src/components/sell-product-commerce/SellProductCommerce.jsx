import SellProductCard from "./sell-product-card/SellProductCard";

export default function SellProductCommerce({ products }) {
    return (
        <div className="w-100 grid place-self-center md:place-content-start grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10">
            {products.map((product, index) => (
                <SellProductCard key={index} product={product} />
            ))}
        </div>
    );
}
