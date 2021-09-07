import {Injectable} from '@angular/core';
import {
	CertificateCreateDto,
	Patient,
	RecoveryDto,
	Shipping,
	ShippingOptions,
	TestDto,
	VaccinationDto
} from 'shared/model';

@Injectable({
	providedIn: 'root'
})
export class CertificateCreateDtoMappingService {
	mapCreationDataToDto(patient: Patient, shipping: Shipping): CertificateCreateDto {
		const certificateCreateDto: CertificateCreateDto = this.mapPatientData(patient);
		if (patient.vaccination) {
			certificateCreateDto.vaccinationInfo = this.mapVaccinationData(patient);
		}
		if (patient.test) {
			certificateCreateDto.testInfo = this.mapTestData(patient);
		}
		if (patient.recovery) {
			certificateCreateDto.recoveryInfo = this.mapRecoveryData(patient);
		}

		this.addShippingData(certificateCreateDto, shipping);

		return certificateCreateDto;
	}

	private mapPatientData(patient: Patient): CertificateCreateDto {
		return {
			name: {
				familyName: patient.surName,
				givenName: patient.firstName
			},
			dateOfBirth: this.toJSONDateString(patient.birthdate),
			language: patient.language
		};
	}

	private mapVaccinationData(patient: Patient): VaccinationDto[] {
		return [
			{
				medicinalProductCode: patient.vaccination.medicalProduct.code,
				numberOfDoses: patient.vaccination.doseNumber,
				totalNumberOfDoses: patient.vaccination.totalDoses,
				vaccinationDate: this.toJSONDateString(patient.vaccination.dateOfVaccination),
				countryOfVaccination: patient.vaccination.countryOfVaccination.code
			}
		];
	}

	private mapTestData(patient: Patient): TestDto[] {
		return [
			{
				typeCode: patient.test.typeOfTest.code,
				manufacturerCode: patient.test.manufacturer?.code,
				sampleDateTime: this.toJSONDateTimeString(patient.test.sampleDate),
				testingCentreOrFacility: patient.test.center,
				memberStateOfTest: patient.test.countryOfTest.code
			}
		];
	}

	private mapRecoveryData(patient: Patient): RecoveryDto[] {
		return [
			{
				dateOfFirstPositiveTestResult: this.toJSONDateString(patient.recovery.dateFirstPositiveTestResult),
				countryOfTest: patient.recovery.countryOfTest.code
			}
		];
	}

	private addShippingData(certificateCreateDto: CertificateCreateDto, shipping: Shipping): void {
		switch (shipping.shippingOption) {
			case ShippingOptions.POST:
				certificateCreateDto.address = {
					streetAndNr: shipping.streetAndNr,
					zipCode: shipping.zipCode,
					city: shipping.city,
					cantonCodeSender: shipping.cantonCodeSender
				};
				break;
			case ShippingOptions.APP:
				certificateCreateDto.appCode = shipping.appDeliveryCode;
				break;
			default:
				break;
		}
	}

	private toJSONDateTimeString(date: Date): string {
		const tzo = -date.getTimezoneOffset();
		const dif = tzo >= 0 ? '+' : '-';
		const pad = num => {
			const norm = Math.floor(Math.abs(num));
			return (norm < 10 ? '0' : '') + norm;
		};

		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
			date.getMinutes()
		)}:00.000${dif}${pad(tzo / 60)}:${pad(tzo % 60)}`;
	}

	private toJSONDateString(date: Date | string): string {
		if (date instanceof Date) {
			let month = (date.getMonth() + 1).toString();
			if (month.length === 1) {
				month = `0${month}`;
			}
			let day = date.getDate().toString();
			if (day.length === 1) {
				day = `0${day}`;
			}
			return `${date.getFullYear()}-${month}-${day}`;
		}
		return date;
	}
}
