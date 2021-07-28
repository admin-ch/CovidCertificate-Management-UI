import {Component, HostBinding, Input, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {MAT_DATE_FORMATS, MatDateFormats} from '@angular/material/core';

const MY_FORMATS: MatDateFormats = {
	parse: {
		dateInput: 'DD.MM.YYYY'
	},
	display: {
		dateInput: 'DD.MM.YYYY',
		monthYearLabel: 'MMM YYYY',
		dateA11yLabel: 'LL',
		monthYearA11yLabel: 'MMMM YYYY'
	}
};

@Component({
	selector: 'ec-datetimepicker',
	templateUrl: './date-time-picker.component.html',
	styleUrls: ['./date-time-picker.component.scss'],
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-dateTimePicker'},
	providers: [{provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}]
})
export class DateTimePickerComponent implements OnInit, OnChanges {
	private static counter = 0;
	@Input() id: string;
	@Input() label: string;
	@Input() showTime = true;
	@Input() showDate = true;
	@Input() required;
	@Input() errors: ValidationErrors;
	@Input() defaultValue?: {date?: Date; time?: Date};
	@HostBinding('class.datetime') datetime = true;
	form: FormGroup;

	constructor(readonly fb: FormBuilder) {
		this.createForm();
	}

	ngOnInit(): void {
		this.defineId();
		this.setDefaultValues();
	}

	ngOnChanges(): void {
		this.datetime = this.showDate && this.showTime;
		this.updateValidators();
		this.updateErrors();
	}

	private createForm(): void {
		this.form = this.fb.group({
			time: '',
			date: ''
		});

		this.form.get('date').valueChanges.subscribe(() => {
			if (this.form.get('time').touched) {
				this.form.get('time').updateValueAndValidity();
			}
		});
	}

	private defineId(): void {
		if (!this.id) {
			this.id = `datepicker-${DateTimePickerComponent.counter}`;
			DateTimePickerComponent.counter++;
		}
	}

	private setDefaultValues(): void {
		this.form.setValue({
			time: this.defaultValue?.time || '',
			date: this.defaultValue?.date || ''
		});
	}

	private updateValidators(): void {
		if (this.required || this.required === '') {
			if (this.showDate) {
				this.form.get('date').setValidators(Validators.required);
			}
			if (this.showTime) {
				this.form.get('time').setValidators(Validators.required);
			}
		} else {
			this.form.get('time').setValidators(null);
			this.form.get('date').setValidators(null);
		}
	}

	private updateErrors(): void {
		if (!!this.errors) {
			this.handleErrors();
		}
	}

	private handleErrors(): void {
		Object.keys(this.errors).forEach(keyError => {
			switch (keyError) {
				case 'date': {
					if (!!this.errors[keyError].required) {
						this.form.get('date').setErrors({[keyError]: this.errors[keyError]});
					}
					break;
				}
				case 'dateAfterToday': {
					this.form.get('date').setErrors({[keyError]: this.errors[keyError]});
					break;
				}
				case 'dateTooSmall': {
					this.form.get('date').setErrors({[keyError]: this.errors[keyError]});
					break;
				}
				case 'time':
				case 'timeInvalid': {
					if (!!this.errors[keyError].required) {
						this.form.get('time').setErrors({[keyError]: this.errors[keyError]});
					}
					break;
				}
				case 'timeAfterToday': {
					this.form.get('time').setErrors({[keyError]: this.errors[keyError]});
					break;
				}
				default: {
					break;
				}
			}
		});
	}
}
