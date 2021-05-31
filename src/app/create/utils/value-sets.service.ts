import {Injectable} from '@angular/core';
import {CountryCodeDto, ProductInfo, TestValueSets, VaccinationValueSets, ValueSetsResponse} from 'shared/model';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
	providedIn: 'root'
})
export class ValueSetsService {
	private valueSets: ValueSetsResponse;
	private countryOptions: ProductInfo[] = [];
	private medicinalProducts: ProductInfo[] = [];
	private typeOfTests: ProductInfo[] = [];
	private manufacturerOfTest: ProductInfo[] = [];

	private readonly certificateLanguages = [
		{display: this.translateService.instant('common.language.de'), code: 'de'},
		{display: this.translateService.instant('common.language.fr'), code: 'fr'},
		{display: this.translateService.instant('common.language.it'), code: 'it'}
	];

	constructor(private readonly translateService: TranslateService) {}

	setValueSets(valueSets: ValueSetsResponse): void {
		this.valueSets = valueSets;
		this.computeMedicinalProducts();
		this.computeCountryOptions();
		this.computeTypeOfTests();
		this.computeManufacturerOfTest();
	}

	getCertificateLanguages(): ProductInfo[] {
		return this.certificateLanguages;
	}

	getCountryOptions(): ProductInfo[] {
		return this.countryOptions;
	}

	getMedicinalProducts(): ProductInfo[] {
		return this.medicinalProducts;
	}

	getTypeOfTests(): ProductInfo[] {
		return this.typeOfTests;
	}

	getManufacturerOfTest(): ProductInfo[] {
		return this.manufacturerOfTest;
	}

	private computeMedicinalProducts(): void {
		this.medicinalProducts = this.valueSets.vaccinationSets.map((vaccinationValue: VaccinationValueSets) => ({
			display: vaccinationValue.name,
			code: vaccinationValue.code
		}));
	}

	private computeCountryOptions(): void {
		this.countryOptions = this.valueSets.countryCodes[this.translateService.currentLang].map(
			(country: CountryCodeDto) => ({
				display: country.display,
				code: country.short
			})
		);
	}

	private computeTypeOfTests(): void {
		this.typeOfTests = this.valueSets.testSets
			.map((testValue: TestValueSets) => ({
				display: testValue.type,
				code: testValue.type_code
			}))
			.filter((value, index, self) => index === self.findIndex(t => t.code === value.code));
	}

	private computeManufacturerOfTest(): void {
		this.manufacturerOfTest = this.valueSets.testSets
			.map((testValue: TestValueSets) => ({
				display: testValue.manufacturer,
				code: testValue.manufacturer_code_eu
			}))
			.filter(value => value.code !== '');
	}
}
