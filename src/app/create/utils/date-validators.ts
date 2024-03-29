import {AbstractControl} from '@angular/forms';
import * as moment from 'moment';
import {DATE_FORMAT} from 'shared/model';

export class DateValidators {
	static MIN_DATE: Date = new Date(1900, 0, 1);
	static ANTIBODY_CERTIFICATE_MIN_DATE: Date = new Date(2021, 10, 16);
	static EXCEPTIONAL_CERTIFICATE_MIN_DATE: Date = new Date(2021, 9, 1);
	static RAPID_CERTIFICATE_MIN_DATE: Date = new Date(2021, 9, 1); // change to 2022, 0, 24 before the integration
	static DATE_REGEX = /^((19|20)\d\d(-\d\d){0,2}){0,1}$/;

	static validShortDate() {
		return (control: AbstractControl): {[key: string]: boolean} | null => {
			const dateValue: string = control.value?.date;
			if (!this.isDate(dateValue) && !this.DATE_REGEX.test(dateValue)) {
				return {invalidShortDate: true};
			}
			return null;
		};
	}

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

	static dateMoreThanMinDateRapid() {
		return (control: AbstractControl): {[key: string]: boolean} | null => {
			const dateValue: moment.Moment = this.getMomentDate(control.value?.date);
			if (!!dateValue && dateValue.isBefore(DateValidators.RAPID_CERTIFICATE_MIN_DATE)) {
				return {rapidDateTooSmall: true};
			}
			return null;
		};
	}

	static dateMoreThanBirthday(formName?: string) {
		return (control: AbstractControl): {[key: string]: boolean} | null => {
			const dateValue: moment.Moment = this.getMomentDate(control.value?.date);
			let formValue = control?.parent?.value;
			if (!formValue) {
				return null;
			}

			if (formName) {
				formValue = formValue[formName];
			}

			let birthdate = this.getMomentDate(formValue?.birthdate?.date);
			if (!birthdate?.isValid()) {
				const [year, month, day] = (formValue?.birthdate?.date as string)?.split('-') || [];

				if (!year || (!!day && !month)) {
					return null;
				}
				if (!month) {
					birthdate = moment(`${year}-01-01`);
				} else if (!day) {
					birthdate = moment(`${year}-${month}-01`);
				} else {
					birthdate = moment(`${year}-${month}-${day}`);
				}
			}
			if (!!dateValue && dateValue.isBefore(birthdate)) {
				return {dateBeforeBirthday: true};
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
				}
				return {timeAfterToday: true};
			}
			return null;
		};
	}

	static dateBeforeThanAntibodyCertificateMinDate() {
		return (control: AbstractControl): {[key: string]: boolean} | null => {
			const dateValue: moment.Moment = this.getMomentDate(control.value?.date);
			if (!!dateValue && dateValue.isBefore(DateValidators.ANTIBODY_CERTIFICATE_MIN_DATE)) {
				return {dateBeforeAntibodyCertificateMinDate: true};
			}
			return null;
		};
	}

	static dateBeforeThanExceptionalCertificateMinDate() {
		return (control: AbstractControl): {[key: string]: boolean} | null => {
			const dateValue: moment.Moment = this.getMomentDate(control.value?.date);
			if (!!dateValue && dateValue.isBefore(DateValidators.EXCEPTIONAL_CERTIFICATE_MIN_DATE)) {
				return {dateBeforeExceptionalCertificateMinDate: true};
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

	private static isDate(value: unknown): boolean {
		const isMoment: boolean = moment.isMoment(value);
		const isDateObject: boolean = value instanceof Date;
		return isDateObject || isMoment;
	}
}
