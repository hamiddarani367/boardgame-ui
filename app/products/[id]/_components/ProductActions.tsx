"use client";

import { Heart, Bell, Share2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ProductActions() {
  const actions = [
    { icon: Heart, label: "افزودن به علاقه‌مندی" },
    { icon: Bell, label: "اطلاع‌رسانی تخفیف" },
    { icon: Share2, label: "اشتراک‌گذاری محصول" },
  ];

  return (
    <TooltipProvider>
      <div className="flex md:flex-col gap-3">
        {actions.map(({ icon: Icon, label }) => (
          <Tooltip key={label}>
            <TooltipTrigger
              className="h-10 w-10 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors"
              aria-label={label}
            >
              <Icon className="h-5 w-5" />
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-gray-700 text-white text-xs border-0"
            >
              {label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}