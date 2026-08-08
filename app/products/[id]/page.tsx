import { getProduct, getRelatedProducts } from "@/lib/products";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCarousel from "@/components/ProductCarousel";
import { ProductGallery } from "./_components/ProductGallery";
import { ProductActions } from "./_components/ProductActions";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return { title: "محصول پیدا نشد" };
  return {
    title: `${product.persianTitle} | Board Kingdom`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) notFound();

  const relatedProducts = getRelatedProducts(id, 8);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 w-full">
      <div className="w-full px-6 md:px-10 lg:px-16 py-6">
        <div className="mx-auto max-w-[130rem]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">خانه</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600">محصولات</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">{product.persianTitle}</span>
          </nav>

          {/* بخش اصلی: ۱۲ ستونه (۴/۸) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            {/* ستون راست: گالری + دکمه‌ها (۴ ستون) */}
            <div className="md:col-span-4">
              <div className="flex items-start gap-4">
                {/* دکمه‌های عمودی در سمت راست (RTL) */}
                <div className="hidden md:flex md:flex-col pt-2">
                  <ProductActions />
                </div>

                {/* گالری */}
                <div className="flex-1">
                  <ProductGallery
                    images={[product.image, ...product.images]}
                    productName={product.persianTitle}
                  />
                  {/* دکمه‌ها در موبایل زیر گالری */}
                  <div className="flex md:hidden justify-center gap-3 mt-4">
                    <ProductActions />
                  </div>
                </div>
              </div>
            </div>

            {/* ستون چپ: اطلاعات محصول (۸ ستون) */}
            <div className="md:col-span-8 flex flex-col">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{product.title}</p>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                {product.persianTitle}
              </h1>

              {/* امتیاز */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 text-amber-500">
                  <span className="text-lg">★</span>
                  <span className="font-bold text-sm">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-500">({product.reviewsCount} نظر)</span>
              </div>

              {/* توضیحات کوتاه */}
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                {product.description}
              </p>

              {/* تگ‌ها */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* ویژگی‌های محصول */}
              <div className="mb-6">
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white dark:bg-gray-950 px-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                      ویژگی‌های محصول
                    </span>
                  </div>
                </div>

                {/* ۳ ستونه */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">👥</span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">تعداد بازیکن</p>
                      <p className="font-bold text-gray-900 dark:text-white">{product.players} نفر</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">⏱️</span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">مدت زمان بازی</p>
                      <p className="font-bold text-gray-900 dark:text-white">{product.time} دقیقه</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">🎂</span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">رده سنی</p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {product.age.includes("سال") ? product.age : `${product.age} سال`}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">🏢</span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">ناشر</p>
                      <p className="font-bold text-gray-900 dark:text-white">{product.publisher}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">سال انتشار</p>
                      <p className="font-bold text-gray-900 dark:text-white">{product.releaseYear}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">⚖️</span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">وزن</p>
                      <p className="font-bold text-gray-900 dark:text-white">{product.weight} گرم</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* قیمت و خرید */}
              <div className="pt-4">
                <div className="flex items-end gap-2 mb-4">
                  {product.discountedPrice ? (
                    <>
                      <span className="text-2xl font-black text-gray-900 dark:text-white">
                        {formatPrice(product.discountedPrice)}
                      </span>
                      <span className="text-base text-gray-400 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-gray-500">تومان</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl font-black text-gray-900 dark:text-white">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-gray-500">تومان</span>
                    </>
                  )}
                </div>

                {/* دکمهٔ افزودن به سبد (Redux) */}
                <AddToCartButton
                  id={product.id}
                  title={product.title}
                  persianTitle={product.persianTitle}
                  image={product.image}
                  price={product.price}
                  discountedPrice={product.discountedPrice}
                  stockCount={product.stockCount}
                />

                {product.stockCount === 0 && (
                  <p className="text-red-500 text-sm text-center mt-3">
                    ⚠️ این محصول در حال حاضر ناموجود است
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* توضیحات کامل (نقد و بررسی) */}
          {product.fullDescription && (
            <div className="mb-12">
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">
                📖 نقد و بررسی
              </h2>
              <div className="dark:bg-gray-900 rounded-xl p-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                {product.fullDescription.split("\n").map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* محصولات مرتبط – تمام عرض با padding داخلی */}
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