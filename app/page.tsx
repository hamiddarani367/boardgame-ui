import CategoryRow from "@/components/home/CategoryRow";
import GameSceneCanvas from "@/components/home/GameSceneCanvas";
import ProductCarousel from "@/components/ProductCarousel";
import { getProductsByType } from "@/lib/products";

  const [discountProducts, bestsellerProducts, newProducts] = await Promise.all([
    getProductsByType("discount"),
    getProductsByType("bestseller"),
    getProductsByType("new"),
  ]);

export default function Home() {
  return (
    <>
      <GameSceneCanvas />
      <CategoryRow />
      
      {/* ردیف تخفیف‌ها */}
      <ProductCarousel
        title="تخفیف‌های ویژه"
        subtitle="فرصت محدود برای خرید"
        icon="🔥"
        products={discountProducts}
        variant="discount"
      />

      {/* ردیف پرفروش‌ها */}
      <ProductCarousel
        title="پرفروش‌ترین‌ها"
        subtitle="محبوب‌ترین بازی‌های بردگیمرها"
        icon="⭐"
        products={bestsellerProducts}
        variant="bestseller"
      />

      {/* ردیف جدیدترین‌ها */}
      <ProductCarousel
        title="جدیدترین‌ها"
        subtitle="تازه‌های دنیای بردگیم"
        icon="🆕"
        products={newProducts}
        variant="new"
      />
    </>
  );
}