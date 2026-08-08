"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft, X } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const openModal = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
  };

  // اصلاح: فقط مودال را باز کن، selectedIndex را تغییر نده
  const handleThumbnailClick = (index: number) => {
    openModal(index);
  };

  const nextImage = () => {
    setModalIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setModalIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* تصویر اصلی – کلیک روی آن مودال را با همان تصویر باز می‌کند */}
      <div
        className="relative aspect-[4/3] md:aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer group"
        onClick={() => openModal(selectedIndex)}
      >
        <Image
          src={images[selectedIndex]}
          alt={productName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium bg-black/50 px-4 py-2">
            🔍 کلیک کنید
          </span>
        </div>
      </div>

      {/* thumbnail ها – کلیک فقط مودال را باز می‌کند، تصویر اصلی تغییر نمی‌کند */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 mt-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden border border-gray-100 dark:border-gray-800 transition-all",
                // برای نشان دادن تصویر فعال در مودال (اختیاری)
                // می‌توانید active را بر اساس modalIndex یا selectedIndex تنظیم کنید
                "opacity-60 hover:opacity-80"
              )}
            >
              <Image
                src={img}
                alt={`${productName} - thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* مودال گالری (بدون تغییر) */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-[70vw] h-[80vh] p-0 gap-0 bg-white dark:bg-gray-900 overflow-hidden flex flex-col [&>button:first-child]:hidden">
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-4 left-4 z-20 bg-black/50 hover:bg-black/70 text-white p-1.5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-1 min-h-0">
            {images.length > 1 && (
              <div className="hidden md:flex md:flex-col gap-2 p-3 bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 overflow-y-auto w-24 flex-shrink-0">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setModalIndex(index)}
                    className={cn(
                      "relative w-full aspect-square overflow-hidden border border-gray-100 dark:border-gray-800 transition-all",
                      modalIndex === index
                        ? "opacity-100 scale-105"
                        : "opacity-50 hover:opacity-80"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${productName} - thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 relative bg-gray-100 dark:bg-gray-800 min-h-0">
              <Image
                src={images[modalIndex]}
                alt={`${productName} - بزرگنمایی ${modalIndex + 1}`}
                fill
                className="object-contain p-4"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={nextImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-white p-2 transition-all"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={prevImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-white p-2 transition-all"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1">
                {modalIndex + 1} / {images.length}
              </div>
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex md:hidden gap-2 p-3 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setModalIndex(index)}
                  className={cn(
                    "relative w-12 h-12 flex-shrink-0 overflow-hidden border border-gray-100 dark:border-gray-800 transition-all",
                    modalIndex === index
                      ? "opacity-100 scale-105"
                      : "opacity-50 hover:opacity-80"
                  )}
                >
                  <Image
                    src={img}
                    alt={`${productName} - thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}