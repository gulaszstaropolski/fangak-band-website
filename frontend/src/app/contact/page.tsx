import { ContactForm } from "./contact-form";
import { StreamingLinks } from "@/components/music";
import { PageIntro, SiteFooter, SiteHeader } from "@/components/site-layout";
import { getBand } from "@/lib/content";

export const metadata = { title: "Contact" };
export const revalidate = 60;

export default async function ContactPage() {
  const band = await getBand();
  return (
    <>
      <SiteHeader name={band.name || "FANGAK"} />
      <main className="inner-page">
        <PageIntro eyebrow="Bookings, press, or just a hello" title="Let’s talk." copy="For booking enquiries, collaborations or anything else, drop us a note. We’d love to hear from you." />
        <div className="contact-layout">
          <ContactForm />
          <aside className="contact-aside"><p className="eyebrow">Keep in touch</p><h2>Follow the noise.</h2><StreamingLinks links={band.socialLinks} />{!band.socialLinks?.length && <p>Add your social profiles in the Band info entry in Strapi.</p>}</aside>
        </div>
      </main>
      <SiteFooter name={band.name || "FANGAK"} />
    </>
  );
}
