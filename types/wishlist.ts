export interface WishlistProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  discounted_price?: number | null;
  image: string;
  stock_count: number;
  enabled: boolean;
}

export interface WishlistItem {
  id: number;
  product_id: number;
  created_at: string;
  product?: WishlistProduct;
}

export interface WishlistListResponse {
  wishlists: WishlistItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface WishlistCountResponse {
  count: number;
}

export interface WishlistCheckResponse {
  is_favorite: boolean;
}