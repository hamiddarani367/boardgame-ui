import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import ProductsPageContent from "./_components/ProductsPageContent";

export const metadata: Metadata = {
  title: "محصولات | Board Kingdom",
  description:
    "انواع بردگیم‌های استراتژیک، خانوادگی، کارتی و مهمانی با بهترین قیمت",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // ✅ await کردن searchParams (الزامی در Next.js 15)
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const sort = (params.sort as string) || "newest";
  const category = (params.category as string) || "";
  const playerCount = (params.players as string) || "";
  const minPrice = Number(params.minPrice) || 0;
  const maxPrice = Number(params.maxPrice) || 10000000;

  const { products, totalPages } = await getProducts({
    page,
    sort,
    category,
    playerCount,
    minPrice,
    maxPrice,
  });

  return (
    <ProductsPageContent
      products={products}
      totalPages={totalPages}
      currentPage={page}
      currentSort={sort}
    />
  );
}