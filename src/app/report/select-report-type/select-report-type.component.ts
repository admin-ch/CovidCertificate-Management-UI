import {Component, Inject, OnInit} from '@angular/core';
import {ReportType} from 'shared/model';
import {FormControl, Validators} from '@angular/forms';
import {AuthFunction, AuthService} from '../../auth/auth.service';
import {take} from 'rxjs/operators';
import {ReportService} from '../report.service';
import {MatHorizontalStepper} from '@angular/material/stepper';

// Note: Keep order!
// Re-uncomment entries when reports are being added.
// Remove "skip" from tests when all reports have been added.
const AUTH_FUNCTION_REPORT_TYPE_MAP = {
	// [AuthFunction.REPORT_A3]: ReportType.A3,
	// [AuthFunction.REPORT_A5]: ReportType.A3,
	// [AuthFunction.REPORT_A7]: ReportType.A7,
	// [AuthFunction.REPORT_A10]: ReportType.A7,
	[AuthFunction.REPORT_A2]: ReportType.A2
	// [AuthFunction.REPORT_A4]: ReportType.A4,
	// [AuthFunction.REPORT_A6]: ReportType.A4,
	// [AuthFunction.REPORT_A11]: ReportType.A11,
	// [AuthFunction.REPORT_A12]: ReportType.A12,
	// [AuthFunction.REPORT_A8]: ReportType.A8,
	// [AuthFunction.REPORT_A9]: ReportType.A9,
};

@Component({
	selector: 'ec-select-report-type',
	templateUrl: './select-report-type.component.html',
	styleUrls: ['./select-report-type.component.scss']
})
export class SelectReportTypeComponent implements OnInit {
	ReportType = ReportType;
	AuthFunction = AuthFunction;

	formControl = new FormControl('', Validators.required);

	constructor(
		@Inject(MatHorizontalStepper) private readonly stepper: MatHorizontalStepper,
		private readonly authService: AuthService,
		private readonly reportService: ReportService
	) {}

	ngOnInit(): void {
		this.createForm();
	}

	goNext(): void {
		if (this.formControl.valid) {
			this.reportService.selectedReportType = this.formControl.value;
			this.stepper.next();
		}
	}

	private createForm(): void {
		this.authService.authorizedFunctions$.pipe(take(1)).subscribe(authFunctions => {
			const authFunction = (Object.keys(AUTH_FUNCTION_REPORT_TYPE_MAP) as AuthFunction[]).find(key =>
				authFunctions.includes(key)
			);

			this.formControl.setValue(AUTH_FUNCTION_REPORT_TYPE_MAP[authFunction]);
		});
	}
}
