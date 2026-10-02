type FieldText = { label: string; description: string };

const slide: Record<string, FieldText> = {
  backgroundImage: { label: "Zdjęcie w tle slajdu", description: "Zdjęcie wyświetlane za tekstem slajdu. Może być poziome lub pionowe – zostanie dopasowane z zachowaniem proporcji." },
  imageAlt: { label: "Opis zdjęcia (tekst alternatywny)", description: "Krótki opis zdjęcia dla osób niewidzących. Zostaw puste, jeśli zdjęcie jest tylko ozdobą." },
  heading: { label: "Duży nagłówek slajdu", description: "Główny napis wyświetlany na slajdzie na stronie głównej." },
  description: { label: "Opis pod nagłówkiem", description: "Krótki tekst wyświetlany pod nagłówkiem slajdu." },
  ctaLabel: { label: "Napis na przycisku", description: "Tekst na przycisku slajdu, np. „Poznaj zespół”. Przycisk pojawi się tylko po wpisaniu napisu i adresu." },
  ctaUrl: { label: "Adres, do którego prowadzi przycisk", description: "Wpisz adres wewnętrzny (np. /about, /music, /videos) albo pełny link https://… . Górne menu podświetli pozycję o tym samym adresie." },
  order: { label: "Kolejność slajdu", description: "Liczba określająca kolejność: mniejsza liczba = wcześniej. Przy takich samych liczbach decyduje kolejność na liście." },
};

const cta: Record<string, FieldText> = {
  label: { label: "Napis na przycisku", description: "Tekst widoczny na przycisku, np. „Posłuchaj”." },
  link: { label: "Adres, do którego prowadzi przycisk", description: "Adres wewnętrzny (np. /music) albo pełny link https://… ." },
};

const pageHero: Record<string, FieldText> = {
  heading: { label: "Nagłówek sekcji", description: "Duży napis w górnej części sekcji." },
  subheading: { label: "Tekst pod nagłówkiem", description: "Krótki opis wyświetlany pod nagłówkiem." },
  backgroundImage: { label: "Zdjęcie w tle sekcji", description: "Zdjęcie wyświetlane za tekstem sekcji." },
  ctaLabel: { label: "Napis na przycisku", description: "Tekst na przycisku sekcji." },
  ctaUrl: { label: "Adres, do którego prowadzi przycisk", description: "Adres wewnętrzny (np. /about) albo pełny link https://… ." },
};

const home: Record<string, FieldText> = {
  logo: { label: "Logo", description: "Obraz logo wyświetlany w nagłówku strony." },
  logoText: { label: "Napis obok logo", description: "Tekst nazwy zespołu w lewym górnym rogu strony." },
  backgroundImage: { label: "Zdjęcie w tle (bez slajdów)", description: "Używane tylko wtedy, gdy nie dodano żadnych slajdów." },
  slides: { label: "Slajdy strony głównej", description: "Zmieniające się automatycznie plansze na górze strony głównej. Dodawaj, usuwaj i przesuwaj slajdy; każdy ma zdjęcie, tekst i przycisk." },
  heading: { label: "Nagłówek (bez slajdów)", description: "Duży napis na górze strony głównej, używany gdy nie ma slajdów." },
  subheading: { label: "Podtytuł (bez slajdów)", description: "Krótki tekst pod nagłówkiem, używany gdy nie ma slajdów." },
  description: { label: "Opis zespołu", description: "Dłuższy tekst o zespole wyświetlany na stronie głównej." },
  primaryCTA: { label: "Główny przycisk (bez slajdów)", description: "Pierwszy przycisk na górze strony, używany gdy nie ma slajdów." },
  secondaryCTA: { label: "Dodatkowy przycisk (bez slajdów)", description: "Drugi, mniej wyróżniony przycisk, używany gdy nie ma slajdów." },
  primaryColor: { label: "Kolor główny", description: "Kolor wyróżnień na stronie, np. #ff6a2b." },
  secondaryColor: { label: "Kolor dodatkowy", description: "Drugi kolor strony, np. #131411." },
  seoTitle: { label: "Tytuł w wyszukiwarce (SEO)", description: "Tytuł strony głównej widoczny w Google i w karcie przeglądarki." },
  seoDescription: { label: "Opis w wyszukiwarce (SEO)", description: "Krótki opis strony głównej widoczny w wynikach Google." },
  seoImage: { label: "Obraz przy udostępnianiu (SEO)", description: "Obraz pokazywany przy udostępnianiu strony w mediach społecznościowych." },
  sections: { label: "Dodatkowe sekcje strony", description: "Dodatkowe bloki treści wyświetlane na stronie głównej." },
};

const page: Record<string, FieldText> = {
  title: { label: "Tytuł podstrony", description: "Nazwa podstrony. Domyślnie używana też jako napis w menu." },
  slug: { label: "Adres podstrony (slug)", description: "Końcówka adresu, np. „about” daje /about. Generuje się z tytułu; dla każdej podstrony musi być inna." },
  backgroundImage: { label: "Zdjęcie w tle", description: "Zdjęcie wyświetlane za nagłówkiem podstrony." },
  heading: { label: "Nagłówek", description: "Duży napis na górze podstrony." },
  subheading: { label: "Tekst pod nagłówkiem", description: "Krótki opis pod nagłówkiem." },
  content: { label: "Treść podstrony", description: "Główny tekst podstrony." },
  buttons: { label: "Przyciski na podstronie", description: "Dodaj dowolną liczbę przycisków; każdy ma napis i adres, do którego prowadzi." },
  showInNavigation: { label: "Pokaż w górnym menu", description: "Zaznacz, aby podstrona pojawiła się w menu nawigacji." },
  navigationLabel: { label: "Napis w menu", description: "Tekst w górnym menu. Puste = użyty zostanie tytuł podstrony." },
  navigationOrder: { label: "Kolejność w menu", description: "Mniejsza liczba = pozycja bardziej po lewej." },
  seoTitle: { label: "Tytuł w wyszukiwarce (SEO)", description: "Tytuł widoczny w Google i w karcie przeglądarki." },
  seoDescription: { label: "Opis w wyszukiwarce (SEO)", description: "Krótki opis widoczny w wynikach Google." },
  sections: { label: "Sekcje podstrony", description: "Dodatkowe bloki treści (nagłówek, tekst, galeria)." },
};

type Metadatas = Record<string, { edit?: Record<string, unknown>; list?: Record<string, unknown> }>;

function applyTexts(configuration: { metadatas?: Metadatas }, texts: Record<string, FieldText>) {
  const metadatas: Metadatas = { ...(configuration.metadatas ?? {}) };
  for (const [field, { label, description }] of Object.entries(texts)) {
    if (!metadatas[field]) continue;
    metadatas[field] = {
      ...metadatas[field],
      edit: { ...metadatas[field].edit, label, description },
      list: { ...metadatas[field].list, label },
    };
  }
  return { ...configuration, metadatas };
}

/** Sets Polish editor-facing labels/help in the Content Manager (does not change the data model). */
export async function applyAdminLabels(strapi: any) {
  const contentManager = strapi.plugin("content-manager");
  if (!contentManager) return;
  const types = contentManager.service("content-types");
  const components = contentManager.service("components");
  const jobs: Array<[string, "type" | "component", Record<string, FieldText>]> = [
    ["api::home.home", "type", home],
    ["api::page.page", "type", page],
    ["home.slide", "component", slide],
    ["home.cta", "component", cta],
    ["page.hero", "component", pageHero],
  ];
  for (const [uid, kind, texts] of jobs) {
    try {
      const service = kind === "type" ? types : components;
      const model = kind === "type" ? strapi.contentTypes[uid] : strapi.components[uid];
      if (!model) continue;
      const configuration = await service.findConfiguration(model);
      await service.updateConfiguration(model, applyTexts(configuration, texts));
    } catch (error) {
      strapi.log.warn(`Could not apply Polish admin labels for ${uid}: ${(error as Error).message}`);
    }
  }
}
