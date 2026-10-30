"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Select, { type StylesConfig, type GroupBase } from "react-select";
import { useProvinces } from "@/hooks/useProvinces";
import { useCities } from "@/hooks/useCities";
import { useCreateAddress } from "@/hooks/useCreateAddress";
import { useUpdateAddress } from "@/hooks/useUpdateAddress";
import type { Address } from "@/types/address";

interface Option {
  value: number;
  label: string;
}

const selectCustomStyles: StylesConfig<Option, false, GroupBase<Option>> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#fff" : "#f3f4f6",
    border: state.isFocused ? "2px solid #3b82f6" : "2px solid transparent",
    borderRadius: "0.75rem",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(59,130,246,0.2)" : "none",
    minHeight: "44px",
    padding: "0 4px",
    fontSize: "0.875rem",
    transition: "all 0.2s",
    "&:hover": { borderColor: "#3b82f6" },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9ca3af",
    fontSize: "0.875rem",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#2563eb"
      : state.isFocused
      ? "#eff6ff"
      : "white",
    color: state.isSelected ? "white" : "#1f2937",
    fontSize: "0.875rem",
    ":active": { backgroundColor: "#bfdbfe" },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "1rem",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
    marginTop: "4px",
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  singleValue: (provided) => ({ ...provided, color: "#1f2937" }),
};

interface AddAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  limitReached?: boolean;
  currentAddressCount?: number;
  onSuccess?: () => void;
  address?: Address | null;
}

/** این کامپوننت داخلی است و با key از بیرون remount می‌شود */
function AddAddressDialogInner({
  open,
  onOpenChange,
  limitReached = false,
  currentAddressCount = 0,
  onSuccess,
  address = null,
}: AddAddressDialogProps) {
  const isEditMode = !!address;

  // ✅ مقدار اولیهٔ state مستقیماً از prop (بدون useEffect)
  const [title, setTitle] = useState(address?.title ?? "");
  const [postalCode, setPostalCode] = useState(address?.postal_code ?? "");
  const [provinceId, setProvinceId] = useState<number | null>(
    address?.province?.id ?? null
  );
  const [cityId, setCityId] = useState<number | null>(
    address?.city?.id ?? null
  );
  const [fullAddress, setFullAddress] = useState(
    address?.full_address ?? ""
  );
  const [error, setError] = useState<string | null>(null);

  const { data: provinces, isLoading: provincesLoading } = useProvinces();
  const { data: cities, isLoading: citiesLoading } = useCities(provinceId);
  const { mutate: createAddress, isPending: isCreating } = useCreateAddress();
  const { mutate: updateAddress, isPending: isUpdating } = useUpdateAddress();

  const isSaving = isCreating || isUpdating;

  const provinceOptions: Option[] =
    provinces?.map((p) => ({ value: p.id, label: p.name })) ?? [];
  const cityOptions: Option[] =
    cities?.map((c) => ({ value: c.id, label: c.name })) ?? [];

  const isSaveDisabled =
    !provinceId ||
    !cityId ||
    !fullAddress.trim() ||
    !title.trim() ||
    !postalCode.trim();

  const handleSubmit = () => {
    if (isSaveDisabled) return;
    if (!isEditMode && limitReached) return;
    setError(null);

    const basePayload = {
      title: title.trim(),
      full_address: fullAddress.trim(),
      province_id: provinceId!,
      city_id: cityId!,
      postal_code: postalCode.trim(),
    };

    if (isEditMode && address) {
      updateAddress(
        { id: address.id, body: basePayload },
        {
          onSuccess: () => {
            onOpenChange(false);
            onSuccess?.();
          },
          onError: (err) => {
            const axiosErr = err as unknown as {
              response?: { data?: { error?: string; message?: string } };
            };
            setError(
              axiosErr?.response?.data?.error ||
                axiosErr?.response?.data?.message ||
                "خطا در ویرایش آدرس"
            );
          },
        }
      );
    } else {
      createAddress(
        { ...basePayload, is_default: currentAddressCount === 0 },
        {
          onSuccess: () => {
            onOpenChange(false);
            onSuccess?.();
          },
          onError: (err) => {
            const axiosErr = err as unknown as {
              response?: { data?: { error?: string; message?: string } };
            };
            setError(
              axiosErr?.response?.data?.error ||
                axiosErr?.response?.data?.message ||
                "خطا در ذخیره آدرس"
            );
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-sm:!max-w-full max-sm:!h-dvh max-sm:!rounded-none sm:!max-w-[90vw] !p-6 overflow-y-auto sm:min-h-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "ویرایش آدرس" : "افزودن آدرس جدید"}
          </DialogTitle>
        </DialogHeader>

        {!isEditMode && limitReached && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl">
            <p className="text-amber-700 dark:text-amber-400 text-sm">
              شما به حداکثر تعداد آدرس مجاز رسیده‌اید.
            </p>
          </div>
        )}

        <div className="grid gap-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-bold mb-1.5 block">
                عنوان آدرس
              </Label>
              <Input
                placeholder="مثلاً خانه"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl h-11"
                disabled={!isEditMode && limitReached}
                required
              />
            </div>
            <div>
              <Label className="text-sm font-bold mb-1.5 block">
                کد پستی
              </Label>
              <Input
                placeholder="۱۰ رقمی"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="rounded-xl h-11"
                disabled={!isEditMode && limitReached}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-bold mb-1.5 block">استان</Label>
              <Select
                options={provinceOptions}
                value={
                  provinceId
                    ? provinceOptions.find((p) => p.value === provinceId) || null
                    : null
                }
                onChange={(option) => {
                  setProvinceId(option?.value ?? null);
                  setCityId(null);
                }}
                placeholder={
                  provincesLoading ? "در حال بارگذاری..." : "انتخاب استان"
                }
                styles={selectCustomStyles}
                noOptionsMessage={() => "موردی یافت نشد"}
                isLoading={provincesLoading}
                isDisabled={provincesLoading || (!isEditMode && limitReached)}
                menuPosition="fixed"
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : undefined
                }
                required
              />
            </div>
            <div>
              <Label className="text-sm font-bold mb-1.5 block">شهر</Label>
              <Select
                options={cityOptions}
                value={
                  cityId
                    ? cityOptions.find((c) => c.value === cityId) || null
                    : null
                }
                onChange={(option) => setCityId(option?.value ?? null)}
                placeholder={
                  citiesLoading ? "در حال بارگذاری..." : "انتخاب شهر"
                }
                styles={selectCustomStyles}
                noOptionsMessage={() => "موردی یافت نشد"}
                isLoading={citiesLoading}
                isDisabled={
                  !provinceId || citiesLoading || (!isEditMode && limitReached)
                }
                menuPosition="fixed"
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : undefined
                }
                required
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-bold mb-1.5 block">
              آدرس دقیق
            </Label>
            <Input
              placeholder="خیابان، کوچه، پلاک، واحد"
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              className="rounded-xl h-11"
              disabled={!isEditMode && limitReached}
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              انصراف
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={handleSubmit}
              disabled={isSaveDisabled || isSaving || (!isEditMode && limitReached)}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  در حال ذخیره...
                </>
              ) : isEditMode ? (
                "ذخیره تغییرات"
              ) : (
                "ذخیره آدرس"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * ✅ wrapper با key
 * هر بار که `address` یا `open` تغییر کند، کامپوننت از نو mount می‌شود
 * و state اولیه از props گرفته می‌شود (بدون نیاز به useEffect)
 */
export default function AddAddressDialog(props: AddAddressDialogProps) {
  const { open, address } = props;

  // اگر بسته است، چیزی رندر نکن (تا state reset شود)
  if (!open) return null;

  // key با id آدرس یا "new" برای حالت افزودن
  const key = address ? `edit-${address.id}` : "new";

  return <AddAddressDialogInner key={key} {...props} />;
}