import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CertificateService } from 'shared/certificate.service';
import { Patient, Shipping } from 'shared/model';
import { CreationDataService } from '../utils/creation-data.service';
import { ValueSetsService } from '../utils/value-sets.service';

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
	patientTypeOfTest: string;
	patientVaccinationCountry: string;

	private readonly RECOVERY_CERTIFICATE_VALIDITY_IN_DAYS = 364;
	private readonly DAYS_UNTIL_VALID = 10;

	get birthdate(): string {
		const patientBirthdate = this.patient?.birthdate;
		if (patientBirthdate instanceof Date) {
			return patientBirthdate.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });
		} else {
			return patientBirthdate;
		}
	}

	constructor(
		private readonly dataService: CreationDataService,
		private readonly valueSetsService: ValueSetsService,
		private readonly certificateService: CertificateService
	) { }

	ngOnInit(): void {
		this.dataService.patientChanged.subscribe(patient => {
			this.patient = patient;

			if (this.patient.recovery) {
				this.validFrom = new Date(this.patient.recovery.dateFirstPositiveTestResult);
				this.validFrom.setDate(
					this.patient.recovery.dateFirstPositiveTestResult.getDate() + this.DAYS_UNTIL_VALID
				);
				this.validUntil = new Date(this.patient.recovery.dateFirstPositiveTestResult);
				this.validUntil.setDate(this.validUntil.getDate() + this.RECOVERY_CERTIFICATE_VALIDITY_IN_DAYS);
			}
		});

		this.dataService.shippingChanged.subscribe(shipping => {
			this.shipping = shipping;
		});
	}

	getTranslatedTypeOfTest(): string {
		return this.valueSetsService.getTypeOfTests().filter(elem => elem.code === this.patient?.test.typeOfTest.code).map(item => item.display)[0];
	}

	getTranslatedCountry(): string {
		if (this.patient.test) {
			return this.valueSetsService.getCountryOptions().filter(elem => elem.code === this.patient?.test.countryOfTest.code).map(item => item.display)[0];
		}
		if (this.patient.vaccination) {
			return this.valueSetsService.getCountryOptions().filter(elem => elem.code === this.patient?.vaccination.countryOfVaccination.code).map(item => item.display)[0];
		}
		if (this.patient.recovery) {
			return this.valueSetsService.getCountryOptions().filter(elem => elem.code === this.patient?.recovery.countryOfTest.code).map(item => item.display)[0];
		}
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
