import type { Metadata } from "next";
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
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const sort = (params.sort as string) || "newest";

  return <ProductsPageContent currentPage={page} currentSort={sort} />;
}