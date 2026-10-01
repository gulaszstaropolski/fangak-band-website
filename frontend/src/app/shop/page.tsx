import { StreamingLinks } from "@/components/music";
import { PageIntro, SiteFooter, SiteHeader } from "@/components/site-layout";
import { getBand } from "@/lib/content";

export const metadata = { title: "Shop" };
export const revalidate = 60;

export default async function ShopPage() {
  const band = await getBand();
  return (
    <>
      <SiteHeader name={band.name || "FANGAK"} />
      <main className="inner-page">
        <PageIntro eyebrow="Take a little music home" title="Good things, good sound." copy="Find records, merch and more from our official stores. Links are added by the band and open directly with each platform." />
        <section className="shop-panel">
          <span className="shop-star" aria-hidden="true">✳</span><div><p className="eyebrow">Official stores</p><h2>Support independent music.</h2><p>Browse our releases and find the latest merch wherever it’s available.</p></div>
          <StreamingLinks links={band.streamingLinks} />
        </section>
        <p className="shop-note">Shop links can be managed in Strapi under Band info → Streaming links. Add Bandcamp and merch store URLs there.</p>
      </main>
      <SiteFooter name={band.name || "FANGAK"} />
    </>
  );
}
