"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Select from "react-select";
import {
  MapPin, PlusCircle, Pencil, Trash2,
} from "lucide-react";
import { getAddresses, removeAddress, type Address } from "@/lib/addresses";

// بارگذاری LocationPicker فقط در کلاینت
const LocationPicker = dynamic(
  () => import("@/components/LocationPicker").then((mod) => mod.LocationPicker),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <span className="text-gray-500">در حال بارگذاری نقشه...</span>
      </div>
    ),
  }
);

// استایل‌های react-select (همانند سبد خرید)
const selectCustomStyles = {
  control: (provided: any, state: any) => ({
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
  placeholder: (provided: any) => ({ ...provided, color: "#9ca3af", fontSize: "0.875rem" }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#2563eb" : state.isFocused ? "#eff6ff" : "white",
    color: state.isSelected ? "white" : "#1f2937",
    fontSize: "0.875rem",
    ":active": { backgroundColor: "#bfdbfe" },
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: "1rem",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
    marginTop: "4px",
  }),
  singleValue: (provided: any) => ({ ...provided, color: "#1f2937" }),
};

const provinces = [
  { value: "tehran", label: "تهران" },
  { value: "esfahan", label: "اصفهان" },
  { value: "fars", label: "فارس" },
];

const cities: Record<string, string[]> = {
  tehran: ["تهران", "شمیرانات", "ری"],
  esfahan: ["اصفهان", "کاشان", "نجف‌آباد"],
  fars: ["شیراز", "مرودشت", "فسا"],
};

const cityCoordinates: Record<string, [number, number]> = {
  تهران: [35.6892, 51.3890],
  شمیرانات: [35.7988, 51.4347],
  ری: [35.5979, 51.4396],
  اصفهان: [32.6546, 51.6680],
  کاشان: [33.9871, 51.4393],
  نجف‌آباد: [32.6323, 51.3662],
  شیراز: [29.5926, 52.5836],
  مرودشت: [29.8742, 52.8027],
  فسا: [28.9449, 53.6485],
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formProvince, setFormProvince] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formPostalCode, setFormPostalCode] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([35.6892, 51.3890]);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  useEffect(() => {
    getAddresses().then((data) => {
      setAddresses(data);
      setLoading(false);
    });
  }, []);

  // ---- Reset form ----
  const resetForm = () => {
    setFormTitle("");
    setFormProvince("");
    setFormCity("");
    setFormAddress("");
    setFormPostalCode("");
    setMapCenter([35.6892, 51.3890]);
    setEditingId(null);
  };

  // ---- Open dialog for add/edit ----
  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (addr: Address) => {
    setEditingId(addr.id);
    setFormTitle(addr.title);
    setFormProvince(provinces.find((p) => p.label === addr.province)?.value || "");
    setFormCity(addr.city);
    setFormAddress(addr.address);
    setFormPostalCode(addr.postalCode);
    if (cityCoordinates[addr.city]) {
      setMapCenter(cityCoordinates[addr.city]);
    }
    setDialogOpen(true);
  };

  // ---- Handlers ----
  const handleSave = () => {
    // اینجا در آینده updateAddress یا addAddress را صدا می‌زنیم
    alert("آدرس ذخیره شد (نمونه)");
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    await removeAddress(id);
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleCityChange = (cityName: string) => {
    setFormCity(cityName);
    setFormAddress("");
    if (cityCoordinates[cityName]) {
      setMapCenter(cityCoordinates[cityName]);
    }
  };

  // Reverse geocoding
  const buildShortAddress = (addressObj: any): string => {
    const parts: string[] = [];
    if (addressObj.road) parts.push(addressObj.road);
    if (addressObj.neighbourhood) parts.push(addressObj.neighbourhood);
    if (addressObj.suburb) parts.push(addressObj.suburb);
    if (addressObj.city_district) parts.push(addressObj.city_district);
    if (addressObj.borough) parts.push(addressObj.borough);
    return parts.length > 0 ? parts.join("، ") : addressObj.display_name;
  };

  const fetchAddressFromCoordinates = useCallback(async (lat: number, lng: number) => {
    setIsFetchingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa`
      );
      const data = await response.json();
      if (data && data.address) {
        const shortAddress = buildShortAddress(data.address);
        setFormAddress(shortAddress);

        const state = data.address.state || data.address.province || data.address.region || "";
        const city = data.address.city || data.address.town || data.address.village || data.address.county || "";

        if (state) {
          const matchedProvince = provinces.find((p) => {
            const label = p.label.toLowerCase();
            const stateLower = state.toLowerCase();
            return label.includes(stateLower) || stateLower.includes(label);
          });
          if (matchedProvince) {
            setFormProvince(matchedProvince.value);
            if (city) {
              const cityList = cities[matchedProvince.value] || [];
              const matchedCity = cityList.find((c) => {
                const cityLower = c.toLowerCase();
                const searchLower = city.toLowerCase();
                return cityLower.includes(searchLower) || searchLower.includes(cityLower);
              });
              if (matchedCity) {
                setFormCity(matchedCity);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("خطا در دریافت آدرس:", error);
    } finally {
      setIsFetchingAddress(false);
    }
  }, []);

  const handleLocationChange = useCallback(
    (lat: number, lng: number) => {
      setMapCenter([lat, lng]);
      fetchAddressFromCoordinates(lat, lng);
    },
    [fetchAddressFromCoordinates]
  );

  // ---- Loading skeleton ----
  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="border-gray-200 dark:border-gray-800">
              <CardContent className="p-5">
                <div className="animate-pulse space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div />
        <Button
          size="sm"
          className="rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900"
          onClick={openAddDialog}
        >
          <PlusCircle className="h-4 w-4 ml-1" />
          افزودن آدرس جدید
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <Card
            key={addr.id}
            className="border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {addr.title}
                    </span>
                    {addr.isDefault && (
                      <Badge
                        variant="secondary"
                        className="mr-2 text-xs bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
                      >
                        پیش‌فرض
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-blue-600 rounded-lg"
                    onClick={() => openEditDialog(addr)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-red-600 rounded-lg"
                    onClick={() => handleDelete(addr.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {addr.address}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {addr.province}، {addr.city} | کد پستی: {addr.postalCode}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog افزودن / ویرایش (تمام‌صفحه در موبایل) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-sm:!max-w-full max-sm:!h-dvh max-sm:!rounded-none sm:!max-w-[90vw] !p-6 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "ویرایش آدرس" : "افزودن آدرس جدید"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-bold mb-1.5 block">عنوان آدرس</Label>
                <Input
                  placeholder="مثلاً خانه"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="rounded-xl h-11 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-bold mb-1.5 block">کد پستی</Label>
                <Input
                  placeholder="۱۰ رقمی"
                  value={formPostalCode}
                  onChange={(e) => setFormPostalCode(e.target.value)}
                  className="rounded-xl h-11 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-bold mb-1.5 block">استان</Label>
                <Select
                  options={provinces}
                  value={provinces.find((p) => p.value === formProvince) || null}
                  onChange={(option) => {
                    setFormProvince(option?.value ?? "");
                    setFormCity("");
                    setFormAddress("");
                  }}
                  placeholder="انتخاب استان"
                  styles={selectCustomStyles}
                  noOptionsMessage={() => "موردی یافت نشد"}
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-bold mb-1.5 block">شهر</Label>
                <Select
                  options={(cities[formProvince] || []).map((c) => ({
                    value: c,
                    label: c,
                  }))}
                  value={formCity ? { value: formCity, label: formCity } : null}
                  onChange={(option) => handleCityChange(option?.value ?? "")}
                  placeholder="انتخاب شهر"
                  styles={selectCustomStyles}
                  noOptionsMessage={() => "موردی یافت نشد"}
                  isDisabled={!formProvince}
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-bold mb-1.5 block">آدرس دقیق</Label>
              <Input
                placeholder="خیابان، کوچه، پلاک، واحد"
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                className="rounded-xl h-11 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                required
              />
              {isFetchingAddress && (
                <p className="text-xs text-blue-600 mt-1">در حال دریافت آدرس...</p>
              )}
            </div>

            {/* نقشه واقعی */}
            {dialogOpen && (
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <LocationPicker
                  key={`${mapCenter[0]}-${mapCenter[1]}`}
                  center={mapCenter}
                  onLocationChange={handleLocationChange}
                  height="320px"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" className="rounded-xl" onClick={() => setDialogOpen(false)}>
                انصراف
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={
                  !formTitle.trim() ||
                  !formProvince ||
                  !formCity ||
                  !formAddress.trim() ||
                  !formPostalCode.trim()
                }
              >
                ذخیره آدرس
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}