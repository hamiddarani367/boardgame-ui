import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Heart, MapPin, Clock } from "lucide-react";

export default function DashboardPage() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-600">سفارشات</CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">۱۲</div>
            <p className="text-xs text-gray-500 mt-1">۲ سفارش در حال انجام</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-600">علاقه‌مندی‌ها</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">۸</div>
            <p className="text-xs text-gray-500 mt-1">۳ مورد جدید اضافه شده</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-600">آدرس‌ها</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">۳</div>
            <p className="text-xs text-gray-500 mt-1">آدرس پیش‌فرض: خانه</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-black mb-4">آخرین سفارشات</h2>
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p>شما هنوز سفارشی ثبت نکرده‌اید</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}