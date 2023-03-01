import {Injectable} from '@angular/core';
import {ReportType} from 'shared/model';
import {Subject} from 'rxjs';
import {GenerationResponseStatus} from './report-generation/report-generation.component';
import {AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators} from '@angular/forms';
import {getMaxPeriodValidator, getStartDateBeforeEndDateValidator} from 'shared/validators/date-time.validator';
import * as moment from 'moment';

@Injectable({
	providedIn: 'root'
})
export class ReportService {
	generateReport$ = new Subject<void>();
	reportFinished$ = new Subject<GenerationResponseStatus>();
	selectedReportType: ReportType;
	formGroup: UntypedFormGroup;
	reset$ = new Subject<void>();

	// Workaround to validate that chiplist is not empty
	validateChiplist$ = new Subject<void>();

	constructor(private readonly fb: UntypedFormBuilder) {
		this.formGroup = fb.group({
			[ReportType.A2]: this.fb.group({
				uvcis: [[], Validators.required]
			}),
			[ReportType.A3]: this.fb.group(
				{
					from: ['', [ReportService.isDateValidator]],
					to: ['', [ReportService.isDateValidator]],
					canton: ['', Validators.required],
					userIds: new UntypedFormArray([], [Validators.required, Validators.maxLength(200)])
				},
				{
					validators: [getStartDateBeforeEndDateValidator('from', 'to'), getMaxPeriodValidator('from', 'to', 90)]
				}
			),
			[ReportType.A4]: this.fb.group(
				{
					from: ['', [ReportService.isDateValidator]],
					to: ['', [ReportService.isDateValidator]],
					canton: ['', Validators.required],
					types: new UntypedFormArray([], Validators.required),
					userIds: new UntypedFormArray([], [Validators.required, Validators.maxLength(200)])
				},
				{
					validators: [getStartDateBeforeEndDateValidator('from', 'to'), getMaxPeriodValidator('from', 'to', 90)]
				}
			),
			[ReportType.A7]: this.fb.group(
				{
					from: ['', [ReportService.isDateValidator]],
					to: ['', [ReportService.isDateValidator]],
					canton: ['', Validators.required],
					types: new UntypedFormArray([], Validators.required)
				},
				{validators: getStartDateBeforeEndDateValidator('from', 'to')}
			),
			[ReportType.A8]: this.fb.group(
				{
					from: ['', [ReportService.isDateValidator]],
					to: ['', [ReportService.isDateValidator]],
					types: new UntypedFormArray([], Validators.required)
				},
				{
					validators: [getStartDateBeforeEndDateValidator('from', 'to'), getMaxPeriodValidator('from', 'to', 90)]
				}
			),
			[ReportType.A9]: this.fb.group(
				{
					from: ['', [ReportService.isDateValidator]],
					to: ['', [ReportService.isDateValidator]],
					types: new UntypedFormArray([], Validators.required)
				},
				{
					validators: [getStartDateBeforeEndDateValidator('from', 'to')]
				}
			),
			[ReportType.A11]: this.fb.group(
				{
					from: ['', [ReportService.isDateValidator]],
					to: ['', [ReportService.isDateValidator]],
					canton: ['', Validators.required]
				},
				{validators: getStartDateBeforeEndDateValidator('from', 'to')}
			),
			[ReportType.A12]: this.fb.group({
				transferCodes: [[], Validators.required]
			}),
			[ReportType.A13]: this.fb.group(
				{
					from: ['', [ReportService.isDateValidator]],
					to: ['', [ReportService.isDateValidator]],
					canton: ['', Validators.required]
				},
				{validators: getStartDateBeforeEndDateValidator('from', 'to')}
			)
		});
		this.formGroup.disable();
	}

	private static isDateValidator(control: AbstractControl): ValidationErrors | null {
		const isMoment: boolean = moment.isMoment(control.value);
		const isDateObject: boolean = control.value instanceof Date;
		return isDateObject || isMoment ? null : {invalidDate: true};
	}
}
