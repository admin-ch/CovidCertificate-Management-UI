import {DateMapper} from './date-mapper';
import * as moment from 'moment';

describe('DateMapper', () => {
	const datePast: Date = new Date('2000-04-29');
	const timeNoon = '12:00';

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
});
