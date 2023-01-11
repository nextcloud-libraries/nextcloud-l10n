# Changelog

All notable changes to this project will be documented in this file.

## 2.0.0-beta.0 - 2023-01-11

[Full Changelog](https://github.com/nextcloud/nextcloud-l10n/compare/v1.6.0...v2.0.0-beta.0)

### Fixed
- Provide all translation related functions [\#542](https://github.com/nextcloud/nextcloud-l10n/pull/542) ([susnux](https://github.com/susnux))
- Fix building and deploying documentaton [\#546](https://github.com/nextcloud/nextcloud-l10n/pull/546) ([susnux](https://github.com/susnux))

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
