import {Component, Inject} from '@angular/core';
import {ReportType} from 'shared/model';
import {FormControl, Validators} from '@angular/forms';
import {AuthFunction, AuthService} from '../../auth/auth.service';
import {ReportService} from '../report.service';
import {MatHorizontalStepper} from '@angular/material/stepper';

@Component({
	selector: 'ec-select-report-type',
	templateUrl: './select-report-type.component.html',
	styleUrls: ['./select-report-type.component.scss']
})
export class SelectReportTypeComponent {
	ReportType = ReportType;
	AuthFunction = AuthFunction;

	formControl = new FormControl('', Validators.required);

	constructor(
		@Inject(MatHorizontalStepper) private readonly stepper: MatHorizontalStepper,
		private readonly authService: AuthService,
		private readonly reportService: ReportService
	) {
	}

	goNext(): void {
		if (this.formControl.valid) {
			this.reportService.selectedReportType = this.formControl.value;
			this.stepper.next();
		} else {
			this.formControl.markAsTouched()
		}
	}
}
