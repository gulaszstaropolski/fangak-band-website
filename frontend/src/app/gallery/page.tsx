import Image from "next/image";
import { CMSPageView, getPageMetadata } from "@/components/cms-page";
import { PageIntro, SiteFooter, SiteHeader } from "@/components/site-layout";
import { getBand, getGallery, getPage } from "@/lib/content";

export async function generateMetadata() {
  return getPageMetadata("gallery", "Gallery");
}
export const revalidate = 60;

export default async function GalleryPage() {
  const [band, photos, page] = await Promise.all([getBand(), getGallery(), getPage("gallery")]);
  if (page) return <CMSPageView page={page} />;
  return (
    <>
      <SiteHeader name={band.name || "FANGAK"} logoText={band.logoText} logoImage={band.logoImage} />
      <main className="inner-page">
        <PageIntro eyebrow="Loud nights, good people" title="Life in the frame." copy="A few moments from the stage, the road and everywhere the music takes us." />
        {photos.length ? <div className="gallery-grid">{photos.map((photo, index) => <figure className={`gallery-tile gallery-tile-${index % 5}`} key={photo.id}>
          {photo.image ? <Image src={photo.image} alt={photo.title} fill sizes="(max-width: 700px) 100vw, 50vw" /> : <div className="gallery-placeholder"><span>F.</span></div>}
          <figcaption><strong>{photo.title}</strong>{(photo.description || photo.caption) && <span>{photo.description || photo.caption}</span>}</figcaption>
        </figure>)}</div> : <div className="empty-state"><span className="empty-record" aria-hidden="true">F.</span><h2>The gallery is waiting for its first encore.</h2><p>Performance photos added in the CMS will appear here.</p></div>}
      </main>
      <SiteFooter name={band.name || "FANGAK"} />
    </>
  );
}
