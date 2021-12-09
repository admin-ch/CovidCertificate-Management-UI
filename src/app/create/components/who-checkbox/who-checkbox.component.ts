import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {GenerationType} from "shared/model";
import {TranslateService} from "@ngx-translate/core";

@Component({
	selector: 'ec-who-checkbox',
	templateUrl: './who-checkbox.component.html',
	styleUrls: ['./who-checkbox.component.scss']
})
export class WhoCheckboxComponent {
	@Input() formControl: FormControl;
	@Input() certificateType?: GenerationType

	constructor(private translate: TranslateService) {
	}

	get infoText(): string {
		let text: string = this.translate.instant('certificateCreate.step-two.entitledtoissueconfirmation');

		if(this.certificateType !== 'recovery') {
			text += this.translate.instant('certificateCreate.step-two.nonissuablevaccineproductinformation');
		}

		return text;
	}

	get hasError(): boolean {
		return this.formControl.errors?.required && this.formControl?.touched;
	}
}
