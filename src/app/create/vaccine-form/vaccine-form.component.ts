import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {ValueSetsService} from '../utils/value-sets.service';
import {CountryCodesDto, DATE_FORMAT, MomentWrapper, Patient, ProductInfo, ProductInfoWithGroup} from 'shared/model';
import {DateValidators} from '../utils/date-validators';
import {TranslateService} from '@ngx-translate/core';
import {DosesValidators} from '../utils/doses-validator';
import {DateMapper} from '../utils/date-mapper';
import {CreationDataService} from '../utils/creation-data.service';
import * as moment from 'moment';
import {IssuableProductValidator} from '../utils/issuable-product-validator';

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
export class VaccineFormComponent implements OnInit {
	@Output() back = new EventEmitter<void>();
	@Output() next = new EventEmitter<void>();

	@ViewChild('formDirective') formDirective: FormGroupDirective;

	vaccineForm: FormGroup;

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
			this.vaccineForm.patchValue({
				certificateLanguage: this.getDefaultCertificateLanguage(),
				countryOfVaccination: this.getDefaultCountryOfVaccination()
			});
		});
	}

	goBack(): void {
		this.back.emit();
	}

	goNext(): void {
		if (this.vaccineForm.valid) {
			this.dataService.setNewPatient(this.mapFormToPatientData());
			this.next.emit();
		}
	}

	getCertificateLanguages(): ProductInfo[] {
		return this.valueSetsService.getCertificateLanguages();
	}

	getMedicalProducts(): ProductInfoWithGroup[] {
		return this.valueSetsService.getMedicinalProducts();
	}

	getCountriesOfVaccination(): ProductInfo[] {
		return this.valueSetsService.getCountryOptions();
	}

	private createForm(): void {
		this.vaccineForm = this.formBuilder.group(
			{
				firstName: ['', [Validators.required, Validators.maxLength(50)]],
				surName: ['', [Validators.required, Validators.maxLength(50)]],
				birthdate: [
					'',
					[
						Validators.required,
						DateValidators.validShortDate(),
						DateValidators.dateLessThanToday(),
						DateValidators.dateMoreThanMinDate()
					]
				],
				certificateLanguage: [this.getDefaultCertificateLanguage(), Validators.required],
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

		this.vaccineForm.get('medicalProduct').valueChanges.subscribe(selectedMedicalProduct => {
			this.handleCountryAndMedicalProductValidation(
				this.vaccineForm.get('countryOfVaccination').value,
				selectedMedicalProduct
			);
		});

		this.vaccineForm.get('countryOfVaccination').valueChanges.subscribe(selectedCountryOfVaccination => {
			this.handleCountryAndMedicalProductValidation(
				selectedCountryOfVaccination,
				this.vaccineForm.get('medicalProduct').value
			);
		});
	}

	private handleCountryAndMedicalProductValidation(country: ProductInfo, medicalProduct: ProductInfoWithGroup) {
		if (medicalProduct.issuable === 'ABROAD_ONLY' && country.code !== 'CH') {
			this.vaccineForm.get('checkBox').enable();
			this.vaccineForm.get('checkBox').setValue(false);
		} else {
			this.vaccineForm.get('checkBox').disable();
		}
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
			firstName: this.vaccineForm.value.firstName,
			surName: this.vaccineForm.value.surName,
			birthdate: DateMapper.getBirthdate(this.vaccineForm.value.birthdate),
			language: this.vaccineForm.value.certificateLanguage.code,
			vaccination: {
				countryOfVaccination: this.vaccineForm.value.countryOfVaccination,
				dateOfVaccination: DateMapper.getDate(this.vaccineForm.value.dateOfVaccination),
				doseNumber: this.vaccineForm.value.doseNumber,
				medicalProduct: this.vaccineForm.value.medicalProduct,
				totalDoses: this.vaccineForm.value.totalDoses
			}
		};
	}

	private resetForm(): void {
		const previousCertificateLanguage: ProductInfo = this.vaccineForm.value.certificateLanguage;
		const previousMedicalProduct: ProductInfoWithGroup = this.vaccineForm.value.medicalProduct;

		this.formDirective.resetForm();
		this.vaccineForm.reset({
			certificateLanguage: previousCertificateLanguage,
			dateOfVaccination: this.getDefaultDateOfVaccination(),
			countryOfVaccination: this.getDefaultCountryOfVaccination(),
			medicalProduct: previousMedicalProduct
		});
	}
}
