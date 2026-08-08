"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getUserProfile, type UserProfile } from "@/lib/user";

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
  });

  useEffect(() => {
    getUserProfile().then(setProfile);
  }, []);

  return (
    <div>
      <Card className="shadow-sm border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-black">اطلاعات شخصی</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label className="text-sm font-bold mb-1.5 block">نام</Label>
              <Input
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className="rounded-xl h-11 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
              />
            </div>
            <div>
              <Label className="text-sm font-bold mb-1.5 block">نام خانوادگی</Label>
              <Input
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className="rounded-xl h-11 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
              />
            </div>
            <div>
              <Label className="text-sm font-bold mb-1.5 block">شماره موبایل</Label>
              <Input
                value={profile.mobile}
                onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                className="rounded-xl h-11 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
              />
            </div>
            <div>
              <Label className="text-sm font-bold mb-1.5 block">ایمیل</Label>
              <Input
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="rounded-xl h-11 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8">
            ذخیره تغییرات
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}