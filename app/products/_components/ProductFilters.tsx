"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Select, { type MultiValue } from "react-select";
import { formatPrice } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

const CATEGORIES: Option[] = [
  { value: "strategy", label: "استراتژیک" },
  { value: "family", label: "خانوادگی" },
  { value: "party", label: "مهمانی" },
  { value: "card", label: "کارتی" },
  { value: "cooperative", label: "همکاری" },
  { value: "two-player", label: "دونفره" },
];

const PLAYERS: Option[] = [
  { value: "1", label: "۱ نفره" },
  { value: "2", label: "۲ نفره" },
  { value: "3", label: "۳-۴ نفره" },
  { value: "4", label: "۴+ نفره" },
];

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#f3f4f6" : "#f3f4f6",
    border: "none",
    borderRadius: "9999px",
    boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
    minHeight: "44px",
    padding: "0 4px",
    fontSize: "0.875rem",
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: "#e5e7eb",
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#9ca3af",
    fontSize: "0.875rem",
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: "#dbeafe",
    borderRadius: "9999px",
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: "#1e40af",
    fontSize: "0.75rem",
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: "#3b82f6",
    ":hover": {
      backgroundColor: "#bfdbfe",
      color: "#1e3a8a",
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#2563eb"
      : state.isFocused
      ? "#eff6ff"
      : "white",
    color: state.isSelected ? "white" : "#1f2937",
    fontSize: "0.875rem",
    ":active": {
      backgroundColor: "#bfdbfe",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: "1rem",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
    marginTop: "4px",
  }),
};

const toEnglishDigits = (value: string): string => {
  const persianDigits = /[۰-۹]/g;
  const map: { [key: string]: string } = {
    "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
    "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
  };
  return value.replace(persianDigits, (digit) => map[digit] || digit);
};

const extractNumericValue = (input: string) => {
  return toEnglishDigits(input).replace(/[^0-9]/g, "");
};

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategories =
    searchParams.get("category")?.split(",").filter(Boolean) || [];
  const selectedPlayers =
    searchParams.get("players")?.split(",").filter(Boolean) || [];

  const categoryValues = CATEGORIES.filter((cat) =>
    selectedCategories.includes(cat.value)
  );
  const playerValues = PLAYERS.filter((p) =>
    selectedPlayers.includes(p.value)
  );

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  useEffect(() => {
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, [searchParams]);

  const updateMultiParam = (key: string, options: MultiValue<Option>) => {
    const values = options.map((opt) => opt.value);
    const params = new URLSearchParams(searchParams.toString());
    if (values.length > 0) {
      params.set(key, values.join(","));
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const applyPriceFilter = (field: "minPrice" | "maxPrice", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(field, value);
    } else {
      params.delete(field);
    }
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  return (
    <div>
      <h3 className="font-black text-lg mb-5">🎯 فیلترها</h3>

      {/* دسته‌بندی */}
      <div className="mb-5">
        <Label className="text-sm font-bold mb-2 block">دسته‌بندی</Label>
        <Select
          instanceId="category-select"
          isMulti
          options={CATEGORIES}
          value={categoryValues}
          onChange={(newValue) => updateMultiParam("category", newValue)}
          placeholder="همه"
          styles={customStyles}
          noOptionsMessage={() => "موردی یافت نشد"}
          isClearable={false}
        />
      </div>

      {/* تعداد بازیکن */}
      <div className="mb-5">
        <Label className="text-sm font-bold mb-2 block">تعداد بازیکن</Label>
        <Select
          instanceId="players-select"
          isMulti
          options={PLAYERS}
          value={playerValues}
          onChange={(newValue) => updateMultiParam("players", newValue)}
          placeholder="همه"
          styles={customStyles}
          noOptionsMessage={() => "موردی یافت نشد"}
          isClearable={false}
        />
      </div>

      {/* حداقل قیمت */}
      <div className="mb-5">
        <Label className="text-sm font-bold mb-2 block">
          حداقل قیمت (تومان)
        </Label>
        <Input
          type="text"
          inputMode="numeric"
          placeholder="مثلاً ۵۰۰,۰۰۰"
          value={minPrice ? formatPrice(Number(minPrice)) : ""}
          onChange={(e) => setMinPrice(extractNumericValue(e.target.value))}
          onBlur={(e) =>
            applyPriceFilter("minPrice", extractNumericValue(e.target.value))
          }
          className="no-spinner w-full rounded-full bg-gray-100 dark:bg-gray-800 border-0 h-11 px-4 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
        />
      </div>

      {/* حداکثر قیمت */}
      <div className="mb-5">
        <Label className="text-sm font-bold mb-2 block">
          حداکثر قیمت (تومان)
        </Label>
        <Input
          type="text"
          inputMode="numeric"
          placeholder="مثلاً ۲,۰۰۰,۰۰۰"
          value={maxPrice ? formatPrice(Number(maxPrice)) : ""}
          onChange={(e) => setMaxPrice(extractNumericValue(e.target.value))}
          onBlur={(e) =>
            applyPriceFilter("maxPrice", extractNumericValue(e.target.value))
          }
          className="no-spinner w-full rounded-full bg-gray-100 dark:bg-gray-800 border-0 h-11 px-4 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
        />
      </div>

      {/* حذف فیلترها */}
      <Button
        onClick={() => router.push("/products")}
        className="w-full mt-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11"
      >
        حذف فیلترها
      </Button>
    </div>
  );
}