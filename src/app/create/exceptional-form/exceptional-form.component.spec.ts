import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExceptionalFormComponent} from './exceptional-form.component';
import {DateTimePickerComponent} from '../date-time-picker/date-time-picker.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ObliqueTestingModule, ObNestedFormModule} from '@oblique/oblique';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {PersonalDataComponent} from "../components/personal-data/personal-data.component";
import {CreationDataService} from "../utils/creation-data.service";
import * as moment from "moment";
import {ValueSetsService} from "../utils/value-sets.service";

describe('ExceptionalFormComponent', () => {
	let component: ExceptionalFormComponent;
	let fixture: ComponentFixture<ExceptionalFormComponent>;
	let creationDataService: CreationDataService;

	const mockValueSetsService = {
		getCertificateLanguages: jest.fn().mockReturnValue([]),
		getVaccines: jest.fn().mockReturnValue([]),
		getCountryOptions: jest.fn().mockReturnValue([{code: 'CH', display: 'TEST-CH'}, {code: 'DE', display: 'TEST-DE'}])
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ExceptionalFormComponent, DateTimePickerComponent, PersonalDataComponent],
			imports: [
				NoopAnimationsModule,
				ObliqueTestingModule,
				ObNestedFormModule,
				ReactiveFormsModule,
				MatSelectModule,
				MatFormFieldModule,
				MatInputModule,
				MatAutocompleteModule
			],
			providers: [
				{
					provide: ValueSetsService,
					useValue: mockValueSetsService
				}
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ExceptionalFormComponent);
		creationDataService = TestBed.inject(CreationDataService);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('Form reset', () => {
		it('should reset the firstName correctly', () => {
			component.exceptionalForm.get('firstName').setValue('TEST');
			creationDataService.emitResetCalled();
			expect(component.exceptionalForm.value.firstName).toBeNull();
		});

		it('should reset the surName correctly', () => {
			component.exceptionalForm.get('surName').setValue('TEST');
			creationDataService.emitResetCalled();
			expect(component.exceptionalForm.value.surName).toBeNull();
		});

		it('should reset the birthdate correctly', () => {
			component.exceptionalForm.get('birthdate').setValue('TEST');
			creationDataService.emitResetCalled();
			expect(component.exceptionalForm.value.birthdate).toEqual({date: null, time: null});
		});

		it('should reset the certificateLanguage correctly', () => {
			component.exceptionalForm.get('certificateLanguage').setValue({display: 'TEST', code: 'lang'});
			creationDataService.emitResetCalled();
			expect(component.exceptionalForm.value.certificateLanguage).toEqual({display: 'TEST', code: 'lang'});
		});

		it('should reset the countryOfTest correctly', () => {
			component.exceptionalForm.get('countryOfTest').setValue({display: 'TEST-DE', code: 'DE'});
			creationDataService.emitResetCalled();
			expect(component.exceptionalForm.value.countryOfTest).toEqual({display: 'TEST-CH', code: 'CH'});
		});

		it('should reset the center correctly', () => {
			component.exceptionalForm.get('center').setValue('Testcenter');
			creationDataService.emitResetCalled();
			expect(component.exceptionalForm.value.center).toEqual('Testcenter');
		});

		it('should reset the sampleDate correctly', () => {
			const dateString = '2021-08-24T08:00:00.482Z';
			const date = new Date(dateString);
			Date.now = jest.fn().mockReturnValue(date);
			component.exceptionalForm.get('sampleDate').setValue('TEST');
			creationDataService.emitResetCalled();
			const momentDate: moment.Moment = component.exceptionalForm.value.sampleDate.date;
			expect(momentDate.toISOString()).toEqual(dateString);
		});

		it('should reset the checkBox correctly', () => {
			component.exceptionalForm.get('checkBox').setValue(true);
			creationDataService.emitResetCalled();
			expect(component.exceptionalForm.value.checkBox).toBeFalsy();
		});
	});
});
