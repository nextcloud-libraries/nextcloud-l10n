/*!
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/* eslint-disable no-var, camelcase */

import type { PluralFunction, Translations } from './registry.ts'

declare global {
	var _nc_l10n_locale: string
	var _nc_l10n_language: string

	var _oc_l10n_registry_translations: Record<string, Translations>
	var _oc_l10n_registry_plural_functions: Record<string, PluralFunction>
}

export {}
