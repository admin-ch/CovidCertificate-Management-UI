import {Component} from '@angular/core';
import {ReportService} from "../report.service";
import {GenerationResponseStatus} from "../report-generation/report-generation.component";

@Component({
	selector: 'ec-report-end',
	templateUrl: './report-end.component.html',
	styleUrls: ['./report-end.component.scss']
})
export class ReportEndComponent {

	GenerationResponseStatus = GenerationResponseStatus

	constructor(public readonly reportService: ReportService) {
	}
}
