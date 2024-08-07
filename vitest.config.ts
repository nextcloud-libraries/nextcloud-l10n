/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import viteConfig from './vite.config'

export default async (env: Parameters<typeof viteConfig>[0]) => {
	const config = typeof viteConfig === 'function' ? await viteConfig(env) : viteConfig
	// node-externals conflicts with vitest
	config.plugins = config.plugins!.filter((plugin) => plugin && (!('name' in plugin) || plugin?.name !== 'node-externals'))

	return {
		...config,
		test: {
			environment: 'jsdom',
			coverage: {
				reporter: ['text', 'lcov'],
			},
		},
	}
}
