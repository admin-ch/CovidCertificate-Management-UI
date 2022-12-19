import {Component, Inject} from '@angular/core';
import {ReportType} from 'shared/model';
import {UntypedFormControl, Validators} from '@angular/forms';
import {AuthFunction, AuthService} from '../../auth/auth.service';
import {ReportService} from '../report.service';
import {MatStepper} from '@angular/material/stepper';

@Component({
	selector: 'ec-select-report-type',
	templateUrl: './select-report-type.component.html',
	styleUrls: ['./select-report-type.component.scss']
})
export class SelectReportTypeComponent {
	ReportType = ReportType;
	AuthFunction = AuthFunction;

	formControl = new UntypedFormControl('', Validators.required);

	constructor(
		@Inject(MatStepper) private readonly stepper: MatStepper,
		private readonly authService: AuthService,
		private readonly reportService: ReportService
	) {}

	goNext(): void {
		if (this.formControl.valid) {
			this.reportService.selectedReportType = this.formControl.value;
			this.stepper.next();
		} else {
			this.formControl.markAsTouched();
		}
	}
}
