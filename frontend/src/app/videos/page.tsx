import { VideoCard } from "@/components/video";
import { PageIntro, SiteFooter, SiteHeader } from "@/components/site-layout";
import { getBand, getVideos } from "@/lib/content";

export const metadata = { title: "Videos" };
export const revalidate = 60;

export default async function VideosPage() {
  const [band, videos] = await Promise.all([getBand(), getVideos()]);
  return (
    <>
      <SiteHeader name={band.name || "FANGAK"} logoText={band.logoText} logoImage={band.logoImage} />
      <main className="inner-page">
        <PageIntro eyebrow="Watch and listen" title="Videos." copy="Live moments, music videos and more from FANGAK." />
        <section className="video-grid">
          {videos.length ? videos.map((video) => <VideoCard key={video.id} video={video} />) : (
            <div className="empty-state"><h2>Videos are coming soon.</h2><p>Check back for clips and performances.</p></div>
          )}
        </section>
      </main>
      <SiteFooter name={band.name || "FANGAK"} />
    </>
  );
}
