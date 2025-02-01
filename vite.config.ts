/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { createLibConfig } from '@nextcloud/vite-config'
import { defineConfig } from 'vite'

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
		config: defineConfig({
			test: {
				environment: 'jsdom',
				coverage: {
					reporter: ['text', 'lcov'],
				},
			},
		})
	},
)
