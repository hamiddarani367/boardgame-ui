import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  title: string;
  persianTitle: string;
  image: string;
  price: number;
  discountedPrice?: number;
  quantity: number;
  stockCount: number;
}

interface PlaceOrderParams {
  addressId: string;
  deliveryOptionId: string;
  discountCode?: string;
}

interface PlaceOrderResponse {
  orderId: string;
  paymentUrl: string;
}

interface CartState {
  items: CartItem[];
  orderStatus: "idle" | "loading" | "succeeded" | "failed";
  paymentUrl: string | null;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  orderStatus: "idle",
  paymentUrl: null,
  error: null,
};

// Async Thunk برای ثبت سفارش
export const placeOrder = createAsyncThunk<PlaceOrderResponse, PlaceOrderParams>(
  "cart/placeOrder",
  async (params, { rejectWithValue }) => {
    try {
      console.log("[Cart API] ثبت سفارش با پارامترها:", params);
      // شبیه‌سازی تأخیر شبکه
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // پاسخ نمونه (بعداً با fetch واقعی جایگزین کنید)
      const mockResponse: PlaceOrderResponse = {
        orderId: `ORD-${Date.now()}`,
        paymentUrl: `https://payment.example.com/pay?order=${Date.now()}`,
      };
      console.log("[Cart API] پاسخ دریافت شد:", mockResponse);
      return mockResponse;
    } catch (error: any) {
      console.error("[Cart API] خطا در ثبت سفارش:", error);
      return rejectWithValue(error.message || "خطا در برقراری ارتباط");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      console.log(`[Cart Redux] افزودن به سبد:`, action.payload);
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        const newQty = existing.quantity + action.payload.quantity;
        existing.quantity = Math.min(newQty, existing.stockCount);
      } else {
        state.items.push(action.payload);
      }
    },
    updateQuantity(state, action: PayloadAction<{ id: string; delta: number }>) {
      console.log(`[Cart Redux] تغییر تعداد:`, action.payload);
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        const newQty = item.quantity + action.payload.delta;
        item.quantity = Math.max(0, Math.min(newQty, item.stockCount));
        if (item.quantity === 0) {
          state.items = state.items.filter((i) => i.id !== action.payload.id);
        }
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      console.log(`[Cart Redux] حذف آیتم با id: ${action.payload}`);
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart(state) {
      console.log(`[Cart Redux] پاک کردن کل سبد`);
      state.items = [];
    },
    resetOrderStatus(state) {
      state.orderStatus = "idle";
      state.paymentUrl = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.orderStatus = "loading";
        state.error = null;
        state.paymentUrl = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderStatus = "succeeded";
        state.paymentUrl = action.payload.paymentUrl;
        // ❗ سبد دیگر اینجا پاک نمی‌شود – فقط پس از تأیید پرداخت پاک می‌کنیم.
        console.log("[Cart Redux] سفارش ثبت شد. لینک پرداخت:", action.payload.paymentUrl);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.orderStatus = "failed";
        state.error = (action.payload as string) || "خطای نامشخص";
        console.error("[Cart Redux] خطا در ثبت سفارش:", state.error);
      });
  },
});

export const { addToCart, updateQuantity, removeItem, clearCart, resetOrderStatus } = cartSlice.actions;
export default cartSlice.reducer;