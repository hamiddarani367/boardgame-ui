import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          slug={product.slug}
          name={product.name}
          price={product.price ?? 0}
          sale_price={product.discounted_price ?? undefined}
          main_image={product.image}
        />
      ))}
    </div>
  );
}