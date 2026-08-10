import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/products"; // همون تابع فیک

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const page = Number(searchParams.get("page")) || 1;
  const sort = searchParams.get("sort") || "newest";
  const category = searchParams.get("category") || "";
  const playerCount = searchParams.get("playerCount") || "";
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 10000000;
  const limit = Number(searchParams.get("limit")) || 12;

  const result = await getProducts({
    page,
    sort,
    category,
    playerCount,
    minPrice,
    maxPrice,
    limit,
  });

  return NextResponse.json(result);
}