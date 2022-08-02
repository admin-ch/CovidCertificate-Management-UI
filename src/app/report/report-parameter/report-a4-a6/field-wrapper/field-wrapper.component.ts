import {Component, Input} from '@angular/core';

@Component({
	selector: 'ec-field-wrapper',
	templateUrl: './field-wrapper.component.html',
	styleUrls: ['./field-wrapper.component.scss']
})
export class FieldWrapperComponent {

	@Input()
	isError: boolean
}
