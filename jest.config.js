module.exports = {
	clearMocks: true,
	collectCoverageFrom: ['lib/**/*.ts'],
	testEnvironment: 'jsdom',
	preset: 'ts-jest/presets/js-with-ts',
	transform: {
		'^.+\\.[tj]sx?$': [
			'ts-jest', {
				tsconfig: 'tests/tsconfig.json',
			},
		],
	},
	transformIgnorePatterns: [],
}
