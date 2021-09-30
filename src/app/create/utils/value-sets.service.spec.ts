import {TestBed} from '@angular/core/testing';
import {ValueSetsService} from './value-sets.service';
import {ObliqueTestingModule} from '@oblique/oblique';
import {ValueSetsResponse} from 'shared/model';
import {ValueSetsResponseMock} from './value-sets-response-mock';

describe('ValueSetsService', () => {
	let service: ValueSetsService;

	const valueSets: ValueSetsResponse = ValueSetsResponseMock.valueSets;

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
			service.setValueSets(valueSets);
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
			service.setValueSets(valueSets);
		});

		it('should compute the correct amount of medical products', () => {
			expect(service.getMedicinalProducts().length).toBe(7);
		});

		it('should compute BBIBP-CorV correctly', () => {
			expect(service.getMedicinalProducts()[0]).toEqual({
				code: 'BBIBP-CorV',
				display: 'BBIBP-CorV (Vero Cells)',
				group: 'China Sinopharm International Corp. - Beijing location',
				issuable: 'ABROAD_ONLY'
			});
		});

		it('should compute Comirnaty correctly', () => {
			expect(service.getMedicinalProducts()[1]).toEqual({
				code: 'EU/1/20/1528',
				display: 'Comirnaty',
				group: 'Biontech Manufacturing GmbH',
				issuable: 'CH_AND_ABROAD'
			});
		});
	});

	describe('Type of tests ', () => {
		beforeEach(() => {
			service.setValueSets(valueSets);
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
			service.setValueSets(valueSets);
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
