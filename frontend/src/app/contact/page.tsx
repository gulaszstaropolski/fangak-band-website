import { ContactForm } from "./contact-form";
import { CMSPageView } from "@/components/cms-page";
import { StreamingLinks } from "@/components/music";
import { PageIntro, SiteFooter, SiteHeader } from "@/components/site-layout";
import { getBand, getContact, getPage, getSettings } from "@/lib/content";

export const metadata = { title: "Contact" };
export const revalidate = 60;

export default async function ContactPage() {
  const [band, contact, page, settings] = await Promise.all([getBand(), getContact(), getPage("contact"), getSettings()]);
  if (page) return <CMSPageView page={page} />;
  return (
    <>
      <SiteHeader name={band.name || "FANGAK"} logoText={band.logoText} logoImage={band.logoImage} />
      <main className="inner-page">
        <PageIntro eyebrow="Bookings, press, or just a hello" title="Let’s talk." copy={contact?.description || "For booking enquiries, collaborations or anything else, drop us a note. We’d love to hear from you."} />
        <div className="contact-layout">
          <ContactForm fields={contact?.formFields} />
          <aside className="contact-aside"><p className="eyebrow">Keep in touch</p><h2>Follow the noise.</h2><StreamingLinks links={settings.socialLinks || band.socialLinks} />{settings.contactEmail && <p><a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></p>}{settings.contactPhone && <p><a href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a></p>}{!settings.socialLinks?.length && !band.socialLinks?.length && <p>Add your social profiles in the Settings entry in Strapi.</p>}</aside>
        </div>
      </main>
      <SiteFooter name={band.name || "FANGAK"} />
    </>
  );
}
