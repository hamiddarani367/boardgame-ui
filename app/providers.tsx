"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { AuthProvider } from "@/providors/AuthProvidor";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Provider store={store}>{children}</Provider>
    </AuthProvider>
  );
}