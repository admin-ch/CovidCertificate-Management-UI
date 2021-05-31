import {MomentWrapper} from 'shared/model';

export class DateMapper {
	static getDate(momentWrapper: MomentWrapper): Date {
		const date = momentWrapper.date.toDate();
		if (momentWrapper.time) {
			const time = momentWrapper.time.split(':').map(t => Number(t));
			date.setHours(time[0]);
			date.setMinutes(time[1]);
		}
		return date;
	}
}
