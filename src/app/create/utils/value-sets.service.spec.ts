import {TestBed} from '@angular/core/testing';
import {ValueSetsService} from './value-sets.service';
import {ObliqueTestingModule} from '@oblique/oblique';
import {VaccinationValueSets, ValueSetsResponse} from 'shared/model';

describe('ValueSetsService', () => {
	let service: ValueSetsService;

	const issuableVaccines: VaccinationValueSets[] =
		[
			{
				productCode: "EU/1/20/1528",
				productDisplay: "Comirnaty",
				prophylaxisCode: "1119349007",
				prophylaxisDisplay: "SARS-CoV-2 mRNA vaccine",
				authHolderCode: "ORG-100030215",
				authHolderDisplay: "Biontech Manufacturing GmbH"
			},
			{
				productCode: "EU/1/20/1525",
				productDisplay: "COVID-19 Vaccine Janssen",
				prophylaxisCode: "J07BX03",
				prophylaxisDisplay: "covid-19 vaccines",
				authHolderCode: "ORG-100001417",
				authHolderDisplay: "Janssen-Cilag International"
			},
			{
				productCode: "EU/1/20/1507",
				productDisplay: "Spikevax (previously COVID-19 Vaccine Moderna)",
				prophylaxisCode: "1119349007",
				prophylaxisDisplay: "SARS-CoV-2 mRNA vaccine",
				authHolderCode: "ORG-100031184",
				authHolderDisplay: "Moderna Biotech Spain S.L."
			},
			{
				productCode: "EU/1/21/1529",
				productDisplay: "Vaxzevria (previously COVID-19 Vaccine AstraZeneca)",
				prophylaxisCode: "J07BX03",
				prophylaxisDisplay: "covid-19 vaccines",
				authHolderCode: "ORG-100001699",
				authHolderDisplay: "AstraZeneca AB"
			}
		]

	const valueSets: ValueSetsResponse = {
		countryCodes: {
			de: [
				{
					display: 'Schweden',
					lang: 'de',
					active: true,
					version: 'https://iso-3166-1_alpha-2/1',
					system: 'https://iso-3166-1_alpha-2',
					short: 'SE'
				},
				{
					display: 'Schweiz',
					lang: 'de',
					active: true,
					version: 'https://iso-3166-1_alpha-2/1',
					system: 'https://iso-3166-1_alpha-2',
					short: 'CH'
				}
			],
			fr: [
				{
					display: 'Suède',
					lang: 'fr',
					active: true,
					version: 'https://iso-3166-1_alpha-2/1',
					system: 'https://iso-3166-1_alpha-2',
					short: 'SE'
				},
				{
					display: 'Suisse',
					lang: 'fr',
					active: true,
					version: 'https://iso-3166-1_alpha-2/1',
					system: 'https://iso-3166-1_alpha-2',
					short: 'CH'
				}
			],
			it: [
				{
					display: 'Svezia',
					lang: 'it',
					active: true,
					version: 'https://iso-3166-1_alpha-2/1',
					system: 'https://iso-3166-1_alpha-2',
					short: 'SE'
				},
				{
					display: 'Svizzera',
					lang: 'it',
					active: true,
					version: 'https://iso-3166-1_alpha-2/1',
					system: 'https://iso-3166-1_alpha-2',
					short: 'CH'
				}
			],
			en: [
				{
					display: 'Sweden',
					lang: 'en',
					active: true,
					version: 'https://iso-3166-1_alpha-2/1',
					system: 'https://iso-3166-1_alpha-2',
					short: 'SE'
				},
				{
					display: 'Switzerland',
					lang: 'en',
					active: true,
					version: 'https://iso-3166-1_alpha-2/1',
					system: 'https://iso-3166-1_alpha-2',
					short: 'CH'
				}
			]
		},
		vaccinationSets: [
			{
				productCode: 'EU/1/20/1528',
				productDisplay: 'Comirnaty',
				prophylaxisCode: '1119349007',
				prophylaxisDisplay: 'COVID-19 mRNA vaccine',
				authHolderCode: 'ORG-100030215',
				authHolderDisplay: 'BioNTech Manufacturing GmbH'
			},
			{
				productCode: 'EU/1/20/1507',
				productDisplay: 'COVID-19 Vaccine Moderna',
				prophylaxisCode: '1119349007',
				prophylaxisDisplay: 'COVID-19 mRNA vaccine',
				authHolderCode: 'ORG-100031184',
				authHolderDisplay: 'Moderna Biotech Spain, S.L.'
			}
		],
		testSets: [
			{
				display: 'PCR',
				code: 'LP6464-4'
			},
			{
				display: 'Panbio COVID-19 Ag Test',
				code: 'LP217198-3'
			},
			{
				display: 'AMP Rapid Test SARS-CoV-2 Ag',
				code: 'LP217198-3'
			},
			{
				display: 'Fantasy',
				code: '42'
			}
		]
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ObliqueTestingModule]
		});
		service = TestBed.inject(ValueSetsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('Country options', () => {
		beforeEach(() => {
			service.setValueSets(valueSets, issuableVaccines);
		});

		it('should compute the correct amount of countries', () => {
			expect(service.getCountryOptions().length).toBe(2);
		});

		it('should compute Sweden correctly', () => {
			expect(service.getCountryOptions()[1]).toEqual({code: 'SE', display: 'Sweden'});
		});

		it('should compute Switzerland correctly', () => {
			expect(service.getCountryOptions()[0]).toEqual({code: 'CH', display: 'Switzerland'});
		});
	});

	describe('Medical products ', () => {
		beforeEach(() => {
			service.setValueSets(valueSets, issuableVaccines);
		});

		it('should compute the correct amount of medical products', () => {
			expect(service.getMedicinalProducts().length).toBe(2);
		});

		it('should compute Comirnaty correctly', () => {
			expect(service.getMedicinalProducts()[0]).toEqual({
				code: 'EU/1/20/1528',
				display: 'Comirnaty',
				group: 'BioNTech Manufacturing GmbH'
			});
		});

		it('should compute COVID-19 Vaccine Moderna correctly', () => {
			expect(service.getMedicinalProducts()[1]).toEqual({
				code: 'EU/1/20/1507',
				display: 'COVID-19 Vaccine Moderna',
				group: 'Moderna Biotech Spain, S.L.'
			});
		});
	});

	describe('Type of tests ', () => {
		beforeEach(() => {
			service.setValueSets(valueSets, issuableVaccines);
		});

		it('should compute the correct amount of types of test', () => {
			expect(service.getTypeOfTests().length).toBe(2);
		});

		it('should compute Nucleic acid amplification with probe detection correctly', () => {
			expect(service.getTypeOfTests()[0]).toEqual({
				code: 'LP6464-4',
				display: 'Nucleic acid amplification with probe detection (PCR)'
			});
		});

		it('should compute Rapid immunoassay correctly', () => {
			expect(service.getTypeOfTests()[1]).toEqual({
				code: 'LP217198-3',
				display: 'Rapid immunoassay (certificateCreate.form.group.test.type.antigen)'
			});
		});
	});

	describe('Certificate languages', () => {
		beforeEach(() => {
			service.setValueSets(valueSets, issuableVaccines);
		});

		it('should give back the correct number of certificate languages', () => {
			expect(service.getCertificateLanguages().length).toBe(4);
		});

		it('should have german has certificate language', () => {
			expect(service.getCertificateLanguages()[0]).toEqual({code: 'de', display: 'common.language.de'});
		});

		it('should have french has certificate language', () => {
			expect(service.getCertificateLanguages()[1]).toEqual({code: 'fr', display: 'common.language.fr'});
		});

		it('should have italian has certificate language', () => {
			expect(service.getCertificateLanguages()[2]).toEqual({code: 'it', display: 'common.language.it'});
		});

		it('should have romansh has certificate language', () => {
			expect(service.getCertificateLanguages()[3]).toEqual({code: 'rm', display: 'common.language.rm'});
		});
	});
});
