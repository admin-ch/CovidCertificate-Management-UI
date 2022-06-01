import {Component, Inject, OnInit} from '@angular/core';
import {ReportService} from '../report.service';
import {ReportType} from 'shared/model';
import {MatHorizontalStepper} from '@angular/material/stepper';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
	selector: 'ec-report-parameter',
	templateUrl: './report-parameter.component.html',
	styleUrls: ['./report-parameter.component.scss']
})
export class ReportParameterComponent implements OnInit {
	formGroup: FormGroup;

	ReportType = ReportType;

	constructor(
		@Inject(MatHorizontalStepper) public readonly stepper: MatHorizontalStepper,
		public readonly reportService: ReportService,
		private readonly fb: FormBuilder
	) {}

	ngOnInit() {
		this.formGroup = this.fb.group({});
		Object.values(ReportType).forEach(reportName => {
			this.formGroup.addControl(reportName, this.fb.group({}));
		});
	}

	goNext(): void {
		this.reportService.generateReport$.next();
		this.stepper.next();
	}
}
