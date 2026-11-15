import { redirect, notFound } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { getProductOverrides } from "@/lib/productsStore";

interface Props {
  params: {
    slug: string;
  };
}

export default async function RootSlugRedirectPage({ params }: Props) {
  const slug = decodeURIComponent(params.slug || "").trim().toLowerCase();

  // Check overrides first to respect deletions & purges with 0 clues
  const overrides = await getProductOverrides();
  const directOvr =
    overrides[slug] ||
    Object.values(overrides).find(
      (o: any) => o?.slug?.toLowerCase() === slug || o?.id?.toLowerCase() === slug
    );

  if (directOvr?.deleted || directOvr?.purged) {
    notFound();
  }

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
    const pOvr = overrides[product.id] || (product.slug ? overrides[product.slug] : undefined);
    if (pOvr?.deleted || pOvr?.purged) {
      notFound();
    }
    redirect(`/products/${product.slug}`);
  }

  // 3. Otherwise trigger standard 404
  notFound();
}
