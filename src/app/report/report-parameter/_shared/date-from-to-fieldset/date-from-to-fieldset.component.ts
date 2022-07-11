import {Component, Input} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {FormControl} from "@angular/forms";
import * as moment from "moment/moment";

@Component({
	selector: 'ec-date-from-to-fieldset',
	templateUrl: './date-from-to-fieldset.component.html',
	styleUrls: ['./date-from-to-fieldset.component.scss']
})
export class DateFromToFieldsetComponent {

	@Input()
	dateFromFormControl: FormControl

	@Input()
	dateToFormControl: FormControl

	readonly MIN_DATE = moment('2021-05-01')

	constructor(public readonly translate: TranslateService) {
	}
}
