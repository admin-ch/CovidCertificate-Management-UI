import {TestBed} from '@angular/core/testing';
import {CertificateCreateDtoMappingService} from './certificate-create-dto-mapping.service';
import {GenerationType, Patient, Shipping, ShippingOptions} from 'shared/model';
import {getTimeZone} from 'shared/mocks';

describe('CertificateCreateDtoMappingService', () => {
	let service: CertificateCreateDtoMappingService;

	const testDataPatientOnly: Patient = {
		firstName: 'John',
		surName: 'Doe',
		birthdate: new Date(2000, 1, 1),
		language: 'de',
		certificateType: GenerationType.TEST
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
		},
		certificateType: GenerationType.VACCINATION
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
		},
		certificateType: GenerationType.TEST
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
		},
		certificateType: GenerationType.TEST
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
		},
		certificateType: GenerationType.TEST
	};

	const testDataForRecovery: Patient = {
		firstName: 'John',
		surName: 'Doe',
		birthdate: new Date(2000, 1, 1),
		language: 'de',
		recovery: {
			dateFirstPositiveTestResult: new Date(2021, 1, 1),
			countryOfTest: {display: 'Schweiz', code: 'CH'}
		},
		certificateType: GenerationType.RECOVERY
	};

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CertificateCreateDtoMappingService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('with shipping PDF', () => {
		const shipping: Shipping = {shippingOption: ShippingOptions.PDF};

		it('should map a dto with patient data only correctly', () => {
			expect(service.mapCreationDataToDto(testDataPatientOnly, shipping)).toEqual({
				dateOfBirth: '2000-02-01',
				name: {
					familyName: 'Doe',
					givenName: 'John'
				},
				systemSource: 'WebUI',
				language: 'de'
			});
		});

		it('should map a dto with data for vaccination correctly', () => {
			expect(service.mapCreationDataToDto(testDataForVaccination, shipping)).toEqual({
				dateOfBirth: '2000-02-01',
				name: {
					familyName: 'Doe',
					givenName: 'John'
				},
				systemSource: 'WebUI',
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
			expect(service.mapCreationDataToDto(testDataForTest, shipping)).toEqual({
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
				],
				systemSource: 'WebUI'
			});
		});

		it('should map a dto with data in summer for test correctly', () => {
			expect(service.mapCreationDataToDto(testDataForTestSummer, shipping)).toEqual({
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
				],
				systemSource: 'WebUI'
			});
		});

		it('should map a dto with data for test without manufacturer correctly', () => {
			expect(service.mapCreationDataToDto(testDataForTestWithoutManufacturer, shipping)).toEqual({
				dateOfBirth: '2000-02-01',
				name: {
					familyName: 'Doe',
					givenName: 'John'
				},
				language: 'de',
				testInfo: [
					{
						memberStateOfTest: 'CH',
						sampleDateTime: `2021-02-01T00:00:00.000${getTimeZone(testDataForTestWithoutManufacturer.test.sampleDate)}`,
						manufacturerCode: undefined,
						testingCentreOrFacility: 'TEST-center',
						typeCode: 'T-42'
					}
				],
				systemSource: 'WebUI'
			});
		});

		it('should map a dto with data for recovery correctly', () => {
			expect(service.mapCreationDataToDto(testDataForRecovery, shipping)).toEqual({
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
				],
				systemSource: 'WebUI'
			});
		});
	});

	describe('with shipping app delivery', () => {
		const shipping: Shipping = {shippingOption: ShippingOptions.APP, appDeliveryCode: 424242426};

		it('should map a dto with patient data only correctly', () => {
			expect(service.mapCreationDataToDto(testDataPatientOnly, shipping)).toEqual({
				appCode: 424242426,
				dateOfBirth: '2000-02-01',
				name: {
					familyName: 'Doe',
					givenName: 'John'
				},
				language: 'de',
				systemSource: 'WebUI'
			});
		});

		it('should map a dto with data for vaccination correctly', () => {
			expect(service.mapCreationDataToDto(testDataForVaccination, shipping)).toEqual({
				appCode: 424242426,
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
				],
				systemSource: 'WebUI'
			});
		});

		it('should map a dto with data for test correctly', () => {
			expect(service.mapCreationDataToDto(testDataForTest, shipping)).toEqual({
				appCode: 424242426,
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
				],
				systemSource: 'WebUI'
			});
		});

		it('should map a dto with data in summer for test correctly', () => {
			expect(service.mapCreationDataToDto(testDataForTestSummer, shipping)).toEqual({
				appCode: 424242426,
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
				],
				systemSource: 'WebUI'
			});
		});

		it('should map a dto with data for test without manufacturer correctly', () => {
			expect(service.mapCreationDataToDto(testDataForTestWithoutManufacturer, shipping)).toEqual({
				appCode: 424242426,
				dateOfBirth: '2000-02-01',
				name: {
					familyName: 'Doe',
					givenName: 'John'
				},
				language: 'de',
				testInfo: [
					{
						memberStateOfTest: 'CH',
						sampleDateTime: `2021-02-01T00:00:00.000${getTimeZone(testDataForTestWithoutManufacturer.test.sampleDate)}`,
						manufacturerCode: undefined,
						testingCentreOrFacility: 'TEST-center',
						typeCode: 'T-42'
					}
				],
				systemSource: 'WebUI'
			});
		});

		it('should map a dto with data for recovery correctly', () => {
			expect(service.mapCreationDataToDto(testDataForRecovery, shipping)).toEqual({
				appCode: 424242426,
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
				],
				systemSource: 'WebUI'
			});
		});
	});

	describe('with shipping post', () => {
		const shipping: Shipping = {
			shippingOption: ShippingOptions.POST,
			streetAndNr: 'Street 42',
			zipCode: 4242,
			city: 'Testcity',
			cantonCodeSender: 'BE'
		};

		it('should map a dto with patient data only correctly', () => {
			expect(service.mapCreationDataToDto(testDataPatientOnly, shipping)).toEqual({
				address: {
					cantonCodeSender: 'BE',
					city: 'Testcity',
					streetAndNr: 'Street 42',
					zipCode: 4242
				},
				dateOfBirth: '2000-02-01',
				name: {
					familyName: 'Doe',
					givenName: 'John'
				},
				language: 'de',
				systemSource: 'WebUI'
			});
		});

		it('should map a dto with data for vaccination correctly', () => {
			expect(service.mapCreationDataToDto(testDataForVaccination, shipping)).toEqual({
				address: {
					cantonCodeSender: 'BE',
					city: 'Testcity',
					streetAndNr: 'Street 42',
					zipCode: 4242
				},
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
				],
				systemSource: 'WebUI'
			});
		});

		it('should map a dto with data for test correctly', () => {
			expect(service.mapCreationDataToDto(testDataForTest, shipping)).toEqual({
				address: {
					cantonCodeSender: 'BE',
					city: 'Testcity',
					streetAndNr: 'Street 42',
					zipCode: 4242
				},
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
				],
				systemSource: 'WebUI'
			});
		});

		it('should map a dto with data in summer for test correctly', () => {
			expect(service.mapCreationDataToDto(testDataForTestSummer, shipping)).toEqual({
				address: {
					cantonCodeSender: 'BE',
					city: 'Testcity',
					streetAndNr: 'Street 42',
					zipCode: 4242
				},
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
				],
				systemSource: 'WebUI'
			});
		});

		it('should map a dto with data for test without manufacturer correctly', () => {
			expect(service.mapCreationDataToDto(testDataForTestWithoutManufacturer, shipping)).toEqual({
				address: {
					cantonCodeSender: 'BE',
					city: 'Testcity',
					streetAndNr: 'Street 42',
					zipCode: 4242
				},
				dateOfBirth: '2000-02-01',
				name: {
					familyName: 'Doe',
					givenName: 'John'
				},
				language: 'de',
				testInfo: [
					{
						memberStateOfTest: 'CH',
						sampleDateTime: `2021-02-01T00:00:00.000${getTimeZone(testDataForTestWithoutManufacturer.test.sampleDate)}`,
						manufacturerCode: undefined,
						testingCentreOrFacility: 'TEST-center',
						typeCode: 'T-42'
					}
				],
				systemSource: 'WebUI'
			});
		});

		it('should map a dto with data for recovery correctly', () => {
			expect(service.mapCreationDataToDto(testDataForRecovery, shipping)).toEqual({
				address: {
					cantonCodeSender: 'BE',
					city: 'Testcity',
					streetAndNr: 'Street 42',
					zipCode: 4242
				},
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
				],
				systemSource: 'WebUI'
			});
		});
	});
});
