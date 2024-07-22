/*!
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
/// <reference types="@nextcloud/typings" />

import { getCanonicalLocale } from './locale'

declare let window: Nextcloud.v27.WindowWithGlobals

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6

/**
 * Get the first day of the week
 *
 * @return The first day where 0 is Sunday, 1 is Monday etc.
 */
export function getFirstDay(): WeekDay {
	// Server rendered
	if (typeof window.firstDay !== 'undefined') {
		return window.firstDay as WeekDay
	}

	// Try to fallback to Intl
	// getWeekInfo is a Stage 3 proposal and not available in Firefox
	// Node.js and Samsung Internet only has accessor property weekInfo instead
	type WeekInfoDay = 1 | 2 | 3 | 4 | 5 | 6 | 7
	type WeekInfo = {
		firstDay: WeekInfoDay,
		weekend: WeekInfoDay,
		minimalDays: WeekInfoDay,
	 }
	const intl = new Intl.Locale(getCanonicalLocale())
	// @ts-expect-error These properties are not part of the standard
	const weekInfo: WeekInfo = intl.getWeekInfo?.() ?? intl.weekInfo
	if (weekInfo) {
		// Convert 1..7 to 0..6 format
		return weekInfo.firstDay % 7 as WeekDay
	}

	// Fallback to Monday
	return 1
}

/**
 * Get a list of day names (full names)
 *
 * @return {string[]}
 */
export function getDayNames(): string[] {
	// Server rendered
	if (typeof window.dayNames !== 'undefined') {
		return window.dayNames
	}

	// Fallback to Intl
	const locale = getCanonicalLocale()
	return [
		new Date('1970-01-04T00:00:00.000Z').toLocaleDateString(locale, { weekday: 'long' }),
		new Date('1970-01-05T00:00:00.000Z').toLocaleDateString(locale, { weekday: 'long' }),
		new Date('1970-01-06T00:00:00.000Z').toLocaleDateString(locale, { weekday: 'long' }),
		new Date('1970-01-07T00:00:00.000Z').toLocaleDateString(locale, { weekday: 'long' }),
		new Date('1970-01-08T00:00:00.000Z').toLocaleDateString(locale, { weekday: 'long' }),
		new Date('1970-01-09T00:00:00.000Z').toLocaleDateString(locale, { weekday: 'long' }),
		new Date('1970-01-10T00:00:00.000Z').toLocaleDateString(locale, { weekday: 'long' }),
	]
}

/**
 * Get a list of day names (short names)
 *
 * @return {string[]}
 */
export function getDayNamesShort(): string[] {
	if (typeof window.dayNamesShort !== 'undefined') {
		return window.dayNamesShort
	}

	// Fallback to Intl
	// Note: narrow is shorter than server's "min", but it's the closest we can get
	const locale = getCanonicalLocale()
	return [
		new Date('1970-01-04T00:00:00.000Z').toLocaleDateString(locale, { weekday: 'short' }),
		new Date('1970-01-05T00:00:00.000Z').toLocaleDateString(locale, { weekday: 'short' }),
		new Date('1970-01-06T00:00:00.000Z').toLocaleDateString(locale, { weekday: 'short' }),
		new Date('1970-01-07T00:00:00.000Z').toLocaleDateString(locale, { weekday: 'short' }),
		new Date('1970-01-08T00:00:00.000Z').toLocaleDateString(locale, { weekday: 'short' }),
		new Date('1970-01-09T00:00:00.000Z').toLocaleDateString(locale, { weekday: 'short' }),
		new Date('1970-01-10T00:00:00.000Z').toLocaleDateString(locale, { weekday: 'short' }),
	]
}

/**
 * Get a list of day names (minified names)
 *
 * @return {string[]}
 */
export function getDayNamesMin(): string[] {
	// Server rendered
	if (typeof window.dayNamesMin !== 'undefined') {
		return window.dayNamesMin
	}

	// Fallback to Intl
	const locale = getCanonicalLocale()
	return [
		new Date('1970-01-04T00:00:00.000Z').toLocaleDateString(locale, { weekday: 'narrow' }),
		new Date('1970-01-05T00:00:00.000Z').toLocaleDateString(locale, { weekday: 'narrow' }),
		new Date('1970-01-06T00:00:00.000Z').toLocaleDateString(locale, { weekday: 'narrow' }),
		new Date('1970-01-07T00:00:00.000Z').toLocaleDateString(locale, { weekday: 'narrow' }),
		new Date('1970-01-08T00:00:00.000Z').toLocaleDateString(locale, { weekday: 'narrow' }),
		new Date('1970-01-09T00:00:00.000Z').toLocaleDateString(locale, { weekday: 'narrow' }),
		new Date('1970-01-10T00:00:00.000Z').toLocaleDateString(locale, { weekday: 'narrow' }),
	]
}

/**
 * Get a list of month names (full names)
 *
 * @return {string[]}
 */
export function getMonthNames(): string[] {
	// Server rendered
	if (typeof window.monthNames !== 'undefined') {
		return window.monthNames
	}

	// Fallback to Intl
	const locale = getCanonicalLocale()
	return [
		new Date('1970-01-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'long' }),
		new Date('1970-02-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'long' }),
		new Date('1970-03-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'long' }),
		new Date('1970-04-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'long' }),
		new Date('1970-05-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'long' }),
		new Date('1970-06-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'long' }),
		new Date('1970-07-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'long' }),
		new Date('1970-08-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'long' }),
		new Date('1970-09-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'long' }),
		new Date('1970-10-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'long' }),
		new Date('1970-11-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'long' }),
		new Date('1970-12-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'long' }),
	]
}

/**
 * Get a list of month names (short names)
 *
 * @return {string[]}
 */
export function getMonthNamesShort(): string[] {
	// Server rendered
	if (typeof window.monthNamesShort !== 'undefined') {
		return window.monthNamesShort
	}

	// Fallback to Intl
	const locale = getCanonicalLocale()
	return [
		new Date('1970-01-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'short' }),
		new Date('1970-02-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'short' }),
		new Date('1970-03-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'short' }),
		new Date('1970-04-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'short' }),
		new Date('1970-05-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'short' }),
		new Date('1970-06-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'short' }),
		new Date('1970-07-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'short' }),
		new Date('1970-08-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'short' }),
		new Date('1970-09-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'short' }),
		new Date('1970-10-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'short' }),
		new Date('1970-11-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'short' }),
		new Date('1970-12-01T00:00:00.000Z').toLocaleDateString(locale, { month: 'short' }),
	]
}
