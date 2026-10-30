export interface Tag {
  id: number;
  name: string;
  slug?: string;
}

export interface AttributeValue {
  attribute_id: number;
  attribute_slug: string;
  attribute_name: string;
  icon: string;
  unit: string;
  value: string;
}

export interface Product {
  id: number;
  name: string;
  persian_title: string;
  slug: string;
  sku: string;
  description: string;
  full_description: string;
  category_id: number;
  brand_id: number;
  price: number;
  discounted_price?: number | null;
  stock_count: number;
  image: string;
  images: string[];
  tags: Tag[];
  attribute_values: AttributeValue[];
  created_at: string;
  updated_at: string;
}



export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}



