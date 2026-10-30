"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const PLACEHOLDER_IMAGE = "/images/placeholder.jpg"; // put your placeholder in public/images

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  // Filter out empty strings and invalid URLs
  const validImages = images.filter(
    (img) => img && img.trim() !== "" && img.trim() !== "/"
  );
  const finalImages = validImages.length > 0 ? validImages : [PLACEHOLDER_IMAGE];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 cursor-pointer"
        onClick={() => openModal(selectedIndex)}
      >
        <Image
          src={finalImages[selectedIndex]}
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {finalImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {finalImages.map((image, index) => (
            <div
              key={index}
              className={`relative aspect-square w-16 flex-shrink-0 overflow-hidden rounded-xl cursor-pointer border-2 transition-colors ${
                index === selectedIndex
                  ? "border-blue-500"
                  : "border-transparent hover:border-gray-300"
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <Image
                src={image}
                alt={productName}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative max-w-3xl w-full">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative aspect-square w-full">
              <Image
                src={finalImages[selectedIndex]}
                alt={productName}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}