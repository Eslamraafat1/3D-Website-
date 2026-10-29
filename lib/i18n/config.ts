export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const dirOf = (lang: Locale) => (lang === "ar" ? "rtl" : "ltr");

/** A string available in every supported language. */
export type L = Record<Locale, string>;
export const l = (en: string, ar: string): L => ({ en, ar });

/** Localised number (Arabic-Indic digits in Arabic). Technical annotations stay Latin. */
export const num = (n: number, lang: Locale) =>
  new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US", { useGrouping: n >= 10000 }).format(n);
