import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroupDirective, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ValueSetsService} from '../utils/value-sets.service';
import {TranslateService} from '@ngx-translate/core';
import {GenerationType, Patient, ProductInfo, RapidTestProductInfoWithToString} from 'shared/model';
import {DateValidators} from '../utils/date-validators';
import {TimeValidators} from '../utils/time-validators';
import {CreationDataService} from '../utils/creation-data.service';
import {DateMapper} from '../utils/date-mapper';
import * as moment from 'moment';
import {PCR_TEST_CODE, RAPID_TEST_CODE} from 'shared/constants';
import {RapidTestValidator} from '../utils/rapid-test-validator';
import {PersonalDataComponent} from '../components/personal-data/personal-data.component';

const BASE_DATE_VALIDATORS = [Validators.required, TimeValidators.validateTime(), DateValidators.dateLessThanToday(), DateValidators.dateMoreThanMinDate()];

const RAPID_DATE_VALIDATORS = [
	Validators.required,
	TimeValidators.validateTime(),
	DateValidators.dateLessThanToday(),
	DateValidators.dateMoreThanMinDate(),
	DateValidators.dateMoreThanMinDateRapid()
];

const ANTIBODY_DATE_VALIDATORS = [
	Validators.required,
	TimeValidators.validateTime(),
	DateValidators.dateLessThanToday(),
	DateValidators.dateMoreThanMinDate(),
	DateValidators.dateBeforeThanAntibodyCertificateMinDate()
];

@Component({
	selector: 'ec-test-form',
	templateUrl: './test-form.component.html',
	styleUrls: ['./test-form.scss']
})
export class TestFormComponent implements OnInit, AfterViewInit {
	@Input() antibody = false;
	@Input() rapid = false;
	@Output() readonly back = new EventEmitter<void>();
	@Output() readonly next = new EventEmitter<void>();

	@ViewChild('formDirective') formDirective: FormGroupDirective;
	@ViewChild('testPersonalDataComponent') personalDataChild: PersonalDataComponent;

	testForm: UntypedFormGroup;
	testType: ProductInfo;

	rapidTestCompleteControl: UntypedFormControl;
	filteredRapidTests: RapidTestProductInfoWithToString[];

	private rapidTests: RapidTestProductInfoWithToString[];

	get displayTestProducts(): boolean {
		return this.testType.code === RAPID_TEST_CODE;
	}

	constructor(
		private readonly formBuilder: UntypedFormBuilder,
		private readonly valueSetsService: ValueSetsService,
		private readonly translateService: TranslateService,
		private readonly dataService: CreationDataService
	) {}

	ngOnInit(): void {
		this.testType = this.rapid ? this.getTestTypeOptions()[1] : this.getTestTypeOptions()[0];
		this.createForm();
		this.dataService.resetCalled.subscribe(() => {
			this.resetForm();
		});
		this.dataService.certificateTypeChanged.subscribe(() => {
			this.resetForm();
		});
		this.translateService.onLangChange.subscribe(() => {
			this.updateTestTypeRadio();
			this.testForm.patchValue({
				certificateLanguage: this.getDefaultCertificateLanguage(),
				countryOfTest: this.getCountriesOfTest().find(countryCode => countryCode.code === this.testForm.controls.countryOfTest.value.code)
			});
		});
		this.rapidTestCompleteControl = this.createAutocompleteControl();
		this.rapidTests = this.valueSetsService
			.getRapidTests()
			.map(productInfo => new RapidTestProductInfoWithToString(productInfo.code, productInfo.display, productInfo.validUntil));
		this.filteredRapidTests = this.rapidTests;
	}

	ngAfterViewInit(): void {
		// revalidate the 'sampleDate' field when birthdate is change
		this.testForm.get(`${PersonalDataComponent.FORM_GROUP_NAME}.birthdate`).valueChanges.subscribe(() => {
			// timeout is needed to ensure that the validator gets called after the field contains the new value
			setTimeout(() => {
				const control = this.testForm.get('sampleDate');
				// we cannot use AbstractControl::updateValueAndValidity() because then the error message
				// will contain an object-path for subfield of the ec-datetimepicker
				control.patchValue(control.value);
			});
		});
	}

	goBack(): void {
		this.back.emit();
	}

	goNext(): void {
		this.personalDataChild.touchDatepicker();
		if (this.personalDataChild.vaccineForm) {
			this.personalDataChild.vaccineForm.markAllAsTouched();
		}

		if (this.testForm.valid && this.personalDataChild.vaccineForm?.valid) {
			this.dataService.setNewPatient(this.mapFormToPatientData());
			this.next.emit();
		}
	}

	getCertificateLanguages(): ProductInfo[] {
		return this.valueSetsService.getCertificateLanguages();
	}

	getCountriesOfTest(): ProductInfo[] {
		return this.valueSetsService.getCountryOptions();
	}

	getTestTypeOptions(): ProductInfo[] {
		return this.antibody ? this.valueSetsService.getTypeOfAntibodyTests() : this.valueSetsService.getTypeOfTests();
	}

	getCurrentDateTime() {
		return {
			time: moment().format('HH:mm'),
			date: moment()
		};
	}

	getCurrentDate() {
		return {
			time: '00:00',
			date: moment()
		};
	}

	onRapidTestCompleteClear() {
		this.testForm.controls.product.reset();
		this.filteredRapidTests = this.rapidTests;
	}

	certificateTypeChanged(changeEvent: {value: ProductInfo}) {
		const testType = changeEvent.value;
		const isValidTestType = testType.code === PCR_TEST_CODE || testType.code === RAPID_TEST_CODE;
		if (isValidTestType) {
			this.testType = testType;
			this.testForm.patchValue({
				typeOfTest: testType,
				product: ''
			});
			this.updateProductValidators(testType.code);
		}
	}

	getMinDate(): Date {
		return this.rapid ? DateValidators.RAPID_CERTIFICATE_MIN_DATE : this.antibody ? DateValidators.ANTIBODY_CERTIFICATE_MIN_DATE : DateValidators.MIN_DATE;
	}

	private updateProductValidators(testTypeCode: string) {
		const productControl = this.testForm.controls.product;
		if (testTypeCode === RAPID_TEST_CODE) {
			productControl?.setValidators(Validators.required);
		} else {
			productControl?.clearValidators();
		}
		productControl?.updateValueAndValidity();
	}

	private createForm(): void {
		let sampleDateValidators = BASE_DATE_VALIDATORS;
		if (this.antibody) {
			sampleDateValidators = ANTIBODY_DATE_VALIDATORS;
		}
		if (this.rapid) {
			sampleDateValidators = RAPID_DATE_VALIDATORS;
		}
		this.testForm = this.formBuilder.group({
			typeOfTest: [this.testType, Validators.required],
			sampleDate: [
				this.rapid ? this.getCurrentDate() : this.getCurrentDateTime(),
				[DateValidators.dateMoreThanBirthday(PersonalDataComponent.FORM_GROUP_NAME), ...sampleDateValidators]
			],
			countryOfTest: [this.getDefaultCountryOfTest(), Validators.required],
			product: [''],
			...(this.rapid ? {center: ['']} : {center: ['', [Validators.required, Validators.maxLength(50)]]})
		});
	}

	private createAutocompleteControl(): UntypedFormControl {
		const autocompleteControl = new UntypedFormControl('', RapidTestValidator.testRequired);
		autocompleteControl.valueChanges.subscribe(value => {
			if (typeof value === 'string') {
				this.filteredRapidTests = this.filterRapidTests(value);
			} else if (value instanceof RapidTestProductInfoWithToString) {
				this.testForm.patchValue({product: value});
			}
		});
		return autocompleteControl;
	}

	private filterRapidTests(query: string) {
		query = query.toLowerCase();
		return this.rapidTests.filter(product => {
			const productDisplay = product.display.toLowerCase();
			return productDisplay.startsWith(query);
		});
	}

	private getDefaultCertificateLanguage(): ProductInfo {
		return this.translateService.currentLang === 'en'
			? this.getCertificateLanguages().find(lang => lang.code === 'de')
			: this.getCertificateLanguages().find(lang => lang.code === this.translateService.currentLang);
	}

	private getDefaultCountryOfTest(): ProductInfo {
		return this.getCountriesOfTest().find(countryCode => countryCode.code === 'CH');
	}

	private mapFormToPatientData(): Patient {
		let additionalData;

		if (this.antibody) {
			additionalData = {
				certificateType: GenerationType.ANTIBODY,
				antibody: {
					center: this.testForm.value.center,
					manufacturer: this.testForm.value.product,
					sampleDate: DateMapper.getDate(this.testForm.value.sampleDate),
					typeOfTest: this.testForm.value.typeOfTest
				}
			};
		} else {
			additionalData = {
				certificateType: this.rapid ? GenerationType.RECOVERY_RAT : GenerationType.TEST,
				test: {
					countryOfTest: this.testForm.value.countryOfTest,
					manufacturer: this.rapid ? null : this.testForm.value.product,
					sampleDate: DateMapper.getDate(this.testForm.value.sampleDate),
					typeOfTest: this.rapid ? null : this.testForm.value.typeOfTest
				}
			};

			if (!this.rapid) {
				additionalData.test.center = this.testForm.value.center;
			}
		}

		return {
			...this.personalDataChild.mapFormToPersonalData(),
			...additionalData
		};
	}

	private updateTestTypeRadio(): void {
		this.testType = this.testType.code === this.getTestTypeOptions()[0].code ? this.getTestTypeOptions()[0] : this.getTestTypeOptions()[1];
	}

	private resetForm(): void {
		const previousCertificateLanguage: ProductInfo = this.testForm.value[PersonalDataComponent.FORM_GROUP_NAME].certificateLanguage;
		const previousTypeOfTest: ProductInfo = this.testForm.value.typeOfTest;
		const previousProduct: ProductInfo = this.testForm.value.product;
		const previousCenter: string = this.testForm.value.center;

		this.formDirective.resetForm();
		this.testForm.reset({
			[PersonalDataComponent.FORM_GROUP_NAME]: {
				certificateLanguage: previousCertificateLanguage
			},
			countryOfTest: this.getDefaultCountryOfTest(),
			typeOfTest: previousTypeOfTest,
			product: previousProduct,
			center: previousCenter,
			sampleDate: this.rapid ? this.getCurrentDate() : this.getCurrentDateTime()
		});

		this.filteredRapidTests = this.rapidTests;
	}
}
