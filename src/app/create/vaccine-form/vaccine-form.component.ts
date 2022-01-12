import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import {DATE_FORMAT, GenerationType, MomentWrapper, Patient, ProductInfo, Vaccine} from 'shared/model';
import {PersonalDataComponent} from '../components/personal-data/personal-data.component';
import {CreationDataService} from '../utils/creation-data.service';
import {DateMapper} from '../utils/date-mapper';
import {DateValidators} from '../utils/date-validators';
import {DosesValidators} from '../utils/doses-validator';
import {IssuableProductValidator} from '../utils/issuable-product-validator';
import {ValueSetsService} from '../utils/value-sets.service';

const VACCINE_DATE_VALIDATORS = [
	Validators.required,
	DateValidators.dateLessThanToday(),
	DateValidators.dateMoreThanMinDate()
];

@Component({
	selector: 'ec-vaccine-form',
	templateUrl: './vaccine-form.component.html',
	styleUrls: ['./vaccine-form.component.scss']
})
export class VaccineFormComponent implements OnInit, AfterViewInit {
	@Output() back = new EventEmitter<void>();
	@Output() next = new EventEmitter<void>();

	@ViewChild('formDirective') formDirective: FormGroupDirective;
	@ViewChild('vaccinePersonalDataComponent') personalDataChild: PersonalDataComponent;

	vaccineForm: FormGroup;
	personalDataForm: FormGroup;

	public maxDose = 9
	public minDose = 0

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly valueSetsService: ValueSetsService,
		private readonly translateService: TranslateService,
		private readonly dataService: CreationDataService
	) {}

	ngOnInit(): void {
		this.createForm();
		this.dataService.resetCalled.subscribe(() => {
			this.resetForm();
		});
		this.dataService.certificateTypeChanged.subscribe(() => {
			this.resetForm();
		});
		this.translateService.onLangChange.subscribe(_ => {
			this.vaccineForm.controls.medicalProduct.reset();
			this.vaccineForm.patchValue({
				certificateLanguage: this.getDefaultCertificateLanguage(),
				countryOfVaccination: this.getDefaultCountryOfVaccination()
			});
		});
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
		this.vaccineForm.markAllAsTouched();
		if (this.personalDataForm) {
			this.personalDataForm.markAllAsTouched();
		}
		if (this.vaccineForm.valid && this.personalDataForm && this.personalDataForm.valid) {
			this.dataService.setNewPatient(this.mapFormToPatientData());
			this.next.emit();
		}
	}

	getCertificateLanguages(): ProductInfo[] {
		return this.valueSetsService.getCertificateLanguages();
	}

	getVaccines(): Vaccine[] {
		return this.valueSetsService.getVaccines();
	}

	getCountriesOfVaccination(): ProductInfo[] {
		return this.valueSetsService.getCountryOptions();
	}

	get infoText(): string {
		let text = this.translateService.instant('certificateCreate.step-two.entitledtoissueconfirmation');
		text += this.translateService.instant('certificateCreate.step-two.nonissuablevaccineproductinformation');

		return text;
	}

	private createForm(): void {
		this.vaccineForm = this.formBuilder.group(
			{
				medicalProduct: ['', Validators.required],
				doseNumber: ['', [Validators.required, Validators.max(9), Validators.min(1)]],
				totalDoses: ['', [Validators.required, Validators.max(9), Validators.min(1)]],
				dateOfVaccination: [this.getDefaultDateOfVaccination(), VACCINE_DATE_VALIDATORS],
				countryOfVaccination: [this.getDefaultCountryOfVaccination(), Validators.required],
				checkBox: [{value: false, disabled: true}, Validators.requiredTrue]
			},
			{validators: [DosesValidators.validateDoses, IssuableProductValidator.validateProduct]}
		);

		this.vaccineForm.get('dateOfVaccination').valueChanges.subscribe(_ => {
			if (!!this.vaccineForm.get('birthdate')) {
				this.vaccineForm.controls.dateOfVaccination.setValidators([
					DateValidators.dateMoreThanBirthday(),
					...VACCINE_DATE_VALIDATORS
				]);
			}
		});

		this.vaccineForm.get('countryOfVaccination').valueChanges.subscribe(selectedCountryOfVaccination => {
			if (selectedCountryOfVaccination && selectedCountryOfVaccination.code !== 'CH') {
				this.vaccineForm.get('checkBox').enable();
				this.vaccineForm.get('checkBox').setValue(false);
			} else {
				this.vaccineForm.get('checkBox').disable();
			}
		});
	}

	private getDefaultCertificateLanguage(): ProductInfo {
		return this.translateService.currentLang === 'en'
			? this.getCertificateLanguages().find(lang => lang.code === 'de')
			: this.getCertificateLanguages().find(lang => lang.code === this.translateService.currentLang);
	}

	private getDefaultCountryOfVaccination(): ProductInfo {
		return this.getCountriesOfVaccination().find(countryCode => countryCode.code === 'CH');
	}

	private getDefaultDateOfVaccination(): MomentWrapper {
		return {date: moment(new Date(), DATE_FORMAT)};
	}

	private mapFormToPatientData(): Patient {
		return {
			firstName: this.personalDataForm.value.firstName,
			surName: this.personalDataForm.value.surName,
			birthdate: DateMapper.getBirthdate(this.personalDataForm.value.birthdate),
			language: this.personalDataForm.value.certificateLanguage.code,
			vaccination: {
				countryOfVaccination: this.vaccineForm.value.countryOfVaccination,
				dateOfVaccination: DateMapper.getDate(this.vaccineForm.value.dateOfVaccination),
				doseNumber: this.vaccineForm.value.doseNumber,
				medicalProduct: this.vaccineForm.value.medicalProduct,
				totalDoses: this.vaccineForm.value.totalDoses
			},
			certificateType: GenerationType.VACCINATION
		};
	}

	private resetForm(): void {
		const previousCertificateLanguage: ProductInfo = this.vaccineForm.value.certificateLanguage;

		this.formDirective.resetForm();
		this.vaccineForm.reset({
			certificateLanguage: previousCertificateLanguage,
			dateOfVaccination: this.getDefaultDateOfVaccination(),
			countryOfVaccination: this.getDefaultCountryOfVaccination(),
			checkBox: {value: false, disabled: true}
		});
	}
}
