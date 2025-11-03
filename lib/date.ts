/// <reference types="@nextcloud/typings" />
/*!
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getCanonicalLocale } from './locale.ts'

declare let globalThis: Nextcloud.v29.WindowWithGlobals

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6

/**
 * Get the first day of the week
 *
 * @return The first day where 0 is Sunday, 1 is Monday etc.
 */
export function getFirstDay(): WeekDay {
	// Server rendered
	if (typeof globalThis.firstDay !== 'undefined') {
		return globalThis.firstDay as WeekDay
	}

	// Try to fallback to Intl
	// getWeekInfo is a Stage 3 proposal and not available in Firefox
	// Node.js and Samsung Internet only has accessor property weekInfo instead
	type WeekInfoDay = 1 | 2 | 3 | 4 | 5 | 6 | 7
	type WeekInfo = {
		firstDay: WeekInfoDay
		weekend: WeekInfoDay
		minimalDays: WeekInfoDay
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
 */
export function getDayNames(): string[] {
	// Server rendered
	if (typeof globalThis.dayNames !== 'undefined') {
		return globalThis.dayNames
	}

	// Fallback to Intl
	const locale = getCanonicalLocale()
	return [
		new Date(1970, 0, 4).toLocaleDateString(locale, { weekday: 'long' }),
		new Date(1970, 0, 5).toLocaleDateString(locale, { weekday: 'long' }),
		new Date(1970, 0, 6).toLocaleDateString(locale, { weekday: 'long' }),
		new Date(1970, 0, 7).toLocaleDateString(locale, { weekday: 'long' }),
		new Date(1970, 0, 8).toLocaleDateString(locale, { weekday: 'long' }),
		new Date(1970, 0, 9).toLocaleDateString(locale, { weekday: 'long' }),
		new Date(1970, 0, 10).toLocaleDateString(locale, { weekday: 'long' }),
	]
}

/**
 * Get a list of day names (short names)
 */
export function getDayNamesShort(): string[] {
	// Server rendered
	if (typeof globalThis.dayNamesShort !== 'undefined') {
		return globalThis.dayNamesShort
	}

	// Fallback to Intl
	// Note: short is shorter than server's "short", but it's the closest we can get
	const locale = getCanonicalLocale()
	return [
		new Date(1970, 0, 4).toLocaleDateString(locale, { weekday: 'short' }),
		new Date(1970, 0, 5).toLocaleDateString(locale, { weekday: 'short' }),
		new Date(1970, 0, 6).toLocaleDateString(locale, { weekday: 'short' }),
		new Date(1970, 0, 7).toLocaleDateString(locale, { weekday: 'short' }),
		new Date(1970, 0, 8).toLocaleDateString(locale, { weekday: 'short' }),
		new Date(1970, 0, 9).toLocaleDateString(locale, { weekday: 'short' }),
		new Date(1970, 0, 10).toLocaleDateString(locale, { weekday: 'short' }),
	]
}

/**
 * Get a list of day names (minified names)
 */
export function getDayNamesMin(): string[] {
	// Server rendered
	if (typeof globalThis.dayNamesMin !== 'undefined') {
		return globalThis.dayNamesMin
	}

	// Fallback to Intl
	// Note: narrow is shorter than server's "min", but it's the closest we can get
	const locale = getCanonicalLocale()
	return [
		new Date(1970, 0, 4).toLocaleDateString(locale, { weekday: 'narrow' }),
		new Date(1970, 0, 5).toLocaleDateString(locale, { weekday: 'narrow' }),
		new Date(1970, 0, 6).toLocaleDateString(locale, { weekday: 'narrow' }),
		new Date(1970, 0, 7).toLocaleDateString(locale, { weekday: 'narrow' }),
		new Date(1970, 0, 8).toLocaleDateString(locale, { weekday: 'narrow' }),
		new Date(1970, 0, 9).toLocaleDateString(locale, { weekday: 'narrow' }),
		new Date(1970, 0, 10).toLocaleDateString(locale, { weekday: 'narrow' }),
	]
}

/**
 * Get a list of month names (full names)
 */
export function getMonthNames(): string[] {
	// Server rendered
	if (typeof globalThis.monthNames !== 'undefined') {
		return globalThis.monthNames
	}

	// Fallback to Intl
	const locale = getCanonicalLocale()
	return [
		new Date(1970, 0).toLocaleDateString(locale, { month: 'long' }),
		new Date(1970, 1).toLocaleDateString(locale, { month: 'long' }),
		new Date(1970, 2).toLocaleDateString(locale, { month: 'long' }),
		new Date(1970, 3).toLocaleDateString(locale, { month: 'long' }),
		new Date(1970, 4).toLocaleDateString(locale, { month: 'long' }),
		new Date(1970, 5).toLocaleDateString(locale, { month: 'long' }),
		new Date(1970, 6).toLocaleDateString(locale, { month: 'long' }),
		new Date(1970, 7).toLocaleDateString(locale, { month: 'long' }),
		new Date(1970, 8).toLocaleDateString(locale, { month: 'long' }),
		new Date(1970, 9).toLocaleDateString(locale, { month: 'long' }),
		new Date(1970, 10).toLocaleDateString(locale, { month: 'long' }),
		new Date(1970, 11).toLocaleDateString(locale, { month: 'long' }),
	]
}

/**
 * Get a list of month names (short names)
 */
export function getMonthNamesShort(): string[] {
	// Server rendered
	if (typeof globalThis.monthNamesShort !== 'undefined') {
		return globalThis.monthNamesShort
	}

	// Fallback to Intl
	const locale = getCanonicalLocale()
	return [
		new Date(1970, 0).toLocaleDateString(locale, { month: 'short' }),
		new Date(1970, 1).toLocaleDateString(locale, { month: 'short' }),
		new Date(1970, 2).toLocaleDateString(locale, { month: 'short' }),
		new Date(1970, 3).toLocaleDateString(locale, { month: 'short' }),
		new Date(1970, 4).toLocaleDateString(locale, { month: 'short' }),
		new Date(1970, 5).toLocaleDateString(locale, { month: 'short' }),
		new Date(1970, 6).toLocaleDateString(locale, { month: 'short' }),
		new Date(1970, 7).toLocaleDateString(locale, { month: 'short' }),
		new Date(1970, 8).toLocaleDateString(locale, { month: 'short' }),
		new Date(1970, 9).toLocaleDateString(locale, { month: 'short' }),
		new Date(1970, 10).toLocaleDateString(locale, { month: 'short' }),
		new Date(1970, 11).toLocaleDateString(locale, { month: 'short' }),
	]
}
