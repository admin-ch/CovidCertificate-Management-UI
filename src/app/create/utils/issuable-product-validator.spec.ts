import {TestBed} from '@angular/core/testing';
import {ValueSetsService} from './value-sets.service';
import {ValueSetsResponse} from 'shared/model';
import {FormControl, FormGroup} from '@angular/forms';
import {IssuableProductValidator} from './issuable-product-validator';
import {ValueSetsResponseMock} from './value-sets-response-mock';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

describe('IssuableProductValidator', () => {
	let service: ValueSetsService;

	const valueSets: ValueSetsResponse = ValueSetsResponseMock.valueSets;

	beforeAll(() => {
		TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot()]
		});
		service = TestBed.inject(ValueSetsService);
		TestBed.inject(TranslateService).use('en');
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
