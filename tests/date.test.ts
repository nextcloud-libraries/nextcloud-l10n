/// <reference types="@nextcloud/typings" />
/*!
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { Mocked } from 'vitest'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getDayNames, getDayNamesMin, getDayNamesShort, getFirstDay, getMonthNames, getMonthNamesShort } from '../lib/date.ts'
import * as localeModule from '../lib/locale.ts'

vi.mock('../lib/locale.ts')
const { getCanonicalLocale } = localeModule as Mocked<typeof localeModule>

declare let globalThis: Nextcloud.v29.WindowWithGlobals

describe('date', () => {
	describe('getFirstDay', () => {
		const weekInfoMocks = {
			'en-US': { firstDay: 7, weekend: [6, 7], minimalDays: 1 },
			'de-DE': { firstDay: 1, weekend: [6, 7], minimalDays: 4 },
		} as const

		const mockGetWeekInfo = function(this: Intl.Locale) {
			const weekInfo = weekInfoMocks[this.baseName as keyof typeof weekInfoMocks]
			if (weekInfo) {
				return weekInfo
			}
			throw new Error(`Locale ${this.baseName} is not implemented in tests`)
		}

		const originalGetWeekInfo = Intl.Locale.prototype.getWeekInfo
		const originalWeekInfoDescriptor = Object.getOwnPropertyDescriptor(Intl.Locale.prototype, 'weekInfo')!

		beforeEach(() => {
			// @ts-expect-error - Mocking for tests
			delete globalThis.firstDay
		})

		afterEach(() => {
			vi.clearAllMocks()
			Intl.Locale.prototype.getWeekInfo = originalGetWeekInfo
			Object.defineProperty(Intl.Locale.prototype, 'weekInfo', originalWeekInfoDescriptor)
		})

		it('returns `globalThis.firstDate` when defined', () => {
			globalThis.firstDay = 3
			expect(getFirstDay()).toBe(3)
		})

		it('returns 1 (Monday) in "de-DE" locale when `globalThis.firstDate` is not defined but `Intl.weekInfo` is defined (Node.js, Samsung Internet)', () => {
			getCanonicalLocale.mockReturnValue('de-DE')
			expect(getFirstDay()).toBe(1)
		})

		it('returns 0 (Sunday) in "en-US" locale when `globalThis.firstDate` is not defined but `Intl.weekInfo` is defined (Node.js, Samsung Internet)', () => {
			getCanonicalLocale.mockReturnValue('en-US')
			expect(getFirstDay()).toBe(0)
		})

		it('returns 1 (Monday) in "de-DE" locale when `globalThis.firstDate` is not defined but `Intl.getWeekInfo` is defined (Chromium, Safari)', () => {
			getCanonicalLocale.mockReturnValue('de-DE')
			// getWeekInfo is available, weekInfo is not available (Chromium, Safari)
			Intl.Locale.prototype.getWeekInfo = mockGetWeekInfo
			delete Intl.Locale.prototype.weekInfo
			expect(getFirstDay()).toBe(1)
		})

		it('returns 0 (Sunday) in "en-US" locale when `globalThis.firstDate` is not defined but `Intl.getWeekInfo` is defined (Chromium, Safari)', () => {
			getCanonicalLocale.mockReturnValue('en-US')
			// getWeekInfo is available, weekInfo is not available (Chromium, Safari)
			Intl.Locale.prototype.getWeekInfo = mockGetWeekInfo
			delete Intl.Locale.prototype.weekInfo
			expect(getFirstDay()).toBe(0)
		})

		it('returns 1 (Monday) when neither `globalThis.firstDate` nor `Intl.Locale.getWeekInfo`/`weekInfo` is defined (Firefox)', () => {
			delete Intl.Locale.prototype.getWeekInfo
			delete Intl.Locale.prototype.weekInfo
			expect(getFirstDay()).toBe(1)
		})
	})

	describe('getDayNames TZ=Europe/Berlin', () => {
		beforeEach(() => {
			vi.stubEnv('TZ', 'Europe/Berlin')
		})
		afterEach(() => {
			vi.unstubAllEnvs()
			// @ts-expect-error - Mocking for tests
			delete globalThis.dayNames
		})

		it('returns `globalThis.dayNames` when defined', () => {
			globalThis.dayNames = ['Day 0', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6']
			expect(getDayNames()).toEqual(globalThis.dayNames)
		})

		it('returns English day names in "en-US" locale when `globalThis.dayNames` is not defined', () => {
			getCanonicalLocale.mockReturnValue('en-US')
			expect(getDayNames()).toEqual(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
		})

		it('returns German day names in "de-DE" locale when `globalThis.dayNames` is not defined', () => {
			getCanonicalLocale.mockReturnValue('de-DE')
			expect(getDayNames()).toEqual(['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'])
		})
	})

	describe('getDayNames TZ=America/New_York', () => {
		beforeEach(() => {
			vi.stubEnv('TZ', 'America/New_York')
		})
		afterEach(() => {
			vi.unstubAllEnvs()
			// @ts-expect-error - Mocking for tests
			delete globalThis.dayNames
		})

		it('returns `globalThis.dayNames` when defined', () => {
			globalThis.dayNames = ['Day 0', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6']
			expect(getDayNames()).toEqual(globalThis.dayNames)
		})

		it('returns English day names in "en-US" locale when `globalThis.dayNames` is not defined', () => {
			getCanonicalLocale.mockReturnValue('en-US')
			expect(getDayNames()).toEqual(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
		})

		it('returns German day names in "de-DE" locale when `globalThis.dayNames` is not defined', () => {
			getCanonicalLocale.mockReturnValue('de-DE')
			expect(getDayNames()).toEqual(['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'])
		})
	})

	describe('getDayNamesShort TZ=Europe/Berlin', () => {
		beforeEach(() => {
			vi.stubEnv('TZ', 'Europe/Berlin')
		})
		afterEach(() => {
			vi.unstubAllEnvs()
			// @ts-expect-error - Mocking for tests
			delete globalThis.dayNamesShort
		})

		it('returns `globalThis.dayNamesShort` when defined', () => {
			globalThis.dayNamesShort = ['D. 0', 'D. 1', 'D. 2', 'D. 3', 'D. 4', 'D. 5', 'D. 6']
			expect(getDayNamesShort()).toEqual(globalThis.dayNamesShort)
		})

		it('returns English short day names from `Intl` in "en-US" locale when `globalThis.dayNamesShort` is not defined', () => {
			getCanonicalLocale.mockReturnValue('en-US')
			expect(getDayNamesShort()).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
		})

		it('returns German short day names from `Intl` in "de-DE" locale when `globalThis.dayNamesShort` is not defined', () => {
			getCanonicalLocale.mockReturnValue('de-DE')
			expect(getDayNamesShort()).toEqual(['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'])
		})
	})

	describe('getDayNamesShort TZ=America/New_York', () => {
		beforeEach(() => {
			vi.stubEnv('TZ', 'America/New_York')
		})
		afterEach(() => {
			vi.unstubAllEnvs()
			// @ts-expect-error - Mocking for tests
			delete globalThis.dayNamesShort
		})

		it('returns `globalThis.dayNamesShort` when defined', () => {
			globalThis.dayNamesShort = ['D. 0', 'D. 1', 'D. 2', 'D. 3', 'D. 4', 'D. 5', 'D. 6']
			expect(getDayNamesShort()).toEqual(globalThis.dayNamesShort)
		})

		it('returns English short day names from `Intl` in "en-US" locale when `globalThis.dayNamesShort` is not defined', () => {
			getCanonicalLocale.mockReturnValue('en-US')
			expect(getDayNamesShort()).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
		})

		it('returns German short day names from `Intl` in "de-DE" locale when `globalThis.dayNamesShort` is not defined', () => {
			getCanonicalLocale.mockReturnValue('de-DE')
			expect(getDayNamesShort()).toEqual(['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'])
		})
	})

	describe('getDayNamesMin TZ=Europe/Berlin', () => {
		beforeEach(() => {
			vi.stubEnv('TZ', 'Europe/Berlin')
		})
		afterEach(() => {
			vi.unstubAllEnvs()
			// @ts-expect-error - Mocking for tests
			delete globalThis.dayNamesMin
		})

		it('returns `globalThis.dayNamesMin` when defined', () => {
			globalThis.dayNamesMin = ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6']
			expect(getDayNamesMin()).toEqual(globalThis.dayNamesMin)
		})

		it('returns English narrow day names from `Intl` in "en-US" locale when `globalThis.dayNamesMin` is not defined', () => {
			getCanonicalLocale.mockReturnValue('en-US')
			expect(getDayNamesMin()).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S'])
		})

		it('returns German narrow day names from `Intl` in "de-DE" locale when `globalThis.dayNamesMin` is not defined', () => {
			getCanonicalLocale.mockReturnValue('de-DE')
			expect(getDayNamesMin()).toEqual(['S', 'M', 'D', 'M', 'D', 'F', 'S'])
		})
	})

	describe('getDayNamesMin TZ=America/New_York', () => {
		beforeEach(() => {
			vi.stubEnv('TZ', 'America/New_York')
		})
		afterEach(() => {
			vi.unstubAllEnvs()
			// @ts-expect-error - Mocking for tests
			delete globalThis.dayNamesMin
		})

		it('returns `globalThis.dayNamesMin` when defined', () => {
			globalThis.dayNamesMin = ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6']
			expect(getDayNamesMin()).toEqual(globalThis.dayNamesMin)
		})

		it('returns English narrow day names from `Intl` in "en-US" locale when `globalThis.dayNamesMin` is not defined', () => {
			getCanonicalLocale.mockReturnValue('en-US')
			expect(getDayNamesMin()).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S'])
		})

		it('returns German narrow day names from `Intl` in "de-DE" locale when `globalThis.dayNamesMin` is not defined', () => {
			getCanonicalLocale.mockReturnValue('de-DE')
			expect(getDayNamesMin()).toEqual(['S', 'M', 'D', 'M', 'D', 'F', 'S'])
		})
	})

	describe('getMonthNames TZ=Europe/Berlin', () => {
		beforeEach(() => {
			vi.stubEnv('TZ', 'Europe/Berlin')
		})
		afterEach(() => {
			vi.unstubAllEnvs()
			// @ts-expect-error - Mocking for tests
			delete globalThis.monthNames
		})

		it('returns `globalThis.monthNames` when defined', () => {
			globalThis.monthNames = ['Month 0', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11']
			expect(getMonthNames()).toEqual(globalThis.monthNames)
		})

		it('returns English month names from `Intl` in "en-US" locale when `globalThis.monthNames` is not defined', () => {
			getCanonicalLocale.mockReturnValue('en-US')
			expect(getMonthNames()).toEqual(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])
		})

		it('returns German month names from `Intl` in "de-DE" locale when `globalThis.monthNames` is not defined', () => {
			getCanonicalLocale.mockReturnValue('de-DE')
			expect(getMonthNames()).toEqual(['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'])
		})
	})

	describe('getMonthNames TZ=America/New_York', () => {
		beforeEach(() => {
			vi.stubEnv('TZ', 'America/New_York')
		})
		afterEach(() => {
			vi.unstubAllEnvs()
			// @ts-expect-error - Mocking for tests
			delete globalThis.monthNames
		})

		it('returns `globalThis.monthNames` when defined', () => {
			globalThis.monthNames = ['Month 0', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11']
			expect(getMonthNames()).toEqual(globalThis.monthNames)
		})

		it('returns English month names from `Intl` in "en-US" locale when `globalThis.monthNames` is not defined', () => {
			getCanonicalLocale.mockReturnValue('en-US')
			expect(getMonthNames()).toEqual(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])
		})

		it('returns German month names from `Intl` in "de-DE" locale when `globalThis.monthNames` is not defined', () => {
			getCanonicalLocale.mockReturnValue('de-DE')
			expect(getMonthNames()).toEqual(['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'])
		})
	})

	describe('getMonthNamesShort TZ=Europe/Berlin', () => {
		beforeEach(() => {
			vi.stubEnv('TZ', 'Europe/Berlin')
		})
		afterEach(() => {
			vi.unstubAllEnvs()
			// @ts-expect-error - Mocking for tests
			delete globalThis.monthNamesShort
		})

		it('returns `globalThis.monthNamesShort` when defined', () => {
			globalThis.monthNamesShort = ['M. 0', 'M. 1', 'M. 2', 'M. 3', 'M. 4', 'M. 5', 'M. 6', 'M. 7', 'M. 8', 'M. 9', 'M. 10', 'M. 11']
			expect(getMonthNamesShort()).toEqual(globalThis.monthNamesShort)
		})

		it('returns English short month names from `Intl` in "en-US" locale when `globalThis.monthNamesShort` is not defined', () => {
			getCanonicalLocale.mockReturnValue('en-US')
			expect(getMonthNamesShort()).toEqual(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
		})

		it('returns German short month names from `Intl` in "de-DE" locale when `globalThis.monthNamesShort` is not defined', () => {
			getCanonicalLocale.mockReturnValue('de-DE')
			expect(getMonthNamesShort()).toEqual(['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'])
		})
	})

	describe('getMonthNamesShort TZ=America/New_York', () => {
		beforeEach(() => {
			vi.stubEnv('TZ', 'America/New_York')
		})
		afterEach(() => {
			vi.unstubAllEnvs()
			// @ts-expect-error - Mocking for tests
			delete globalThis.monthNamesShort
		})

		it('returns `globalThis.monthNamesShort` when defined', () => {
			globalThis.monthNamesShort = ['M. 0', 'M. 1', 'M. 2', 'M. 3', 'M. 4', 'M. 5', 'M. 6', 'M. 7', 'M. 8', 'M. 9', 'M. 10', 'M. 11']
			expect(getMonthNamesShort()).toEqual(globalThis.monthNamesShort)
		})

		it('returns English short month names from `Intl` in "en-US" locale when `globalThis.monthNamesShort` is not defined', () => {
			getCanonicalLocale.mockReturnValue('en-US')
			expect(getMonthNamesShort()).toEqual(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
		})

		it('returns German short month names from `Intl` in "de-DE" locale when `globalThis.monthNamesShort` is not defined', () => {
			getCanonicalLocale.mockReturnValue('de-DE')
			expect(getMonthNamesShort()).toEqual(['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'])
		})
	})
})
