"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import ProductCarousel from "@/components/ProductCarousel";
import { ProductActions } from "./_components/ProductActions";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useApiQuery } from "@/hooks/useApi";
import type { Product } from "@/types/product";
import AddToCartButton from "@/components/AddToCartButton";
import ProductGallery from "./_components/ProductGallery";

/* ---------------------------------------------------------------
 * رندر آیکون — پشتیبانی از URL، ایموجی یا خالی
 * اگر سرور آیکون نداده باشد، آیکون پیش‌فرض 🏷️ نمایش داده می‌شود
 * --------------------------------------------------------------- */
function renderIcon(icon?: string) {
  const value = (icon ?? "").trim();

  if (!value) {
    return <span className="text-lg md:text-2xl">🏷️</span>;
  }

  return <span className="text-lg md:text-2xl">{value}</span>;
}

/* ---------------------------------------------------------------
 * استخراج نام تگ — پشتیبانی از string | {name, slug}
 * --------------------------------------------------------------- */
function getTagName(tag: unknown): string {
  if (typeof tag === "string") return tag;
  if (tag && typeof tag === "object") {
    const t = tag as Record<string, unknown>;
    if (typeof t.name === "string" && t.name) return t.name;
    if (typeof t.slug === "string" && t.slug) return t.slug;
  }
  return "";
}

function getTagKey(tag: unknown, index: number): string | number {
  if (tag && typeof tag === "object") {
    const t = tag as Record<string, unknown>;
    if (typeof t.id === "number" || typeof t.id === "string") return t.id;
  }
  return index;
}

/* --------------------------------------------------------------- */

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";

  const {
    data: product,
    isLoading,
    error,
  } = useApiQuery<Product>(`/products/${slug}`, ["product", slug], undefined, {
    enabled: !!slug,
  });

  const { data: relatedData } = useApiQuery<{ products: Product[] }>(
    `/products/${slug}/related`,
    ["related-products", slug],
    { limit: 8 },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <p className="text-gray-500">در حال بارگذاری...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950">
        <p className="text-red-500 text-lg mb-4">محصول مورد نظر پیدا نشد.</p>
        <Link href="/products" className="text-blue-600 hover:underline">
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  const relatedProducts = relatedData?.products ?? [];

  const galleryImages = [product.image, ...product.images].filter(
    (url) => url && url.trim() !== ""
  );

  // ✅ ویژگی‌ها به‌صورت کامل از سرور می‌آیند (شامل icon, unit, slug)
  const attributes = (product.attribute_values ?? []).filter(
    (av) => (av.value ?? "").toString().trim() !== ""
  );

  const price = product.price;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 w-full">
      <div className="w-full px-6 md:px-10 lg:px-16 py-6">
        <div className="mx-auto max-w-[130rem]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">
              خانه
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600">
              محصولات
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {product.name}
            </span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            {/* گالری */}
            <div className="md:col-span-4">
              <div className="flex items-start gap-4">
                <div className="hidden md:flex md:flex-col pt-2">
                  <ProductActions productId={product.id} />
                </div>
                <div className="flex-1">
                  <ProductGallery
                    images={galleryImages}
                    productName={product.name}
                  />
                  <div className="flex md:hidden justify-center gap-3 mt-4">
                    <ProductActions productId={product.id} />
                  </div>
                </div>
              </div>
            </div>

            {/* اطلاعات */}
            <div className="md:col-span-8 flex flex-col">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                {product.name}
              </h1>

              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                {product.description}
              </p>

              {/* تگ‌ها */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.tags.map((tag, index) => {
                    const tagName = getTagName(tag);
                    if (!tagName) return null;
                    return (
                      <Badge
                        key={getTagKey(tag, index)}
                        variant="secondary"
                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full"
                      >
                        {tagName}
                      </Badge>
                    );
                  })}
                </div>
              )}

              {/* ✅ ویژگی‌ها — کاملاً داینامیک */}
              {attributes.length > 0 && (
                <div className="mb-6">
                  <div className="relative mb-6">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white dark:bg-gray-950 px-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                        ویژگی‌های محصول
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                    {attributes.map((av, idx) => {
                      const name = (av.attribute_name ?? "").trim() || "ویژگی";
                      const value = (av.value ?? "").toString().trim();
                      const unit = (av.unit ?? "").trim();

                      return (
                        <div
                          key={av.attribute_slug || `${av.attribute_id}-${idx}`}
                          className="bg-gray-50 dark:bg-gray-900 rounded-xl p-2 md:p-3 flex items-center gap-2 md:gap-3"
                        >
                          <span className="shrink-0">{renderIcon(av.icon)}</span>
                          <div className="min-w-0">
                            <p className="text-[9px] md:text-xs text-gray-500 dark:text-gray-400 truncate">
                              {name}
                            </p>
                            <p className="text-xs md:text-base font-bold text-gray-900 dark:text-white">
                              {value}
                              {unit ? ` ${unit}` : ""}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* قیمت و خرید */}
              <div className="pt-2">
                <div className="mb-2">
                  {product.discounted_price ? (
                    <div className="flex flex-col gap-3 rounded-2xl bg-gradient-to-l from-red-50 to-white dark:from-red-950/30 dark:to-gray-900 border border-red-100 dark:border-red-900/30 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          قیمت با تخفیف
                        </span>
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          ٪
                          {Math.round(
                            ((price - product.discounted_price) / price) * 100
                          )}{" "}
                          تخفیف
                        </span>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-black text-red-600 dark:text-red-400">
                          {formatPrice(product.discounted_price)}
                        </span>
                        <span className="text-sm text-gray-500">تومان</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400 line-through">
                          {formatPrice(price)}
                        </span>
                        <span className="text-gray-500">تومان</span>
                      </div>
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                        سود شما از این خرید:{" "}
                        {formatPrice(price - product.discounted_price)} تومان
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-black text-gray-900 dark:text-white">
                        {formatPrice(price)}
                      </span>
                      <span className="text-sm text-gray-500">تومان</span>
                    </div>
                  )}
                </div>
                <AddToCartButton
                  id={product.id}
                  stock_count={product.stock_count}
                />

                {product.stock_count === 0 && (
                  <p className="text-red-500 text-sm text-center mt-3">
                    ⚠️ این محصول در حال حاضر ناموجود است
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* نقد و بررسی */}
          {product.full_description && (
            <div className="mb-4">
              <div className="relative mb-6">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-gray-950 px-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                    📖 نقد و بررسی
                  </span>
                </div>
              </div>

              <div className="dark:bg-gray-900 rounded-xl p-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                <div
                  dangerouslySetInnerHTML={{
                    __html: product.full_description,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* محصولات مرتبط */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <ProductCarousel
            title="محصولات مرتبط"
            subtitle="پیشنهاد بر اساس سلیقهٔ شما"
            icon="🎯"
            products={relatedProducts}
            variant="new"
          />
        </div>
      )}
    </div>
  );
}