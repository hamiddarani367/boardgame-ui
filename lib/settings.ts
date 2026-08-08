// lib/settings.ts

interface SiteSettings {
  freeShippingThreshold: number;
  shippingCost: number;
}

let cachedSettings: SiteSettings | null = null;

// تابع اصلی برای گرفتن تنظیمات
export async function getSiteSettings(): Promise<SiteSettings> {
  // اگر تنظیمات قبلاً گرفته شده باشد، از کش استفاده کن
  if (cachedSettings) {
    return cachedSettings;
  }

  // ------------------------------
  // 👇 فعلاً مقادیر ثابت (بعداً API واقعی)
  // ------------------------------
  const defaultSettings: SiteSettings = {
    freeShippingThreshold: 4_000_000, // تومان
    shippingCost: 49_000,             // تومان
  };

  // شبیه‌سازی تأخیر API (فعلاً مستقیم برمی‌گردانیم)
  // در آینده:
  // const response = await fetch('/api/settings');
  // const data = await response.json();
  // cachedSettings = data;

  cachedSettings = defaultSettings;
  return cachedSettings;
}

// در صورت نیاز، تابعی برای پاک کردن کش (مثلاً بعد از تغییر تنظیمات توسط ادمین)
export function clearSettingsCache() {
  cachedSettings = null;
}