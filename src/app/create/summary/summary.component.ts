import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Patient, Shipping} from 'shared/model';
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
	shipping: Shipping;

	private readonly CERTIFICATE_VALIDITY_IN_DAYS = 179;
	private readonly DAYS_UNTIL_VALID = 10;

	get birthdate(): string {
		const patientBirthdate = this.patient?.birthdate;
		if (patientBirthdate instanceof Date) {
			return patientBirthdate.toLocaleDateString('de-CH', {day: '2-digit', month: '2-digit', year: 'numeric'});
		} else {
			return patientBirthdate;
		}
	}

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

		this.dataService.shippingChanged.subscribe(shipping => {
			this.shipping = shipping;
		});
	}

	goBack(): void {
		this.back.emit();
	}

	goNext(): void {
		this.certificateService.createCertificate(this.patient, this.shipping).subscribe(createCertificateResponse => {
			this.dataService.setNewCreateCertificateResponse(createCertificateResponse);
			this.dataService.emitResetCalled();
			this.next.emit();
		});
	}
}
