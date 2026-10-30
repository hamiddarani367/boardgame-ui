"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  XCircle,
  Home,
  RefreshCw,
  ShoppingCart,
  Loader2,
  AlertTriangle,
  CheckCircle,
  FileText,
} from "lucide-react";
import { useVerifyOrder } from "@/hooks/useVerifyOrder";

// ✅ نقشه‌ی reason → پیام فارسی
const REASON_MESSAGES: Record<
  string,
  { title: string; description: string }
> = {
  canceled: {
    title: "پرداخت لغو شد",
    description:
      "شما فرآیند پرداخت را لغو کردید. در صورتی که مایل به تکمیل سفارش هستید، می‌توانید مجدداً تلاش کنید.",
  },
  not_found: {
    title: "سفارش یافت نشد",
    description:
      "سفارشی متناظر با این پرداخت پیدا نشد. لطفاً با پشتیبانی تماس بگیرید یا سفارش خود را مجدداً ثبت کنید.",
  },
  invalid_gateway: {
    title: "درگاه پرداخت نامعتبر",
    description:
      "درگاه پرداخت انتخابی نامعتبر است. لطفاً مجدداً از صفحه‌ی تسویه‌حساب اقدام کنید.",
  },
  verify_error: {
    title: "خطا در تأیید پرداخت",
    description:
      "پرداخت شما انجام شد اما تأیید آن با خطا مواجه شد. اگر مبلغ از حساب شما کسر شده، طی ۷۲ ساعت آینده به‌صورت خودکار بازگردانده می‌شود.",
  },
  update_error: {
    title: "خطا در ثبت سفارش",
    description:
      "پرداخت شما موفق بود اما در به‌روزرسانی سفارش مشکلی پیش آمد. لطفاً با پشتیبانی تماس بگیرید و کد سفارش را اعلام کنید.",
  },
};

const DEFAULT_MESSAGE = {
  title: "پرداخت ناموفق",
  description:
    "متأسفانه فرآیند پرداخت با خطا مواجه شد. لطفاً مجدداً تلاش کنید یا با پشتیبانی تماس بگیرید.",
};

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") ?? "";
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

  // ---------- Paid (واقعاً پرداخت شده ولی به failed اومده بودیم) ----------
  if (data?.status === "paid") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-950 mb-5">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>

            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              پرداخت شما موفق بود
            </h1>

            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              سفارش شما با موفقیت ثبت و پرداخت شد.
            </p>

            {orderId && (
              <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full mb-6">
                <ShoppingCart className="h-4 w-4 text-gray-500" />
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

  // ---------- Failed ----------
  const message = REASON_MESSAGES[reason] ?? {
    ...DEFAULT_MESSAGE,
    ...(reason && !REASON_MESSAGES[reason]
      ? { description: decodeURIComponent(reason) }
      : {}),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-gray-200 dark:border-gray-800 shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-950 mb-5">
            <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
            {message.title}
          </h1>

          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
            {message.description}
          </p>

          {(reason === "verify_error" || reason === "update_error") && (
            <div className="flex items-start gap-2 text-right bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl p-3 mb-6">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                در صورت کسر مبلغ از حساب شما، حداکثر تا ۷۲ ساعت آینده
                به‌صورت خودکار بازگردانده می‌شود.
              </p>
            </div>
          )}

          {orderId && (
            <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full mb-6">
              <ShoppingCart className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                کد سفارش:
              </span>
              <span className="font-black text-gray-900 dark:text-white">
                #{Number(orderId).toLocaleString("fa-IR")}
              </span>
            </div>
          )}

          <div className="space-y-3">
            {orderId ? (
              <Link href={`/account/orders/${orderId}`} className="block">
                <Button className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2">
                  <RefreshCw className="h-4 w-4" />
                  تلاش مجدد برای پرداخت
                </Button>
              </Link>
            ) : (
              <Link href="/cart" className="block">
                <Button className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  بازگشت به سبد خرید
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

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <PaymentFailedContent />
    </Suspense>
  );
}