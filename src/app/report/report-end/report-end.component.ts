import {Component, Inject} from '@angular/core';
import {ReportService} from "../report.service";
import {GenerationResponseStatus} from "../report-generation/report-generation.component";
import {MatHorizontalStepper} from "@angular/material/stepper";

@Component({
	selector: 'ec-report-end',
	templateUrl: './report-end.component.html',
	styleUrls: ['./report-end.component.scss']
})
export class ReportEndComponent {

	GenerationResponseStatus = GenerationResponseStatus

	constructor(@Inject(MatHorizontalStepper) public readonly stepper: MatHorizontalStepper,
		public readonly reportService: ReportService) {
	}
}
