import {AbstractControl} from '@angular/forms';
import * as moment from 'moment';
import {DATE_FORMAT} from 'shared/model';

export class DateValidators {
	static MIN_DATE: Date = new Date(1900, 0, 1);

	static dateLessThanToday() {
		return (control: AbstractControl): {[key: string]: boolean} | null => {
			const dateValue: Date = control.value?.date;
			if (!!dateValue && dateValue > new Date()) {
				return {dateAfterToday: true};
			}
			return null;
		};
	}

	static dateMoreThanMinDate() {
		return (control: AbstractControl): {[key: string]: boolean} | null => {
			const dateValue: moment.Moment = this.getMomentDate(control.value?.date);
			if (!!dateValue && dateValue.isBefore(DateValidators.MIN_DATE)) {
				return {dateTooSmall: true};
			}
			return null;
		};
	}

	static dateTimeLessThanToday() {
		return (control: AbstractControl): {[key: string]: boolean} | null => {
			const dateValue: string = new Date(control.value?.date).toDateString();
			const dateTime: Date = new Date(`${dateValue} ${control.value?.time}`);
			const momentDateValue: moment.Moment = this.getMomentDate(dateTime);
			const today: Date = new Date();
			if (!!momentDateValue && momentDateValue.isAfter(today)) {
				if (control.value?.date > today) {
					return {dateAfterToday: true};
				} else {
					return {timeAfterToday: true};
				}
			}
			return null;
		};
	}

	private static getMomentDate(date: Date | moment.Moment): moment.Moment {
		if (date instanceof moment) {
			return date as moment.Moment;
		}
		return moment(date, DATE_FORMAT);
	}
}
