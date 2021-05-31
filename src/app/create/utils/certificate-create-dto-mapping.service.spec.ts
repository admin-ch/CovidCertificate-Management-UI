import {TestBed} from '@angular/core/testing';
import {CertificateCreateDtoMappingService} from './certificate-create-dto-mapping.service';
import {Patient} from 'shared/model';
import {getTimeZone} from 'shared/mocks';

describe('CertificateCreateDtoMappingService', () => {
	let service: CertificateCreateDtoMappingService;

	const testDataPatientOnly: Patient = {
		firstName: 'John',
		surName: 'Doe',
		birthdate: new Date(2000, 1, 1),
		language: 'de'
	};

	const testDataForVaccination: Patient = {
		firstName: 'John',
		surName: 'Doe',
		birthdate: new Date(2000, 1, 1),
		language: 'de',
		vaccination: {
			medicalProduct: {code: 'M-42', display: 'TEST-medicalProduct'},
			doseNumber: 2,
			totalDoses: 2,
			dateOfVaccination: new Date(2021, 1, 1),
			countryOfVaccination: {display: 'Schweiz', code: 'CH'}
		}
	};

	const testDataForTest: Patient = {
		firstName: 'John',
		surName: 'Doe',
		birthdate: new Date(2000, 1, 1),
		language: 'de',
		test: {
			typeOfTest: {code: 'T-42', display: 'TEST-type'},
			manufacturer: {code: 'M-42', display: 'TEST-manufacturer'},
			sampleDate: new Date(2021, 1, 1),
			center: 'TEST-center',
			countryOfTest: {display: 'Schweiz', code: 'CH'}
		}
	};

	const testDataForTestSummer: Patient = {
		firstName: 'John',
		surName: 'Doe',
		birthdate: new Date(2000, 1, 1),
		language: 'de',
		test: {
			typeOfTest: {code: 'T-42', display: 'TEST-type'},
			manufacturer: {code: 'M-42', display: 'TEST-manufacturer'},
			sampleDate: new Date(2021, 7, 1),
			center: 'TEST-center',
			countryOfTest: {display: 'Schweiz', code: 'CH'}
		}
	};

	const testDataForTestWithoutManufacturer: Patient = {
		firstName: 'John',
		surName: 'Doe',
		birthdate: new Date(2000, 1, 1),
		language: 'de',
		test: {
			typeOfTest: {code: 'T-42', display: 'TEST-type'},
			manufacturer: undefined,
			sampleDate: new Date(2021, 1, 1),
			center: 'TEST-center',
			countryOfTest: {display: 'Schweiz', code: 'CH'}
		}
	};

	const testDataForRecovery: Patient = {
		firstName: 'John',
		surName: 'Doe',
		birthdate: new Date(2000, 1, 1),
		language: 'de',
		recovery: {
			dateFirstPositiveTestResult: new Date(2021, 1, 1),
			countryOfTest: {display: 'Schweiz', code: 'CH'}
		}
	};

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CertificateCreateDtoMappingService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should map a dto with patient data only correctly', () => {
		expect(service.mapPatientToDto(testDataPatientOnly)).toEqual({
			dateOfBirth: '2000-02-01',
			name: {
				familyName: 'Doe',
				givenName: 'John'
			},
			language: 'de'
		});
	});

	it('should map a dto with data for vaccination correctly', () => {
		expect(service.mapPatientToDto(testDataForVaccination)).toEqual({
			dateOfBirth: '2000-02-01',
			name: {
				familyName: 'Doe',
				givenName: 'John'
			},
			language: 'de',
			vaccinationInfo: [
				{
					countryOfVaccination: 'CH',
					medicinalProductCode: 'M-42',
					numberOfDoses: 2,
					totalNumberOfDoses: 2,
					vaccinationDate: '2021-02-01'
				}
			]
		});
	});

	it('should map a dto with data for test correctly', () => {
		expect(service.mapPatientToDto(testDataForTest)).toEqual({
			dateOfBirth: '2000-02-01',
			name: {
				familyName: 'Doe',
				givenName: 'John'
			},
			language: 'de',
			testInfo: [
				{
					memberStateOfTest: 'CH',
					sampleDateTime: `2021-02-01T00:00:00.000${getTimeZone(testDataForTest.test.sampleDate)}`,
					manufacturerCode: 'M-42',
					testingCentreOrFacility: 'TEST-center',
					typeCode: 'T-42'
				}
			]
		});
	});

	it('should map a dto with data in summer for test correctly', () => {
		expect(service.mapPatientToDto(testDataForTestSummer)).toEqual({
			dateOfBirth: '2000-02-01',
			name: {
				familyName: 'Doe',
				givenName: 'John'
			},
			language: 'de',
			testInfo: [
				{
					memberStateOfTest: 'CH',
					sampleDateTime: `2021-08-01T00:00:00.000${getTimeZone(testDataForTestSummer.test.sampleDate)}`,
					manufacturerCode: 'M-42',
					testingCentreOrFacility: 'TEST-center',
					typeCode: 'T-42'
				}
			]
		});
	});

	it('should map a dto with data for test without manufacturer correctly', () => {
		expect(service.mapPatientToDto(testDataForTestWithoutManufacturer)).toEqual({
			dateOfBirth: '2000-02-01',
			name: {
				familyName: 'Doe',
				givenName: 'John'
			},
			language: 'de',
			testInfo: [
				{
					memberStateOfTest: 'CH',
					sampleDateTime: `2021-02-01T00:00:00.000${getTimeZone(
						testDataForTestWithoutManufacturer.test.sampleDate
					)}`,
					manufacturerCode: undefined,
					testingCentreOrFacility: 'TEST-center',
					typeCode: 'T-42'
				}
			]
		});
	});

	it('should map a dto with data for recovery correctly', () => {
		expect(service.mapPatientToDto(testDataForRecovery)).toEqual({
			dateOfBirth: '2000-02-01',
			name: {
				familyName: 'Doe',
				givenName: 'John'
			},
			language: 'de',
			recoveryInfo: [
				{
					countryOfTest: 'CH',
					dateOfFirstPositiveTestResult: '2021-02-01'
				}
			]
		});
	});
});
