/*!
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => vi.resetModules())

describe('getLanguage', () => {
	it('returns the set language as it is', async () => {
		mockLanguage('de-DE')
		expect(await getLanguage()).toEqual('de-DE')
	})

	it('returns the navigator language if no language is set', async () => {
		const spy = vi.spyOn(navigator, 'language', 'get')
		spy.mockImplementationOnce(() => 'ar-EG')

		mockLanguage(undefined)
		expect(await getLanguage()).toEqual('ar-EG')
		expect(spy).toHaveBeenCalledOnce()
	})
})

describe('setLanguage', () => {
	it('does set the global state', async () => {
		mockLanguage('de')
		await setLanguage('ar')
		expect(globalThis._nc_l10n_language).toBe('ar')
	})

	it.skipIf(typeof globalThis.document === 'undefined')('does set the DOM attribute', async () => {
		mockLanguage('de')
		await setLanguage('ar')
		expect(document.documentElement.lang).toBe('ar')
	})
})

describe('getLocale', () => {
	it('returns the set locale as it is with underscore', async () => {
		mockLocale('de_DE')
		expect(await getLocale()).toEqual('de_DE')
	})

	it('returns the environment locale with underscore if no locale is set', async () => {
		mockLocale(undefined)
		expect(await getLocale()).toEqual(process.env.LANG?.replaceAll('-', '_').split('.')[0])
	})
})

describe('setLocale', () => {
	it('does set the global state', async () => {
		mockLocale('de_DE')
		await setLocale('ar')
		expect(globalThis._nc_l10n_locale).toBe('ar')
	})

	it.skipIf(typeof globalThis.document === 'undefined')('does set the DOM attribute', async () => {
		mockLocale('de_DE')
		await setLocale('ar')
		expect(document.documentElement.dataset.locale).toBe('ar')
	})
})

describe('getCanonicalLocale', () => {
	it('returns the set locale with hyphen', async () => {
		mockLocale('de_DE')
		expect(await getCanonicalLocale()).toEqual('de-DE')
	})

	it('returns the set locale with multiple hyphen', async () => {
		mockLocale('az_Cyrl_AZ')
		expect(await getCanonicalLocale()).toEqual('az-Cyrl-AZ')
	})

	it('returns the environment locale with hyphen if no locale is set', async () => {
		expect(process.env.LANG).toBeTruthy()

		mockLocale(undefined)
		expect(await getCanonicalLocale()).toEqual(process.env.LANG!.split('.')[0])
	})
})

describe('getTimezone', () => {
	vi.spyOn(console, 'debug').mockImplementation(() => {})
	it('returns the set timezone as it is', async () => {
		mockTimezone('Europe/Berlin')
		expect(await getTimezone()).toEqual('Europe/Berlin')
	})

	it('returns the environment timezone if no timezone is set', async () => {
		mockTimezone(undefined)
		expect(await getTimezone()).toEqual(process.env.TZ)
	})
})

describe('setTimezone', () => {
	it('sets the global state', async () => {
		mockTimezone('Europe/Berlin')
		await setTimezone('America/New_York')
		expect(globalThis._nc_l10n_timezone).toBe('America/New_York')
	})
})

async function getCanonicalLocale() {
	const { getCanonicalLocale } = await import('../lib/locale.ts')
	return getCanonicalLocale()
}

async function getLocale() {
	const { getLocale } = await import('../lib/locale.ts')
	return getLocale()
}

async function getLanguage() {
	const { getLanguage } = await import('../lib/locale.ts')
	return getLanguage()
}

async function getTimezone() {
	const { getTimezone } = await import('../lib/locale.ts')
	return getTimezone()
}

async function setLocale(locale: string) {
	const { setLocale } = await import('../lib/locale.ts')
	return setLocale(locale)
}

async function setLanguage(language: string) {
	const { setLanguage } = await import('../lib/locale.ts')
	return setLanguage(language)
}

async function setTimezone(timezone: string) {
	const { setTimezone } = await import('../lib/locale.ts')
	return setTimezone(timezone)
}

function mockLanguage(lang?: string) {
	// @ts-expect-error - Mocking global state
	globalThis._nc_l10n_language = lang
}
function mockLocale(locale?: string) {
	// @ts-expect-error - Mocking global state
	globalThis._nc_l10n_locale = locale
	if (typeof globalThis.document !== 'undefined') {
		delete globalThis.document.documentElement.dataset.locale
	}
}
function mockTimezone(timezone?: string) {
	// @ts-expect-error - Mocking global state
	globalThis._nc_l10n_timezone = timezone
}
