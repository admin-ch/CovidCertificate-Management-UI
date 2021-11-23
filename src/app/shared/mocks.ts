import {
	GenerationType,
	Patient,
	PatientDto,
	ProductInfo,
	Recovery,
	RecoveryDto,
	Test,
	TestDto,
	Vaccination,
	VaccinationDto
} from 'shared/model';

const VALUE_DATE_2021 = '2021-04-29';
const VALUE_DATE_1989 = '1989-01-17';

export const getTimeZone = date => {
	const tzo = -date.getTimezoneOffset();
	const dif = tzo >= 0 ? '+' : '-';
	const pad = num => {
		const norm = Math.floor(Math.abs(num));
		return (norm < 10 ? '0' : '') + norm;
	};

	return `${dif}${pad(tzo / 60)}:${pad(tzo % 60)}`;
};

const manufacturerTestProduct = {
	code: '258',
	display: 'Test Manufacturer'
} as ProductInfo;

const medicalProduct = {
	code: '456',
	display: 'COVID-19 Vaccine Moderna'
} as ProductInfo;

const testTypeProduct = {
	code: '147',
	display: 'Rapid immunossay'
} as ProductInfo;

const vaccination: Vaccination = {
	countryOfVaccination: {display: 'Schweiz', code: 'CH'},
	dateOfVaccination: new Date(VALUE_DATE_2021),
	doseNumber: 2,
	medicalProduct,
	totalDoses: 2
};

const vaccinationDto: VaccinationDto = {
	countryOfVaccination: 'CH',
	medicinalProductCode: '456',
	numberOfDoses: 2,
	totalNumberOfDoses: 2,
	vaccinationDate: VALUE_DATE_2021
};

const test: Test = {
	manufacturer: manufacturerTestProduct,
	center: 'Testcenter 11',
	countryOfTest: {display: 'Schweiz', code: 'CH'},
	sampleDate: new Date('2021-04-27T18:00:00.000'),
	typeOfTest: testTypeProduct
};

const testDto: TestDto = {
	memberStateOfTest: 'CH',
	sampleDateTime: `2021-04-27T18:00:00.000${getTimeZone(test.sampleDate)}`,
	manufacturerCode: '258',
	testingCentreOrFacility: 'Testcenter 11',
	typeCode: '147'
};

const recovery: Recovery = {
	countryOfTest: {display: 'Schweiz', code: 'CH'},
	dateFirstPositiveTestResult: new Date(VALUE_DATE_2021)
};

const recoveryDto: RecoveryDto = {
	countryOfTest: 'CH',
	dateOfFirstPositiveTestResult: VALUE_DATE_2021
};

export const patientNoCertificate: Patient = {
	birthdate: new Date(VALUE_DATE_1989),
	firstName: 'Hans',
	surName: 'Muster',
	language: 'de'
};
export const patientNoCertificateDto: PatientDto = {
	dateOfBirth: VALUE_DATE_1989,
	name: {familyName: 'Muster', givenName: 'Hans'},
	language: 'de',
	systemSource: 'WebUI'
};
export const vaccinationPatient: Patient = {
	birthdate: new Date(VALUE_DATE_1989),
	firstName: 'Hans',
	surName: 'Muster',
	language: 'de',
	vaccination,
	certificateType: GenerationType.VACCINATION
};
export const vaccinationPatienDto: PatientDto = {
	dateOfBirth: VALUE_DATE_1989,
	name: {familyName: 'Muster', givenName: 'Hans'},
	language: 'de',
	vaccinationInfo: [vaccinationDto],
	systemSource: 'WebUI'
};
export const testPatient: Patient = {
	birthdate: new Date(VALUE_DATE_1989),
	firstName: 'Stefanie',
	surName: 'Blau',
	language: 'de',
	test,
	certificateType: GenerationType.TEST
};
export const testPatientDto: PatientDto = {
	dateOfBirth: VALUE_DATE_1989,
	name: {familyName: 'Blau', givenName: 'Stefanie'},
	language: 'de',
	testInfo: [testDto],
	systemSource: 'WebUI'
};
export const recoveryPatient: Patient = {
	birthdate: new Date(VALUE_DATE_1989),
	firstName: 'Kurt',
	surName: 'Stern',
	language: 'de',
	recovery,
	certificateType: GenerationType.RECOVERY
};
export const recoveryPatientDto: PatientDto = {
	dateOfBirth: VALUE_DATE_1989,
	name: {familyName: 'Stern', givenName: 'Kurt'},
	language: 'de',
	recoveryInfo: [recoveryDto],
	systemSource: 'WebUI'
};
