/*!
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/* eslint-disable camelcase */

/// <reference types="@nextcloud/typings" />

import type { PluralFunction, Translations } from './registry.ts'

declare global {
	// Library shared global state
	var _nc_l10n_locale: string | undefined
	var _nc_l10n_language: string | undefined
	var _nc_l10n_timezone: string | undefined

	var _oc_l10n_registry_translations: Record<string, Translations> | undefined
	var _oc_l10n_registry_plural_functions: Record<string, PluralFunction> | undefined

	// Nextcloud server globals available on Nextcloud app in Web environment
	var firstDay: Nextcloud.v29.WindowWithGlobals['firstDay'] | undefined
	var dayNames: Nextcloud.v29.WindowWithGlobals['dayNames'] | undefined
	var dayNamesShort: Nextcloud.v29.WindowWithGlobals['dayNamesShort'] | undefined
	var dayNamesMin: Nextcloud.v29.WindowWithGlobals['dayNamesMin'] | undefined
	var monthNames: Nextcloud.v29.WindowWithGlobals['monthNames'] | undefined
	var monthNamesShort: Nextcloud.v29.WindowWithGlobals['monthNamesShort'] | undefined
}

export {}
