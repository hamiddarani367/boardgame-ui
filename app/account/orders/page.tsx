"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  CheckCircle,
  Truck,
  Clock,
  CreditCard,
  Package,
  ChevronDown,
  ChevronUp,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useMyOrders } from "@/hooks/useMyOrders";
import type { Order } from "@/types/order";

// ==================== وضعیت‌ها ====================

const statusConfig: Record<
  Order["status"],
  { label: string; icon: React.ElementType; color: string; bgColor: string }
> = {
  pending: {
    label: "در انتظار پرداخت",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950",
  },
  paid: {
    label: "پرداخت شده",
    icon: CheckCircle,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  shipped: {
    label: "در حال ارسال",
    icon: Truck,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950",
  },
  delivered: {
    label: "تحویل داده شده",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950",
  },
  canceled: {
    label: "لغو شده",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950",
  },
  refunded: {
    label: "مرجوع شده",
    icon: RotateCcw,
    color: "text-gray-600",
    bgColor: "bg-gray-100 dark:bg-gray-800",
  },
};

function getPersianDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

// ==================== کارت هر سفارش ====================

function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const status = statusConfig[order.status] ?? statusConfig.pending;
  const StatusIcon = status.icon;

  const items = order.items ?? [];
  const itemCount = items.length;
  const totalSavings =
    (order.discount_amount ?? 0) + (order.total_savings ?? 0);

  return (
    <Card className="border-gray-200 dark:border-gray-800 overflow-hidden">
      <button
        type="button"
        className="w-full text-right p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${status.bgColor}`}>
            <StatusIcon className={`h-5 w-5 ${status.color}`} />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">
              سفارش #{order.id.toLocaleString("fa-IR")}
            </p>
            <p className="text-xs text-gray-500">
              {getPersianDate(order.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            className={`${status.bgColor} ${status.color} text-xs font-medium border-0 hidden sm:inline-flex`}
          >
            {status.label}
          </Badge>
          <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
            {formatPrice(order.final_amount)} تومان
          </span>
          {open ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4">
          <Separator className="mb-4" />

          {/* Badge وضعیت در موبایل */}
          <div className="sm:hidden mb-3">
            <Badge
              className={`${status.bgColor} ${status.color} text-xs font-medium border-0`}
            >
              {status.label}
            </Badge>
          </div>

          {/* آیتم‌ها */}
          <div className="space-y-3 mb-4">
            {items.map((item) => {
              const hasDiscount =
                item.discounted_price != null &&
                item.discounted_price > 0 &&
                item.discounted_price < item.price;

              return (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    {item.product_image && (
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">
                      {item.product_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      تعداد: {item.quantity.toLocaleString("fa-IR")}
                    </p>
                    {hasDiscount && (
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-gray-400 line-through">
                          {formatPrice(item.price)}
                        </span>
                        <span className="text-[11px] text-red-600 font-bold">
                          {formatPrice(item.discounted_price!)}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-bold whitespace-nowrap">
                    {formatPrice(item.total_price)} تومان
                  </span>
                </div>
              );
            })}
          </div>

          <Separator className="mb-4" />

          {/* اطلاعات تکمیلی */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">
                {itemCount.toLocaleString("fa-IR")} قلم کالا
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">
                مبلغ نهایی: {formatPrice(order.final_amount)} تومان
              </span>
            </div>

            {totalSavings > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  سود شما: {formatPrice(totalSavings)} تومان
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

// ==================== صفحه ====================

export default function OrdersPage() {
  const { data, isLoading, isError } = useMyOrders({ page: 1, page_size: 20 });

  // ---- Loading ----
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-gray-200 dark:border-gray-800">
            <CardContent className="p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                </div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // ---- Error ----
  if (isError) {
    return (
      <Card className="border-gray-200 dark:border-gray-800">
        <CardContent className="p-8 text-center text-gray-500">
          <XCircle className="mx-auto h-16 w-16 text-red-300 mb-4" />
          <p className="text-lg font-medium text-red-500">
            خطا در دریافت سفارش‌ها
          </p>
          <p className="text-sm mt-2">لطفاً دوباره تلاش کنید</p>
        </CardContent>
      </Card>
    );
  }

  // ✅ data خودش آرایه است (نه { orders: [...] })
  const orders = data ?? [];

  // ---- Empty ----
  if (orders.length === 0) {
    return (
      <Card className="border-gray-200 dark:border-gray-800">
        <CardContent className="p-8 text-center text-gray-500">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-lg font-medium mb-4">
            شما هنوز سفارشی ثبت نکرده‌اید
          </p>
          <Link href="/products">
            <Button
              variant="outline"
              className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              مشاهده محصولات
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // ---- List ----
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}