import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
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

const SAMPLE_DATE_VALIDATORS = [
	Validators.required,
	TimeValidators.validateTime(),
	DateValidators.dateLessThanToday(),
	DateValidators.dateMoreThanMinDate()
];

@Component({
	selector: 'ec-test-form',
	templateUrl: './test-form.component.html',
	styleUrls: ['./test-form.scss']
})
export class TestFormComponent implements OnInit, AfterViewInit {
	@Input() antibody = false;
	@Output() back = new EventEmitter<void>();
	@Output() next = new EventEmitter<void>();

	@ViewChild('formDirective') formDirective: FormGroupDirective;
	@ViewChild('testPersonalDataComponent') personalDataChild: PersonalDataComponent;

	testForm: FormGroup;
	testType: ProductInfo;

	personalDataForm: FormGroup;

	rapidTestCompleteControl: FormControl;
	filteredRapidTests: RapidTestProductInfoWithToString[];

	private rapidTests: RapidTestProductInfoWithToString[];

	get displayTestProducts(): boolean {
		return this.testType.code === RAPID_TEST_CODE;
	}

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly valueSetsService: ValueSetsService,
		private readonly translateService: TranslateService,
		private readonly dataService: CreationDataService
	) {}

	ngOnInit(): void {
		this.testType = this.getTestTypeOptions()[0];
		this.createForm();
		this.dataService.resetCalled.subscribe(() => {
			this.resetForm();
		});
		this.dataService.certificateTypeChanged.subscribe(() => {
			this.resetForm();
		});
		this.translateService.onLangChange.subscribe(_ => {
			this.testForm.patchValue({
				certificateLanguage: this.getDefaultCertificateLanguage(),
				countryOfTest: this.getDefaultCountryOfTest()
			});
		});
		this.rapidTestCompleteControl = this.createAutocompleteControl();
		this.rapidTests = this.valueSetsService
			.getRapidTests()
			.map(
				productInfo =>
					new RapidTestProductInfoWithToString(productInfo.code, productInfo.display, productInfo.validUntil)
			);
		this.filteredRapidTests = this.rapidTests;
	}

	ngAfterViewInit() {
		if (this.personalDataChild && this.personalDataChild.vaccineForm) {
			this.personalDataForm = this.personalDataChild.vaccineForm;
		}
	}

	goBack(): void {
		this.back.emit();
	}

	goNext(): void {
		if(this.personalDataForm) {
			this.personalDataForm.markAllAsTouched();
		}
		if (this.testForm.valid && this.personalDataForm && this.personalDataForm.valid) {
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

	getCurrentDateTime(): any {
		return {
			time: moment().format('HH:mm'),
			date: moment()
		};
	}

	getCurrentDate(): any {
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
		if (this.antibody) {
			SAMPLE_DATE_VALIDATORS.push(DateValidators.dateBeforeThanAntibodyCertificateMinDate());
		}
		this.testForm = this.formBuilder.group({
			typeOfTest: [this.testType, Validators.required],
			product: [''],
			sampleDate: [this.getCurrentDateTime(), SAMPLE_DATE_VALIDATORS],
			center: ['', [Validators.required, Validators.maxLength(50)]],
			countryOfTest: [this.getDefaultCountryOfTest(), Validators.required]
		});

		this.testForm.get('sampleDate').valueChanges.subscribe(_ => {
			if (!!this.testForm.get('birthdate')) {
				this.testForm.controls.sampleDate.setValidators([
					DateValidators.dateMoreThanBirthday(),
					...SAMPLE_DATE_VALIDATORS
				]);
			}
		});
	}

	private createAutocompleteControl(): FormControl {
		const autocompleteControl = new FormControl('', RapidTestValidator.testRequired);
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
				certificateType: GenerationType.TEST,
				test: {
					center: this.testForm.value.center,
					countryOfTest: this.testForm.value.countryOfTest,
					manufacturer: this.testForm.value.product,
					sampleDate: DateMapper.getDate(this.testForm.value.sampleDate),
					typeOfTest: this.testForm.value.typeOfTest
				}
			};
		}

		return {
			firstName: this.personalDataForm.value.firstName,
			surName: this.personalDataForm.value.surName,
			birthdate: DateMapper.getBirthdate(this.personalDataForm.value.birthdate),
			language: this.personalDataForm.value.certificateLanguage.code,
			...additionalData
		};
	}

	private resetForm(): void {
		const previousCertificateLanguage: ProductInfo = this.testForm.value.certificateLanguage;
		const previousTypeOfTest: ProductInfo = this.testForm.value.typeOfTest;
		const previousProduct: ProductInfo = this.testForm.value.product;
		const previousCenter: string = this.testForm.value.center;

		this.formDirective.resetForm();
		this.testForm.reset({
			certificateLanguage: previousCertificateLanguage,
			countryOfTest: this.getDefaultCountryOfTest(),
			typeOfTest: previousTypeOfTest,
			product: previousProduct,
			center: previousCenter,
			sampleDate: this.getCurrentDateTime()
		});

		this.filteredRapidTests = this.rapidTests;
	}
}
