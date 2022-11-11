import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroupDirective, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ValueSetsService} from '../utils/value-sets.service';
import {TranslateService} from '@ngx-translate/core';
import {GenerationType, Patient, ProductInfo} from 'shared/model';
import {DateValidators} from '../utils/date-validators';
import {TimeValidators} from '../utils/time-validators';
import {CreationDataService} from '../utils/creation-data.service';
import {DateMapper} from '../utils/date-mapper';
import * as moment from 'moment';

const SAMPLE_DATE_VALIDATORS = [
	Validators.required,
	TimeValidators.validateTime(),
	DateValidators.dateLessThanToday(),
	DateValidators.dateMoreThanMinDate(),
	DateValidators.dateMoreThanBirthday()
];

@Component({
	selector: 'ec-exceptional-form',
	templateUrl: './exceptional-form.component.html',
	styleUrls: ['./exceptional-form.component.scss']
})
export class ExceptionalFormComponent implements OnInit, AfterViewInit {
	@Output() readonly back = new EventEmitter<void>();
	@Output() readonly next = new EventEmitter<void>();

	@ViewChild('formDirective') formDirective: FormGroupDirective;

	exceptionalForm: UntypedFormGroup;

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
			this.exceptionalForm.patchValue({
				certificateLanguage: this.getDefaultCertificateLanguage(),
				countryOfTest: this.getDefaultCountryOfTest()
			});
		});
	}

	ngAfterViewInit(): void {
		// revalidate the 'sampleDate' field when birthdate is change
		this.exceptionalForm.get('birthdate').valueChanges.subscribe(() => {
			// timeout is needed to ensure that the validator gets called after the field contains the new value
			setTimeout(() => {
				const control = this.exceptionalForm.get('sampleDate');
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
		this.exceptionalForm.markAllAsTouched();
		if (this.exceptionalForm.valid) {
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

	getCurrentDateTime() {
		return {
			time: moment().format('HH:mm'),
			date: moment()
		};
	}

	getCurrentDate() {
		return {
			time: '23:59',
			date: moment()
		};
	}

	getMinDate(): Date {
		return DateValidators.EXCEPTIONAL_CERTIFICATE_MIN_DATE;
	}

	get infoText(): string {
		return this.translateService.instant('certificateCreate.step-two.entitledtoissuemedicalattestationconfirmation');
	}

	private createForm(): void {
		SAMPLE_DATE_VALIDATORS.push(DateValidators.dateBeforeThanExceptionalCertificateMinDate());
		this.exceptionalForm = this.formBuilder.group({
			firstName: ['', [Validators.required, Validators.maxLength(50)]],
			surName: ['', [Validators.required, Validators.maxLength(50)]],
			birthdate: ['', [Validators.required, DateValidators.validShortDate(), DateValidators.dateLessThanToday(), DateValidators.dateMoreThanMinDate()]],
			certificateLanguage: [this.getDefaultCertificateLanguage(), Validators.required],
			sampleDate: [this.getCurrentDateTime(), SAMPLE_DATE_VALIDATORS],
			center: ['', [Validators.required, Validators.maxLength(50)]],
			countryOfTest: [this.getDefaultCountryOfTest(), Validators.required],
			checkBox: [false, Validators.requiredTrue]
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
		const additionalData = {
			certificateType: GenerationType.EXCEPTIONAL,
			exceptional: {
				center: this.exceptionalForm.value.center,
				sampleDate: DateMapper.getDate(this.exceptionalForm.value.sampleDate)
			}
		};

		return {
			firstName: this.exceptionalForm.value.firstName,
			surName: this.exceptionalForm.value.surName,
			birthdate: DateMapper.getBirthdate(this.exceptionalForm.value.birthdate),
			language: this.exceptionalForm.value.certificateLanguage.code,
			...additionalData
		};
	}

	private resetForm(): void {
		const previousCertificateLanguage: ProductInfo = this.exceptionalForm.value.certificateLanguage;
		const previousCenter: string = this.exceptionalForm.value.center;

		this.formDirective.resetForm();
		this.exceptionalForm.reset({
			certificateLanguage: previousCertificateLanguage,
			countryOfTest: this.getDefaultCountryOfTest(),
			center: previousCenter,
			sampleDate: this.getCurrentDateTime(),
			checkBox: false
		});
	}
}
