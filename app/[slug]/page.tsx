import { redirect, notFound } from "next/navigation";
import { CATEGORIES } from "@/data/categories";
import { getLiveProductBySlug } from "@/lib/productsStore";

interface Props {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function RootSlugRedirectPage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const slug = decodeURIComponent(resolvedParams.slug || "").trim().toLowerCase();

  // 1. Check if category slug
  const cat = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === slug || c.id.toLowerCase() === slug
  );
  if (cat) {
    redirect(`/collections/${cat.slug}`);
  }

  // 2. Check if product slug, ID, or SKU via live products store
  const product = await getLiveProductBySlug(slug);
  if (product && !(product as any).deleted && !(product as any).purged) {
    redirect(`/products/${product.slug}`);
  }

  // 3. Otherwise trigger 404 with zero traces
  notFound();
}
