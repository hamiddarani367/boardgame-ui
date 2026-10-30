"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUpdateUserProfile } from "@/hooks/useUpdateUserProfile";
import type { UserProfile, UpdateUserProfileBody } from "@/types/user";
import { toPersianDigits } from "@/lib/utils";

export default function SettingsPage() {
  const { data: profile, isLoading, isError } = useUserProfile();

  if (isLoading) {
    return (
      <Card className="shadow-sm border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-black">اطلاعات شخصی</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-11 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !profile) {
    return (
      <Card className="shadow-sm border-gray-200 dark:border-gray-800">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 dark:text-red-400">
            خطا در دریافت اطلاعات کاربر
          </p>
        </CardContent>
      </Card>
    );
  }

  // ✅ با key، هر بار profile تغییر کند، فرم از نو mount می‌شود
  return (
    <ProfileForm
      key={`${profile.id ?? "user"}-${profile.first_name}-${profile.last_name}-${profile.email ?? ""}`}
      profile={profile}
    />
  );
}

// ==================== فرم داخلی ====================

function ProfileForm({ profile }: { profile: UserProfile }) {
  // ✅ مقدار اولیهٔ state مستقیماً از props
  const [firstName, setFirstName] = useState(profile.first_name ?? "");
  const [lastName, setLastName] = useState(profile.last_name ?? "");
  const [email, setEmail] = useState(profile.email ?? "");
  const phone = profile.phone ?? "";

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate: updateProfile, isPending: isSaving } = useUpdateUserProfile();

  const handleSave = () => {
    setSuccess(false);
    setError(null);

    const body: UpdateUserProfileBody = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
    };

    updateProfile(body, {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      },
      onError: (err) => {
        const axiosErr = err as unknown as {
          response?: { data?: { error?: string; message?: string } };
        };
        setError(
          axiosErr?.response?.data?.error ||
            axiosErr?.response?.data?.message ||
            "خطا در ذخیره تغییرات"
        );
      },
    });
  };

  const isDisabled = !firstName.trim() || !lastName.trim();

  return (
    <Card className="shadow-sm border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-black">اطلاعات شخصی</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* نام */}
          <div>
            <Label className="text-sm font-bold mb-1.5 block">نام</Label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="نام خود را وارد کنید"
              className="rounded-xl h-11"
            />
          </div>

          {/* نام خانوادگی */}
          <div>
            <Label className="text-sm font-bold mb-1.5 block">
              نام خانوادگی
            </Label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="نام خانوادگی خود را وارد کنید"
              className="rounded-xl h-11"
            />
          </div>

          {/* شماره موبایل (غیرقابل ویرایش) */}
          <div>
            <Label className="text-sm font-bold mb-1.5 block">
              شماره موبایل
            </Label>
            <Input
              value={toPersianDigits(phone)}
              readOnly
              disabled
              className="rounded-xl h-11 bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-500"
              title="شماره موبایل قابل ویرایش نیست"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              شماره موبایل قابل ویرایش نیست.
            </p>
          </div>

          {/* ایمیل */}
          <div>
            <Label className="text-sm font-bold mb-1.5 block">
              ایمیل{" "}
              <span className="text-gray-400 font-normal">(اختیاری)</span>
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="rounded-xl h-11"
              dir="ltr"
            />
          </div>
        </div>

        {/* پیام موفقیت */}
        {success && (
          <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
            <p className="text-green-700 dark:text-green-400 text-sm">
              تغییرات با موفقیت ذخیره شد
            </p>
          </div>
        )}

        {/* پیام خطا */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={handleSave}
          disabled={isSaving || isDisabled}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              در حال ذخیره...
            </>
          ) : (
            "ذخیره تغییرات"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}