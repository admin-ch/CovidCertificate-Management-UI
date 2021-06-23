import {Injectable} from '@angular/core';
import {
	CountryCodeDto,
	ProductInfo,
	ProductInfoWithGroup,
	TestValueSets,
	VaccinationValueSets,
	ValueSetsResponse
} from 'shared/model';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
	providedIn: 'root'
})
export class ValueSetsService {
	private valueSets: ValueSetsResponse;
	private countryOptions: ProductInfo[] = [];
	private medicinalProducts: ProductInfoWithGroup[] = [];
	private typeOfTests: ProductInfo[] = [];
	private manufacturerOfTest: ProductInfoWithGroup[] = [];
	private certificateLanguages: ProductInfo[] = [];

	constructor(private readonly translateService: TranslateService) {}

	setValueSets(valueSets: ValueSetsResponse): void {
		this.valueSets = valueSets;
		this.computeMedicinalProducts();
		this.computeCountryOptions();
		this.computeTypeOfTests();
		this.computeManufacturerOfTest();
		this.computeCertificateLanguages();
	}

	getCertificateLanguages(): ProductInfo[] {
		return this.certificateLanguages;
	}

	getCountryOptions(): ProductInfo[] {
		return this.countryOptions;
	}

	getMedicinalProducts(): ProductInfoWithGroup[] {
		return this.medicinalProducts;
	}

	getTypeOfTests(): ProductInfo[] {
		return this.typeOfTests;
	}

	getManufacturerOfTest(): ProductInfoWithGroup[] {
		return this.manufacturerOfTest;
	}

	private computeMedicinalProducts(): void {
		this.medicinalProducts = this.valueSets.vaccinationSets.map((vaccinationValue: VaccinationValueSets) => ({
			group: vaccinationValue.auth_holder,
			display: vaccinationValue.name,
			code: vaccinationValue.code
		}));
	}

	private computeCountryOptions(): void {
		this.countryOptions = this.valueSets.countryCodes[this.translateService.currentLang]
			.map((country: CountryCodeDto) => ({
				display: country.display,
				code: country.short
			}))
			.sort((countryA: CountryCodeDto, countryB: CountryCodeDto) =>
				countryA.display.localeCompare(countryB.display)
			);
	}

	private computeTypeOfTests(): void {
		this.typeOfTests = this.valueSets.testSets
			.map((testValue: TestValueSets) => ({
				display: `${testValue.type}${this.getTypeOfTestSuffix(testValue.type)}`,
				code: testValue.type_code
			}))
			.filter((value, index, self) => index === self.findIndex(t => t.code === value.code));
	}

	private getTypeOfTestSuffix(typeOfTest: string): string {
		switch (typeOfTest) {
			case 'Nucleic acid amplification with probe detection':
				return ' (PCR)';
			case 'Rapid immunoassay':
				return ` (${this.translateService.instant('certificateCreate.form.group.test.type.antigen')})`;
			default:
				return '';
		}
	}

	private computeManufacturerOfTest(): void {
		this.manufacturerOfTest = this.valueSets.testSets
			.map((testValue: TestValueSets) => ({
				group: testValue.name,
				display: testValue.manufacturer,
				code: testValue.manufacturer_code_eu
			}))
			.filter(value => value.code !== '');
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
