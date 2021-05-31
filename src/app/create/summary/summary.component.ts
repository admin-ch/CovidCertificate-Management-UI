import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Patient} from 'shared/model';
import {CreationDataService} from '../utils/creation-data.service';
import {CertificateService} from 'shared/certificate.service';

@Component({
	selector: 'ec-summary',
	templateUrl: './summary.component.html',
	styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
	@Output() back = new EventEmitter<void>();
	@Output() next = new EventEmitter<void>();

	patient: Patient;
	validFrom: Date;
	validUntil: Date;

	private readonly CERTIFICATE_VALIDITY_IN_DAYS = 179;
	private readonly DAYS_UNTIL_VALID = 10;

	constructor(
		private readonly dataService: CreationDataService,
		private readonly certificateService: CertificateService
	) {}

	ngOnInit(): void {
		this.dataService.patientChanged.subscribe(patient => {
			this.patient = patient;

			if (this.patient.recovery) {
				this.validFrom = new Date(this.patient.recovery.dateFirstPositiveTestResult);
				this.validFrom.setDate(
					this.patient.recovery.dateFirstPositiveTestResult.getDate() + this.DAYS_UNTIL_VALID
				);
				this.validUntil = new Date(this.patient.recovery.dateFirstPositiveTestResult);
				this.validUntil.setDate(this.validUntil.getDate() + this.CERTIFICATE_VALIDITY_IN_DAYS);
			}
		});
	}

	goBack(): void {
		this.back.emit();
	}

	goNext(): void {
		this.certificateService.createCertificate(this.patient).subscribe(createCertificateResponse => {
			this.dataService.setNewCreateCertificateResponse(createCertificateResponse);
			this.dataService.emitResetCalled();
			this.next.emit();
		});
	}
}
