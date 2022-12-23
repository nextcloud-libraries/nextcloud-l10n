/// <reference types="@nextcloud/typings" />

declare var window: Nextcloud.v24.WindowWithGlobals

/**
 * Get the first day of the week
 *
 * @return {number}
 */
export function getFirstDay(): number {
	if (typeof window.firstDay === 'undefined') {
		console.warn('No firstDay found')
		return 1
	}

	return window.firstDay
}

/**
 * Get a list of day names (full names)
 *
 * @return {string[]}
 */
export function getDayNames(): string[] {
	if (typeof window.dayNames === 'undefined') {
		console.warn('No dayNames found')
		return [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
		]
	}

	return window.dayNames
}

/**
 * Get a list of day names (short names)
 *
 * @return {string[]}
 */
export function getDayNamesShort(): string[] {
	if (typeof window.dayNamesShort === 'undefined') {
		console.warn('No dayNamesShort found')
		return ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.']
	}

	return window.dayNamesShort
}

/**
 * Get a list of day names (minified names)
 *
 * @return {string[]}
 */
export function getDayNamesMin(): string[] {
	if (typeof window.dayNamesMin === 'undefined') {
		console.warn('No dayNamesMin found')
		return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
	}

	return window.dayNamesMin
}

/**
 * Get a list of month names (full names)
 *
 * @return {string[]}
 */
export function getMonthNames(): string[] {
	if (typeof window.monthNames === 'undefined') {
		console.warn('No monthNames found')
		return [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		]
	}

	return window.monthNames
}

/**
 * Get a list of month names (short names)
 *
 * @return {string[]}
 */
export function getMonthNamesShort(): string[] {
	if (typeof window.monthNamesShort === 'undefined') {
		console.warn('No monthNamesShort found')
		return [
			'Jan.',
			'Feb.',
			'Mar.',
			'Apr.',
			'May.',
			'Jun.',
			'Jul.',
			'Aug.',
			'Sep.',
			'Oct.',
			'Nov.',
			'Dec.',
		]
	}

	return window.monthNamesShort
}
