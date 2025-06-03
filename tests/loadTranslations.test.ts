/*!
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { SetupServerApi } from 'msw/node'

import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { setLanguage } from '../lib/locale.ts'
import { loadTranslations, register, translate, unregister } from '../lib/translation.ts'

vi.mock('@nextcloud/router', () => ({
	generateFilePath: (app: string, type: string, path: string) => `http://localhost/${app}/${type}/${path}`,
}))

const requestHandlers = [
	http.get('http://localhost/myapp/l10n/de.json', () => HttpResponse.json({
		translations: {
			'Hello world!': 'Hallo Welt!',
		},
	})),
	// Response with empty body
	http.get('http://localhost/empty/l10n/de.json', () => HttpResponse.json()),
	// Response contains JSON but no translations
	http.get('http://localhost/missing-bundle/l10n/de.json', () => HttpResponse.json({})),
	// Response contains JSON but the translations are invalid
	http.get('http://localhost/invalid/l10n/de.json', () => HttpResponse.json({
		translations: 'invalid',
	})),
	// errors
	http.get('http://localhost/404/l10n/de.json', () => HttpResponse.json({}, { status: 404 })),
	http.get('http://localhost/500/l10n/de.json', () => HttpResponse.json({}, { status: 500 })),
	http.get('http://localhost/networkissue/l10n/de.json', () => HttpResponse.error()),
]

const server: SetupServerApi = setupServer(...requestHandlers)

describe('loadTranslations', () => {
	beforeAll(() => {
		server.listen({ onUnhandledRequest: 'error' })
	})

	beforeEach(() => {
		setLanguage('de')
	})

	// Close server after all tests
	afterAll(() => server.close())

	// Reset handlers after each test for test isolation
	afterEach(() => {
		server.resetHandlers()
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
		setLanguage('en')
		const callback = vi.fn()

		try {
			await loadTranslations('myapp', callback)
			// Callback called
			expect(callback).toBeCalledTimes(1)
		} catch (e) {
			expect(e).toBe('Unexpected error')
		}
	})

	it('registers new translations', async () => {
		const callback = vi.fn()
		await loadTranslations('myapp', callback)
		// Callback called
		expect(callback).toBeCalledTimes(1)
		// New translations work
		expect(translate('myapp', 'Hello world!')).toBe('Hallo Welt!')
	})

	it('does reject on network error', async () => {
		try {
			await loadTranslations('networkissue')
			expect('').toBe('Unexpected pass')
		} catch (e) {
			expect(e).toBeInstanceOf(Error)
			expect((<Error>e).message).toBe('Network error')
		}
	})

	it('does reject on server error', async () => {
		try {
			await loadTranslations('500')
			expect('').toBe('Unexpected pass')
		} catch (e) {
			expect(e).toBeInstanceOf(Error)
			expect((<Error>e).message).toBe('Internal Server Error')
		}
	})

	it('does reject on unavailable bundle', async () => {
		try {
			await loadTranslations('404')
			expect('').toBe('Unexpected pass')
		} catch (e) {
			expect(e).toBeInstanceOf(Error)
			expect((<Error>e).message).toBe('Not Found')
		}
	})

	it('does reject on invalid bundle', async () => {
		try {
			await loadTranslations('invalid')
			expect('').toBe('Unexpected pass')
		} catch (e) {
			expect(e).toBeInstanceOf(Error)
			expect((<Error>e).message).toBe('Invalid content of translation bundle')
		}
	})

	it('does reject on missing bundle', async () => {
		try {
			await loadTranslations('missing-bundle')
			expect('').toBe('Unexpected pass')
		} catch (e) {
			expect(e).toBeInstanceOf(Error)
			expect((<Error>e).message).toBe('Invalid content of translation bundle')
		}
	})

	it('does reject on empty response', async () => {
		await expect(() => loadTranslations('empty')).rejects.toThrowErrorMatchingInlineSnapshot('[Error: Invalid content of translation bundle]')
	})
})
