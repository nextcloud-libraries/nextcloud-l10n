/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { beforeAll, beforeEach, describe, expect, it, test, vi } from 'vitest'
import { formatRelativeTime } from '../lib/time.ts'

const setLanguage = (lang: string) => document.documentElement.setAttribute('lang', lang)

describe('time - formatRelativeTime', () => {
	beforeAll(() => {
		vi.useFakeTimers({ now: new Date('2025-01-01T00:00:00Z') })
	})

	beforeEach(() => {
		setLanguage('en')
	})

	test.each`
	input                     | relativeTime | expected
	${'2024-12-31T23:59:30Z'} |    ${'long'} | ${'30 seconds ago'}
	${'2024-12-31T23:59:30Z'} |   ${'short'} | ${'30 sec. ago'}
	${'2024-12-31T23:59:30Z'} |  ${'narrow'} | ${'30s ago'}
	${'2024-12-31T23:55:00Z'} |    ${'long'} | ${'5 minutes ago'}
	${'2024-12-31T23:55:00Z'} |   ${'short'} | ${'5 min. ago'}
	${'2024-12-31T23:55:00Z'} |  ${'narrow'} | ${'5m ago'}
	${'2025-01-01T10:00:00Z'} |    ${'long'} | ${'in 10 hours'}
	${'2025-01-01T10:00:00Z'} |   ${'short'} | ${'in 10 hr.'}
	${'2025-01-01T10:00:00Z'} |  ${'narrow'} | ${'in 10h'}
	${'2025-01-02T11:00:00Z'} |    ${'long'} | ${'tomorrow'}
	${'2025-01-03T11:00:00Z'} |    ${'long'} | ${'in 2 days'}
	${'2025-01-07T12:00:00Z'} |    ${'long'} | ${'next week'}
	${'2025-01-14T10:00:00Z'} |    ${'long'} | ${'in 2 weeks'}
	${'2025-03-01T10:00:00Z'} |    ${'long'} | ${'March 1'}
	${'2025-03-14T10:00:00Z'} |    ${'long'} | ${'March 14'}
	${'2025-03-14T10:00:00Z'} |   ${'short'} | ${'Mar 14'}
	${'2025-03-14T10:00:00Z'} |  ${'narrow'} | ${'M 14'}
	${'2026-01-01T10:00:00Z'} |    ${'long'} | ${'January 2026'}
	${'2024-01-01T10:00:00Z'} |    ${'long'} | ${'January 2024'}
	${'2024-01-01T10:00:00Z'} |   ${'short'} | ${'Jan 2024'}
	${'2024-01-01T10:00:00Z'} |  ${'narrow'} | ${'J 24'}
	`('format date time $input as $expected', ({ input, relativeTime, expected }) => {
		const date = new Date(input)
		expect(formatRelativeTime(date, { relativeTime })).toBe(expected)
	})

	it('can ignore seconds', () => {
		expect(formatRelativeTime(new Date('2024-12-31T23:59:30Z'), { ignoreSeconds: 'few seconds ago' })).toBe('few seconds ago')
		expect(formatRelativeTime(new Date('2024-12-31T23:58:00Z'), { ignoreSeconds: 'few seconds ago' })).toBe('2 minutes ago')
	})

	it('uses user language by default', () => {
		setLanguage('de')
		expect(formatRelativeTime(new Date('2024-12-31T23:58:00Z'))).toBe('vor 2 Minuten')
	})

	it('can override the lange as parameter', () => {
		setLanguage('de')
		expect(formatRelativeTime(new Date('2024-12-31T23:58:00Z'), { language: 'en' })).toBe('2 minutes ago')
	})
})
