<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: GPL-3.0-or-later
-->
# Changelog

All notable changes to this project will be documented in this file.


## 3.4.0 - 2025-07-09
### 🚀 Enhancements
- feat: add support for universal environment [\#933](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/933) \([susnux](https://github.com/susnux)\)
- feat(gettext): allow to add translations to the wrapper [\#953](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/953) \([susnux](https://github.com/susnux)\)

### Other changes
- chore: update ESLint to v9 and adjust code style [\#955](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/955) \([susnux](https://github.com/susnux)\)
- chore: update support Node versions and use `devEngines` [\#954](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/954) \([susnux](https://github.com/susnux)\)
- Updated development dependencies

## 3.3.0 - 2025-05-29
### ℹ️ Notes
- The Node version was increased to current LTS version 22.
- The `callback` parameter of the `loadTranslations` method is deprecated.
  Instead just use the returned promise like `loadTranslations('app').then(callback)`.

### 🚀 Enhancements
* feat: add method to format relative time [#921](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/921) ([susnux](https://github.com/susnux))

### 🐛 Fixed bugs
* fix: export types used in gettext exports [#905](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/905) ([susnux](https://github.com/susnux))
* fix(translations): use language instead of locale + refactor the `loadTranslations` method [#927](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/927) ([susnux](https://github.com/susnux))
* fix(locale): fallback to device preferences instead of 'en' [#864](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/864) ([ShGKme](https://github.com/ShGKme))

### Other changes
* refactor: simplify `loadTranslations` [#928](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/928) ([susnux](https://github.com/susnux))
* chore(deps): drop unnecessary @types/dompurify [#903](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/903) ([max-nextcloud](https://github.com/max-nextcloud))
* docs(readme): update badges [#904](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/904) ([st3iny](https://github.com/st3iny))
* chore(deps): Bump dompurify to 3.2.6
* Bump development dependencies

## 3.2.0 - 2025-02-13
### ℹ️ Notes
The `GettextBuilder.detectLocale` method is deprecated and will be removed in the next major version.
It is replaced with the `detectLanguage` method to make the method naming more consistent.

### Added
* feat(date): fallback to Intl [\#831](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/831) \([ShGKme](https://github.com/ShGKme)\)
* feat(gettext): Add `detectLanguage` method and deprecate `detectLocale` [\#850](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/850) \([susnux](https://github.com/susnux)\)
* feat: Overload translate function to either allow number or placeholder as third arg [\#854](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/854) \([susnux](https://github.com/susnux)\)

### Fixed
* fix(types): type translation variable keys [\#807](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/807) \([ShGKme](https://github.com/ShGKme)\)
* fix(isRTL): Correctly handle Urdu and Uzbek Afghan [\#855](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/855) \([susnux](https://github.com/susnux)\)
* fix(registry): Prevent prototype polluting [\#860](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/860) \([susnux](https://github.com/susnux)\)

### Changed
* refactor(gettext): Drop `node-gettext` dependency and use our translation logic [\#851](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/851) \([susnux](https://github.com/susnux)\)
* license: Add SPDX header [\#781](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/781) \([AndyScherzinger](https://github.com/AndyScherzinger)\)
* chore: Add missing trailing comma in vite config [\#852](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/852) \([susnux](https://github.com/susnux)\)
* docs: Clarify readme about Nextcloud provided and custom translations [\#853](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/853) \([susnux](https://github.com/susnux)\)
* docs: improve return type of getFirstDay() [\#784](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/784) \([st3iny](https://github.com/st3iny)\)
* docs: replace missing exports plugin to also document internal types [\#846](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/846) \([susnux](https://github.com/susnux)\)
* ci: Update from org [\#795](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/795) \([AndyScherzinger](https://github.com/AndyScherzinger)\)
* ci: Update workflows from organization [\#847](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/847) \([susnux](https://github.com/susnux)\)
* chore(deps): Bump `dompurify` and `@types/dompurify`
* chore(dev-deps): Update development dependencies

## 3.1.0 - 2024-05-07
### Added

*   Allow setting `escape` option per parameter replacing.\
	For more security this should be used instead of disabling paramter escaping,
	see [pull request #756](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/756)
	```js
	// Example
	t(
		'my-app',
		'{a}{userInput}{a_end}',
		{
			a: {
				value: '<a>',
				escape: false,
			},
			userInput: somePossiblyInsecureValue, // This will be escaped
			a_end: {
				value: '</a>',
				escape: false,
			}
		},
	)
	```

## 3.0.1 - 2024-05-04

### Fixed
* Ensure that built type definitions are bundled with the release and located in the correct directory

## 3.0.0 - 2024-05-02
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-l10n/compare/v2.2.0...v3.0.0)

### Breaking changes
Instead of also sanitizing the replacing variables, now only the result is sanitized, see [pull request #648](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/648).

This will improve the performance if multiple placeholders are used and it allows this, 
while the string is still sanitized:
```js
t(
	'See {linkstart}documentation{linkend}',
	{
		linkstart: '<a ...>',
		linkend: '</a>',
	},
	// No number
	undefined,
	{
		// Do not escape the result as we want the HTML anchor element
		escape: false,
	}
)
```

### Added
* feat: export aliases `t` and `n` for `translate` and `translatePlural`

### Fixed
* fix!: Only sanitize the result string when replacing variables

### Changed
* Update NPM to latest LTS v10
* Migrate to vite for transpiling and vitest for testing
* chore: Added more tests for special cases on plural forms
* chore(deps): Bump tough-cookie to 4.1.3
* chore(deps): Bump postcss to 8.4.31
* chore(deps): Bump @nextcloud/typings to 1.8.0
* chore(deps): Bump dompurify to 3.1.1
* chore(deps): Bump @nextcloud/router to 3.0.1

## 2.2.0 - 2023-06-26

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-l10n/compare/v2.1.0...v2.2.0)

### Added
- `isRTL` was added to check whether a given, or the current, language is read right-to-left [\#639](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/639) ([susnux](https://github.com/susnux))

### Fixed
- Add typings to the package exports to fix build for Typescript projects using `node16` or `nodenext` module resolution [\#633](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/633) ([susnux](https://github.com/susnux))
- Update exported `NextcloudWindowWithRegistry` type for Nextcloud 27 [\#640](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/640) ([susnux](https://github.com/susnux))
- Harden `loadTranslations` by handling edge cases where invalid data is retrieved [\#644](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/644) ([susnux](https://github.com/susnux))

### Changed
- Update node engines to next LTS (Node 20 + NPM 9)
- Dependency updates

## 2.1.0 - 2023-02-25

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-l10n/compare/v2.0.1...v2.1.0)

### Added
- `unregister` is now part of the public API [\#579](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/579) ([susnux](https://github.com/susnux))

### Fixed
- Export the `Translations` type and add missing documentation [\#566](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/566) ([susnux](https://github.com/susnux))
- Fix singular translation in edge cases where plural strings are provided [\#570](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/570) ([susnux](https://github.com/susnux))
- Make loading translations use async XMLHttpRequest [\#571](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/571) ([susnux](https://github.com/susnux))
- Removed warning "no app translation was registered" [\#572](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/572) ([ShGKme](https://github.com/ShGKme))

### Changed
- Added tests and increased code coverage
- Dependency updates

## 2.0.1 - 2023-01-19

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-l10n/compare/v2.0.0...v2.0.1)

### Fixed
- fix\(config\): fix npmignore config [\#563](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/563) ([skjnldsv](https://github.com/skjnldsv))
- fix\(config\): fix tsconfig out dir typings [\#562](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/562) ([skjnldsv](https://github.com/skjnldsv))
- Fix standalone registration [\#556](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/556) ([ShGKme](https://github.com/ShGKme))

### Changed
- Dependency updates

## 2.0.0 - 2023-01-12

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-l10n/compare/v1.6.0...v2.0.0)
### Changed
From 2.0.0, this package is standalone and do not rely on window OC variables to function.

### Fixed
- Provide all translation related functions [\#542](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/542) ([susnux](https://github.com/susnux))
- Fix building and deploying documentation [\#546](https://github.com/nextcloud-libraries/nextcloud-l10n/pull/546) ([susnux](https://github.com/susnux))

## 1.6.0 - 2022-05-10
### Changed
- Dependency updates
- Remove dependency on OC for `getLocale` and `getLanguage`

## 1.5.0 - 2022-05-10
Superseeded by v1.6.0 as the release was empty.

## 1.4.1 - 2020-09-07
### Changed
- Dependency updates
### Fixed
- Language detection of languages that have a `_` in their code (#172)

## 1.4.0 - 2020-08-31
### Added
- Nextcloud 20 support
### Changed
- Dependency updates

## 1.3.0 - 2020-06-04
### Added
- getCanonicalLocale
### Changed
- Dependency updates

## 1.2.3 - 2020-04-08
### Changed
- Dependency updates
### Fixed
- Source locale of translations is now set to 'en', so fewer warnings are printed

## 1.2.2 - 2020-04-06
### Fixed
- Update vulnerable packages

## 1.2.1 - 2020-04-06
### Changed
- Dependency updates
### Fixed
- Update vulnerable packages

## 1.2.0 - 2020-03-19
### Added
- Optional debug mode with logging, no console.warn for production builds
### Changed
- Dependency updates

## 1.1.1 - 2020-03-19
### Changed
- Dependency updates
### Fixed
- Update vulnerable packages

## 1.1.0 - 2020-02-21
### Added
- Gettext-based translation helpers for Nextcloud-independent translations (mostly for libraries)
### Changed
- Updated documentation
- Updated dependencies

## 1.0.1 - 2020-01-08
### Fixed
- Translate `escape` option typo
### Changed
- Updated documentation
