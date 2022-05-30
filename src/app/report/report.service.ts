import {Injectable} from '@angular/core';
import {ReportType} from "shared/model";

@Injectable({
	providedIn: 'root'
})
export class ReportService {
	selectedReportType: ReportType
}
