"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  Trash2,
  ChevronLeft,
  Tag,
  MapPin,
  PlusCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { AxiosError } from "axios";

// Components
import AddAddressDialog from "@/components/AddAddressDialog";
import PaymentGatewaySelector from "@/components/PaymentGatewaySelector";

// Hooks
import { useCart } from "@/hooks/useCart";
import { useUpdateCartItem } from "@/hooks/useUpdateCartItem";
import { useRemoveCartItem } from "@/hooks/useRemoveCartItem";
import { useCartItemsDetails } from "@/hooks/useCartItemsDetails";
import { useAddresses } from "@/hooks/useAddresses";
import { useCheckout } from "@/hooks/useCheckout";
import { useApplyDiscount } from "@/hooks/useApplyDiscount";
import { useRemoveDiscount } from "@/hooks/useRemoveDiscount";
import { useAuth } from "@/hooks/useAuth";

// تنظیمات سایت
import { getSiteSettings } from "@/lib/settings";
import { formatPrice } from "@/lib/utils";

const MAX_ADDRESSES = 10;

/* ---------------------------------------------------------------
 * سه نقطهٔ انیمیشنی
 * --------------------------------------------------------------- */
function AnimatedDots() {
  return (
    <span className="inline-flex items-baseline" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block animate-bounce text-3xl leading-none text-blue-600"
          style={{
            animationDelay: `${i * 150}ms`,
            animationDuration: "900ms",
          }}
        >
          .
        </span>
      ))}
    </span>
  );
}

export default function CartPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const { data: cart, isLoading: cartLoading } = useCart();
  const { mutate: updateItem } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveCartItem();

  const {
    data: addresses,
    isLoading: addressesLoading,
    refetch: refetchAddresses,
  } = useAddresses();

  const { mutate: checkout, isPending: isCheckingOut } = useCheckout();

  const { mutate: applyDiscount, isPending: isApplyingDiscount } =
    useApplyDiscount();
  const { mutate: removeDiscount, isPending: isRemovingDiscount } =
    useRemoveDiscount();

  const cartItems = cart?.items ?? [];
  const { detailsMap } = useCartItemsDetails(cartItems);

  const sortedAddresses = useMemo(() => {
    if (!addresses) return [];
    return [...addresses].sort((a, b) => {
      if (a.is_default && !b.is_default) return -1;
      if (!a.is_default && b.is_default) return 1;
      return 0;
    });
  }, [addresses]);

  const addressCount = addresses?.length ?? 0;
  const addressLimitReached = addressCount >= MAX_ADDRESSES;

  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [addressError, setAddressError] = useState(false);
  const [selectedGatewayId, setSelectedGatewayId] = useState<number | null>(
    null
  );
  const [gatewayError, setGatewayError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const [isRedirecting, setIsRedirecting] = useState(false);

  const addressSectionRef = useRef<HTMLDivElement>(null);
  const gatewaySectionRef = useRef<HTMLDivElement>(null);

  const [freeShippingThreshold, setFreeShippingThreshold] = useState(2_000_000);
  const [shippingCost, setShippingCost] = useState(49_000);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth/signin?callbackUrl=/checkout/cart");
    }
  }, [user, authLoading, router]);

  const effectiveAddressId = useMemo(() => {
    if (selectedAddressId !== null) return selectedAddressId;
    if (!sortedAddresses || sortedAddresses.length === 0) return null;
    return sortedAddresses[0].id;
  }, [selectedAddressId, sortedAddresses]);

  useEffect(() => {
    getSiteSettings().then((s) => {
      setFreeShippingThreshold(s.freeShippingThreshold);
      setShippingCost(s.shippingCost);
    });
  }, []);

  const totalPrice = cart?.total_amount ?? 0;
  const totalDiscount = cart?.total_savings ?? 0;
  const discountAmount = cart?.discount_amount ?? 0;
  const hasDiscountCode = !!cart?.discount_id;
  const cartFinalAmount = cart?.final_amount ?? 0;

  const totalItems = cart?.total_items ?? 0;
  const isFreeShipping = cartFinalAmount >= freeShippingThreshold;
  const shippingCharge = isFreeShipping ? 0 : shippingCost;
  const finalPrice = cartFinalAmount + shippingCharge;

  const handleUpdateQuantity = (
    itemId: number,
    currentQty: number,
    delta: number,
    productId: number
  ) => {
    const newQty = currentQty + delta;

    if (delta > 0) {
      const product = detailsMap.get(productId);
      const stock = product?.stock_count ?? Infinity;
      if (currentQty >= stock) return;
    }

    if (newQty <= 0) {
      removeItem(itemId, {
        onError: (err) => console.error("Remove error:", err),
      });
      return;
    }

    updateItem(
      { itemId, quantity: newQty },
      { onError: (err) => console.error("Update error:", err) }
    );
  };

  const handleRemoveItem = (itemId: number) => {
    removeItem(itemId, {
      onError: (err) => console.error("Remove error:", err),
    });
  };

  const handleApplyDiscount = () => {
    const code = discountCode.trim();
    if (!code) return;

    setDiscountError(null);
    applyDiscount(
      { code },
      {
        onSuccess: () => {
          setDiscountCode("");
        },
        onError: (err) => {
          const axiosErr = err as AxiosError<{ error?: string }>;
          setDiscountError(
            axiosErr?.response?.data?.error || "کد تخفیف نامعتبر است"
          );
        },
      }
    );
  };

  const handleRemoveDiscount = () => {
    setDiscountError(null);
    removeDiscount(undefined, {
      onError: (err) => {
        const axiosErr = err as AxiosError<{ error?: string }>;
        setDiscountError(
          axiosErr?.response?.data?.error || "خطا در حذف تخفیف"
        );
      },
    });
  };

  const handleContinue = () => {
    if (isCheckingOut || isRedirecting) return;

    let hasError = false;

    if (!effectiveAddressId) {
      setAddressError(true);
      hasError = true;
    } else {
      setAddressError(false);
    }

    if (!selectedGatewayId) {
      setGatewayError(true);
      hasError = true;
    } else {
      setGatewayError(false);
    }

    if (hasError) {
      if (!effectiveAddressId) {
        addressSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      } else if (!selectedGatewayId) {
        gatewaySectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    setOrderError(null);
    setIsRedirecting(true);

    checkout(
      {
        address_id: effectiveAddressId!,
        gateway_id: selectedGatewayId!,
      },
      {
        onSuccess: (data) => {
          if (typeof window !== "undefined") {
            localStorage.setItem("last_order_id", String(data.order_id));
          }

          if (data.redirect_url && data.redirect_url.trim() !== "") {
            window.location.href = data.redirect_url;
          } else {
            window.location.href = `/payment/success?order_id=${data.order_id}`;
          }
        },
        onError: (err) => {
          setIsRedirecting(false);
          const axiosErr = err as AxiosError<{ error?: string }>;
          setOrderError(axiosErr?.response?.data?.error || "خطا در ثبت سفارش");
        },
      }
    );
  };

  if (authLoading || cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <p className="text-gray-500">در حال انتقال به صفحه ورود...</p>
      </div>
    );
  }

  const showGlobalOverlay = isCheckingOut || isRedirecting;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 w-full">
      {/* ✅ Overlay شیشه‌ای لایت و بدون باکس */}
      {showGlobalOverlay && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center">
          {/* پس‌زمینه لایت با بلور */}
          <div className="absolute inset-0 bg-white/60 dark:bg-gray-950/60 backdrop-blur-2xl" />

          {/* محتوای شناور بدون باکس */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* اسپینر با هاله آبی ملایم */}
            <div className="relative flex items-center justify-center">
              <div className="absolute h-24 w-24 rounded-full bg-blue-400/20 blur-2xl" />
              <Loader2 className="relative h-16 w-16 animate-spin text-blue-600 dark:text-blue-400" />
            </div>

            {/* متن با سه نقطه انیمیشنی */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-xl font-bold text-gray-800 dark:text-white text-center flex items-baseline justify-center">
                در حال انتقال به صفحه پرداخت
                <AnimatedDots />
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                لطفاً صفحه را نبندید
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full px-6 md:px-10 lg:px-16 py-6">
        <div className="mx-auto max-w-[130rem]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">
              خانه
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">
              سبد خرید
            </span>
          </nav>

          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-8">
            🛒 سبد خرید
          </h1>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <ShoppingCartEmpty />
              <p className="mt-4 text-lg font-medium">سبد خرید شما خالی است</p>
              <Link
                href="/products"
                className="mt-2 text-blue-600 hover:underline"
              >
                بازگشت به فروشگاه
              </Link>
            </div>
          ) : (
            <>
              <div className="grid lg:grid-cols-3 gap-8">
                {/* جدول سبد خرید */}
                <div className="lg:col-span-2">
                  <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-xl px-4 py-3">
                    <div className="col-span-5">محصول</div>
                    <div className="col-span-2 text-center">قیمت واحد</div>
                    <div className="col-span-2 text-center">تعداد</div>
                    <div className="col-span-2 text-center">قیمت کل</div>
                    <div className="col-span-1 text-center">حذف</div>
                  </div>

                  <div className="border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-xl overflow-hidden divide-y divide-gray-200 dark:divide-gray-700">
                    {cartItems.map((item) => {
                      const originalPrice = item.price;
                      const unitPrice =
                        item.discounted_price && item.discounted_price > 0
                          ? item.discounted_price
                          : item.price;
                      const itemTotal = unitPrice * item.quantity;
                      const hasDiscount = unitPrice < originalPrice;
                      const stockCount =
                        detailsMap.get(item.product_id)?.stock_count ??
                        Infinity;
                      const isMaxed = item.quantity >= stockCount;

                      return (
                        <div
                          key={item.id}
                          className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          {/* دسکتاپ */}
                          <div className="hidden md:grid md:grid-cols-12 gap-4 items-center px-4 py-4">
                            <div className="md:col-span-5 flex items-center gap-4 w-full">
                              <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <Image
                                  src={item.product_image}
                                  alt={item.product_name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/products/${item.product_id}`}
                                  className="font-bold text-gray-900 dark:text-white hover:text-blue-600 block truncate"
                                >
                                  {item.product_name}
                                </Link>
                              </div>
                            </div>

                            <div className="md:col-span-2 text-center text-sm">
                              {hasDiscount ? (
                                <div className="flex flex-col items-center">
                                  <span className="text-[11px] text-gray-400 line-through">
                                    {formatPrice(originalPrice)}
                                  </span>
                                  <span className="font-bold text-red-600 dark:text-red-400">
                                    {formatPrice(unitPrice)}
                                  </span>
                                  <span className="text-[10px] text-gray-500">
                                    تومان
                                  </span>
                                </div>
                              ) : (
                                <div className="font-bold text-gray-700 dark:text-gray-300">
                                  {formatPrice(unitPrice)}
                                  <span className="text-[10px] text-gray-500 block">
                                    تومان
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="md:col-span-2 flex items-center justify-center flex-col">
                              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.id,
                                      item.quantity,
                                      -1,
                                      item.product_id
                                    )
                                  }
                                  className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-10 text-center text-sm font-bold border-x border-gray-200 dark:border-gray-700">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.id,
                                      item.quantity,
                                      1,
                                      item.product_id
                                    )
                                  }
                                  disabled={isMaxed}
                                  className={`h-8 w-8 flex items-center justify-center transition-colors ${
                                    isMaxed
                                      ? "opacity-40 cursor-not-allowed"
                                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                  }`}
                                  title={
                                    isMaxed
                                      ? `حداکثر موجودی: ${stockCount} عدد`
                                      : ""
                                  }
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              {isMaxed && stockCount !== Infinity && (
                                <p className="text-[9px] text-amber-600 dark:text-amber-400 mt-1">
                                  حداکثر موجودی: {stockCount}
                                </p>
                              )}
                            </div>

                            <div className="md:col-span-2 text-center font-black text-blue-600 dark:text-blue-400">
                              {formatPrice(itemTotal)}
                              <span className="text-[10px] text-gray-500 block">
                                تومان
                              </span>
                            </div>

                            <div className="md:col-span-1 flex justify-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* موبایل */}
                          <div className="md:hidden p-4">
                            <div className="flex gap-3">
                              <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <Image
                                  src={item.product_image}
                                  alt={item.product_name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/products/${item.product_id}`}
                                  className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2"
                                >
                                  {item.product_name}
                                </Link>
                                <div className="mt-1.5 flex items-center gap-2">
                                  {hasDiscount ? (
                                    <>
                                      <span className="text-xs font-bold text-red-600">
                                        {formatPrice(unitPrice)} تومان
                                      </span>
                                      <span className="text-[10px] text-gray-400 line-through">
                                        {formatPrice(originalPrice)}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-xs font-bold text-blue-600">
                                      {formatPrice(unitPrice)} تومان
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-500 hover:bg-red-50 shrink-0"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                              <div className="flex flex-col items-center">
                                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        item.id,
                                        item.quantity,
                                        -1,
                                        item.product_id
                                      )
                                    }
                                    className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="w-10 text-center text-sm font-bold border-x border-gray-200 dark:border-gray-700">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        item.id,
                                        item.quantity,
                                        1,
                                        item.product_id
                                      )
                                    }
                                    disabled={isMaxed}
                                    className={`h-8 w-8 flex items-center justify-center transition-colors ${
                                      isMaxed
                                        ? "opacity-40 cursor-not-allowed"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                                {isMaxed && stockCount !== Infinity && (
                                  <p className="text-[9px] text-amber-600 dark:text-amber-400 mt-1">
                                    حداکثر موجودی: {stockCount}
                                  </p>
                                )}
                              </div>
                              <div className="text-left">
                                <p className="text-[10px] text-gray-500">
                                  قیمت کل
                                </p>
                                <span className="font-black text-blue-600 text-sm">
                                  {formatPrice(itemTotal)} تومان
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <Link
                      href="/products"
                      className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      <ChevronLeft className="h-4 w-4" /> ادامه خرید
                    </Link>
                  </div>
                </div>

                {/* خلاصه سفارش */}
                <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 sticky top-28 border border-gray-200 dark:border-gray-700">
                    <h3 className="font-black text-lg mb-4">خلاصه سفارش</h3>
                    <Separator />

                    <div className="space-y-3 mt-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">تعداد کالاها</span>
                        <span className="font-bold">{totalItems}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">قیمت کالاها</span>
                        <span className="font-bold">
                          {formatPrice(totalPrice)} تومان
                        </span>
                      </div>

                      {totalDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>تخفیف محصولات</span>
                          <span>{formatPrice(totalDiscount)} تومان</span>
                        </div>
                      )}

                      {hasDiscountCode && (
                        <div className="flex justify-between text-green-600 items-center">
                          <span className="flex items-center gap-1">
                            کد تخفیف ({cart?.discount_code})
                            <button
                              type="button"
                              onClick={handleRemoveDiscount}
                              disabled={isRemovingDiscount}
                              className="text-red-500 hover:text-red-700 text-xs underline disabled:opacity-50"
                            >
                              حذف
                            </button>
                          </span>
                          <span>-{formatPrice(discountAmount)} تومان</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-gray-600">هزینهٔ ارسال</span>
                        {isFreeShipping ? (
                          <span className="text-green-600 font-bold">
                            رایگان
                          </span>
                        ) : (
                          <span className="font-bold">
                            {formatPrice(shippingCharge)} تومان
                          </span>
                        )}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between text-lg font-black">
                      <span>مبلغ نهایی</span>
                      <span className="text-blue-600">
                        {formatPrice(finalPrice)} تومان
                      </span>
                    </div>

                    {!hasDiscountCode && (
                      <>
                        <div className="mt-4 flex gap-2">
                          <Input
                            placeholder="کد تخفیف"
                            value={discountCode}
                            onChange={(e) => {
                              setDiscountCode(e.target.value);
                              setDiscountError(null);
                            }}
                            className="h-10 rounded-xl text-sm"
                            disabled={isApplyingDiscount}
                          />
                          <Button
                            variant="outline"
                            className="h-10 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50"
                            onClick={handleApplyDiscount}
                            disabled={
                              isApplyingDiscount || !discountCode.trim()
                            }
                          >
                            {isApplyingDiscount ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Tag className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {discountError && (
                          <p className="text-red-500 text-xs mt-1">
                            {discountError}
                          </p>
                        )}
                      </>
                    )}

                    {hasDiscountCode && (
                      <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        کد تخفیف با موفقیت اعمال شد
                      </p>
                    )}

                    {!isFreeShipping && (
                      <p className="text-[11px] text-gray-500 mt-3 text-center">
                        با خرید {formatPrice(freeShippingThreshold)} تومان،
                        ارسال شما{" "}
                        <span className="text-green-600 font-bold">
                          رایگان
                        </span>{" "}
                        می‌شود.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* آدرس تحویل */}
              <div
                ref={addressSectionRef}
                className="mt-12 bg-white dark:bg-gray-900 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="flex items-center gap-2 text-lg font-black">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    آدرس تحویل
                  </h2>
                  <div className="flex flex-col items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setDialogOpen(true)}
                      disabled={addressLimitReached}
                    >
                      <PlusCircle className="h-4 w-4 ml-1" />
                      افزودن آدرس جدید
                    </Button>
                    {addressLimitReached && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                        حداکثر {MAX_ADDRESSES} آدرس
                      </p>
                    )}
                  </div>
                </div>

                {addressesLoading ? (
                  <div className="flex items-center justify-center py-8 text-gray-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                ) : !sortedAddresses || sortedAddresses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm">هیچ آدرسی ثبت نشده است</p>
                    <Button
                      variant="outline"
                      className="mt-3 rounded-xl"
                      onClick={() => setDialogOpen(true)}
                      disabled={addressLimitReached}
                    >
                      <PlusCircle className="h-4 w-4 ml-1" />
                      افزودن آدرس جدید
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
                    {sortedAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                          effectiveAddressId === addr.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                            : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={effectiveAddressId === addr.id}
                          onChange={() => {
                            setSelectedAddressId(addr.id);
                            setAddressError(false);
                          }}
                          className="mt-1 accent-blue-600"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm">
                              {addr.title}
                            </span>
                            {addr.is_default && (
                              <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs shrink-0">
                                پیش‌فرض
                              </Badge>
                            )}
                            {effectiveAddressId === addr.id && (
                              <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs shrink-0">
                                <CheckCircle className="h-3 w-3 ml-1" />{" "}
                                انتخاب شده
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                            {addr.full_address}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {addr.province?.name}، {addr.city?.name} | کد پستی:{" "}
                            {addr.postal_code}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {addressError && (
                  <p className="text-red-500 text-sm mt-4">
                    لطفاً آدرس تحویل را انتخاب کنید.
                  </p>
                )}
              </div>

              {/* روش پرداخت */}
              <div
                ref={gatewaySectionRef}
                className="mt-6 bg-white dark:bg-gray-900 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700"
              >
                <PaymentGatewaySelector
                  selectedId={selectedGatewayId}
                  onSelect={(id) => {
                    setSelectedGatewayId(id);
                    setGatewayError(false);
                  }}
                  error={gatewayError}
                />
              </div>

              {/* خطای کلی سفارش */}
              {orderError && (
                <div className="mt-6 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {orderError}
                  </p>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <Button
                  onClick={handleContinue}
                  disabled={isCheckingOut || isRedirecting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-12 rounded-xl text-base disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {showGlobalOverlay ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      در حال انتقال...
                    </span>
                  ) : (
                    "ادامه ثبت سفارش"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* دیالوگ افزودن آدرس */}
      <AddAddressDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        limitReached={addressLimitReached}
        currentAddressCount={addressCount}
        onSuccess={() => {
          setOrderError(null);
          refetchAddresses();
        }}
      />
    </div>
  );
}

function ShoppingCartEmpty() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-24 w-24 text-gray-300 dark:text-gray-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
      />
    </svg>
  );
}