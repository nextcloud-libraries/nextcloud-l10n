/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import { recommendedLibrary } from '@nextcloud/eslint-config'

export default [
	...recommendedLibrary,

	// Fix tsdoc generation
	{
		files: ['lib/**.ts'],
		rules: {
			'jsdoc/check-tag-names': [
				'error',
				{ definedTags: ['packageDocumentation'] },
			],
		},
	},
]
