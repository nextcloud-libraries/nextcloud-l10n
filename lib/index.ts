/*!
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * This module provides all functions for the `OC.L10N` namespace
 *
 * @packageDocumentation
 * @module @nextcloud/l10n
 * @example
 * ```js
import { translate as t, translatePlural as n } from '@nextcloud/l10n'
console.log(t('my-app', 'Hello {name}', { name: 'J. Doe' }));
const count = 2;
console.warn(n('my-app', 'Got an error', 'Got multiple errors', 2));
```
 */

export type { Translations } from './registry'

export * from './date'
export * from './locale'
export * from './translation'

export {
	type FormatDateOptions,

	formatRelativeTime,
} from './time.ts'
