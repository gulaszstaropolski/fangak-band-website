import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CMSPageView } from "@/components/cms-page";
import { getPage } from "@/lib/content";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  return page
    ? {
        title: page.seoTitle || page.title,
        description: page.seoDescription || page.subheading,
      }
    : {};
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();
  return <CMSPageView page={page} />;
}
