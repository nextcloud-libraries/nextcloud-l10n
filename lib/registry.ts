/// <reference types="@nextcloud/typings" />
export type Translations = Record<string, string | string[] | undefined>
export type PluralFunction = (number: number) => number

export interface NextcloudWindowWithRegistry extends Nextcloud.v25.WindowWithGlobals {
	_oc_l10n_registry_translations?: Record<string, Translations>
	_oc_l10n_registry_plural_functions?: Record<string, PluralFunction>
}

declare const window: NextcloudWindowWithRegistry

interface AppTranslations {
	translations: Translations
	pluralFunction: PluralFunction
}

/**
 * Check if translations and plural function are set for given app
 *
 * @param {string} appId the app id
 * @return {boolean}
 */
export function hasAppTranslations(appId: string) {
	return (
		window._oc_l10n_registry_translations?.[appId] !== undefined
		&& window._oc_l10n_registry_plural_functions?.[appId] !== undefined
	)
}

/**
 * Register new, or extend available, translations for an app
 *
 * @param {string} appId the app id
 * @param {object} translations the translations list
 * @param {Function} pluralFunction the plural function
 */
export function registerAppTranslations(
	appId: string,
	translations: Translations,
	pluralFunction: PluralFunction
) {
	window._oc_l10n_registry_translations = Object.assign(
		window._oc_l10n_registry_translations || {},
		{
			[appId]: Object.assign(window._oc_l10n_registry_translations?.[appId] || {}, translations),
		}
	)

	window._oc_l10n_registry_plural_functions = Object.assign(
		window._oc_l10n_registry_plural_functions || {},
		{
			[appId]: pluralFunction,
		}
	)
}

/**
 * Unregister all translations and plural function for given app
 *
 * @param {string} appId the app id
 */
export function unregisterAppTranslations(appId: string) {
	delete window._oc_l10n_registry_translations?.[appId]
	delete window._oc_l10n_registry_plural_functions?.[appId]
}

/**
 * Get translations bundle for given app and current locale
 *
 * @param {string} appId the app id
 * @return {object}
 */
export function getAppTranslations(appId: string): AppTranslations {
	if (
		typeof window._oc_l10n_registry_translations?.[appId] === 'undefined'
		|| typeof window._oc_l10n_registry_plural_functions?.[appId] === 'undefined'
	) {
		console.warn(`No translation for appId "${appId}" have been registered`)
	}
	return {
		translations: window._oc_l10n_registry_translations?.[appId] ?? {},
		pluralFunction: window._oc_l10n_registry_plural_functions?.[appId] ?? ((number: number) => number),
	}
}
