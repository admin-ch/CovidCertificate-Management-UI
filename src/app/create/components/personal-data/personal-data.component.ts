import {Component, OnInit, ViewChild} from '@angular/core';
import {ControlContainer, UntypedFormBuilder, UntypedFormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {PersonalData, ProductInfo} from 'shared/model';
import {CreationDataService} from '../../utils/creation-data.service';
import {DateValidators} from '../../utils/date-validators';
import {ValueSetsService} from '../../utils/value-sets.service';
import {DateMapper} from "../../utils/date-mapper";

@Component({
	selector: 'ec-personal-data',
	templateUrl: './personal-data.component.html',
	styleUrls: ['./personal-data.component.scss'],
	viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class PersonalDataComponent implements OnInit {
	public static readonly FORM_GROUP_NAME = 'personalData';

	@ViewChild('formDirective') formDirective: FormGroupDirective;
	public vaccineForm: UntypedFormGroup;

	constructor(
		private parent: FormGroupDirective,
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
			this.vaccineForm.patchValue({
				certificateLanguage: this.getDefaultCertificateLanguage()
			});
		});
	}

	getCertificateLanguages(): ProductInfo[] {
		return this.valueSetsService.getCertificateLanguages();
	}

	touchDatepicker(): void {
		const element: HTMLElement = document.querySelector('#birthdate-date');
		element.focus();
		element.blur();
	}

	public mapFormToPersonalData(): PersonalData {
		return {
			firstName: this.vaccineForm.value.firstName,
			surName: this.vaccineForm.value.surName,
			birthdate: DateMapper.getBirthdate(this.vaccineForm.value.birthdate),
			language: this.vaccineForm.value.certificateLanguage.code,
		};
	}

	private getDefaultCertificateLanguage(): ProductInfo {
		return this.translateService.currentLang === 'en'
			? this.getCertificateLanguages().find(lang => lang.code === 'de')
			: this.getCertificateLanguages().find(lang => lang.code === this.translateService.currentLang);
	}

	private createForm(): void {
		this.vaccineForm = this.formBuilder.group({
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
			checkBox: [{value: false, disabled: true}, Validators.requiredTrue]
		});

		this.parent.form.addControl(PersonalDataComponent.FORM_GROUP_NAME, this.vaccineForm);
	}

	private resetForm(): void {
		const previousCertificateLanguage: ProductInfo = this.vaccineForm.value.certificateLanguage;
		this.formDirective.resetForm();
		this.vaccineForm.reset({
			certificateLanguage: previousCertificateLanguage,
			checkBox: {value: false, disabled: true}
		});
	}
}
