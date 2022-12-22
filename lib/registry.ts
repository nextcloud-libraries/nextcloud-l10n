declare var window: {
    _oc_l10n_registry_translations: Record<string, Record<string, string | undefined>>
    _oc_l10n_registry_plural_functions: Record<string, (number: number) => number>
}

interface AppTranslations {
    translations: Record<string, string | undefined>;
    pluralFunction: (number: number) => number;
}

/**
 * @param {string} appId the app id
 * @return {object}
 */
export function getAppTranslations(appId: string): AppTranslations {
    if (typeof window._oc_l10n_registry_translations === 'undefined' ||
        typeof window._oc_l10n_registry_plural_functions === 'undefined') {
        console.warn('No OC L10N registry found')
        return {
            translations: {},
            pluralFunction: (number: number) => number
        }
    }

    return {
        translations: window._oc_l10n_registry_translations[appId] || {},
        pluralFunction: window._oc_l10n_registry_plural_functions[appId],
    }
}