import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {ValueSetsService} from '../utils/value-sets.service';
import {TranslateService} from '@ngx-translate/core';
import {DateValidators} from '../utils/date-validators';
import {GenerationType, Patient, ProductInfo} from 'shared/model';
import {CreationDataService} from '../utils/creation-data.service';
import {DateMapper} from '../utils/date-mapper';
import {PersonalDataComponent} from '../components/personal-data/personal-data.component';

const FIRST_POSITIVE_TEST_VALIDATORS = [
	Validators.required,
	DateValidators.dateLessThanToday(),
	DateValidators.dateMoreThanMinDate(),
	DateValidators.dateMoreThanBirthday(PersonalDataComponent.FORM_GROUP_NAME)
];

@Component({
	selector: 'ec-recovery-form',
	templateUrl: './recovery-form.component.html',
	styleUrls: ['./recovery-form.component.scss']
})
export class RecoveryFormComponent implements OnInit, AfterViewInit {
	@Output() back = new EventEmitter<void>();
	@Output() next = new EventEmitter<void>();

	@ViewChild('formDirective') formDirective: FormGroupDirective;
	@ViewChild('recoveryPersonalDataComponent') personalDataChild: PersonalDataComponent;

	recoveryForm: UntypedFormGroup;

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
		this.translateService.onLangChange.subscribe(_ => {
			this.recoveryForm.patchValue({
				certificateLanguage: this.getDefaultCertificateLanguage(),
				countryOfTest: this.getDefaultCountryOfRecovery()
			});
		});
	}

	ngAfterViewInit(): void {
		// revalidate the 'dateOfVaccination' field when birthdate is change
		this.recoveryForm.get(PersonalDataComponent.FORM_GROUP_NAME + '.birthdate').valueChanges.subscribe(() => {
			// timeout is needed to ensure that the validator gets called after the field contains the new value
			setTimeout(() => {
				const control = this.recoveryForm.get('dateFirstPositiveTestResult');
				// we cannot use AbstractControl::updateValueAndValidity() because then the error message
				// will contain an object-path for subfield of the ec-datetimepicker
				control.patchValue(control.value)
			})
		});
	}

	goBack(): void {
		this.back.emit();
	}

	goNext(): void {
		if (
			this.recoveryForm.controls.countryOfTest.value &&
			this.recoveryForm.controls.countryOfTest.value.code !== 'CH'
		) {
			this.recoveryForm.markAllAsTouched();
		}

		if (this.personalDataChild?.vaccineForm) {
			this.personalDataChild.touchDatepicker();
			this.personalDataChild?.vaccineForm.markAllAsTouched();
		}
		if (this.recoveryForm.valid && this.personalDataChild?.vaccineForm?.valid) {
			this.dataService.setNewPatient(this.mapFormToPatientData());
			this.next.emit();
		}
	}

	getCertificateLanguages(): ProductInfo[] {
		return this.valueSetsService.getCertificateLanguages();
	}

	getCountriesOfRecovery(): ProductInfo[] {
		return this.valueSetsService.getCountryOptions();
	}

	get infoText(): string {
		return this.translateService.instant('certificateCreate.step-two.entitledtoissueconfirmation');
	}

	private createForm(): void {
		this.recoveryForm = this.formBuilder.group({
			dateFirstPositiveTestResult: ['', FIRST_POSITIVE_TEST_VALIDATORS],
			countryOfTest: [this.getDefaultCountryOfRecovery(), Validators.required]
		});
	}

	private getDefaultCertificateLanguage(): ProductInfo {
		return this.translateService.currentLang === 'en'
			? this.getCertificateLanguages().find(lang => lang.code === 'de')
			: this.getCertificateLanguages().find(lang => lang.code === this.translateService.currentLang);
	}

	private getDefaultCountryOfRecovery(): ProductInfo {
		return this.getCountriesOfRecovery().find(countryCode => countryCode.code === 'CH');
	}

	private mapFormToPatientData(): Patient {
		return {
			...this.personalDataChild.mapFormToPersonalData(),
			recovery: {
				countryOfTest: this.recoveryForm.value.countryOfTest,
				dateFirstPositiveTestResult: DateMapper.getDate(this.recoveryForm.value.dateFirstPositiveTestResult)
			},
			certificateType: GenerationType.RECOVERY
		};
	}

	private resetForm(): void {
		const previousCertificateLanguage: ProductInfo = this.recoveryForm.value[PersonalDataComponent.FORM_GROUP_NAME].certificateLanguage;

		this.formDirective.resetForm();
		this.recoveryForm.reset({
			[PersonalDataComponent.FORM_GROUP_NAME]: {
				certificateLanguage: previousCertificateLanguage
			},
			countryOfTest: this.getDefaultCountryOfRecovery()
		});
	}
}
