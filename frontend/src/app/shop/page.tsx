import { StreamingLinks } from "@/components/music";
import { CMSPageView, getPageMetadata } from "@/components/cms-page";
import { PageIntro, SiteFooter, SiteHeader } from "@/components/site-layout";
import { getBand, getPage, getStreams } from "@/lib/content";

export async function generateMetadata() {
  return getPageMetadata("shop", "Shop");
}
export const revalidate = 60;

export default async function ShopPage() {
  const [band, streams, page] = await Promise.all([getBand(), getStreams(), getPage("shop")]);
  if (page) return <CMSPageView page={page} />;
  const platformLinks = streams.length
    ? streams.map((stream) => ({ platform: stream.platformName || stream.title, url: stream.platformUrl }))
    : band.streamingLinks;
  return (
    <>
      <SiteHeader name={band.name || "FANGAK"} logoText={band.logoText} logoImage={band.logoImage} />
      <main className="inner-page">
        <PageIntro eyebrow="Take a little music home" title="Good things, good sound." copy="Find records, merch and more from our official stores. Links are added by the band and open directly with each platform." />
        <section className="shop-panel">
          <span className="shop-star" aria-hidden="true">✳</span><div><p className="eyebrow">Official stores</p><h2>Support independent music.</h2><p>Browse our releases and find the latest merch wherever it’s available.</p></div>
          <StreamingLinks links={platformLinks} />
        </section>
        <p className="shop-note">Platform links can be managed in Strapi under Streams.</p>
      </main>
      <SiteFooter name={band.name || "FANGAK"} />
    </>
  );
}
