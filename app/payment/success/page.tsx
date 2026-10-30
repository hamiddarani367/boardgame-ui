"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Home,
  FileText,
  Package,
  Loader2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { useVerifyOrder } from "@/hooks/useVerifyOrder";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const { data, isLoading } = useVerifyOrder(orderId);

  // ---------- Loading ----------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            در حال بررسی وضعیت پرداخت...
          </p>
        </div>
      </div>
    );
  }

  // ---------- Failed / Error ----------
  if (data?.status !== "paid") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-950 mb-5">
              <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>

            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              پرداخت تأیید نشد
            </h1>

            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              وضعیت پرداخت این سفارش تأیید نشد. لطفاً دوباره تلاش کنید یا با
              پشتیبانی تماس بگیرید.
            </p>

            {orderId && (
              <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full mb-6">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  کد سفارش:
                </span>
                <span className="font-black text-gray-900 dark:text-white">
                  #{Number(orderId).toLocaleString("fa-IR")}
                </span>
              </div>
            )}

            <div className="space-y-3">
              {orderId && (
                <Link
                  href={`/account/orders/${orderId}`}
                  className="block"
                >
                  <Button className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2">
                    <RefreshCw className="h-4 w-4" />
                    تلاش مجدد برای پرداخت
                  </Button>
                </Link>
              )}

              <Link href="/" className="block">
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl border-gray-200 dark:border-gray-700 font-bold gap-2"
                >
                  <Home className="h-4 w-4" />
                  بازگشت به فروشگاه
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------- Paid ----------
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-gray-200 dark:border-gray-800 shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-950 mb-5">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>

          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
            سفارش شما ثبت شد
          </h1>

          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
            سفارش شما با موفقیت ثبت شد و پس از تأیید پرداخت، برای شما ارسال
            خواهد شد.
          </p>

          {orderId && (
            <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full mb-6">
              <Package className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                کد سفارش:
              </span>
              <span className="font-black text-gray-900 dark:text-white">
                #{Number(orderId).toLocaleString("fa-IR")}
              </span>
            </div>
          )}

          <div className="space-y-3">
            <Link href="/account/orders" className="block">
              <Button className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2">
                <FileText className="h-4 w-4" />
                مشاهده سفارش‌ها
              </Button>
            </Link>

            <Link href="/" className="block">
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl border-gray-200 dark:border-gray-700 font-bold gap-2"
              >
                <Home className="h-4 w-4" />
                بازگشت به فروشگاه
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}