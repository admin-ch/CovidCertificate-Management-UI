import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroupDirective, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
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
	DateValidators.dateMoreThanMinDate(),
	DateValidators.dateMoreThanBirthday(PersonalDataComponent.FORM_GROUP_NAME)
];

@Component({
	selector: 'ec-tourist-vaccine-form',
	templateUrl: './tourist-vaccine-form.component.html',
	styleUrls: ['./tourist-vaccine-form.component.scss']
})
export class TouristVaccineFormComponent implements OnInit, AfterViewInit {
	@Output() readonly back = new EventEmitter<void>();
	@Output() readonly next = new EventEmitter<void>();

	@ViewChild('formDirective') formDirective: FormGroupDirective;
	@ViewChild('touristPersonalDataComponent') personalDataChild: PersonalDataComponent;

	vaccineForm: UntypedFormGroup;

	public maxDose = 9;
	public minDose = 0;

	constructor(
		private readonly formBuilder: UntypedFormBuilder,
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
		this.translateService.onLangChange.subscribe(() => {
			this.vaccineForm.controls.medicalProduct.reset();
			this.vaccineForm.controls.countryOfVaccination.reset();
			this.vaccineForm.controls.checkBox.reset();
			this.vaccineForm.patchValue({
				certificateLanguage: this.getDefaultCertificateLanguage()
			});
		});
	}

	ngAfterViewInit(): void {
		// revalidate the 'dateOfVaccination' field when birthdate is change
		this.vaccineForm.get(`${PersonalDataComponent.FORM_GROUP_NAME}.birthdate`).valueChanges.subscribe(() => {
			// timeout is needed to ensure that the validator gets called after the field contains the new value
			setTimeout(() => {
				const control = this.vaccineForm.get('dateOfVaccination');
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
		this.vaccineForm.markAllAsTouched();
		this.personalDataChild.touchDatepicker();

		if (this.vaccineForm.valid) {
			this.dataService.setNewPatient(this.mapFormToPatientData());
			this.next.emit();
		}
	}

	getCertificateLanguages(): ProductInfo[] {
		return this.valueSetsService.getCertificateLanguages();
	}

	getVaccines(): Vaccine[] {
		return this.valueSetsService.getVaccines().filter(vaccine => vaccine.touristVaccine);
	}

	getCountriesOfVaccination(): ProductInfo[] {
		return this.valueSetsService.getCountryOptions().filter(country => country.code !== 'CH');
	}

	get infoText(): string {
		let text = this.translateService.instant('certificateCreate.step-two.entitledtoissueconfirmation');
		text += this.translateService.instant('certificateCreate.step-two.nonissuablevaccineproductinformation');

		return text;
	}

	private static getDefaultDateOfVaccination(): MomentWrapper {
		return {date: moment(new Date(), DATE_FORMAT)};
	}

	private createForm(): void {
		this.vaccineForm = this.formBuilder.group(
			{
				medicalProduct: ['', Validators.required],
				doseNumber: ['', [Validators.required, Validators.max(9), Validators.min(1)]],
				totalDoses: ['', [Validators.required, Validators.max(9), Validators.min(1)]],
				dateOfVaccination: [TouristVaccineFormComponent.getDefaultDateOfVaccination(), VACCINE_DATE_VALIDATORS],
				countryOfVaccination: ['', Validators.required],
				checkBox: [false, Validators.requiredTrue]
			},
			{validators: [DosesValidators.validateDoses, IssuableProductValidator.validateProduct]}
		);
	}

	private getDefaultCertificateLanguage(): ProductInfo {
		return this.translateService.currentLang === 'en'
			? this.getCertificateLanguages().find(lang => lang.code === 'de')
			: this.getCertificateLanguages().find(lang => lang.code === this.translateService.currentLang);
	}

	private mapFormToPatientData(): Patient {
		return {
			...this.personalDataChild.mapFormToPersonalData(),
			vaccination: {
				countryOfVaccination: this.vaccineForm.value.countryOfVaccination,
				dateOfVaccination: DateMapper.getDate(this.vaccineForm.value.dateOfVaccination),
				doseNumber: this.vaccineForm.value.doseNumber,
				medicalProduct: this.vaccineForm.value.medicalProduct,
				totalDoses: this.vaccineForm.value.totalDoses
			},
			certificateType: GenerationType.VACCINATION_TOURIST
		};
	}

	private resetForm(): void {
		const previousCertificateLanguage: ProductInfo = this.vaccineForm.value[PersonalDataComponent.FORM_GROUP_NAME].certificateLanguage;

		this.formDirective.resetForm();
		this.vaccineForm.reset({
			[PersonalDataComponent.FORM_GROUP_NAME]: {
				certificateLanguage: previousCertificateLanguage
			},
			dateOfVaccination: TouristVaccineFormComponent.getDefaultDateOfVaccination(),
			checkBox: false
		});
	}
}
