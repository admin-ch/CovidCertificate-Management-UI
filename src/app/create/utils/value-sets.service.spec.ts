import {TestBed} from '@angular/core/testing';
import {ValueSetsService} from './value-sets.service';
import {ObliqueTestingModule} from '@oblique/oblique';
import {ValueSetsResponse} from 'shared/model';

describe('ValueSetsService', () => {
	let service: ValueSetsService;

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
				name: 'Comirnaty',
				code: 'EU/1/20/1528',
				prophylaxis: 'COVID-19 mRNA vaccine',
				active: true,
				prophylaxis_code: '1119349007',
				auth_holder: 'BioNTech Manufacturing GmbH',
				auth_holder_code: 'ORG-100030215'
			},
			{
				name: 'COVID-19 Vaccine Moderna',
				code: 'EU/1/20/1507',
				prophylaxis: 'COVID-19 mRNA vaccine',
				active: true,
				prophylaxis_code: '1119349007',
				auth_holder: 'Moderna Biotech Spain, S.L.',
				auth_holder_code: 'ORG-100031184'
			}
		],
		testSets: [
			{
				name: 'PCR',
				type: 'Nucleic acid amplification with probe detection',
				manufacturer: '',
				active: true,
				type_code: 'LP6464-4',
				swiss_test_kit: '',
				manufacturer_code_eu: '',
				eu_accepted: true,
				ch_accepted: true
			},
			{
				name: 'Panbio COVID-19 Ag Test',
				type: 'Rapid immunoassay',
				manufacturer: 'Abbott Rapid Diagnostics',
				active: true,
				type_code: 'LP217198-3',
				swiss_test_kit: '2',
				manufacturer_code_eu: '1232',
				eu_accepted: true,
				ch_accepted: true
			},
			{
				name: 'AMP Rapid Test SARS-CoV-2 Ag',
				type: 'Rapid immunoassay',
				manufacturer: 'AMEDA Labordiagnostik GmbH',
				active: true,
				type_code: 'LP217198-3',
				swiss_test_kit: '19',
				manufacturer_code_eu: '1304',
				eu_accepted: true,
				ch_accepted: true
			},
			{
				name: 'Second test product',
				type: 'Phantasy',
				manufacturer: 'AMEDA Labordiagnostik GmbH',
				active: true,
				type_code: '42',
				swiss_test_kit: '19',
				manufacturer_code_eu: '1304',
				eu_accepted: true,
				ch_accepted: true
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
		it('should compute the correct amount of countries', () => {
			service.setValueSets(valueSets);
			expect(service.getCountryOptions().length).toBe(2);
		});

		it('should compute Sweden correctly', () => {
			service.setValueSets(valueSets);
			expect(service.getCountryOptions()[0]).toEqual({code: 'SE', display: 'Sweden'});
		});

		it('should compute Switzerland correctly', () => {
			service.setValueSets(valueSets);
			expect(service.getCountryOptions()[1]).toEqual({code: 'CH', display: 'Switzerland'});
		});
	});

	describe('Medical products ', () => {
		it('should compute the correct amount of medical products', () => {
			service.setValueSets(valueSets);
			expect(service.getMedicinalProducts().length).toBe(2);
		});

		it('should compute Comirnaty correctly', () => {
			service.setValueSets(valueSets);
			expect(service.getMedicinalProducts()[0]).toEqual({
				code: 'EU/1/20/1528',
				display: 'Comirnaty',
				group: 'BioNTech Manufacturing GmbH'
			});
		});

		it('should compute COVID-19 Vaccine Moderna correctly', () => {
			service.setValueSets(valueSets);
			expect(service.getMedicinalProducts()[1]).toEqual({
				code: 'EU/1/20/1507',
				display: 'COVID-19 Vaccine Moderna',
				group: 'Moderna Biotech Spain, S.L.'
			});
		});
	});

	describe('Type of tests ', () => {
		it('should compute the correct amount of types of test', () => {
			service.setValueSets(valueSets);
			expect(service.getTypeOfTests().length).toBe(3);
		});

		it('should compute Nucleic acid amplification with probe detection correctly', () => {
			service.setValueSets(valueSets);
			expect(service.getTypeOfTests()[0]).toEqual({
				code: 'LP6464-4',
				display: 'Nucleic acid amplification with probe detection (PCR)'
			});
		});

		it('should compute Rapid immunoassay correctly', () => {
			service.setValueSets(valueSets);
			expect(service.getTypeOfTests()[1]).toEqual({
				code: 'LP217198-3',
				display: 'Rapid immunoassay (certificateCreate.form.group.test.type.antigen)'
			});
		});

		it('should compute Phantasy test type correctly', () => {
			service.setValueSets(valueSets);
			expect(service.getTypeOfTests()[2]).toEqual({
				code: '42',
				display: 'Phantasy'
			});
		});
	});

	describe('Manufacturer of test ', () => {
		it('should compute the correct amount of manufacturers of test', () => {
			service.setValueSets(valueSets);
			expect(service.getManufacturerOfTest().length).toBe(3);
		});

		it('should compute Abbott Rapid Diagnostics correctly', () => {
			service.setValueSets(valueSets);
			expect(service.getManufacturerOfTest()[0]).toEqual({
				code: '1232',
				display: 'Abbott Rapid Diagnostics',
				group: 'Panbio COVID-19 Ag Test'
			});
		});

		it('should compute AMEDA Labordiagnostik GmbH correctly', () => {
			service.setValueSets(valueSets);
			expect(service.getManufacturerOfTest()[1]).toEqual({
				code: '1304',
				display: 'AMEDA Labordiagnostik GmbH',
				group: 'AMP Rapid Test SARS-CoV-2 Ag'
			});
		});

		it('should compute AMEDA Labordiagnostik GmbH correctly', () => {
			service.setValueSets(valueSets);
			expect(service.getManufacturerOfTest()[2]).toEqual({
				code: '1304',
				display: 'AMEDA Labordiagnostik GmbH',
				group: 'Second test product'
			});
		});
	});

	describe('Certificate languages', () => {
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
