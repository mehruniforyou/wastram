import { redirect, notFound } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";

interface Props {
  params: {
    slug: string;
  };
}

export default function RootSlugRedirectPage({ params }: Props) {
  const slug = decodeURIComponent(params.slug || "").trim().toLowerCase();

  // 1. Check if category slug
  const cat = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === slug || c.id.toLowerCase() === slug
  );
  if (cat) {
    redirect(`/collections/${cat.slug}`);
  }

  // 2. Check if product slug, ID, or SKU
  const product = PRODUCTS.find(
    (p) =>
      p.slug?.toLowerCase() === slug ||
      p.id?.toLowerCase() === slug ||
      p.partNumber?.toLowerCase() === slug ||
      (p as any).aliasSlugs?.some((a: string) => a.toLowerCase() === slug)
  );
  if (product) {
    redirect(`/products/${product.slug}`);
  }

  // 3. Otherwise trigger 404
  notFound();
}
