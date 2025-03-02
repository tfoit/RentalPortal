import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import enhancedLogger from "./utils/enhancedLogger";

// Supported languages
const supportedLanguages = ["en", "fr", "de", "es", "it", "nl"];

const initI18n = async () => {
  try {
    enhancedLogger.info("Initializing i18n...", { supportedLanguages });

    await i18n
      .use(Backend)
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        fallbackLng: "en",
        supportedLngs: supportedLanguages,

        // Debug mode in development
        debug: import.meta.env.DEV,

        // Namespace configuration
        defaultNS: "common",
        ns: ["common", "auth", "dashboard", "profile", "apartments"],

        // Backend configuration for loading translations
        backend: {
          loadPath: "/locales/{{lng}}/{{ns}}.json",
          crossDomain: true,
          requestOptions: {
            mode: "cors",
            credentials: "same-origin",
            cache: "default",
          },
        },

        // Detection options
        detection: {
          order: ["localStorage", "cookie", "navigator"],
          lookupLocalStorage: "i18nextLng",
          caches: ["localStorage"],
        },

        // Interpolation options
        interpolation: {
          escapeValue: false, // React already safes from XSS
        },

        react: {
          useSuspense: true,
        },
      });

    // Log successful initialization
    enhancedLogger.info("i18n initialized successfully", {
      currentLanguage: i18n.language,
      storedLanguage: localStorage.getItem("i18nextLng"),
      availableNamespaces: i18n.options.ns,
      isInitialized: i18n.isInitialized,
    });

    // Log when translations are loaded
    i18n.on("loaded", (loaded) => {
      enhancedLogger.info("Translations loaded", {
        loaded,
        language: i18n.language,
        namespaces: Object.keys(i18n.store.data[i18n.language] || {}),
      });
    });

    // Log when language changes
    i18n.on("languageChanged", (lng) => {
      enhancedLogger.info("Language changed", {
        newLanguage: lng,
        availableNamespaces: Object.keys(i18n.store.data[lng] || {}),
      });
      document.documentElement.lang = lng;
    });

    // Log if loading fails
    i18n.on("failedLoading", (lng, ns, msg) => {
      enhancedLogger.error("Failed loading translation", { language: lng, namespace: ns, message: msg });
    });

    return i18n;
  } catch (error) {
    enhancedLogger.error("Error initializing i18n", {
      error: error.message,
      stack: error.stack,
    });

    // Setup a minimal fallback i18n instance if initialization fails
    return i18n.use(initReactI18next).init({
      lng: "en",
      fallbackLng: "en",
      resources: {
        en: {
          common: {
            error: "Error",
            loading: "Loading...",
            translationError: "Translation system is currently unavailable",
          },
        },
      },
      interpolation: {
        escapeValue: false,
      },
    });
  }
};

// Initialize i18n
const i18nPromise = initI18n();

// Export both the promise and the i18n instance for flexibility in usage
export { i18nPromise };
export default i18n;
