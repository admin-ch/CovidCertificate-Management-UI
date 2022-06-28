import {Injectable} from '@angular/core';
import {ReportType} from 'shared/model';
import {Subject} from 'rxjs';
import {GenerationResponseStatus} from './report-generation/report-generation.component';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {getStartDateBeforeEndDateValidator} from "shared/validators/date-time.validator";

@Injectable({
	providedIn: 'root'
})
export class ReportService {
	generateReport$ = new Subject<void>();
	reportFinished$ = new Subject<GenerationResponseStatus>();
	selectedReportType: ReportType;
	formGroup: FormGroup

	constructor(private readonly fb: FormBuilder) {
		this.formGroup = fb.group({
			[ReportType.A2]: this.fb.group({
				uvcis: [[], Validators.required]
			}),
			[ReportType.A7]: this.fb.group({
					from: ['', Validators.required],
					to: ['', Validators.required],
					canton: ['', Validators.required],
					types: [[]],
				},
				{validators: getStartDateBeforeEndDateValidator('from', 'to')}),
		})
		this.formGroup.disable()
	}

}
