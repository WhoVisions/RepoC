export type TranslationDictionary = Record<string, string>

type ModuleLoader = () => Promise<{ default: TranslationDictionary }>

export type TranslationLoader = (locale: string) => Promise<TranslationDictionary>

type CreateJsonTranslationLoaderOptions = {
  extractLocale?: (path: string) => string
  normalizeLocale?: (locale: string) => string
}

export function createJsonTranslationLoader(
  modules: Record<string, ModuleLoader>,
  {
    extractLocale = (path) => path.split('/').pop()?.replace(/\.json$/i, '') ?? path,
    normalizeLocale = (locale) => locale.toLowerCase(),
  }: CreateJsonTranslationLoaderOptions = {},
): TranslationLoader {
  const manifest = new Map<string, ModuleLoader>()

  for (const [path, loader] of Object.entries(modules)) {
    const locale = normalizeLocale(extractLocale(path))
    if (!manifest.has(locale)) {
      manifest.set(locale, loader)
    }
  }

  return async (locale: string) => {
    const normalized = normalizeLocale(locale)
    const loader = manifest.get(normalized)

    if (!loader) {
      const available = Array.from(manifest.keys())
      const availableList = available.length > 0 ? available.join(', ') : 'none'
      throw new Error(`No translation file found for locale "${locale}". Available locales: ${availableList}.`)
    }

    const module = await loader()
    return module.default
  }
}

const localeModules = import.meta.glob<{ default: TranslationDictionary }>('./locales/*.json')

export const loadTranslations = createJsonTranslationLoader(localeModules)

