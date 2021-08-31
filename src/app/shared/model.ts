import {FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {Moment} from 'moment';

export const DATE_FORMAT = 'dd.MM.YYYY';

export interface Patient {
	firstName: string; // maxChar 50
	surName: string; // maxChar 50
	birthdate: Date; // between 1900-01-01 and 2099-12-31 (this format)
	vaccination?: Vaccination;
	test?: Test;
	recovery?: Recovery;
	language: string;
}

export interface CertificateCreateDto {
	name: Name;
	dateOfBirth: string;
	language: string;
	vaccinationInfo?: VaccinationDto[];
	testInfo?: TestDto[];
	recoveryInfo?: RecoveryDto[];
	address?: AddressDto;
	appCode?: number;
}

export interface AddressDto {
	streetAndNr: string;
	zipCode: number;
	city: string;
	cantonCodeSender: string;
}

export interface Name {
	familyName: string;
	givenName: string;
}

export interface Vaccination {
	medicalProduct: ProductInfo;
	doseNumber: number; // 1 - 9 (<= totalDoses)
	totalDoses: number; // 1 - 9
	dateOfVaccination: Date; // format 2000-12-31 / < today / default today
	countryOfVaccination: ProductInfo; // CH preselect
}

export interface VaccinationDto {
	productCode: string;
	productDisplay: string;
	medicinalProductCode: string;
	numberOfDoses: number;
	totalNumberOfDoses: number;
	vaccinationDate: string;
	countryOfVaccination: string;
}

export interface ProductInfo {
	code: string;
	display: string;
}

export interface ProductInfoWithGroup {
	code: string;
	group: string;
	display: string;
}

export interface Test {
	typeOfTest: ProductInfo;
	manufacturer: ProductInfo;
	sampleDate: Date; // format 2000-12-31T17:29 / < today
	center: string; // maxChar 50
	countryOfTest: ProductInfo; // CH preselect
}

export interface TestDto {
	typeCode: string;
	manufacturerCode: string;
	sampleDateTime: string;
	testingCentreOrFacility: string;
	memberStateOfTest: string;
}

export interface Recovery {
	dateFirstPositiveTestResult: Date; // format 2000-12-31 / < today
	countryOfTest: ProductInfo; // CH preselect
}

export interface RecoveryDto {
	dateOfFirstPositiveTestResult: string;
	countryOfTest: string;
}

export enum GenerationType {
	VACCINATION = 'vaccination',
	TEST = 'test',
	RECOVERY = 'recovery'
}

export enum ShippingOptions {
	APP = 'app',
	PDF = 'pdf',
	POST = 'post'
}

export interface FormObject {
	formFields: FormFieldObject;
	formGroup: FormGroup;
}

export interface FormFieldObject {
	[group: string]: FormField[];
}

export interface FormControlObject {
	[group: string]: FormField[];
}

export type AllowedFieldType = 'text' | 'date' | 'datetime' | 'number' | 'select';

export class FormField {
	public readonly angularFormControl: FormControl;
	public readonly selectableOptions?: {display: string; code: any}[];
	public readonly tooltipTranslationKey?: string;
	public readonly defaultValue: any;
	public readonly cssClasses: string;

	constructor(
		public readonly name: string,
		public readonly fieldType: AllowedFieldType,
		options?: {
			defaultValue?: any;
			validators?: ValidatorFn | ValidatorFn[];
			selectableOptions?: {display: string; code: any}[];
			tooltipTranslationKey?: string;
			cssClasses?: string;
		}
	) {
		let formControl: FormControl;
		if (options && options.validators) {
			formControl = new FormControl(options.defaultValue || '', options.validators);
		} else {
			formControl = new FormControl(options?.defaultValue || '');
		}
		this.angularFormControl = formControl;

		this.selectableOptions = options?.selectableOptions || undefined;
		this.tooltipTranslationKey = options?.tooltipTranslationKey || undefined;
		this.defaultValue = options?.defaultValue || undefined;
		this.cssClasses = options?.cssClasses || undefined;
	}
}

export interface CreateCertificateResponse {
	pdf: string; // base64 encoded pdf string
	qrCode: string;
	uvci: string;
	appDeliveryError?: {errorCode: number; errorMessage: string};
}

export interface CsvResponseDto {
	zip: ArrayBuffer;
}

export interface ValueSetsResponse {
	countryCodes: CountryCodesDto;
	vaccinationSets: VaccinationValueSets[];
	testSets: ProductInfo[];
}

export interface CountryCodesDto {
	de: CountryCodeDto[];
	en: CountryCodeDto[];
	fr: CountryCodeDto[];
	it: CountryCodeDto[];
}

export interface CountryCodeDto {
	display: string;
	lang: string;
	active: boolean;
	version: string;
	system: string;
	short: string;
}

export interface VaccinationValueSets {
	name: string;
	code: string;
	prophylaxis: string;
	active: boolean;
	prophylaxis_code: string;
	auth_holder: string;
	auth_holder_code: string;
}

export interface TestValueSets {
	name: string;
	type: string;
	manufacturer: string;
	active: boolean;
	type_code: string;
	swiss_test_kit: string;
	manufacturer_code_eu: string;
	eu_accepted: boolean;
	ch_accepted: boolean;
}

export interface RevokeDto {
	uvci: string;
}

export interface MomentWrapper {
	date: Moment;
	time?: string;
}

export interface Shipping {
	shippingOption: ShippingOptions;
	appDeliveryCode?: number;
	streetAndNr?: string;
	city?: string;
	cantonCodeSender?: string;
	zipCode?: number;
}
