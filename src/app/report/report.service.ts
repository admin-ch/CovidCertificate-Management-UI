import {Injectable} from '@angular/core';
import {ReportType} from "shared/model";
import {A2Parameter} from "./report-parameter/report-a2/report-a2.component";
import {Subject} from "rxjs";
import {GenerationResponseStatus} from "./report-generation/report-generation.component";

export interface ReportParameterStore {
	[ReportType.A2]?: A2Parameter
}

@Injectable({
	providedIn: 'root'
})
export class ReportService {
	generateReport$ = new Subject<void>()
	reportFinished$ = new Subject<GenerationResponseStatus>()
	selectedReportType: ReportType
	parameter: ReportParameterStore = {}
}
