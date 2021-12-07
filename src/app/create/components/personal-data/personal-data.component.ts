import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ProductInfo } from 'shared/model';
import { CreationDataService } from '../../utils/creation-data.service';
import { DateValidators } from '../../utils/date-validators';
import { ValueSetsService } from '../../utils/value-sets.service';

const VACCINE_DATE_VALIDATORS = [
  Validators.required,
  DateValidators.dateLessThanToday(),
  DateValidators.dateMoreThanMinDate()
];

@Component({
  selector: 'ec-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.scss']
})
export class PersonalDataComponent implements OnInit {

  @ViewChild('formDirective') formDirective: FormGroupDirective;
  vaccineForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly valueSetsService: ValueSetsService,
    private readonly translateService: TranslateService,
    private readonly dataService: CreationDataService
  ) { }

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
      });
    });
  }


  getCertificateLanguages(): ProductInfo[] {
    return this.valueSetsService.getCertificateLanguages();
  }

  private getDefaultCertificateLanguage(): ProductInfo {
    return this.translateService.currentLang === 'en'
      ? this.getCertificateLanguages().find(lang => lang.code === 'de')
      : this.getCertificateLanguages().find(lang => lang.code === this.translateService.currentLang);
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
        checkBox: [{ value: false, disabled: true }, Validators.requiredTrue]
      },
    );
  }

  private resetForm(): void {
    const previousCertificateLanguage: ProductInfo = this.vaccineForm.value.certificateLanguage;
    this.formDirective.resetForm();
    this.vaccineForm.reset({
      certificateLanguage: previousCertificateLanguage,
      checkBox: { value: false, disabled: true }
    });
  }
}