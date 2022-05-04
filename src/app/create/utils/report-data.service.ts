import {Injectable} from '@angular/core';
import {CreateCertificateResponse, GenerationType, Patient, ReportType, Shipping} from 'shared/model';
import {Subject} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ReportDataService {
	reportTypeChanged: Subject<ReportType> = new Subject<ReportType>();
	resetCalled: Subject<boolean> = new Subject<boolean>();

	setNewReportType(reportType: ReportType) {
		this.reportTypeChanged.next(reportType);
	}

	emitResetCalled(): void {
		this.resetCalled.next(true);
	}
}
