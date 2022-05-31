import {Injectable} from '@angular/core';
import {ReportType} from "shared/model";
import {A2Parameter} from "./report-parameter/report-a2/report-a2.component";
import {Subject} from "rxjs";

export interface ReportParameterStore {
	[ReportType.A2]?: A2Parameter
}

@Injectable({
	providedIn: 'root'
})
export class ReportService {
	generateReport$ = new Subject<void>()
	selectedReportType: ReportType
	parameter: ReportParameterStore = {}
}
