import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {ValueSetsService} from '../utils/value-sets.service';
import {TranslateService} from '@ngx-translate/core';
import {DateValidators} from '../utils/date-validators';
import {Patient, ProductInfo} from 'shared/model';
import {CreationDataService} from '../utils/creation-data.service';
import {DateMapper} from '../utils/date-mapper';

const FIRST_POSITIVE_TEST_VALIDATORS = [
	Validators.required,
	DateValidators.dateLessThanToday(),
	DateValidators.dateMoreThanMinDate()
];

@Component({
	selector: 'ec-recovery-form',
	templateUrl: './recovery-form.component.html'
})
export class RecoveryFormComponent implements OnInit {
	@Output() back = new EventEmitter<void>();
	@Output() next = new EventEmitter<void>();

	@ViewChild('formDirective') formDirective: FormGroupDirective;

	recoveryForm: FormGroup;

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

	goBack(): void {
		this.back.emit();
	}

	goNext(): void {
		if (this.recoveryForm.valid) {
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

	private createForm(): void {
		this.recoveryForm = this.formBuilder.group({
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
			dateFirstPositiveTestResult: ['', FIRST_POSITIVE_TEST_VALIDATORS],
			countryOfTest: [this.getDefaultCountryOfRecovery(), Validators.required],
			checkBox: [{value: false, disabled: true}, Validators.requiredTrue]
		});

		this.recoveryForm.get('dateFirstPositiveTestResult').valueChanges.subscribe(_ => {
			if (!!this.recoveryForm.get('birthdate')) {
				this.recoveryForm.controls.dateFirstPositiveTestResult.setValidators([
					DateValidators.dateMoreThanBirthday(),
					...FIRST_POSITIVE_TEST_VALIDATORS
				]);
			}
		});

		this.recoveryForm.get('countryOfTest').valueChanges.subscribe(selectedCountryOfTest => {
			this.handleCountryValidation(selectedCountryOfTest);
		});
	}

	private handleCountryValidation(countryOfTest: ProductInfo) {
		if (countryOfTest.code !== 'CH') {
			this.recoveryForm.get('checkBox').enable();
			this.recoveryForm.get('checkBox').setValue(false);
		} else {
			this.recoveryForm.get('checkBox').disable();
		}
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
			firstName: this.recoveryForm.value.firstName,
			surName: this.recoveryForm.value.surName,
			birthdate: DateMapper.getBirthdate(this.recoveryForm.value.birthdate),
			language: this.recoveryForm.value.certificateLanguage.code,
			recovery: {
				countryOfTest: this.recoveryForm.value.countryOfTest,
				dateFirstPositiveTestResult: DateMapper.getDate(this.recoveryForm.value.dateFirstPositiveTestResult)
			}
		};
	}

	private resetForm(): void {
		this.formDirective.resetForm();
		this.recoveryForm.reset({
			certificateLanguage: this.getDefaultCertificateLanguage(),
			countryOfTest: this.getDefaultCountryOfRecovery()
		});
	}
}
