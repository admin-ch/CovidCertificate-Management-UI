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
import {CreationDataService} from "../utils/creation-data.service";
import * as moment from "moment";
import {ValueSetsService} from "../utils/value-sets.service";

describe('ExceptionalFormComponent', () => {
	let component: ExceptionalFormComponent;
	let fixture: ComponentFixture<ExceptionalFormComponent>;
	let creationDataService: CreationDataService;

	const dateFuture: Date = new Date('9999-04-29');
	const datePast: Date = new Date('2021-10-01');
	const dateToOld: Date = new Date('1899-12-31');
	const timeNoon = '12:00';

	const mockValueSetsService = {
		getCertificateLanguages: jest.fn().mockReturnValue([]),
		getVaccines: jest.fn().mockReturnValue([]),
		getCountryOptions: jest.fn().mockReturnValue([{code: 'CH', display: 'TEST-CH'}, {code: 'DE', display: 'TEST-DE'}])
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ExceptionalFormComponent, DateTimePickerComponent],
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

	describe('Form validation', () => {
		describe('sampleDate validation', () => {
			it('should mark the sampleDate as invalid if empty', () => {
				component.exceptionalForm.get('sampleDate').setValue(null);
				expect(component.exceptionalForm.get('sampleDate').invalid).toBeTruthy();
			});

			it('should mark the sampleDate as invalid if in the future', () => {
				component.exceptionalForm.get('sampleDate').setValue({date: dateFuture});
				expect(component.exceptionalForm.get('sampleDate').invalid).toBeTruthy();
			});

			it('should mark the sampleDate as invalid if too old', () => {
				component.exceptionalForm.get('sampleDate').setValue({date: dateToOld});
				expect(component.exceptionalForm.get('sampleDate').invalid).toBeTruthy();
			});

			it('should mark the sampleDate as invalid if before EXCEPTIONAL_CERTIFICATE_MIN_DATE', () => {
				const invalidDate = moment(datePast).clone().add({days: -1});
				component.exceptionalForm.get('sampleDate').setValue({date: invalidDate});
				expect(component.exceptionalForm.get('sampleDate').invalid).toBeTruthy();
			});

			it('should mark the sampleDate as valid if set correctly', () => {
				component.exceptionalForm.get('sampleDate').setValue({date: datePast});
				expect(component.exceptionalForm.get('sampleDate').invalid).toBeFalsy();
			});

			it('should mark the sampleDate as invalid if set before birthdate', () => {
				const dateAhead = moment(datePast).clone().add({days: 1})
				component.exceptionalForm.get('birthdate').setValue({date: dateAhead.toDate(), time: timeNoon});
				component.exceptionalForm.get('sampleDate').setValue({date: datePast, time: timeNoon});
				expect(component.exceptionalForm.get('sampleDate').invalid).toBeTruthy();
			});

			it('should mark the sampleDate as valid if set after/equal birthdate', () => {
				component.exceptionalForm.get('birthdate').setValue(datePast);
				component.exceptionalForm.get('sampleDate').setValue({date: datePast, time: timeNoon});
				expect(component.exceptionalForm.get('sampleDate').invalid).toBeFalsy();
			});
		});

		describe('countryOfTest validation', () => {
			it('should mark the countryOfTest as invalid if empty', () => {
				component.exceptionalForm.get('countryOfTest').setValue('');
				expect(component.exceptionalForm.get('countryOfTest').invalid).toBeTruthy();
			});

			it('should mark the countryOfTest as valid if filled', () => {
				component.exceptionalForm.get('countryOfTest').setValue('CH');
				expect(component.exceptionalForm.get('countryOfTest').invalid).toBeFalsy();
			});
		});

		describe('checkBox validation', () => {
			it('should mark the checkBox as invalid if empty', () => {
				component.exceptionalForm.get('checkBox').setValue(null);
				expect(component.exceptionalForm.get('checkBox').invalid).toBeTruthy();
			});

			it('should mark the center as valid if filled correctly', () => {
				component.exceptionalForm.get('checkBox').setValue(true);
				expect(component.exceptionalForm.get('checkBox').invalid).toBeFalsy();
			});
		});

		describe('center validation', () => {
			it('should mark the center as invalid if empty', () => {
				component.exceptionalForm.get('center').setValue('');
				expect(component.exceptionalForm.get('center').invalid).toBeTruthy();
			});

			it('should mark the center as invalid if length is over 50', () => {
				component.exceptionalForm.get('center').setValue('012345678901234567890123456789012345678901234567891');
				expect(component.exceptionalForm.get('center').invalid).toBeTruthy();
			});

			it('should mark the center as valid if filled correctly', () => {
				component.exceptionalForm.get('center').setValue('John');
				expect(component.exceptionalForm.get('center').invalid).toBeFalsy();
			});
		});
	});

	describe('Handling of goBack()', () => {
		it('should emit back', () => {
			const backSpy = jest.spyOn(component.back, 'emit');

			component.goBack();

			expect(backSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('Handling of goNext()', () => {
		it('should not emit next if the form is invalid', () => {
			const nextSpy = jest.spyOn(component.next, 'emit');

			component.goNext();

			expect(nextSpy).toHaveBeenCalledTimes(0);
		});

		it('should emit next if the form is valid', () => {
			const nextSpy = jest.spyOn(component.next, 'emit');

			component.exceptionalForm.get('firstName').setValue('John');
			component.exceptionalForm.get('surName').setValue('Doe');
			component.exceptionalForm.get('birthdate').setValue({date: datePast});
			component.exceptionalForm.get('certificateLanguage').setValue('DE');

			component.exceptionalForm.get('sampleDate').setValue({date: moment(datePast)});
			component.exceptionalForm.get('countryOfTest').setValue('CH');
			component.exceptionalForm.get('center').setValue('Testcenter');
			component.exceptionalForm.get('checkBox').setValue(true);

			component.goNext();

			expect(nextSpy).toHaveBeenCalledTimes(1);
		});

		it('should call the CreationDataService for setting the new patient data', () => {
			const setNewPatientSpy = jest.spyOn(creationDataService, 'setNewPatient');

			component.exceptionalForm.get('firstName').setValue('John');
			component.exceptionalForm.get('surName').setValue('Doe');
			component.exceptionalForm.get('birthdate').setValue({date: datePast});
			component.exceptionalForm.get('certificateLanguage').setValue('DE');

			component.exceptionalForm.get('sampleDate').setValue({date: moment(datePast)});
			component.exceptionalForm.get('countryOfTest').setValue('CH');
			component.exceptionalForm.get('center').setValue('Testcenter');
			component.exceptionalForm.get('checkBox').setValue(true);

			component.goNext();

			expect(setNewPatientSpy).toHaveBeenCalledTimes(1);
		});

		it('should map the new patient data correctly', () => {
			const setNewPatientSpy = jest.spyOn(creationDataService, 'setNewPatient');

			component.exceptionalForm.get('firstName').setValue('John');
			component.exceptionalForm.get('surName').setValue('Doe');
			component.exceptionalForm.get('birthdate').setValue({date: datePast});
			component.exceptionalForm.get('certificateLanguage').setValue('DE');

			component.exceptionalForm.get('sampleDate').setValue({date: moment(datePast)});
			component.exceptionalForm.get('countryOfTest').setValue('CH');
			component.exceptionalForm.get('center').setValue('Testcenter');
			component.exceptionalForm.get('checkBox').setValue(true);

			component.goNext();

			expect(setNewPatientSpy).toHaveBeenCalledTimes(1);
		});
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
