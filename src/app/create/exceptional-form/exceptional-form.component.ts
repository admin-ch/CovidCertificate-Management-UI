import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {ValueSetsService} from '../utils/value-sets.service';
import {TranslateService} from '@ngx-translate/core';
import {GenerationType, Patient, ProductInfo } from 'shared/model';
import {DateValidators} from '../utils/date-validators';
import {TimeValidators} from '../utils/time-validators';
import {CreationDataService} from '../utils/creation-data.service';
import {DateMapper} from '../utils/date-mapper';
import * as moment from 'moment';

const SAMPLE_DATE_VALIDATORS = [
	Validators.required,
	TimeValidators.validateTime(),
	DateValidators.dateLessThanToday(),
	DateValidators.dateMoreThanMinDate()
];

@Component({
	selector: 'ec-exceptional-form',
	templateUrl: './exceptional-form.component.html',
	styleUrls: ['./exceptional-form.component.scss']
})
export class ExceptionalFormComponent implements OnInit {
	@Output() back = new EventEmitter<void>();
	@Output() next = new EventEmitter<void>();

	@ViewChild('formDirective') formDirective: FormGroupDirective;

	exceptionalForm: FormGroup;

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
			this.exceptionalForm.patchValue({
				certificateLanguage: this.getDefaultCertificateLanguage(),
				countryOfTest: this.getDefaultCountryOfTest()
			});
		});
	}

	goBack(): void {
		this.back.emit();
	}

	goNext(): void {
		console.log(this.exceptionalForm.valid);
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

	getCurrentDateTime(): any {
		return {
			time: moment().format('HH:mm'),
			date: moment()
		};
	}

	getCurrentDate(): any {
		return {
			time: '23:59',
			date: moment()
		};
	}

	get infoText(): string {
		return "Ich bestätige, dass ich ein/e vom Kanton ernannter Aussteller / ernannte Ausstellerin bin und berechtigt bin, Ausnahmezertifikate aufgrund von ärztlichen Attesten zu erstellen (gemäss Art. 21a Covid-19-Verordnung Zertifikate vom 4. Juni 2021, SR 818.102.2 ).";
	}

	private createForm(): void {
		SAMPLE_DATE_VALIDATORS.push(DateValidators.dateBeforeThanExceptionalCertificateMinDate());
		this.exceptionalForm = this.formBuilder.group({
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
			sampleDate: [this.getCurrentDateTime(), SAMPLE_DATE_VALIDATORS],
			center: ['', [Validators.required, Validators.maxLength(50)]],
			countryOfTest: [this.getDefaultCountryOfTest(), Validators.required],
			checkBox: [false, Validators.requiredTrue]
		});

		this.exceptionalForm.get('sampleDate').valueChanges.subscribe(_ => {
			if (!!this.exceptionalForm.get('birthdate')) {
				this.exceptionalForm.controls.sampleDate.setValidators([
					DateValidators.dateMoreThanBirthday(),
					...SAMPLE_DATE_VALIDATORS
				]);
			}
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
				sampleDate: DateMapper.getDate(this.exceptionalForm.value.sampleDate),
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
