import {Injectable} from '@angular/core';
import {
	CountryCodeDto,
	ProductInfo,
	Vaccine,
	VaccinationValueSets,
	ValueSetsResponse,
	ProductInfoWithToString,
	RapidTestProductInfoWithToString
} from 'shared/model';
import {TranslateService} from '@ngx-translate/core';
import {PCR_TEST_CODE, RAPID_TEST_CODE, ANTIBODY_TEST_CODE} from 'shared/constants';

@Injectable({
	providedIn: 'root'
})
export class ValueSetsService {
	private valueSets: ValueSetsResponse;
	private countryOptions: ProductInfo[] = [];
	private medicinalProducts: Vaccine[] = [];
	private rapidTests: RapidTestProductInfoWithToString[] = [];
	private typeOfTests: ProductInfo[] = [];
	private certificateLanguages: ProductInfo[] = [];

	constructor(private readonly translateService: TranslateService) {
		translateService.onLangChange.subscribe(_ => {
			if (this.valueSets) {
				this.setValueSets(this.valueSets);
			}
		});
	}

	setValueSets(valueSets: ValueSetsResponse): void {
		this.valueSets = valueSets;
		this.computeMedicinalProducts();
		this.computeCountryOptions();
		this.computeRapidTests();
		this.computeCertificateLanguages();
		this.initializeTypeOfTests();
	}

	getCertificateLanguages(): ProductInfo[] {
		return this.certificateLanguages;
	}

	getCountryOptions(): ProductInfo[] {
		return this.countryOptions;
	}

	getVaccines(): Vaccine[] {
		return this.medicinalProducts;
	}

	getTypeOfTests(): ProductInfo[] {
		return this.typeOfTests;
	}

	getTypeOfAntibodyTests(): ProductInfo[] {
		return [{code: ANTIBODY_TEST_CODE, display: 'Sars-CoV-2-Antibody'}];
	}

	getRapidTests(): RapidTestProductInfoWithToString[] {
		return this.rapidTests;
	}

	private computeRapidTests(): void {
		this.rapidTests = this.valueSets.testSets;
	}

	private computeMedicinalProducts(): void {
		this.medicinalProducts = this.valueSets.vaccinationSets.map((vaccinationValue: VaccinationValueSets) => ({
			group: vaccinationValue.authHolderDisplay,
			display: vaccinationValue.productDisplay,
			code: vaccinationValue.productCode,
			issuable: vaccinationValue.issuable,
			touristVaccine: vaccinationValue.touristVaccine
		}));
	}

	private computeCountryOptions(): void {
		this.countryOptions = this.valueSets.countryCodes[this.translateService.currentLang]
			.map((country: CountryCodeDto) => ({
				display: country.display,
				code: country.short
			}))
			.sort((countryA: ProductInfo, countryB: ProductInfo) => {
				if (countryA.code === 'CH') {
					return -1;
				} else if (countryB.code === 'CH') {
					return 1;
				} else {
					return countryA.display.localeCompare(countryB.display);
				}
			});
	}

	private initializeTypeOfTests(): void {
		this.typeOfTests = [
			{code: PCR_TEST_CODE, display: 'Nucleic acid amplification with probe detection (PCR)'},
			{
				code: RAPID_TEST_CODE,
				display: `Rapid immunoassay (${this.translateService.instant(
					'certificateCreate.form.group.test.type.antigen'
				)})`
			}
		];
	}

	private computeCertificateLanguages(): void {
		this.certificateLanguages = [
			{display: this.translateService.instant('common.language.de'), code: 'de'},
			{display: this.translateService.instant('common.language.fr'), code: 'fr'},
			{display: this.translateService.instant('common.language.it'), code: 'it'},
			{display: this.translateService.instant('common.language.rm'), code: 'rm'}
		];
	}
}
