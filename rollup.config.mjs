import typescript from '@rollup/plugin-typescript'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const external = [...Object.keys(pkg.dependencies)]

const config = (input, output) => ({
	input,
	external,
	plugins: [
		typescript({
			declaration: true,
		}),
	],
	output: [output],
})

export default [
	config('./lib/index.ts', {
		file: 'dist/index.mjs',
		format: 'esm',
	}),
	config('./lib/index.ts', {
		file: 'dist/index.js',
		format: 'cjs',
	}),
	config('./lib/gettext.ts', {
		file: 'dist/gettext.mjs',
		format: 'esm',
	}),
	config('./lib/gettext.ts', {
		file: 'dist/gettext.js',
		format: 'cjs',
	}),
]
