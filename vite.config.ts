/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { createLibConfig } from '@nextcloud/vite-config'

export default createLibConfig(
	{
		index: `${__dirname}/lib/index.ts`,
		gettext: `${__dirname}/lib/gettext.ts`,
	},
	{
		libraryFormats: ['cjs', 'es'],
		DTSPluginOptions: {
			rollupTypes: true,
		},
	},
)
