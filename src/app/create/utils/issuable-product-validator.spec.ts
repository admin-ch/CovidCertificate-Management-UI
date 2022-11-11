import {TestBed} from '@angular/core/testing';
import {ValueSetsService} from './value-sets.service';
import {ObliqueTestingModule} from '@oblique/oblique';
import {ValueSetsResponse} from 'shared/model';
import {FormControl, FormGroup} from '@angular/forms';
import {IssuableProductValidator} from './issuable-product-validator';
import {ValueSetsResponseMock} from './value-sets-response-mock';

describe('IssuableProductValidator', () => {
	let service: ValueSetsService;

	const valueSets: ValueSetsResponse = ValueSetsResponseMock.valueSets;

	beforeAll(() => {
		TestBed.configureTestingModule({
			imports: [ObliqueTestingModule]
		});
		service = TestBed.inject(ValueSetsService);
		service.setValueSets(valueSets);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should be created', () => {
		service.getVaccines().forEach(productInfoWithGroup => {
			service.getCountryOptions().forEach(productInfo => {
				const testGroup: FormGroup = new FormGroup({
					medicalProduct: new FormControl(productInfoWithGroup),
					countryOfVaccination: new FormControl(productInfo)
				});

				const isNotIssuableInSwitzerland = productInfoWithGroup.issuable === 'ABROAD_ONLY' && productInfo.code === 'CH';
				expect(IssuableProductValidator.validateProduct(testGroup)).toEqual(isNotIssuableInSwitzerland ? {notIssuableInSwitzerland: true} : null);
			});
		});
	});
});
