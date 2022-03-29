import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
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
	DateValidators.dateMoreThanMinDate()
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

	recoveryForm: FormGroup;

	personalDataForm: FormGroup;

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
			this.recoveryForm.patchValue({
				certificateLanguage: this.getDefaultCertificateLanguage(),
				countryOfTest: this.getDefaultCountryOfRecovery()
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
		if (
			this.recoveryForm.controls.countryOfTest.value &&
			this.recoveryForm.controls.countryOfTest.value.code !== 'CH'
		) {
			this.recoveryForm.markAllAsTouched();
		}
		if (this.personalDataForm) {
			this.personalDataChild.touchDatepicker();
			this.personalDataForm.markAllAsTouched();
		}
		if (this.recoveryForm.valid && this.personalDataForm && this.personalDataForm.valid) {
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
			countryOfTest: [this.getDefaultCountryOfRecovery(), Validators.required],
		});

		this.recoveryForm.get('dateFirstPositiveTestResult').valueChanges.subscribe(_ => {
			if (!!this.recoveryForm.get('birthdate')) {
				this.recoveryForm.controls.dateFirstPositiveTestResult.setValidators([
					DateValidators.dateMoreThanBirthday(),
					...FIRST_POSITIVE_TEST_VALIDATORS
				]);
			}
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
			firstName: this.personalDataForm.value.firstName,
			surName: this.personalDataForm.value.surName,
			birthdate: DateMapper.getBirthdate(this.personalDataForm.value.birthdate),
			language: this.personalDataForm.value.certificateLanguage.code,
			recovery: {
				countryOfTest: this.recoveryForm.value.countryOfTest,
				dateFirstPositiveTestResult: DateMapper.getDate(this.recoveryForm.value.dateFirstPositiveTestResult)
			},
			certificateType: GenerationType.RECOVERY
		};
	}

	private resetForm(): void {
		const previousCertificateLanguage: ProductInfo = this.recoveryForm.value.certificateLanguage;

		this.formDirective.resetForm();
		this.recoveryForm.reset({
			certificateLanguage: previousCertificateLanguage,
			countryOfTest: this.getDefaultCountryOfRecovery(),
		});
	}
}
