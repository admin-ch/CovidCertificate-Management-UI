import {DateMapper} from './date-mapper';
import * as moment from 'moment';

describe('DateMapper', () => {
	const datePast: Date = new Date('2000-04-29');
	const timeNoon = '12:00';
	const shortDate = '2000-01';

	describe('getDate', () => {
		it('should map date without time correctly', () => {
			expect(DateMapper.getDate({date: moment(datePast)})).toEqual(datePast);
		});

		it('should map date with time correctly', () => {
			const expectedResult = new Date('2000-04-29');
			expectedResult.setHours(12);

			expect(DateMapper.getDate({date: moment(datePast), time: timeNoon})).toEqual(expectedResult);
		});
	});

	describe('getBirthdate', () => {
		it('should convert moment to date', () => {
			const expectedResult = new Date('2000-04-29');
			expectedResult.setHours(12);

			expect(DateMapper.getDate({date: moment(datePast), time: timeNoon})).toEqual(expectedResult);
		});

		it('should keep short date as string', () => {
			const expectedShortDate = '2000-01';
			const result = DateMapper.getBirthdate({date: shortDate});
			expect(result).toEqual(expectedShortDate);
			expect(typeof result).toBe('string');
		});
	});
});
