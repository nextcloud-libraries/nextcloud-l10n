import { MockXhrServer, newServer } from 'mock-xmlhttprequest'

import { loadTranslations, register, translate, _unregister } from '../lib/translation'

const setLocale = (locale) => document.documentElement.setAttribute('data-locale', locale)

describe('loadTranslations', () => {
	let server: MockXhrServer

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
			.addHandler('GET', '/invalid/l10n/de.json', {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					strings: {
						'Hello world!': 'Hallo Welt!',
					},
				}),
			})
			.addHandler('GET', '/empty/l10n/de.json', {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
				body: '',
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
		jest.clearAllMocks()
	})

	it('calls callback if app already exists', async () => {
		register('myapp', {
			Bye: 'Tschüss',
		})

		const callback = jest.fn()
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
			_unregister('myapp')
		}
	})

	it('calls callback if locale is English', async () => {
		setLocale('en')
		const callback = jest.fn()

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
		const callback = jest.fn()
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
		} finally {
			console.warn(server.getRequestLog()[0])
		}
	})

	it('does reject on network error', async () => {
		const callback = jest.fn()
		try {
			await loadTranslations('networkissue', callback)
			expect('').toBe('Unexpected pass')
		} catch (e) {
			expect(e instanceof Error).toBe(true)
			expect((<Error>e).message).toBe('Network error')
		}
	})

	it('does reject on server error', async () => {
		const callback = jest.fn()
		try {
			await loadTranslations('500', callback)
			expect('').toBe('Unexpected pass')
		} catch (e) {
			expect(e instanceof Error).toBe(true)
			expect((<Error>e).message).toBe('Internal Server Error')
		}
	})

	it('does reject on unavailable bundle', async () => {
		const callback = jest.fn()
		try {
			await loadTranslations('404', callback)
			expect('').toBe('Unexpected pass')
		} catch (e) {
			expect(e instanceof Error).toBe(true)
			expect((<Error>e).message).toBe('Not Found')
		}
	})

	it('does reject on invalid bundle', async () => {
		const callback = jest.fn()
		try {
			await loadTranslations('invalid', callback)
			expect('').toBe('Unexpected pass')
		} catch (e) {
			expect(e instanceof Error).toBe(true)
			expect((<Error>e).message).toBe('Invalid content of translation bundle')
		}
	})

	it('does reject on empty bundle', async () => {
		const callback = jest.fn()
		try {
			await loadTranslations('invalid', callback)
			expect('').toBe('Unexpected pass')
		} catch (e) {
			expect(e instanceof Error).toBe(true)
			expect((<Error>e).message).toBe('Invalid content of translation bundle')
		}
	})
})
