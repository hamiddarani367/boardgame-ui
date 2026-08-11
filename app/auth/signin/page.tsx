"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toPersianDigits, toEnglishDigits } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";

export default function SignInPage() {
  const router = useRouter();
  const { user, login, isLoading } = useAuth();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // اگر کاربر قبلاً لاگین کرده، به صفحه اصلی برود
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">در حال بارگذاری...</p>
      </div>
    );
  }

  if (user) return null;

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
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: toEnglishDigits(phone) }),
      });

      if (res.ok) {
        setStep("code");
      } else {
        const data = await res.json();
        setError(data.message || "خطا در ارسال کد");
      }
    } catch {
      setError("خطا در ارتباط با سرور");
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
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: toEnglishDigits(phone),
          otp: code,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.access_token, data.refresh_token, {
          id: data.user?.id || phone,
          phone: toEnglishDigits(phone),
          name: data.user?.name || `کاربر ${phone.slice(-4)}`,
        });
        router.push("/");
      } else {
        setError(data.message || "کد اشتباه یا منقضی شده");
      }
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
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

      {/* بخش فرم (بدون کارت، فقط padding) */}
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
                className="w-full h-12 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "در حال ارسال..." : "ارسال کد تأیید"}
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
                className="w-full h-12 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "در حال بررسی..." : "تأیید و ورود"}
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