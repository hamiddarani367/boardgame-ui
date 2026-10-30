"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/hooks/useApi";
import { getGuestToken, clearGuestToken } from "@/lib/cart-token";
import { toPersianDigits, toEnglishDigits } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { AxiosError } from "axios";

interface SendOtpResponse {
  message: string;
}

interface VerifyOtpUser {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  permissions?: string[];
}

interface VerifyOtpResponse {
  tokens?: {
    access_token: string;
    refresh_token: string;
  };
  access_token?: string;
  refresh_token?: string;
  user: VerifyOtpUser;
}

interface ApiErrorBody {
  error?: string;
  message?: string;
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, isLoading } = useAuth();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // اگر کاربر قبلاً لاگین کرده، به callbackUrl برود
  useEffect(() => {
    if (!isLoading && user) {
      window.location.href = callbackUrl;
    }
  }, [user, isLoading, callbackUrl]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const validatePhone = (phoneNumber: string): boolean => {
    const cleanPhone = toEnglishDigits(phoneNumber).replace(/\D/g, "");
    return /^09\d{9}$/.test(cleanPhone);
  };

  const handleSendCode = async () => {
    setError("");

    if (!validatePhone(phone)) {
      setError("شماره موبایل معتبر نیست. مثال: ۰۹۱۲۳۴۵۶۷۸۹");
      return;
    }

    setLoading(true);

    try {
      const body = { phone: toEnglishDigits(phone) };
      console.log("📱 Send OTP body:", body);

      const { data } = await apiClient.post<SendOtpResponse>(
        "/auth/send-otp",
        body
      );
      console.log("📱 Send OTP response:", data);
      setStep("code");
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorBody>;
      console.error("❌ Send OTP error:", axiosErr.response?.data);
      const errMsg =
        axiosErr?.response?.data?.error ||
        axiosErr?.response?.data?.message ||
        "خطا در ارسال کد";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setError("");

    if (!code || code.length !== 6) {
      setError("کد باید ۶ رقم باشد");
      return;
    }

    setLoading(true);

    try {
      // ✅ guest_token را از localStorage بگیر (ممکن است وجود داشته باشد)
      const guestToken = getGuestToken();

      // ✅ ساخت body به‌صورت شرطی: guest_token فقط اگر وجود داشت اضافه شود
      const body: {
        phone: string;
        otp: string;
        guest_token?: string;
      } = {
        phone: toEnglishDigits(phone),
        otp: code,
      };

      if (guestToken) {
        body.guest_token = guestToken;
      }

      console.log("🔐 Verify OTP body:", body);

      const { data } = await apiClient.post<VerifyOtpResponse>(
        "/auth/verify-otp",
        body
      );

      console.log("✅ Verify OTP response:", data);

      // ✅ استخراج توکن‌ها (پشتیبانی از دو ساختار)
      const accessToken = data.tokens?.access_token ?? data.access_token;
      const refreshToken = data.tokens?.refresh_token ?? data.refresh_token;

      if (!accessToken || !refreshToken) {
        console.error("❌ Invalid response structure:", data);
        setError("پاسخ سرور نامعتبر است");
        setLoading(false);
        return;
      }

      // ✅ ذخیره در AuthProvider (localStorage + cookie)
      login(accessToken, refreshToken, {
        id: String(data.user?.id ?? phone),
        phone: data.user?.phone ?? toEnglishDigits(phone),
        name:
          [data.user?.firstname, data.user?.lastname]
            .filter(Boolean)
            .join(" ")
            .trim() || `کاربر ${phone.slice(-4)}`,
      });

      // ✅ اگر guest_token داشتیم، پاکش کن چون بک‌اند سبد را ادغام کرد
      if (guestToken) {
        clearGuestToken();
      }

      // ✅ صبر کوتاه تا localStorage و cookie نوشته شوند
      await new Promise((r) => setTimeout(r, 100));

      // ✅ رفرش کامل صفحه برای گرفتن سبد کاربر
      window.location.href = callbackUrl;
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorBody>;
      console.error("❌ Verify OTP error:", axiosErr.response?.data);
      console.error("❌ Status:", axiosErr.response?.status);
      const errMsg =
        axiosErr?.response?.data?.error ||
        axiosErr?.response?.data?.message ||
        "کد اشتباه یا منقضی شده";
      setError(errMsg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* بخش بالایی: لوگو */}
      <div className="flex flex-col items-center justify-center pt-16 pb-10 px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Board Kingdom
          </h1>
          <p className="text-sm text-gray-500 mt-2">دنیای بازی‌های رومیزی</p>
        </div>
      </div>

      {/* بخش فرم */}
      <div className="flex-1 px-4 md:px-0">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
            {step === "phone" ? "ورود / ثبت‌نام" : "تأیید کد"}
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          {step === "phone" ? (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                شماره تلفن
              </label>
              <input
                type="tel"
                value={toPersianDigits(phone)}
                onChange={(e) => setPhone(toEnglishDigits(e.target.value))}
                placeholder="مثلاً ۰۹۱۲۳۴۵۶۷۸۹"
                className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm mb-4 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={loading}
                className="w-full h-12 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    در حال ارسال...
                  </>
                ) : (
                  "ارسال کد تأیید"
                )}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-4 text-center">
                کد به شمارهٔ{" "}
                <span className="font-bold text-gray-900">
                  {toPersianDigits(phone)}
                </span>{" "}
                پیامک شد.
              </p>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                کد تأیید
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm mb-4 text-center tracking-[0.5em] focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                disabled={loading}
                className="w-full h-12 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    در حال بررسی...
                  </>
                ) : (
                  "تأیید و ورود"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setError("");
                  setCode("");
                }}
                className="w-full mt-3 text-sm text-blue-600 hover:underline"
              >
                ویرایش شماره تلفن
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}