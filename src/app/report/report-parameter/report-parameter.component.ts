import {Component, Inject} from '@angular/core';
import {ReportService} from '../report.service';
import {ReportType} from 'shared/model';
import {MatStepper} from '@angular/material/stepper';

@Component({
	selector: 'ec-report-parameter',
	templateUrl: './report-parameter.component.html',
	styleUrls: ['./report-parameter.component.scss']
})
export class ReportParameterComponent {
	ReportType = ReportType;

	constructor(@Inject(MatStepper) public readonly stepper: MatStepper, public readonly reportService: ReportService) {}

	goNext(): void {
		if (this.reportService.formGroup.valid) {
			this.reportService.generateReport$.next();
			this.stepper.next();
		} else {
			this.reportService.formGroup.markAllAsTouched();

			// Workaround to validate that chiplist is not empty
			this.reportService.validateChiplist$.next();
		}
	}

	resetInput(): void {
		this.reportService.reset$.next();
	}
}
