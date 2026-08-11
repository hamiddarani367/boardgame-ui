import { useCallback, useRef } from "react";
import { useAuth } from "./useAuth";
import { API_BASE_URL } from "@/lib/constants";

// نوع هر آیتم در صف درخواست‌های معوقه
interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

export function useApi() {
  const { accessToken, refreshToken, login, logout } = useAuth();
  const isRefreshing = useRef(false);
  const failedQueue = useRef<QueueItem[]>([]);

  const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.current.forEach((item) => {
      if (error) {
        item.reject(error);
      } else {
        item.resolve(token!);
      }
    });
    failedQueue.current = [];
  };

  const refreshAccessToken = useCallback(async (): Promise<string> => {
    if (!refreshToken) throw new Error("No refresh token");

    const res = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) throw new Error("Refresh failed");

    const data = await res.json();
    login(data.access_token, data.refresh_token, {
      id: data.user?.id || "",
      phone: data.user?.phone || "",
      name: data.user?.name || "",
    });

    return data.access_token;
  }, [refreshToken, login]);

  const apiFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers || {});
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }

      let response = await fetch(url, { ...options, headers });

      if (response.status === 401) {
        // اگر در حال refresh هستیم، در صف قرار بگیر
        if (isRefreshing.current) {
          return new Promise<Response>((resolve, reject) => {
            failedQueue.current.push({
              resolve: (token: string) => {
                headers.set("Authorization", `Bearer ${token}`);
                resolve(fetch(url, { ...options, headers }));
              },
              reject,
            });
          });
        }

        isRefreshing.current = true;

        try {
          const newToken = await refreshAccessToken();
          processQueue(null, newToken);
          // درخواست را با توکن جدید تکرار کن
          headers.set("Authorization", `Bearer ${newToken}`);
          response = await fetch(url, { ...options, headers });
        } catch (error) {
          processQueue(error, null);
          logout();
          window.location.href = "/auth/signin";
          throw error;
        } finally {
          isRefreshing.current = false;
        }
      }

      return response;
    },
    [accessToken, refreshAccessToken, logout]
  );

  return apiFetch;
}