"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Heart,
  MapPin,
  ChevronLeft,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useMyOrders } from "@/hooks/useMyOrders";
import { useAddresses } from "@/hooks/useAddresses";
import { useWishlistCount } from "@/hooks/useWishlistCount";
import type { Order } from "@/types/order";

/** رنگ و متن هر وضعیت */
function getStatusInfo(status: Order["status"]) {
  switch (status) {
    case "pending":
      return {
        label: "در انتظار پرداخت",
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
      };
    case "paid":
      return {
        label: "پرداخت شده",
        color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
      };
    case "shipped":
      return {
        label: "در حال ارسال",
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
      };
    case "delivered":
      return {
        label: "تحویل داده شده",
        color:
          "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
      };
    case "canceled":
      return {
        label: "لغو شده",
        color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
      };
    case "refunded":
      return {
        label: "مرجوع شده",
        color:
          "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      };
    default:
      return { label: status, color: "bg-gray-100 text-gray-700" };
  }
}

function getPersianDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function DashboardPage() {
  const { data: orders, isLoading: ordersLoading } = useMyOrders({
    page: 1,
    page_size: 5,
  });
  const { data: wishlistData, isLoading: wishlistLoading } =
    useWishlistCount();
  const { data: addresses, isLoading: addressesLoading } = useAddresses();

  // ✅ data خودش آرایه است
  const ordersList = orders ?? [];
  const ordersCount = ordersList.length;
  const pendingOrders = ordersList.filter(
    (o) =>
      o.status === "pending" ||
      o.status === "paid" ||
      o.status === "shipped"
  ).length;

  const wishlistCount = wishlistData?.count ?? 0;
  const addressCount = addresses?.length ?? 0;
  const defaultAddress = addresses?.find((a) => a.is_default);

  return (
    <div>
      {/* ==================== کارت‌های آمار ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* سفارشات */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-600 dark:text-gray-300">
              سفارشات
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              <>
                <div className="text-2xl font-black">
                  {ordersCount.toLocaleString("fa-IR")}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {pendingOrders > 0
                    ? `${pendingOrders.toLocaleString("fa-IR")} سفارش در حال انجام`
                    : "همهٔ سفارش‌ها تحویل شده"}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* علاقه‌مندی‌ها */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-600 dark:text-gray-300">
              علاقه‌مندی‌ها
            </CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {wishlistLoading ? (
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              <>
                <div className="text-2xl font-black">
                  {wishlistCount.toLocaleString("fa-IR")}
                </div>
                <Link
                  href="/account/wishlist"
                  className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                >
                  مشاهده لیست ←
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        {/* آدرس‌ها */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-600 dark:text-gray-300">
              آدرس‌ها
            </CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {addressesLoading ? (
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              <>
                <div className="text-2xl font-black">
                  {addressCount.toLocaleString("fa-IR")}
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {defaultAddress
                    ? `آدرس پیش‌فرض: ${defaultAddress.title}`
                    : "آدرس پیش‌فرضی ثبت نشده"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ==================== آخرین سفارشات ==================== */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black">آخرین سفارشات</h2>
          {ordersList.length > 0 && (
            <Link
              href="/account/orders"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              مشاهده همه
              <ChevronLeft className="h-4 w-4" />
            </Link>
          )}
        </div>

        {ordersLoading ? (
          <Card>
            <CardContent className="p-6 space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
                />
              ))}
            </CardContent>
          </Card>
        ) : ordersList.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p>شما هنوز سفارشی ثبت نکرده‌اید</p>
              <Link href="/products">
                <Button
                  variant="outline"
                  className="mt-4 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  مشاهده محصولات
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {ordersList.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const firstItem = order.items?.[0];
              const itemCount = order.items?.length ?? 0;

              return (
                <Link href="/account/orders" key={order.id}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer my-1">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        {/* اطلاعات چپ */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {firstItem?.product_image && (
                            <div className="relative h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                              <Image
                                src={firstItem.product_image}
                                alt={firstItem.product_name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm">
                                سفارش #{order.id.toLocaleString("fa-IR")}
                              </span>
                              <Badge
                                className={`text-[10px] ${statusInfo.color}`}
                              >
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {firstItem?.product_name}
                              {itemCount > 1 &&
                                ` و ${(
                                  itemCount - 1
                                ).toLocaleString("fa-IR")} محصول دیگر`}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {getPersianDate(order.created_at)}
                            </p>
                          </div>
                        </div>

                        {/* مبلغ */}
                        <div className="text-left flex-shrink-0">
                          <p className="text-[10px] text-gray-500">
                            مبلغ نهایی
                          </p>
                          <p className="font-black text-blue-600 text-sm">
                            {formatPrice(order.final_amount)} تومان
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}