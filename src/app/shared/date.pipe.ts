import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ObLanguageService} from 'shared/language.service';

@Pipe({
	name: 'obDate',
	// eslint-disable-next-line
	pure: false
})
export class ObDatePipe implements PipeTransform {
	private locale: string;

	constructor(language: ObLanguageService) {
		language.locale$.subscribe(locale => (this.locale = locale));
	}

	transform(value: string | number, format = 'datetime', timezone?: string): string {
		const pipe = new DatePipe(this.locale);
		return format === 'datetime'
			? `${pipe.transform(value, 'shortDate', timezone)} ${pipe.transform(value, 'mediumTime', timezone)}`
			: pipe.transform(value, format, timezone);
	}
}
