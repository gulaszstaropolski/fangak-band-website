import Image from "next/image";
import { PageIntro, SiteFooter, SiteHeader } from "@/components/site-layout";
import { getAbout, getBand, getTeam } from "@/lib/content";

export const metadata = { title: "About" };
export const revalidate = 60;

export default async function AboutPage() {
  const [band, about, team] = await Promise.all([getBand(), getAbout(), getTeam()]);
  const description = about?.description || band.bio;
  const history = about?.historyText || band.bio;
  return (
    <>
      <SiteHeader name={band.name || "FANGAK"} logoText={band.logoText} logoImage={band.logoImage} />
      <main className="inner-page">
        <PageIntro eyebrow="The people behind the sound" title="About the band." copy={description || "We’re a band built around a shared love of music, the energy of a room, and the feeling that stays with you after the last note. Our story is still being written — and we’re glad you’re here for it."} />
        <section className="about-story">
          <div className="about-art" aria-hidden="true"><span>F.</span><small>FANGAK / SOUND IN MOTION</small></div>
          <div><p className="eyebrow">Our story</p><h2>One sound.<br /><em>Many voices.</em></h2><p>{history || "From the first rehearsal to the lights coming up on stage, we make music for the moments that bring people together. Explore our releases, come to a show, and be part of what comes next."}</p></div>
        </section>
        {team.length > 0 && (
          <section className="section-wrap team-section">
            <div className="section-heading"><div><p className="eyebrow">Meet the band</p><h2>The line-up.</h2></div></div>
            <div className="team-grid">{team.map((member) => <article className="team-card" key={member.id}>
              <div className="team-photo">{member.photo ? <Image src={member.photo} alt={member.name} fill sizes="(max-width: 700px) 100vw, 30vw" /> : <span aria-hidden="true">F.</span>}</div>
              <p className="eyebrow">{member.role}</p><h3>{member.name}</h3>{member.bio && <p>{member.bio}</p>}
            </article>)}</div>
          </section>
        )}
      </main>
      <SiteFooter name={band.name || "FANGAK"} />
    </>
  );
}
