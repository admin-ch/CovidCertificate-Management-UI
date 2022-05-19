import {FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {Moment} from 'moment';

export const DATE_FORMAT = 'dd.MM.YYYY';

export interface Patient {
	firstName: string; // maxChar 50
	surName: string; // maxChar 50
	birthdate: Date | string; // between 1900-01-01 and 2099-12-31 (this format)
	vaccination?: Vaccination;
	test?: Test;
	recovery?: Recovery;
	antibody?: Antibody;
	exceptional?: Exceptional;
	language: string;
	certificateType: GenerationType;
}

export interface PatientDto {
	name: Name;
	dateOfBirth: string;
	language: string;
	vaccinationInfo?: VaccinationDto[];
	testInfo?: TestDto[];
	recoveryInfo?: RecoveryDto[];
	antibodyInfo?: AntibodyDto[];
	exceptionalInfo?: ExceptionalDto[];
	systemSource: string;
}

export interface CertificateCreateDto {
	name: Name;
	dateOfBirth: string;
	language: string;
	vaccinationInfo?: VaccinationDto[];
	vaccinationTouristInfo?: VaccinationDto[];
	testInfo?: TestDto[];
	recoveryInfo?: RecoveryDto[];
	antibodyInfo?: AntibodyDto[];
	exceptionalInfo?: ExceptionalDto[];
	address?: AddressDto;
	appCode?: number;
	systemSource: string;
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

export class ProductInfoWithToString implements ProductInfo {
	constructor(public code: string, public display: string) {}

	public toString() {
		return this.display;
	}
}

export class RapidTestProductInfoWithToString {
	constructor(public code: string, public display: string, public validUntil: string) {}

	public toString() {
		return this.display;
	}
}

export interface Vaccine {
	code: string;
	group: string;
	display: string;
	issuable: string;
	touristVaccine: boolean;
}

export interface Test {
	typeOfTest: ProductInfo;
	manufacturer: ProductInfo;
	sampleDate: Date; // format 2000-12-31T17:29 / < today
	center?: string; // maxChar 50
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

export interface Antibody {
	typeOfTest: ProductInfo;
	manufacturer: ProductInfo;
	sampleDate: Date; // format 2000-12-31T17:29 / < today
	center: string; // maxChar 50
}

export interface AntibodyDto {
	sampleDate: string;
	testingCenterOrFacility: string;
}

export interface Exceptional {
	center: string;
	sampleDate: Date;
}

export interface ExceptionalDto {
	attestationIssuer: string;
	validFrom: string;
}

export enum GenerationType {
	VACCINATION = 'vaccination',
	TEST = 'test',
	RECOVERY = 'recovery',
	RECOVERY_RAT = 'recovery-rat',
	ANTIBODY = 'antibody',
	VACCINATION_TOURIST = 'vaccination-tourist',
	EXCEPTIONAL = 'exceptional'
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

export interface CsvRevocationResponseDto {
	csv: string;
}

export interface ValueSetsResponse {
	countryCodes: CountryCodesDto;
	vaccinationSets: VaccinationValueSets[];
	testSets: RapidTestProductInfoWithToString[];
}

export interface FeaturesResponse {
	featureData: FeatureData[];
}

export interface FeatureData {
	uris: string[];
	type: GenerationType;
	start: Date;
	end: Date;
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
	productCode: string;
	productDisplay: string;
	prophylaxisCode: string;
	prophylaxisDisplay: string;
	authHolderCode: string;
	authHolderDisplay: string;
	issuable: string;
	touristVaccine: boolean;
}

export interface RevokeDto {
	uvci: string;
	fraud: boolean;
	systemSource: string;
}

export interface MomentWrapper {
	date: Moment | string;
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
