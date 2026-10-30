"use client";

import { CreditCard, Wallet, Banknote, Loader2, CheckCircle } from "lucide-react";
import { useGateways } from "@/hooks/useGateways";

interface PaymentGatewaySelectorProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
  error?: boolean;
}

/** آیکون بر اساس type یا slug درگاه */
function GatewayIcon({ type, slug }: { type: string; slug: string }) {
  const key = (slug || type || "").toLowerCase();

  if (key.includes("cash") || key.includes("cod") || type === "cash") {
    return <Banknote className="h-6 w-6 text-emerald-600" />;
  }
  if (key.includes("wallet") || key.includes("کیف")) {
    return <Wallet className="h-6 w-6 text-purple-600" />;
  }
  return <CreditCard className="h-6 w-6 text-blue-600" />;
}

export default function PaymentGatewaySelector({
  selectedId,
  onSelect,
  error = false,
}: PaymentGatewaySelectorProps) {
  const { data: gateways, isLoading, isError } = useGateways();

  return (
    <div>
      <h2 className="flex items-center gap-2 text-lg font-black mb-4">
        <CreditCard className="h-5 w-5 text-blue-600" />
        روش پرداخت
      </h2>

      {isLoading && (
        <div className="flex items-center justify-center py-8 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

      {isError && (
        <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-red-600 dark:text-red-400 text-sm">
            خطا در دریافت روش‌های پرداخت
          </p>
        </div>
      )}

      {!isLoading && !isError && (!gateways || gateways.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <CreditCard className="h-10 w-10 mx-auto text-gray-300 mb-2" />
          <p className="text-sm">هیچ روش پرداختی فعال نیست</p>
        </div>
      )}

      {!isLoading && !isError && gateways && gateways.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {gateways.map((gw) => {
            const isSelected = selectedId === gw.id;
            return (
              <label
                key={gw.id}
                className={`relative flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-sm"
                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="gateway"
                  value={gw.id}
                  checked={isSelected}
                  onChange={() => onSelect(gw.id)}
                  className="sr-only"
                />
                <div
                  className={`flex-shrink-0 p-2 rounded-xl transition-colors ${
                    isSelected
                      ? "bg-blue-100 dark:bg-blue-900"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  <GatewayIcon type={gw.type} slug={gw.slug} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-bold text-sm ${
                      isSelected
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {gw.name}
                  </p>
                  {gw.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      {gw.description}
                    </p>
                  )}
                </div>
                {isSelected && (
                  <CheckCircle className="h-5 w-5 text-blue-600 shrink-0" />
                )}
              </label>
            );
          })}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-4">
          لطفاً روش پرداخت را انتخاب کنید.
        </p>
      )}
    </div>
  );
}