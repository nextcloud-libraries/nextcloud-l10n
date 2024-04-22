import { createLibConfig } from '@nextcloud/vite-config'

export default createLibConfig(
	{
		index: `${__dirname}/lib/index.ts`,
		gettext: `${__dirname}/lib/gettext.ts`,
	},
	{
		libraryFormats: ['cjs', 'es'],
	},
)
