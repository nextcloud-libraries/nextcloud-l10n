# @nextcloud/l10n

[![Build Status](https://travis-ci.com/nextcloud/nextcloud-l10n.svg?branch=master)](https://travis-ci.com/nextcloud/nextcloud-l10n)
[![npm](https://img.shields.io/npm/v/@nextcloud/l10n.svg)](https://www.npmjs.com/package/@nextcloud/l10n)
[![Documentation](https://img.shields.io/badge/Documentation-online-brightgreen)](https://nextcloud.github.io/nextcloud-l10n/)

Nextcloud L10n helpers for apps and libraries.

## Installation

```
npm i -S @nextcloud/l10n
```

## Usage

In order to not break the l10n string extraction scripts, make sure to alias the imported function to match the legacy syntax:

```js
import {translate as t, translatePlural as n} from '@nextcloud/l10n'

t('myapp', 'Hello!')
n('myapp', '%n cloud', '%n clouds', 100)
```