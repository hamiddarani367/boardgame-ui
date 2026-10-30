export interface Province {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  province_id?: number; // ✅ اختیاری شد
}

export interface Address {
  id: number;
  user_id?: number;
  title: string;
  full_address: string;
  province: Province;
  city: City;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}