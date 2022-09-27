import {FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {Moment} from 'moment';

export const DATE_FORMAT = 'dd.MM.YYYY';

export interface PersonalData {
	firstName: string; // maxChar 50
	surName: string; // maxChar 50
	birthdate: Date | string; // between 1900-01-01 and 2099-12-31 (this format)
	language: string;
}

export interface Patient extends PersonalData {
	vaccination?: Vaccination;
	test?: Test;
	recovery?: Recovery;
	antibody?: Antibody;
	exceptional?: Exceptional;
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

export enum ReportType {
	A2 = 'report-a2',
	A3 = 'report-a3',
	A4 = 'report-a4',
	A5 = 'report-a5',
	A6 = 'report-a6',
	A7 = 'report-a7',
	A8 = 'report-a8',
	A9 = 'report-a9',
	A10 = 'report-a10',
	A11 = 'report-a11',
	A12 = 'report-a12'
}

// CAUTION:
// The key is the value in the JWT prefixed with `bag-cc-dr_`.
// The value is the value which needs to be sent to the backend.
export enum DataRoomCode {
	AG = 'AG',
	AI = 'AI',
	AR = 'AR',
	BE = 'BE',
	BL = 'BL',
	BS = 'BS',
	FR = 'FR',
	GE = 'GE',
	GL = 'GL',
	GR = 'GR',
	JU = 'JU',
	LU = 'LU',
	NE = 'NE',
	NW = 'NW',
	OW = 'OW',
	SG = 'SG',
	SH = 'SH',
	SO = 'SO',
	SZ = 'SZ',
	TG = 'TG',
	TI = 'TI',
	UR = 'UR',
	VD = 'VD',
	VS = 'VS',
	ZG = 'ZG',
	ZH = 'ZH',
	MI = 'MI',
	ARMEE = 'ARM',
	BV_INTERN = 'BUV',
	GGG = 'GGG'
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

export enum RevocationStatus {
	OK = 'OK',
	ALREADY_REVOKED = 'ALREADY_REVOKED'
}

export interface RevocationResponseDto {
	status: RevocationStatus;
	revocationDateTime: Date; // format 2000-12-31T17:29.80209
}

export interface CsvResponseDto {
	zip: ArrayBuffer;
}

export interface CsvRevocationResponseDto {
	uvcisWithErrorMessageCount: number;
	revokedUvcisCount: number;
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

export enum IssuerType {
	ORGANISATION = 'organisation',
	ISSUER = 'issuer',
}
