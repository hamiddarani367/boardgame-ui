"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  Minus, Plus, Trash2, ChevronLeft, Tag,
  MapPin, Clock, PlusCircle, CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Select from "react-select";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  updateQuantity,
  removeItem,
  placeOrder,
  resetOrderStatus,
} from "@/store/cartSlice";

// تنظیمات سایت
import { getSiteSettings } from "@/lib/settings";

// فرمت‌کننده اعداد فارسی
import { formatPrice } from "@/lib/utils";

// بارگذاری پویای LocationPicker
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

// استایل‌های react-select (همانند قبل)
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

// داده‌های ثابت (آدرس‌ها، استان‌ها و ...)
const savedAddresses = [
  {
    id: "addr1", title: "خانه", province: "تهران", city: "تهران",
    address: "خیابان ولیعصر، بالاتر از پارک وی، کوچه نسترن، پلاک ۱۲، واحد ۳",
    postalCode: "1234567890",
  },
  {
    id: "addr2", title: "محل کار", province: "تهران", city: "تهران",
    address: "سعادت‌آباد، بلوار دریا، خیابان مطهری، پلاک ۴۵، طبقه ۲",
    postalCode: "0987654321",
  },
];

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

const deliveryOptions = [
  { id: "opt1", dateLabel: "امروز - ۶ مرداد ۱۴۰۴", timeLabel: "۹:۰۰ - ۱۲:۰۰" },
  { id: "opt2", dateLabel: "امروز - ۶ مرداد ۱۴۰۴", timeLabel: "۱۵:۰۰ - ۱۸:۰۰" },
  { id: "opt3", dateLabel: "فردا - ۷ مرداد ۱۴۰۴", timeLabel: "۹:۰۰ - ۱۲:۰۰" },
  { id: "opt4", dateLabel: "فردا - ۷ مرداد ۱۴۰۴", timeLabel: "۱۵:۰۰ - ۱۸:۰۰" },
];

export default function CartPage() {
  // Redux
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { orderStatus, paymentUrl, error } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();

  // Local states
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
  const [addressError, setAddressError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const deliverySectionRef = useRef<HTMLDivElement>(null);

  const [newProvince, setNewProvince] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newPostalCode, setNewPostalCode] = useState("");
  const [newAddressTitle, setNewAddressTitle] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([35.6892, 51.3890]);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  // تنظیمات سایت
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(2_000_000);
  const [shippingCost, setShippingCost] = useState(49_000);

  useEffect(() => {
    getSiteSettings().then((s) => {
      setFreeShippingThreshold(s.freeShippingThreshold);
      setShippingCost(s.shippingCost);
    });
  }, []);

  // پاک کردن وضعیت سفارش هنگام mount
  useEffect(() => {
    dispatch(resetOrderStatus());
  }, [dispatch]);

  // هدایت به درگاه پرداخت (فقط یک بار) و سپس ریست وضعیت
  useEffect(() => {
    if (orderStatus === "succeeded" && paymentUrl) {
      window.location.href = paymentUrl;
      // بلافاصله وضعیت سفارش را ریست کن تا با بازگشت دوباره هدایت نشود
      dispatch(resetOrderStatus());
    }
  }, [orderStatus, paymentUrl, dispatch]);

  // ---- محاسبات ----
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.discountedPrice ?? item.price;
    return sum + price * item.quantity;
  }, 0);

  const totalDiscount = cartItems.reduce((sum, item) => {
    if (item.discountedPrice) return sum + (item.price - item.discountedPrice) * item.quantity;
    return sum;
  }, 0);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isFreeShipping = totalPrice >= freeShippingThreshold;
  const shippingCharge = isFreeShipping ? 0 : shippingCost;
  const finalPrice = (discountApplied ? totalPrice * 0.9 : totalPrice) + shippingCharge;
  const isSubmitting = orderStatus === "loading";

  // ---- Handlers ----
  const handleUpdateQuantity = (id: string, delta: number) => {
    dispatch(updateQuantity({ id, delta }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeItem(id));
  };

  const handleApplyDiscount = () => {
    if (discountCode.trim().length > 0) setDiscountApplied(true);
  };

  const handleContinue = () => {
    if (!selectedAddressId || !selectedDeliveryId) {
      setAddressError(true);
      deliverySectionRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    dispatch(
      placeOrder({
        addressId: selectedAddressId,
        deliveryOptionId: selectedDeliveryId,
        discountCode: discountApplied ? discountCode : undefined,
      })
    );
  };

  const handleSaveAddress = () => {
    alert("آدرس جدید ذخیره شد (نمونه)");
    setDialogOpen(false);
  };

  const isSaveDisabled =
    !newProvince || !newCity || !newAddress.trim() || !newAddressTitle.trim() || !newPostalCode.trim();

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
        setNewAddress(shortAddress);

        const state = data.address.state || data.address.province || data.address.region || "";
        const city = data.address.city || data.address.town || data.address.village || data.address.county || "";

        if (state) {
          const matchedProvince = provinces.find((p) => {
            const label = p.label.toLowerCase();
            const stateLower = state.toLowerCase();
            return label.includes(stateLower) || stateLower.includes(label);
          });
          if (matchedProvince) {
            setNewProvince(matchedProvince.value);
            if (city) {
              const cityList = cities[matchedProvince.value] || [];
              const matchedCity = cityList.find((c) => {
                const cityLower = c.toLowerCase();
                const searchLower = city.toLowerCase();
                return cityLower.includes(searchLower) || searchLower.includes(cityLower);
              });
              if (matchedCity) {
                setNewCity(matchedCity);
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

  const handleCityChange = (cityName: string) => {
    setNewCity(cityName);
    setNewAddress("");
    if (cityCoordinates[cityName]) {
      setMapCenter(cityCoordinates[cityName]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 w-full">
      <div className="w-full px-6 md:px-10 lg:px-16 py-6">
        <div className="mx-auto max-w-[130rem]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">خانه</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">سبد خرید</span>
          </nav>

          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-8">🛒 سبد خرید</h1>

          {cartItems.length === 0 && orderStatus !== "succeeded" ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <ShoppingCartEmpty />
              <p className="mt-4 text-lg font-medium">سبد خرید شما خالی است</p>
              <Link href="/products" className="mt-2 text-blue-600 hover:underline">بازگشت به فروشگاه</Link>
            </div>
          ) : orderStatus === "succeeded" ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-lg font-medium text-green-600">سفارش شما با موفقیت ثبت شد</p>
              <p className="text-sm mt-2">در حال انتقال به درگاه پرداخت...</p>
            </div>
          ) : (
            <>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-xl px-4 py-3">
                    <div className="col-span-5">محصول</div>
                    <div className="col-span-2 text-center">قیمت واحد</div>
                    <div className="col-span-2 text-center">تعداد</div>
                    <div className="col-span-2 text-center">قیمت کل</div>
                    <div className="col-span-1"></div>
                  </div>

                  {cartItems.map((item) => {
                    const unitPrice = item.discountedPrice ?? item.price;
                    const itemTotal = unitPrice * item.quantity;
                    const isMaxReached = item.quantity >= item.stockCount;
                    return (
                      <div key={item.id} className="bg-white dark:bg-gray-900 rounded-xl p-4">
                        <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                          <div className="md:col-span-5 flex items-center gap-4 w-full">
                            <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                              <Image src={item.image} alt={item.title} fill className="object-cover" />
                            </div>
                            <div>
                              <Link href={`/products/${item.id}`} className="font-bold text-gray-900 dark:text-white hover:text-blue-600 block">{item.persianTitle}</Link>
                              <p className="text-xs text-gray-500 mt-0.5">{item.title}</p>
                              {item.discountedPrice && (
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-gray-400 line-through">{formatPrice(item.price)}</span>
                                  <span className="text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full">
                                    ٪{Math.round(((item.price - item.discountedPrice) / item.price) * 100)}
                                  </span>
                                </div>
                              )}
                              {item.stockCount === 0 && (
                                <p className="text-xs text-red-500 mt-1">⚠️ این محصول ناموجود است</p>
                              )}
                            </div>
                          </div>
                          <div className="md:col-span-2 text-center text-sm font-bold">{formatPrice(unitPrice)} تومان</div>
                          <div className="md:col-span-2 flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-lg"
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                              disabled={item.stockCount === 0}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-lg"
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                              disabled={isMaxReached || item.stockCount === 0}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="md:col-span-2 text-center font-bold text-blue-600 dark:text-blue-400">
                            {formatPrice(itemTotal)} تومان
                            {item.stockCount > 0 && (
                              <p className="text-[10px] text-gray-500 mt-1">
                                {item.stockCount - item.quantity} عدد باقی‌مانده
                              </p>
                            )}
                          </div>
                          <div className="md:col-span-1 flex justify-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="md:hidden">
                          <div className="flex gap-3">
                            <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                              <Image src={item.image} alt={item.title} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link href={`/products/${item.id}`} className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{item.persianTitle}</Link>
                              <p className="text-[11px] text-gray-500 mt-0.5">{item.title}</p>
                              <p className="text-xs font-bold text-blue-600 mt-1">{formatPrice(unitPrice)} تومان</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-lg"
                                onClick={() => handleUpdateQuantity(item.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-lg"
                                onClick={() => handleUpdateQuantity(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="font-bold text-blue-600 text-sm">{formatPrice(itemTotal)} تومان</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-between items-center pt-4">
                    <Link href="/products" className="flex items-center gap-1 text-sm text-blue-600 hover:underline"><ChevronLeft className="h-4 w-4" /> ادامه خرید</Link>
                  </div>
                </div>

                {/* خلاصه سفارش */}
                <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 sticky top-28">
                    <h3 className="font-black text-lg mb-4">خلاصه سفارش</h3>
                    <Separator />
                    <div className="space-y-3 mt-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">تعداد کالاها</span>
                        <span className="font-bold">{totalItems}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">قیمت کالاها</span>
                        <span className="font-bold">{formatPrice(totalPrice)} تومان</span>
                      </div>
                      {totalDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>تخفیف محصولات</span>
                          <span>{formatPrice(totalDiscount)} تومان</span>
                        </div>
                      )}
                      {discountApplied && (
                        <div className="flex justify-between text-green-600">
                          <span>کد تخفیف</span>
                          <span>-{formatPrice(Math.round(totalPrice * 0.1))} تومان</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">هزینهٔ ارسال</span>
                        {isFreeShipping ? (
                          <span className="text-green-600 font-bold">رایگان</span>
                        ) : (
                          <span className="font-bold">{formatPrice(shippingCharge)} تومان</span>
                        )}
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between text-lg font-black">
                      <span>مبلغ نهایی</span>
                      <span className="text-blue-600">{formatPrice(finalPrice)} تومان</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Input placeholder="کد تخفیف" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} className="h-10 rounded-xl text-sm" />
                      <Button variant="outline" className="h-10 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50" onClick={handleApplyDiscount} disabled={discountApplied}><Tag className="h-4 w-4" /></Button>
                    </div>
                    {discountApplied && <p className="text-green-600 text-xs mt-1">کد تخفیف با موفقیت اعمال شد</p>}

                    {!isFreeShipping && (
                      <p className="text-[11px] text-gray-500 mt-3 text-center">
                        با خرید {formatPrice(freeShippingThreshold)} تومان، ارسال شما <span className="text-green-600 font-bold">رایگان</span> می‌شود.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div ref={deliverySectionRef} className="mt-12 bg-white dark:bg-gray-900 rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="flex items-center gap-2 text-lg font-black">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    آدرس و زمان تحویل
                  </h2>
                  <Button variant="outline" size="sm" className="rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900" onClick={() => setDialogOpen(true)}>
                    <PlusCircle className="h-4 w-4 ml-1" />
                    افزودن آدرس جدید
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {savedAddresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                          : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => { setSelectedAddressId(addr.id); setAddressError(false); }}
                        className="mt-1 accent-blue-600"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{addr.title}</span>
                          {selectedAddressId === addr.id && (
                            <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs shrink-0">
                              <CheckCircle className="h-3 w-3 ml-1" /> انتخاب شده
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">{addr.address}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{addr.province}، {addr.city} | کد پستی: {addr.postalCode}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold mb-3">
                    <Clock className="h-4 w-4 text-blue-600" />
                    زمان تحویل
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {deliveryOptions.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                          selectedDeliveryId === opt.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                            : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="delivery"
                          value={opt.id}
                          checked={selectedDeliveryId === opt.id}
                          onChange={() => { setSelectedDeliveryId(opt.id); setAddressError(false); }}
                          className="mt-1 accent-blue-600"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-sm">{opt.dateLabel}</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">🕒 {opt.timeLabel}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {addressError && (
                  <p className="text-red-500 text-sm mt-4">لطفاً آدرس و زمان تحویل را انتخاب کنید.</p>
                )}

                {error && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <Button
                  onClick={handleContinue}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-12 rounded-xl text-base disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      در حال ثبت سفارش...
                    </span>
                  ) : (
                    "ادامه ثبت سفارش"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-sm:!max-w-full max-sm:!h-dvh max-sm:!rounded-none sm:!max-w-[90vw] !p-6 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>افزودن آدرس جدید</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-bold mb-1.5 block">عنوان آدرس</Label>
                <Input
                  placeholder="مثلاً خانه"
                  value={newAddressTitle}
                  onChange={(e) => setNewAddressTitle(e.target.value)}
                  className="rounded-xl h-11 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-bold mb-1.5 block">کد پستی</Label>
                <Input
                  placeholder="۱۰ رقمی"
                  value={newPostalCode}
                  onChange={(e) => setNewPostalCode(e.target.value)}
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
                  value={provinces.find((p) => p.value === newProvince) || null}
                  onChange={(option) => {
                    setNewProvince(option?.value ?? "");
                    setNewCity("");
                    setNewAddress("");
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
                  options={(cities[newProvince] || []).map((c) => ({ value: c, label: c }))}
                  value={newCity ? { value: newCity, label: newCity } : null}
                  onChange={(option) => handleCityChange(option?.value ?? "")}
                  placeholder="انتخاب شهر"
                  styles={selectCustomStyles}
                  noOptionsMessage={() => "موردی یافت نشد"}
                  isDisabled={!newProvince}
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-bold mb-1.5 block">آدرس دقیق</Label>
              <Input
                placeholder="خیابان، کوچه، پلاک، واحد"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="rounded-xl h-11 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                required
              />
              {isFetchingAddress && (
                <p className="text-xs text-blue-600 mt-1">در حال دریافت آدرس...</p>
              )}
            </div>

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
              <Button variant="outline" className="rounded-xl" onClick={() => setDialogOpen(false)}>انصراف</Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSaveAddress}
                disabled={isSaveDisabled}
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

function ShoppingCartEmpty() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
  );
}