/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { MockXhrServer, newServer } from 'mock-xmlhttprequest'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { loadTranslations, register, translate, unregister } from '../lib/translation'

const setLocale = (locale: string) => document.documentElement.setAttribute('data-locale', locale)

describe('loadTranslations', () => {
	let server: MockXhrServer

	beforeAll(() => {
		// Mock some server state
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any)._oc_webroot = '';
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any)._oc_appswebroots = {
			404: '/404',
			500: '/500',
			empty: '/empty',
			invalid: '/invalid',
			'missing-bundle': '/missing-bundle',
			myapp: '/myapp',
			networkissue: '/networkissue',
		}
	})

	beforeEach(() => {
		setLocale('de')
		server = newServer()
			.addHandler('GET', '/myapp/l10n/de.json', {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					translations: {
						'Hello world!': 'Hallo Welt!',
					},
				}),
			})
			// Response with empty body
			.addHandler('GET', '/empty/l10n/de.json', {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
				body: '',
			})
			// Response contains JSON but no translations
			.addHandler('GET', '/missing-bundle/l10n/de.json', {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({}),
			})
			// Response contains JSON but the translations are invalid
			.addHandler('GET', '/invalid/l10n/de.json', {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					translations: 'invalid',
				}),
			})
			.addHandler('GET', '/404/l10n/de.json', {
				status: 404,
				statusText: 'Not Found',
			})
			.addHandler('GET', '/500/l10n/de.json', {
				status: 500,
				statusText: 'Internal Server Error',
			})
			.addHandler('GET', '/networkissue/l10n/de.json', (req) => req.setNetworkError())
			.setDefault404()
		server
			.disableTimeout()
		server
			.install()
	})

	afterEach(() => {
		server.remove()
		vi.clearAllMocks()
	})

	it('calls callback if app already exists', async () => {
		register('myapp', {
			Bye: 'Tschüss',
		})

		const callback = vi.fn()
		try {
			await loadTranslations('myapp', callback)
			// Callback called
			expect(callback).toBeCalledTimes(1)
			// No requests done
			expect(server.getRequestLog().length).toBe(0)
			// Old translations work
			expect(translate('myapp', 'Bye')).toBe('Tschüss')
			// does not override translations
			expect(translate('myapp', 'Hello world!')).toBe('Hello world!')
		} catch (e) {
			expect(e).toBe('Unexpected error')
		} finally {
			unregister('myapp')
		}
	})

	it('calls callback if locale is English', async () => {
		setLocale('en')
		const callback = vi.fn()

		try {
			await loadTranslations('myapp', callback)
			// Callback called
			expect(callback).toBeCalledTimes(1)
			// No requests done
			expect(server.getRequestLog().length).toBe(0)
		} catch (e) {
			expect(e).toBe('Unexpected error')
		}
	})

	it('registers new translations', async () => {
		const callback = vi.fn()
		try {
			await loadTranslations('myapp', callback)
			// Callback called
			expect(callback).toBeCalledTimes(1)
			// No requests done
			expect(server.getRequestLog().length).toBe(1)
			// New translations work
			expect(translate('myapp', 'Hello world!')).toBe('Hallo Welt!')
		} catch (e) {
			expect(e).toBe('Unexpected error')
		}
	})

	it('does reject on network error', async () => {
		const callback = vi.fn()
		try {
			await loadTranslations('networkissue', callback)
			expect('').toBe('Unexpected pass')
		} catch (e) {
			expect(e instanceof Error).toBe(true)
			expect((<Error>e).message).toBe('Network error')
		}
	})

	it('does reject on server error', async () => {
		const callback = vi.fn()
		try {
			await loadTranslations('500', callback)
			expect('').toBe('Unexpected pass')
		} catch (e) {
			expect(e instanceof Error).toBe(true)
			expect((<Error>e).message).toBe('Internal Server Error')
		}
	})

	it('does reject on unavailable bundle', async () => {
		const callback = vi.fn()
		try {
			await loadTranslations('404', callback)
			expect('').toBe('Unexpected pass')
		} catch (e) {
			expect(e instanceof Error).toBe(true)
			expect((<Error>e).message).toBe('Not Found')
		}
	})

	it('does reject on invalid bundle', async () => {
		const callback = vi.fn()
		try {
			await loadTranslations('invalid', callback)
			expect('').toBe('Unexpected pass')
		} catch (e) {
			expect(e instanceof Error).toBe(true)
			expect((<Error>e).message).toBe('Invalid content of translation bundle')
		}
	})

	it('does reject on missing bundle', async () => {
		const callback = vi.fn()
		try {
			await loadTranslations('missing-bundle', callback)
			expect('').toBe('Unexpected pass')
		} catch (e) {
			expect(e instanceof Error).toBe(true)
			expect((<Error>e).message).toBe('Invalid content of translation bundle')
		}
	})

	it('does reject on empty response', async () => {
		const callback = vi.fn()
		try {
			await loadTranslations('empty', callback)
			expect('').toBe('Unexpected pass')
		} catch (e) {
			expect(e instanceof Error).toBe(true)
			expect((<Error>e).message).toBe('Invalid content of translation bundle')
		}
	})
})
