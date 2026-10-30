"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, PlusCircle, Pencil, Trash2, Loader2 } from "lucide-react";
import { useAddresses } from "@/hooks/useAddresses";
import { useDeleteAddress } from "@/hooks/useDeleteAddress";
import AddAddressDialog from "@/components/AddAddressDialog";
import type { Address } from "@/types/address";

const MAX_ADDRESSES = 10;

export default function AddressesPage() {
  const { data: addresses, isLoading } = useAddresses();
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const addressCount = addresses?.length ?? 0;
  const addressLimitReached = addressCount >= MAX_ADDRESSES;

  const openAddDialog = () => {
    setEditingAddress(null);
    setDialogOpen(true);
  };

  const openEditDialog = (addr: Address) => {
    setEditingAddress(addr);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("آیا از حذف این آدرس مطمئن هستید؟")) {
      deleteAddress(id);
    }
  };

  // ---- حالت بارگذاری ----
  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          <div className="h-9 w-40 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
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
      {/* هدر */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">
            آدرس‌های من
          </h2>
          <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs">
            {addressCount} از {MAX_ADDRESSES}
          </Badge>
        </div>
        <div className="flex flex-col items-end">
          <Button
            size="sm"
            className="rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={openAddDialog}
            disabled={addressLimitReached}
          >
            <PlusCircle className="h-4 w-4 ml-1" />
            افزودن آدرس جدید
          </Button>
          {addressLimitReached && (
            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
              حداکثر {MAX_ADDRESSES} آدرس
            </p>
          )}
        </div>
      </div>

      {/* حالت خالی */}
      {addresses && addresses.length === 0 ? (
        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="p-8 text-center">
            <MapPin className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              هیچ آدرسی ثبت نشده است
            </p>
            <p className="text-sm text-gray-500 mb-4">
              برای ثبت سفارش، حداقل یک آدرس لازم است.
            </p>
            <Button
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
              onClick={openAddDialog}
            >
              <PlusCircle className="h-4 w-4 ml-1" />
              افزودن اولین آدرس
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses?.map((addr) => (
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {addr.title}
                      </span>
                      {addr.is_default && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
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
                      aria-label="ویرایش"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-red-600 rounded-lg disabled:opacity-50"
                      onClick={() => handleDelete(addr.id)}
                      disabled={isDeleting}
                      aria-label="حذف"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {addr.full_address}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {addr.province?.name}، {addr.city?.name} | کد پستی:{" "}
                  {addr.postal_code}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ✅ کامپوننت مشترک برای افزودن و ویرایش */}
      <AddAddressDialog
        open={dialogOpen}
        onOpenChange={(next) => {
          setDialogOpen(next);
          if (!next) setEditingAddress(null);
        }}
        limitReached={addressLimitReached}
        currentAddressCount={addressCount}
        address={editingAddress}
      />
    </div>
  );
}