/**
 * This module provides functionality to translate applications independent from Nextcloud
 * 
 * @packageDocumentation
 * @module @nextcloud/l10n/gettext
 * @example
 * ```js
import { getGettextBuilder } from '@nextcloud/l10n/gettext'

const gt = getGettextBuilder()
            .detectLocale() // or use setLanguage()
            .addTranslation(/* ... *\/)
            .build()

gt.gettext('some string to translate')
```
 */
import GetText from "node-gettext"

import { getLanguage } from "."

/**
 * @notExported
 */
class GettextBuilder {

    private locale?: string
    private translations = {}
    private debug = false

    setLanguage(language: string): GettextBuilder {
        this.locale = language
        return this
    }

    /** Try to detect locale from context with `en` as fallback value */
    detectLocale(): GettextBuilder {
        return this.setLanguage(getLanguage().replace('-', '_'))
    }

    addTranslation(language: string, data: any): GettextBuilder {
        this.translations[language] = data
        return this
    }

    enableDebugMode(): GettextBuilder {
        this.debug = true
        return this
    }

    build(): GettextWrapper {
        return new GettextWrapper(this.locale || 'en', this.translations, this.debug)
    }

}

/**
 * @notExported
 */
class GettextWrapper {

    private gt: GetText

    constructor(locale: string, data: any, debug: boolean) {
        this.gt = new GetText({
            debug,
            sourceLocale: 'en',
        })

        for (let key in data) {
            this.gt.addTranslations(key, 'messages', data[key])
        }

        this.gt.setLocale(locale)
    }

    private subtitudePlaceholders(translated: string, vars: Record<string, string | number>): string {
        return translated.replace(/{([^{}]*)}/g, (a, b) => {
            const r = vars[b]
            if (typeof r === 'string' || typeof r === 'number') {
                return r.toString()
            } else {
                return a
            }
        })
    }

    /** Get translated string (singular form), optionally with placeholders */
    gettext(original: string, placeholders: Record<string, string | number> = {}): string {
        return this.subtitudePlaceholders(
            this.gt.gettext(original),
            placeholders
        )
    }

    /** Get translated string with plural forms */
    ngettext(singular: string, plural: string, count: number, placeholders: Record<string, string | number> = {}): string {
        return this.subtitudePlaceholders(
            this.gt.ngettext(singular, plural, count).replace(/%n/g, count.toString()),
            placeholders
        )
    }

}

export function getGettextBuilder() {
    return new GettextBuilder()
}
