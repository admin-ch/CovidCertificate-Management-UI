import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
	selector: 'ec-who-checkbox',
	templateUrl: './who-checkbox.component.html',
	styleUrls: ['./who-checkbox.component.scss']
})
export class WhoCheckboxComponent {
	@Input() control: FormControl;
	@Input() infoText: string;
	@Input() moreInfo: string;

	get hasError(): boolean {
		return this.control.errors?.required && this.control?.touched;
	}
}
