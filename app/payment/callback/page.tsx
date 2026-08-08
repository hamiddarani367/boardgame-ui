"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/cartSlice";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const status = searchParams.get("status"); // success | failure

  useEffect(() => {
    if (status === "success") {
      dispatch(clearCart());
      console.log("[Payment Callback] پرداخت موفق – سبد خرید پاک شد.");
    }
  }, [status, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center p-8 max-w-md">
        {status === "success" ? (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-black text-green-600 mb-2">پرداخت موفقیت‌آمیز بود!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              سفارش شما ثبت شد و به زودی ارسال خواهد شد. سبد خرید شما نیز پاک شده است.
            </p>
            <Link href="/account/orders">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8">
                مشاهده سفارشات
              </Button>
            </Link>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-black text-red-600 mb-2">پرداخت ناموفق بود</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              متأسفانه پرداخت شما انجام نشد. می‌توانید دوباره تلاش کنید یا از روش دیگری استفاده نمایید.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/checkout/cart">
                <Button variant="outline" className="rounded-xl h-11 px-6">
                  بازگشت به سبد خرید
                </Button>
              </Link>
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6">
                  صفحه اصلی
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}