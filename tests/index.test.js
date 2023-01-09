import {
    getCanonicalLocale,
    getFirstDay,
    getDayNames,
    getDayNamesShort,
    getDayNamesMin,
    getMonthNames,
    getMonthNamesShort,
    translate,
    translatePlural
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
                    'Lade %n Dateien herunter'
                ],
            }
        }
        window._oc_l10n_registry_plural_functions = {
            core: (t) => 1 === t ? 0 : 1
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
        const translation = translate('core', text, {name: 'J. Doe'})
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
