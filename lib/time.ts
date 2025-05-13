/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getLanguage } from './locale.ts'

export interface FormatDateOptions {
	/**
	 * If set then instead of showing seconds since the timestamp show the passed message.
	 * @default false
	 */
	ignoreSeconds?: string | false

	/**
	 * The relative time formatting option to use
	 * @default 'long
	 */
	relativeTime?: 'long' | 'short' | 'narrow'

	/**
	 * Language to use
	 * @default 'current language'
	 */
	language?: string
}

/**
 * Format a given time as "relative time" also called "humanizing".
 *
 * @param timestamp Timestamp or Date object
 * @param opts Options for the formatting
 */
export function formatRelativeTime(
	timestamp: Date|number = Date.now(),
	opts: FormatDateOptions = {},
): string {
	const options: Required<FormatDateOptions> = {
		ignoreSeconds: false,
		language: getLanguage(),
		relativeTime: 'long' as const,
		...opts,
	}

	/** ECMA Date object of the timestamp */
	const date = new Date(timestamp)

	const formatter = new Intl.RelativeTimeFormat([options.language, getLanguage()], { numeric: 'auto', style: options.relativeTime })
	const diff = date.getTime() - Date.now()
	const seconds = diff / 1000

	if (Math.abs(seconds) < 59.5) {
		return options.ignoreSeconds
			|| formatter.format(Math.round(seconds), 'second')
	}

	const minutes = seconds / 60
	if (Math.abs(minutes) <= 59) {
		return formatter.format(Math.round(minutes), 'minute')
	}
	const hours = minutes / 60
	if (Math.abs(hours) < 23.5) {
		return formatter.format(Math.round(hours), 'hour')
	}
	const days = hours / 24
	if (Math.abs(days) < 6.5) {
		return formatter.format(Math.round(days), 'day')
	}
	if (Math.abs(days) < 27.5) {
		const weeks = days / 7
		return formatter.format(Math.round(weeks), 'week')
	}

	// For everything above we show year + month like "August 2025" or month + day if same year like "May 12"
	// This is based on a Nextcloud design decision: https://github.com/nextcloud/server/issues/29807#issuecomment-2431895872
	const months = days / 30
	const format: Intl.DateTimeFormatOptions = Math.abs(months) < 11
		? { month: options.relativeTime, day: 'numeric' }
		: { year: options.relativeTime === 'narrow' ? '2-digit' : 'numeric', month: options.relativeTime }

	const dateTimeFormatter = new Intl.DateTimeFormat([options.language, getLanguage()], format)
	return dateTimeFormatter.format(date)
}
