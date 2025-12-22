/*!
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/* eslint-disable camelcase */

import type { PluralFunction, Translations } from './registry.ts'

declare global {
	var _nc_l10n_locale: string | undefined
	var _nc_l10n_language: string | undefined
	var _nc_l10n_timezone: string | undefined

	var _oc_l10n_registry_translations: Record<string, Translations> | undefined
	var _oc_l10n_registry_plural_functions: Record<string, PluralFunction> | undefined
}

export {}
