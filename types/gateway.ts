export interface Gateway {
  id: number;
  name: string;
  slug: string;
  type: "online" | "cash";
  description?: string;  // ✅ اختیاری
  icon?: string;
}