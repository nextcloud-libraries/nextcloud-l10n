/*!
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => vi.resetModules())

describe('getLanguage', () => {
	it('returns the set language as it is', async () => {
		setLanguage('de-DE')
		expect(await getLanguage()).toEqual('de-DE')
	})

	it('returns the navigator language if no language is set', async () => {
		const spy = vi.spyOn(navigator, 'language', 'get')
		spy.mockImplementationOnce(() => 'ar-EG')

		setLanguage(undefined)
		expect(await getLanguage()).toEqual('ar-EG')
		expect(spy).toHaveBeenCalledOnce()
	})
})

describe('getLocale', () => {
	it('returns the set locale as it is with underscore', async () => {
		setLocale('de_DE')
		expect(await getLocale()).toEqual('de_DE')
	})

	it('returns the environment locale with underscore if no locale is set', async () => {
		setLocale(undefined)
		expect(await getLocale()).toEqual(process.env.LANG?.replaceAll('-', '_').split('.')[0])
	})
})

describe('getCanonicalLocale', () => {
	it('returns the set locale with hyphen', async () => {
		setLocale('de_DE')
		expect(await getCanonicalLocale()).toEqual('de-DE')
	})

	it('returns the set locale with multiple hyphen', async () => {
		setLocale('az_Cyrl_AZ')
		expect(await getCanonicalLocale()).toEqual('az-Cyrl-AZ')
	})

	it('returns the environment locale with hyphen if no locale is set', async () => {
		expect(process.env.LANG).toBeTruthy()

		setLocale(undefined)
		expect(await getCanonicalLocale()).toEqual(process.env.LANG!.split('.')[0])
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

function setLanguage(lang?: string) {
	// @ts-expect-error - Mocking global state
	globalThis._nc_l10n_language = lang
}
function setLocale(locale?: string) {
	// @ts-expect-error - Mocking global state
	globalThis._nc_l10n_locale = locale
}
