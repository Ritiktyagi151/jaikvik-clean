"use client";

import { useEffect, useRef, useState } from "react";
import {
  US,
  FR,
  DE,
  ES,
  IN,
  CN,
  JP,
  RU,
  IT,
  BR,
  SA,
  KR,
  TR,
  IR,
  PK,
  BD,
  CA,
  MX,
  ZA,
  NG,
  AR,
  CL,
  CO,
  EG,
  ID,
  TH,
  VN,
  IL,
  PL,
  NL,
  SE,
  NO,
  FI,
  DK,
  GR,
  PT,
  BE,
  CH,
  AT,
  CZ,
  HU,
  RO,
  UA,
  SK,
  HR,
  RS,
  BG,
} from "country-flag-icons/react/3x2";

interface CountryType {
  code: string;
  name: string;
  Flag: React.ComponentType<React.SVGProps<SVGElement>>;
  langCode: string;
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    __jaikTranslateLoading?: Promise<boolean>;
    __jaikTranslateReady?: boolean;
  }
}

const countries: CountryType[] = [
  { code: "US", name: "English", Flag: US, langCode: "en" },
  { code: "FR", name: "Francais", Flag: FR, langCode: "fr" },
  { code: "DE", name: "Deutsch", Flag: DE, langCode: "de" },
  { code: "ES", name: "Espanol", Flag: ES, langCode: "es" },
  { code: "IN", name: "Hindi", Flag: IN, langCode: "hi" },
  { code: "CN", name: "Chinese", Flag: CN, langCode: "zh-CN" },
  { code: "JP", name: "Japanese", Flag: JP, langCode: "ja" },
  { code: "RU", name: "Russian", Flag: RU, langCode: "ru" },
  { code: "IT", name: "Italiano", Flag: IT, langCode: "it" },
  { code: "BR", name: "Portugues (Brasil)", Flag: BR, langCode: "pt" },
  { code: "SA", name: "Arabic", Flag: SA, langCode: "ar" },
  { code: "KR", name: "Korean", Flag: KR, langCode: "ko" },
  { code: "TR", name: "Turkce", Flag: TR, langCode: "tr" },
  { code: "IR", name: "Persian", Flag: IR, langCode: "fa" },
  { code: "PK", name: "Urdu", Flag: PK, langCode: "ur" },
  { code: "BD", name: "Bangla", Flag: BD, langCode: "bn" },
  { code: "CA", name: "Francais (Canada)", Flag: CA, langCode: "fr" },
  { code: "MX", name: "Espanol (Mexico)", Flag: MX, langCode: "es" },
  { code: "ZA", name: "Afrikaans", Flag: ZA, langCode: "af" },
  { code: "NG", name: "Yoruba", Flag: NG, langCode: "yo" },
  { code: "AR", name: "Espanol (Argentina)", Flag: AR, langCode: "es" },
  { code: "CL", name: "Espanol (Chile)", Flag: CL, langCode: "es" },
  { code: "CO", name: "Espanol (Colombia)", Flag: CO, langCode: "es" },
  { code: "EG", name: "Arabic (Egypt)", Flag: EG, langCode: "ar" },
  { code: "ID", name: "Bahasa Indonesia", Flag: ID, langCode: "id" },
  { code: "TH", name: "Thai", Flag: TH, langCode: "th" },
  { code: "VN", name: "Vietnamese", Flag: VN, langCode: "vi" },
  { code: "IL", name: "Hebrew", Flag: IL, langCode: "iw" },
  { code: "PL", name: "Polski", Flag: PL, langCode: "pl" },
  { code: "NL", name: "Nederlands", Flag: NL, langCode: "nl" },
  { code: "SE", name: "Svenska", Flag: SE, langCode: "sv" },
  { code: "NO", name: "Norsk", Flag: NO, langCode: "no" },
  { code: "FI", name: "Suomi", Flag: FI, langCode: "fi" },
  { code: "DK", name: "Dansk", Flag: DK, langCode: "da" },
  { code: "GR", name: "Greek", Flag: GR, langCode: "el" },
  { code: "PT", name: "Portugues", Flag: PT, langCode: "pt" },
  { code: "BE", name: "Nederlands (Belgium)", Flag: BE, langCode: "nl" },
  { code: "CH", name: "Deutsch (Swiss)", Flag: CH, langCode: "de" },
  { code: "AT", name: "Deutsch (Austria)", Flag: AT, langCode: "de" },
  { code: "CZ", name: "Cestina", Flag: CZ, langCode: "cs" },
  { code: "HU", name: "Magyar", Flag: HU, langCode: "hu" },
  { code: "RO", name: "Romana", Flag: RO, langCode: "ro" },
  { code: "UA", name: "Ukrainian", Flag: UA, langCode: "uk" },
  { code: "SK", name: "Slovencina", Flag: SK, langCode: "sk" },
  { code: "HR", name: "Hrvatski", Flag: HR, langCode: "hr" },
  { code: "RS", name: "Srpski", Flag: RS, langCode: "sr" },
  { code: "BG", name: "Bulgarian", Flag: BG, langCode: "bg" },
];

const TRANSLATE_SCRIPT_ID = "google-translate-script";

const ensureTranslateLoaded = async (): Promise<boolean> => {
  if (typeof window === "undefined") return false;

  const win = window as Window & {
    google?: { translate?: unknown };
  };

  if (window.__jaikTranslateReady && win.google?.translate) return true;

  if (window.__jaikTranslateLoading) {
    return window.__jaikTranslateLoading;
  }

  window.__jaikTranslateLoading = new Promise<boolean>((resolve) => {
    const finalize = (ok: boolean) => {
      window.__jaikTranslateReady = ok;
      resolve(ok);
    };

    window.googleTranslateElementInit = () => {
      try {
        const google = win.google as
          | { translate?: { TranslateElement?: new (...args: unknown[]) => unknown } }
          | undefined;
        if (!google?.translate?.TranslateElement) return finalize(false);
        new google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element"
        );
        finalize(true);
      } catch {
        finalize(false);
      }
    };

    const existingScript = document.getElementById(
      TRANSLATE_SCRIPT_ID
    ) as HTMLScriptElement | null;

    if (existingScript) {
      // If script is already present, allow callback path to complete.
      setTimeout(() => {
        if (win.google?.translate) {
          window.googleTranslateElementInit?.();
        } else {
          finalize(false);
        }
      }, 100);
      return;
    }

    const script = document.createElement("script");
    script.id = TRANSLATE_SCRIPT_ID;
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => finalize(false);
    document.body.appendChild(script);
  });

  return window.__jaikTranslateLoading;
};

const LanguageSelector = () => {
  const [selected, setSelected] = useState<CountryType>(countries[0]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const pollRef = useRef<number | null>(null);

  const closeDropdown = () => {
    setOpen(false);
    setSearch("");
  };

  const applyLanguage = (langCode: string) => {
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (!combo) return false;
    if (combo.value === langCode) return true;
    combo.value = langCode;
    combo.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  };

  const changeLanguage = async (country: CountryType) => {
    setSelected(country);
    closeDropdown();

    const ready = await ensureTranslateLoaded();
    if (!ready) return;

    if (pollRef.current) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }

    let tries = 0;
    pollRef.current = window.setInterval(() => {
      tries += 1;
      const done = applyLanguage(country.langCode);
      if (done || tries > 20) {
        if (pollRef.current) {
          window.clearInterval(pollRef.current);
          pollRef.current = null;
        }
      }
    }, 200);
  };

  const filteredList = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) closeDropdown();
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  useEffect(() => {
    return () => {
      if (pollRef.current) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div id="google_translate_element" className="hidden" />

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-black transition"
      >
        <selected.Flag className="w-6 h-4" />
        <span>{selected.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          fill="none"
          stroke="white"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 bg-black text-white border border-white rounded-md shadow-lg z-50">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search language..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-white rounded-md bg-transparent"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredList.map((country) => (
              <button
                key={country.code}
                onClick={() => changeLanguage(country)}
                className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-600"
              >
                <country.Flag className="w-6 h-4" />
                <span>{country.name}</span>
              </button>
            ))}
            {filteredList.length === 0 && (
              <p className="text-center py-3 text-gray-400">No match found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
