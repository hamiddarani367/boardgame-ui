import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * عدد را به صورت فارسی (با ارقام فارسی و جداکنندهٔ سه‌رقمی) برمی‌گرداند
 */
export function formatPrice(price: number | null | undefined): string {
  if (typeof price !== "number" || isNaN(price)) return "۰";
  return price.toLocaleString("fa-IR");
}

/**
 * یک عدد را به ارقام فارسی تبدیل می‌کند (بدون جداکننده)
 */
export function toPersianDigits(num: number | string): string {
  return String(num).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
}

export function toEnglishDigits(value: string): string {
  const persianDigits = /[۰-۹]/g;
  const map: Record<string, string> = {
    "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
    "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
  };
  return value.replace(persianDigits, (digit) => map[digit] || digit);
}
