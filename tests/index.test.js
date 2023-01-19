import {
	getCanonicalLocale,
	translate,
	translatePlural,
	register,
	_unregister,
} from '../lib/index'

const setLocale = (locale) => document.documentElement.setAttribute('data-locale', locale)

describe('translate', () => {
	const mockWindowDE = () => {
		window._oc_l10n_registry_translations = {
			core: {
				'Hello world!': 'Hallo Welt!',
				'Hello {name}': 'Hallo {name}',
				'_download %n file_::_download %n files_': [
					'Lade %n Datei herunter',
					'Lade %n Dateien herunter',
				],
			},
		}
		window._oc_l10n_registry_plural_functions = {
			core: (t) => t === 1 ? 0 : 1,
		}
		setLocale('de')
	}

	beforeAll(mockWindowDE)

	it('singular', () => {
		const text = 'Hello world!'
		const translation = translate('core', text)
		expect(translation).toBe('Hallo Welt!')
	})

	it('with variable', () => {
		const text = 'Hello {name}'
		const translation = translate('core', text, { name: 'J. Doe' })
		expect(translation).toBe('Hallo J. Doe')
	})

	it('plural', () => {
		const text = ['download %n file', 'download %n files']

		expect(translatePlural('core', ...text, 1)).toBe('Lade 1 Datei herunter')

		expect(translatePlural('core', ...text, 2)).toBe('Lade 2 Dateien herunter')
	})

	it('missing text', () => {
		const text = 'Good bye!'
		const translation = translate('core', text)
		expect(translation).toBe('Good bye!')
	})

	it('missing application', () => {
		const text = 'Good bye!'
		const translation = translate('unavailable', text)
		expect(translation).toBe('Good bye!')
	})
})

describe('getCanonicalLocale', () => {
	afterEach(() => {
		setLocale('')
	})

	it('Returns primary locales as is', () => {
		setLocale('de')
		expect(getCanonicalLocale()).toEqual('de')
		setLocale('zu')
		expect(getCanonicalLocale()).toEqual('zu')
	})

	it('Returns extended locales with hyphens', () => {
		setLocale('az_Cyrl_AZ')
		expect(getCanonicalLocale()).toEqual('az-Cyrl-AZ')
		setLocale('de_DE')
		expect(getCanonicalLocale()).toEqual('de-DE')
	})
})

describe('register', () => {
	beforeEach(() => {
		setLocale('de_DE')
		window._oc_l10n_registry_translations = undefined
		window._oc_l10n_registry_plural_functions = undefined
	})

	it('initial', () => {
		register('app', {
			Application: 'Anwendung',
			'_%n guest_::_%n guests_': ['%n Gast', '%n Gäste'],
		})
		expect(translate('app', 'Application')).toBe('Anwendung')
		expect(translatePlural('app', '%n guest', '%n guests', 1)).toBe('1 Gast')
		expect(translatePlural('app', '%n guest', '%n guests', 2)).toBe('2 Gäste')
	})

	it('extend', () => {
		window._oc_l10n_registry_translations = {
			app: {
				Application: 'Anwendung',
			},
		}
		window._oc_l10n_registry_plural_functions = {
			app: (t) => t === 1 ? 0 : 1,
		}
		register('app', {
			Translation: 'Übersetzung',
		})
		expect(translate('app', 'Application')).toBe('Anwendung')
		expect(translate('app', 'Translation')).toBe('Übersetzung')
	})

	it('with another app', () => {
		window._oc_l10n_registry_translations = {
			core: {
				'Hello world!': 'Hallo Welt!',
			},
		}
		window._oc_l10n_registry_plural_functions = {
			core: (t) => t === 1 ? 0 : 1,
		}
		register('app', {
			Application: 'Anwendung',
		})
		expect(translate('core', 'Hello world!')).toBe('Hallo Welt!')
		expect(translate('app', 'Application')).toBe('Anwendung')
	})

	it('unregister', () => {
		window._oc_l10n_registry_translations = {}
		window._oc_l10n_registry_plural_functions = {}
		register('app', {
			Application: 'Anwendung',
		})
		_unregister('app')
		expect(translate('app', 'Application')).toBe('Application')
	})
})
