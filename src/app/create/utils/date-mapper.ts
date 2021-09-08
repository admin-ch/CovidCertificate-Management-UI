import * as moment from 'moment';
import {MomentWrapper} from 'shared/model';

export class DateMapper {
	static getDate(momentWrapper: MomentWrapper): Date {
		let date: Date;
		if (moment.isMoment(momentWrapper.date)) {
			date = momentWrapper.date.toDate();
			if (momentWrapper.time) {
				this.setTime(date, momentWrapper.time);
			}
		}
		return date;
	}

	static getBirthdate(momentWrapper: MomentWrapper): Date | string {
		return this.getDate(momentWrapper) || (momentWrapper.date as string);
	}

	private static setTime(date: Date, timeValue: string): Date {
		// converts times with AM/PM to 24h this is only needed to for times entered in a polyfilled time field
		if (/^(1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm])$/.test(timeValue)) {
			timeValue = moment(timeValue, ['h:mm A']).format('HH:mm');
		}

		const time = timeValue.split(':').map(t => Number(t));
		date.setHours(time[0]);
		date.setMinutes(time[1]);

		return date;
	}
}
