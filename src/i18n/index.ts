import { useLanguageStore } from '../store/language'
import type { Language } from '../store/language'
import pt from './locales/pt'
import en from './locales/en'
import es from './locales/es'

const locales: Record<Language, typeof pt> = { pt, en, es }

export function useTranslation() {
  const language = useLanguageStore(s => s.language)
  const dict = locales[language]

  return function t(key: string, vars?: Record<string, string | number>): any {
    const keys = key.split('.')
    let result: any = dict
    for (const k of keys) result = result?.[k]
    if (result === undefined) return key
    if (typeof result !== 'string') return result
    if (!vars) return result
    return result.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? ''))
  }
}
