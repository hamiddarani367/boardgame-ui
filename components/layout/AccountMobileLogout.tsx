"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AccountMobileLogout() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="lg:hidden flex items-center gap-1 text-sm text-red-600 hover:underline"
    >
      <LogOut className="h-4 w-4" />
      خروج
    </button>
  );
}