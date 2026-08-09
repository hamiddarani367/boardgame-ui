import { useCallback, useRef } from "react";
import { useAuth } from "./useAuth";

interface FetchOptions extends RequestInit {
  retry?: boolean; // فقط برای کنترل داخلی
}

export function useApi() {
  const { accessToken, refreshToken, login, logout } = useAuth();
  const isRefreshing = useRef(false);
  const failedQueue = useRef<
    Array<{
      resolve: (token: string) => void;
      reject: (err: any) => void;
    }>
  >([]);

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.current.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token!);
      }
    });
    failedQueue.current = [];
  };

  const refreshAccessToken = useCallback(async (): Promise<string> => {
    if (!refreshToken) throw new Error("No refresh token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }
    );

    if (!res.ok) {
      throw new Error("Refresh failed");
    }

    const data = await res.json();
    // انتظار: { access_token, refresh_token, user }
    login(data.access_token, data.refresh_token, {
      id: data.user.id,
      phone: data.user.phone,
      name: data.user.name,
    });

    return data.access_token;
  }, [refreshToken, login]);

  const apiFetch = useCallback(
    async (url: string, options: FetchOptions = {}) => {
      const { retry, ...fetchOpts } = options; // جدا کردن retry

      // هدرهای اولیه
      const headers = new Headers(fetchOpts.headers || {});
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }

      let response = await fetch(url, {
        ...fetchOpts,
        headers,
      });

      // اگر 401 بود و قبلاً retry نکرده‌ایم
      if (response.status === 401 && !retry) {
        // اگر هم‌اکنون در حال refresh هستیم، در صف قرار بگیر
        if (isRefreshing.current) {
          return new Promise<Response>((resolve, reject) => {
            failedQueue.current.push({
              resolve: (token: string) => {
                headers.set("Authorization", `Bearer ${token}`);
                resolve(fetch(url, { ...fetchOpts, headers }));
              },
              reject,
            });
          });
        }

        isRefreshing.current = true;

        try {
          const newToken = await refreshAccessToken();
          processQueue(null, newToken);
          // درخواست را با توکن جدید تکرار کن (retry: true جلوگیری از حلقه)
          headers.set("Authorization", `Bearer ${newToken}`);
          response = await fetch(url, { ...fetchOpts, headers });
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