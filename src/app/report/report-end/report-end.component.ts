import {Component, Inject} from '@angular/core';
import {ReportService} from '../report.service';
import {GenerationResponseStatus} from '../report-generation/report-generation.component';
import {MatStepper} from '@angular/material/stepper';

@Component({
	selector: 'ec-report-end',
	templateUrl: './report-end.component.html',
	styleUrls: ['./report-end.component.scss']
})
export class ReportEndComponent {
	GenerationResponseStatus = GenerationResponseStatus;

	constructor(
		@Inject(MatStepper) public readonly stepper: MatStepper,
		public readonly reportService: ReportService
	) {}
}
