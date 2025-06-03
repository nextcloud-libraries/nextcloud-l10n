/*!
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { po } from 'gettext-parser'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getGettextBuilder } from '../lib/gettext.ts'

const setLanguage = (lang: string) => { globalThis._nc_l10n_language = lang }

describe('gettext', () => {
	beforeEach(() => {
		setLanguage('en')
		vi.spyOn(console, 'debug')
			.mockImplementation(() => {})
	})

	it('falls back to the original string', () => {
		const gt = getGettextBuilder()
			.setLanguage('de')
			.build()

		const translation = gt.gettext('Settings')

		expect(translation).toEqual('Settings')
	})

	it('does not log in production', () => {
		const gt = getGettextBuilder()
			.setLanguage('de')
			.build()

		gt.gettext('Settings')

		expect(console.debug).not.toHaveBeenCalled()
	})

	it('has optional debug logs', () => {
		const gt = getGettextBuilder()
			.setLanguage('de')
			.enableDebugMode()
			.build()

		gt.gettext('Settings')

		expect(console.debug).toHaveBeenCalled()
	})

	it('falls back to the original singular string', () => {
		const gt = getGettextBuilder()
			.setLanguage('en')
			.build()

		const translated = gt.ngettext('%n Setting', '%n Settings', 1)

		expect(translated).toEqual('1 Setting')
	})

	it('falls back to the original plural string', () => {
		const gt = getGettextBuilder()
			.setLanguage('en')
			.build()

		const translated = gt.ngettext('%n Setting', '%n Settings', 2)

		expect(translated).toEqual('2 Settings')
	})

	it('used nextcloud-style placeholder replacement', () => {
		const gt = getGettextBuilder()
			.setLanguage('de')
			.build()

		const translation = gt.gettext('I wish Nextcloud were written in {lang}', {
			lang: 'Rust',
		})

		expect(translation).toEqual('I wish Nextcloud were written in Rust')
	})

	it('is fault tolerant to invalid placeholders', () => {
		const gt = getGettextBuilder()
			.setLanguage('de')
			.build()

		const translation = gt.gettext('This is {value}', {
			// @ts-expect-error We check the fault tolerance so this will be a typescript issue
			value: false,
		})

		expect(translation).toEqual('This is {value}')
	})

	it('used nextcloud-style placeholder replacement for plurals', () => {
		const gt = getGettextBuilder()
			.setLanguage('de')
			.build()

		const translation = gt.ngettext('%n {what} Setting', '%n {what} Settings', 2, {
			what: 'test',
		})

		expect(translation).toEqual('2 test Settings')
	})

	it('translates', () => {
		const pot = `msgid ""
msgstr ""
"Last-Translator: Translator, 2020\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Language: sv\n"
"Plural-Forms: nplurals=2; plural=(n != 1);\n"

msgid "abc"
msgstr "def"
`
		const gt = getGettextBuilder()
			.setLanguage('sv')
			.addTranslation('sv', po.parse(pot))
			.build()

		const translation = gt.gettext('abc')

		expect(translation).toEqual('def')
	})

	it('translates plurals', () => {
		// From https://www.gnu.org/software/gettext/manual/html_node/Translating-plural-forms.html
		const pot = `msgid ""
msgstr ""
"Last-Translator: Translator, 2020\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Language: sv\n"
"Plural-Forms: nplurals=2; plural=(n != 1);\n"

msgid "One file removed"
msgid_plural "%n files removed"
msgstr[0] "%n slika uklonjenih"
msgstr[1] "%n slika uklonjenih"
msgstr[2] "%n slika uklonjenih"
`
		const gt = getGettextBuilder()
			.setLanguage('sv')
			.addTranslation('sv', po.parse(pot))
			.build()

		const translation = gt.ngettext('One file removed', '%n files removed', 2)

		expect(translation).toEqual('2 slika uklonjenih')
	})

	it('falls back to english', () => {
		const pot = `msgid ""
msgstr ""
"Last-Translator: Translator, 2023\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Language: en\n"
"Plural-Forms: nplurals=2; plural=(n != 1);\n"

msgid "abc"
msgstr "xyz"
`
		// Do not set local explicitly, so 'en' should be used
		const gt = getGettextBuilder()
			.addTranslation('en', po.parse(pot))
			.build()

		const translation = gt.gettext('abc')

		expect(translation).toEqual('xyz')
	})

	it('does not escape special chars', () => {
		const gt = getGettextBuilder()
			.setLanguage('de')
			.build()

		const translation = gt.gettext('test & stuff')

		expect(translation).toEqual('test & stuff')
	})

	it('can autodetect the language', () => {
		const pot = `msgid ""
msgstr ""
"Last-Translator: Translator, 2020\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Language: sv\n"
"Plural-Forms: nplurals=2; plural=(n != 1);\n"

msgid "abc"
msgstr "correct"
`

		const potEn = `msgid ""
msgstr ""
"Last-Translator: Translator, 2020\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Language: en\n"
"Plural-Forms: nplurals=2; plural=(n != 1);\n"

msgid "abc"
msgstr "incorrect"
`
		setLanguage('sv')
		const gt = getGettextBuilder()
			.addTranslation('sv', po.parse(pot))
			.addTranslation('en', po.parse(potEn))
			.detectLocale()
			.build()

		const translation = gt.gettext('abc')

		expect(translation).toEqual('correct')
	})
})
