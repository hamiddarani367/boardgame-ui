"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingBag, CheckCircle, Truck, Clock,
  MapPin, CreditCard, Package, ChevronDown, ChevronUp,
} from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { getOrders, type Order } from "@/lib/orders";

const statusConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  "تحویل شده": { icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-950" },
  "در حال ارسال": { icon: Truck, color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-950" },
  "در حال پردازش": { icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50 dark:bg-orange-950" },
};

function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const status = statusConfig[order.status] || statusConfig["در حال پردازش"];
  const StatusIcon = status.icon;

  return (
    <Card className="border-gray-200 dark:border-gray-800">
      <button
        className="w-full text-right p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-xl"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${status.bgColor}`}>
            <StatusIcon className={`h-5 w-5 ${status.color}`} />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{order.id}</p>
            <p className="text-xs text-gray-500">{order.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`${status.bgColor} ${status.color} text-xs font-medium`}>
            {order.status}
          </Badge>
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {formatPrice(order.total)} تومان
          </span>
          {open ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4">
          <Separator className="mb-4" />
          <div className="space-y-3 mb-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{item.title}</p>
                  <p className="text-xs text-gray-500">تعداد: {item.quantity}</p>
                </div>
                <span className="text-sm font-bold">{formatPrice(item.price)} تومان</span>
              </div>
            ))}
          </div>

          <Separator className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">{order.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">{order.paymentMethod}</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">کد رهگیری: {order.trackingCode}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">
                جمع کل: {formatPrice(order.total)} تومان
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="border-gray-200 dark:border-gray-800">
            <CardContent className="p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="p-8 text-center text-gray-500">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium">شما هنوز سفارشی ثبت نکرده‌اید</p>
          </CardContent>
        </Card>
      ) : (
        orders.map((order) => <OrderCard key={order.id} order={order} />)
      )}
    </div>
  );
}