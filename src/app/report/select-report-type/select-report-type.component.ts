import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {GenerationType, ReportType} from 'shared/model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthFunction, AuthService} from '../../auth/auth.service';
import {take} from 'rxjs/operators';
import {ReportDataService} from '../../create/utils/report-data.service';

const AUTH_FUNCTION_REPORT_TYPE_MAP = {
	[AuthFunction.REPORT_A2]: ReportType.REPORT_A2,
	[AuthFunction.REPORT_A3]: ReportType.REPORT_A3,
	[AuthFunction.REPORT_A4]: ReportType.REPORT_A4,
	[AuthFunction.REPORT_A7]: ReportType.REPORT_A7,
	[AuthFunction.REPORT_A8]: ReportType.REPORT_A8,
	[AuthFunction.REPORT_A9]: ReportType.REPORT_A9,
	[AuthFunction.REPORT_A11]: ReportType.REPORT_A11,
	[AuthFunction.REPORT_A12]: ReportType.REPORT_A12
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
	typeSelection: string[] = Object.values(ReportType);

	AuthFunction: typeof AuthFunction = AuthFunction;

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly dataService: ReportDataService,
		private readonly authService: AuthService
	) {}

	ngOnInit(): void {
		this.createForm();
		this.dataService.resetCalled.subscribe(() => {
			this.resetForm();
		});
	}

	goNext(): void {
		if (this.reportTypeSelectionForm.valid) {
			this.dataService.setNewReportType(this.reportTypeSelectionForm.get('type').value);
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

	private resetForm(): void {
		const previousSelection: GenerationType = this.reportTypeSelectionForm.value.type;
		this.reportTypeSelectionForm.reset({type: previousSelection});
	}
}
