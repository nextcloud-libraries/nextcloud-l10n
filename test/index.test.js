import {
    getCanonicalLocale,
    getFirstDay,
    getDayNames,
    getDayNamesShort,
    getDayNamesMin,
    getMonthNames,
    getMonthNamesShort
} from '../lib/index'

describe('getCanonicalLocale', () => {
    const setLocale = (locale) => document.documentElement.setAttribute('data-locale', locale)

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

test('getFirstDay', () => {
    expect(getFirstDay()).toBe(1)
})

test('getDayNames', () => {
    expect(getDayNames().length).toBe(7)
})

test('getDayNamesShort', () => {
    expect(getDayNamesShort().length).toBe(7)
})

test('getDayNamesMin', () => {
    expect(getDayNamesMin().length).toBe(7)
})

test('getMonthNames', () => {
    expect(getMonthNames().length).toBe(12)
})

test('getMonthNamesShort', () => {
    expect(getMonthNamesShort().length).toBe(12)
})
