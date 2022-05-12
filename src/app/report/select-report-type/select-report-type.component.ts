import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ReportType} from 'shared/model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthFunction, AuthService} from '../../auth/auth.service';
import {take} from 'rxjs/operators';

const AUTH_FUNCTION_REPORT_TYPE_MAP = {
	[AuthFunction.REPORT_A2]: ReportType.A2,
	[AuthFunction.REPORT_A3]: ReportType.A3,
	[AuthFunction.REPORT_A4]: ReportType.A4,
	[AuthFunction.REPORT_A5]: ReportType.A5,
	[AuthFunction.REPORT_A6]: ReportType.A6,
	[AuthFunction.REPORT_A7]: ReportType.A7,
	[AuthFunction.REPORT_A8]: ReportType.A8,
	[AuthFunction.REPORT_A9]: ReportType.A9,
	[AuthFunction.REPORT_A10]: ReportType.A10,
	[AuthFunction.REPORT_A11]: ReportType.A11,
	[AuthFunction.REPORT_A12]: ReportType.A12
};

@Component({
	selector: 'ec-select-report-type',
	templateUrl: './select-report-type.component.html',
	styleUrls: ['./select-report-type.component.scss']
})
export class SelectReportTypeComponent implements OnInit {
	@Output() next = new EventEmitter<void>();

	ReportType = ReportType;

	reportTypeSelectionForm: FormGroup;

	AuthFunction: typeof AuthFunction = AuthFunction;

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly authService: AuthService
	) {
	}

	ngOnInit(): void {
		this.createForm();
	}

	goNext(): void {
		if (this.reportTypeSelectionForm.valid) {
			this.next.emit();
		}
	}

	private createForm(): void {
		this.authService.authorizedFunctions$.pipe(take(1)).subscribe(authFunctions => {
			const authFunction = (Object.keys(AUTH_FUNCTION_REPORT_TYPE_MAP) as AuthFunction[]).find(key =>
				authFunctions.includes(key)
			);

			const type = AUTH_FUNCTION_REPORT_TYPE_MAP[authFunction];
			this.reportTypeSelectionForm = this.formBuilder.group({
				type: [type, Validators.required]
			});
		});
	}
}
