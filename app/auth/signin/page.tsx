"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toPersianDigits, toEnglishDigits } from "@/lib/utils";

// حذف موقت BACKEND_URL چون استفاده نمی‌شود
// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mockOtp, setMockOtp] = useState(""); // کد mock برای نمایش

  // اعتبارسنجی شماره موبایل ایران
  const validatePhone = (phoneNumber: string): boolean => {
    const cleanPhone = toEnglishDigits(phoneNumber).replace(/\D/g, "");
    return /^09\d{9}$/.test(cleanPhone);
  };

  const handleSendCode = async () => {
    setError("");

    // اعتبارسنجی قبل از ارسال
    if (!validatePhone(phone)) {
      setError("شماره موبایل معتبر نیست. مثال: ۰۹۱۲۳۴۵۶۷۸۹");
      return;
    }

    setLoading(true);

    // شبیه‌سازی تأخیر شبکه
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // تولید کد ۴ رقمی تصادفی
    const fakeCode = Math.floor(1000 + Math.random() * 9000).toString();
    setMockOtp(fakeCode);
    console.log(`📱 کد تأیید برای ${toEnglishDigits(phone)}: ${fakeCode}`);

    setStep("code");
    setLoading(false);
  };

  const handleVerifyCode = async () => {
    setError("");
    if (code !== mockOtp) {
      setError("کد وارد شده اشتباه است");
      return;
    }

    setLoading(true);
    // شبیه‌سازی login (بدون fetch)
    login("fake_access_token", "fake_refresh_token", {
      id: "1",
      phone: toEnglishDigits(phone),
      name: `کاربر ${phone.slice(-4)}`,
    });
    router.push("/");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {step === "phone" ? "ورود / ثبت‌نام" : "تأیید کد"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}

        {step === "phone" ? (
          <div>
            <label className="block text-sm font-medium mb-1">شماره تلفن</label>
            <input
              type="tel"
              value={toPersianDigits(phone)}
              onChange={(e) => setPhone(toEnglishDigits(e.target.value))}
              placeholder="مثلاً ۰۹۱۲۳۴۵۶۷۸۹"
              className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm mb-4 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              required
            />
            <button
              type="button"
              onClick={handleSendCode}
              disabled={loading}
              className="w-full h-11 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "در حال ارسال..." : "ارسال کد تأیید"}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              کد به شمارهٔ{" "}
              <span className="font-bold">{toPersianDigits(phone)}</span> پیامک شد.
            </p>
            <label className="block text-sm font-medium mb-1">کد تأیید</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm mb-4 text-center tracking-[0.5em] focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              required
            />
            {/* نمایش کد mock برای تست */}
            <p className="text-xs text-gray-400 mb-4 text-center">
              کد تست: <span className="font-mono font-bold text-blue-600">{mockOtp}</span>
            </p>
            <button
              type="button"
              onClick={handleVerifyCode}
              disabled={loading}
              className="w-full h-11 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
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
  );
}