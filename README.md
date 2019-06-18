# nextcloud-l10n
Nextcloud L10n helpers for apps and libraries

## Usage

In order to not break the l10n string extraction scripts, make sure to alias the imported function to match the legacy syntax:

```js
import {translate as t, translatePlural as n} from 'nextcloud-l10n'

t('myapp', 'Hello!')
n('myapp', '%n cloud', '%n clouds', 100)
```