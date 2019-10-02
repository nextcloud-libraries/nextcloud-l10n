/// <reference types="@nextcloud/typings" />

type OC16to17 = Nextcloud.v16.OC | Nextcloud.v17.OC
declare var OC: OC16to17;

/**
 * Returns the user's locale
 */
export function getLocale(): string {
    if (typeof OC === 'undefined') {
        console.warn('No OC found')
        return 'en'
    }

    return OC.getLocale()
}

/**
 * Returns the user's language
 */
export function getLanguage(): string {
    if (typeof OC === 'undefined') {
        console.warn('No OC found')
        return 'en';
    }

    return OC.getLanguage()
}

interface TranslationOptions {
    escaped?: boolean
}

/**
 * Translate a string
 *
 * @param {string} app the id of the app for which to translate the string
 * @param {string} text the string to translate
 * @param {object} vars map of placeholder key to value
 * @param {Number} number to replace %n with
 * @param {object} [options] options object
 * @return {string}
 */
export function translate(app: string, text: string, vars?: object, count?: Number, options?: TranslationOptions): string {
    if (typeof OC === 'undefined') {
        console.warn('No OC found')
        return text
    }

    return OC.L10N.translate(app, text, vars, count, options)
}

/**
 * Translate a plural string
 *
 * @param {string} app the id of the app for which to translate the string
 * @param {string} textSingular the string to translate for exactly one object
 * @param {string} textPlural the string to translate for n objects
 * @param {number} count number to determine whether to use singular or plural
 * @param {Object} vars of placeholder key to value
 * @param {object} options options object
 * @return {string}
 */

export function translatePlural(app: string, textSingular: string, textPlural: string, count: Number, vars?: object, options?: TranslationOptions): string {
    if (typeof OC === 'undefined') {
        console.warn('No OC found')
        return textSingular
    }

    return OC.L10N.translatePlural(app, textSingular, textPlural, count, vars, options)
}
