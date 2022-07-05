import {Component, Input} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {FormControl} from "@angular/forms";

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

	constructor(public readonly translate: TranslateService) {
	}
}
