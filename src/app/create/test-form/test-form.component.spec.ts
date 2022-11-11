import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TestFormComponent} from './test-form.component';
import {DateTimePickerComponent} from '../date-time-picker/date-time-picker.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ObNestedFormModule, ObliqueTestingModule} from '@oblique/oblique';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {ValueSetsService} from '../utils/value-sets.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {CreationDataService} from '../utils/creation-data.service';
import * as moment from 'moment';
import {PCR_TEST_CODE, RAPID_TEST_CODE} from 'shared/constants';
import {ProductInfo} from 'shared/model';
import {PersonalDataComponent} from '../components/personal-data/personal-data.component';

describe('TestFormComponent', () => {
	let component: TestFormComponent;
	let fixture: ComponentFixture<TestFormComponent>;
	let creationDataService: CreationDataService;

	const dateFuture: Date = new Date('9999-04-29');
	const datePast: Date = new Date('2000-04-29');
	const dateToOld: Date = new Date('1899-12-31');
	const timeNoon = '12:00';

	const mockValueSetsService = {
		getCertificateLanguages: jest.fn().mockReturnValue([]),
		getCountryOptions: jest.fn().mockReturnValue([{code: 'CH', display: 'TEST-CH'}]),
		getTypeOfTests: jest.fn().mockReturnValue([
			{code: PCR_TEST_CODE, display: 'Nucleic acid amplification with probe detection (PCR)'},
			{
				code: RAPID_TEST_CODE,
				display: 'Rapid immunoassay'
			}
		]),
		getRapidTests: jest.fn().mockReturnValue([{code: 'test', display: 'test'}])
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TestFormComponent, DateTimePickerComponent, PersonalDataComponent],
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
		fixture = TestBed.createComponent(TestFormComponent);
		creationDataService = TestBed.inject(CreationDataService);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should get the certificate languages from the ValueSetsService', () => {
		jest.clearAllMocks();
		component.getCertificateLanguages();
		expect(mockValueSetsService.getCertificateLanguages).toHaveBeenCalledTimes(1);
	});

	it('should get the countries of test from the ValueSetsService', () => {
		jest.clearAllMocks();
		component.getCountriesOfTest();
		expect(mockValueSetsService.getCountryOptions).toHaveBeenCalledTimes(1);
	});

	it('should get the types of test from the ValueSetsService', () => {
		jest.clearAllMocks();
		component.getTestTypeOptions();
		expect(mockValueSetsService.getTypeOfTests).toHaveBeenCalledTimes(1);
	});

	describe('Form validation', () => {
		describe('typeOfTest validation', () => {
			it('should marks the typeOfTest as invalid if empty', () => {
				component.testForm.get('typeOfTest').setValue('');
				expect(component.testForm.get('typeOfTest').invalid).toBeTruthy();
			});

			it('should marks the typeOfTest as valid if filled', () => {
				component.testForm.get('typeOfTest').setValue({
					code: 'LP6464-4',
					display: 'Nucleic acid amplification with probe detection'
				});
				expect(component.testForm.get('typeOfTest').invalid).toBeFalsy();
			});
		});

		describe('product validation', () => {
			const pcrTest: ProductInfo = {code: PCR_TEST_CODE, display: 'pcr'};
			const rapidTest: ProductInfo = {code: RAPID_TEST_CODE, display: 'rapidtest'};

			describe('PCR', () => {
				beforeEach(() => {
					component.certificateTypeChanged({value: pcrTest});
				});

				it('should mark the product as valid if empty', () => {
					component.testForm.get('product').setValue('');
					expect(component.testForm.get('product').invalid).toBeFalsy();
				});

				it('should hide product selection', () => {
					expect(component.displayTestProducts).toBeFalsy();
				});

				it('should set the product as empty string', () => {
					expect(component.testForm.get('product').value).toBe('');
				});
			});

			describe('rapid test', () => {
				beforeEach(() => {
					component.certificateTypeChanged({value: rapidTest});
				});

				it('should mark the product as invalid if empty', () => {
					component.testForm.get('product').setValue('');
					expect(component.testForm.get('product').invalid).toBeTruthy();
				});

				it('should show product selection', () => {
					expect(component.displayTestProducts).toBeTruthy();
				});

				it('should mark string input as invalid', () => {
					component.rapidTestCompleteControl.setValue('test');
					expect(component.rapidTestCompleteControl.invalid).toBeTruthy();
				});
			});
		});

		describe('sampleDate validation', () => {
			it('should marks the sampleDate as invalid if empty', () => {
				component.testForm.get('sampleDate').setValue({date: '', time: ''});
				expect(component.testForm.get('sampleDate').invalid).toBeTruthy();
			});

			it('should marks the sampleDate as invalid if in the future', () => {
				component.testForm.get('sampleDate').setValue({date: dateFuture, time: timeNoon});
				expect(component.testForm.get('sampleDate').invalid).toBeTruthy();
			});

			it('should mark the sampleDate as invalid if too old', () => {
				component.testForm.get('sampleDate').setValue({date: dateToOld, time: timeNoon});
				expect(component.testForm.get('sampleDate').invalid).toBeTruthy();
			});

			it('should mark the sampleDate one hour in the future as valid', () => {
				const testDate: Date = new Date();
				testDate.setTime(testDate.getTime() + 60 * 60 * 1000);
				const time = `${testDate.getHours()}:${addZeroIfLessThanTen(testDate.getMinutes())}`;
				component.testForm.get('sampleDate').setValue({date: testDate.toDateString(), time});
				expect(component.testForm.get('sampleDate').invalid).toBeFalsy();
			});

			it('should mark the sampleDate today as valid', () => {
				const testDate: Date = new Date();
				const time = `${testDate.getHours()}:${addZeroIfLessThanTen(testDate.getMinutes())}`;
				component.testForm.get('sampleDate').setValue({date: testDate.toDateString(), time});
				expect(component.testForm.get('sampleDate').invalid).toBeFalsy();
			});

			it('should mark the sampleDate as valid if set correctly', () => {
				component.testForm.get('sampleDate').setValue({date: datePast, time: timeNoon});
				expect(component.testForm.get('sampleDate').invalid).toBeFalsy();
			});

			it('should mark the sampleDate as invalid if set before birthdate', () => {
				const dateAhead = moment(datePast).clone().add({days: 1});
				component.testForm.get(`${PersonalDataComponent.FORM_GROUP_NAME}.birthdate`).setValue({date: dateAhead.toDate(), time: timeNoon});
				component.testForm.get('sampleDate').setValue({date: datePast, time: timeNoon});
				expect(component.testForm.get('sampleDate').invalid).toBeTruthy();
			});

			it('should mark the sampleDate as valid if set after/equal birthdate', () => {
				component.testForm.get(`${PersonalDataComponent.FORM_GROUP_NAME}.birthdate`).setValue(datePast);
				component.testForm.get('sampleDate').setValue({date: datePast, time: timeNoon});
				expect(component.testForm.get('sampleDate').invalid).toBeFalsy();
			});
		});

		describe('center validation', () => {
			it('should marks the center as invalid if empty', () => {
				component.testForm.get('center').setValue('');
				expect(component.testForm.get('center').invalid).toBeTruthy();
			});

			it('should marks the center as invalid if length is over 50', () => {
				component.testForm.get('center').setValue('012345678901234567890123456789012345678901234567891');
				expect(component.testForm.get('center').invalid).toBeTruthy();
			});

			it('should marks the center as valid if filled correctly', () => {
				component.testForm.get('center').setValue('John');
				expect(component.testForm.get('center').invalid).toBeFalsy();
			});
		});

		describe('countryOfTest validation', () => {
			it('should marks the countryOfTest as invalid if empty', () => {
				component.testForm.get('countryOfTest').setValue('');
				expect(component.testForm.get('countryOfTest').invalid).toBeTruthy();
			});

			it('should marks the countryOfTest as valid if filled', () => {
				component.testForm.get('countryOfTest').setValue('CH');
				expect(component.testForm.get('countryOfTest').invalid).toBeFalsy();
			});
		});
	});

	describe('Handling of goBack()', () => {
		it('should emit back', () => {
			const nextMock = jest.spyOn(component.back, 'emit');

			component.goBack();

			expect(nextMock).toHaveBeenCalledTimes(1);
		});
	});

	describe('Handling of goNext()', () => {
		it('should not emit next if the form is invalid', () => {
			const nextMock = jest.spyOn(component.next, 'emit');

			component.goNext();

			expect(nextMock).toHaveBeenCalledTimes(0);
		});

		it('should emit next if the type is selected', () => {
			const nextSpy = jest.spyOn(component.next, 'emit');

			component.testForm.get('personalData.firstName').setValue('John');
			component.testForm.get('personalData.surName').setValue('Doe');
			component.testForm.get('personalData.birthdate').setValue({date: datePast});
			component.testForm.get('personalData.certificateLanguage').setValue('DE');

			component.testForm.get('typeOfTest').setValue({
				code: 'LP6464-4',
				display: 'Nucleic acid amplification with probe detection'
			});
			component.testForm.get('product').setValue('');
			component.testForm.get('sampleDate').setValue({date: moment(datePast), time: timeNoon});
			component.testForm.get('center').setValue('Testcenter');
			component.testForm.get('countryOfTest').setValue('CH');

			component.goNext();

			expect(nextSpy).toHaveBeenCalledTimes(1);
		});

		it('should call the CreationDataService for setting the new patient data', () => {
			const setNewPatientSpy = jest.spyOn(creationDataService, 'setNewPatient');

			component.testForm.get('personalData.firstName').setValue('John');
			component.testForm.get('personalData.surName').setValue('Doe');
			component.testForm.get('personalData.birthdate').setValue({date: datePast});
			component.testForm.get('personalData.certificateLanguage').setValue('DE');

			component.testForm.get('typeOfTest').setValue({
				code: 'LP6464-4',
				display: 'Nucleic acid amplification with probe detection'
			});
			component.testForm.get('product').setValue('');
			component.testForm.get('sampleDate').setValue({date: moment(datePast), time: timeNoon});
			component.testForm.get('center').setValue('Testcenter');
			component.testForm.get('countryOfTest').setValue('CH');

			component.goNext();

			expect(setNewPatientSpy).toHaveBeenCalledTimes(1);
		});

		it('should map the new patient data correctly', () => {
			const setNewPatientSpy = jest.spyOn(creationDataService, 'setNewPatient');

			component.testForm.get('personalData.firstName').setValue('John');
			component.testForm.get('personalData.surName').setValue('Doe');
			component.testForm.get('personalData.birthdate').setValue({date: datePast});
			component.testForm.get('personalData.certificateLanguage').setValue('DE');

			component.testForm.get('typeOfTest').setValue({
				code: 'LP6464-4',
				display: 'Nucleic acid amplification with probe detection'
			});
			component.testForm.get('product').setValue('');
			component.testForm.get('sampleDate').setValue({date: moment(datePast), time: timeNoon});
			component.testForm.get('center').setValue('Testcenter');
			component.testForm.get('countryOfTest').setValue({code: 'CH', display: 'test-CH'});

			component.goNext();

			const sampleDate: Date = moment(datePast).toDate();
			sampleDate.setHours(12);

			expect(setNewPatientSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('Form reset', () => {
		it('should reset the firstName correctly', () => {
			component.testForm.get(`${PersonalDataComponent.FORM_GROUP_NAME}.firstName`).setValue('TEST');
			creationDataService.emitResetCalled();
			expect(component.testForm.value[PersonalDataComponent.FORM_GROUP_NAME].firstName).toBeNull();
		});

		it('should reset the surName correctly', () => {
			component.testForm.get(`${PersonalDataComponent.FORM_GROUP_NAME}.surName`).setValue('TEST');
			creationDataService.emitResetCalled();
			expect(component.testForm.value[PersonalDataComponent.FORM_GROUP_NAME].surName).toBeNull();
		});

		it('should reset the birthdate correctly', () => {
			component.testForm.get(`${PersonalDataComponent.FORM_GROUP_NAME}.birthdate`).setValue('TEST');
			creationDataService.emitResetCalled();
			expect(component.testForm.value[PersonalDataComponent.FORM_GROUP_NAME].birthdate).toEqual({date: null, time: null});
		});

		it('should reset the certificateLanguage correctly', () => {
			component.testForm.get(`${PersonalDataComponent.FORM_GROUP_NAME}.certificateLanguage`).setValue({display: 'TEST', code: 'lang'});
			creationDataService.emitResetCalled();
			expect(component.testForm.value[PersonalDataComponent.FORM_GROUP_NAME].certificateLanguage).toEqual({display: 'TEST', code: 'lang'});
		});

		it('should reset the typeOfTest correctly', () => {
			component.testForm.get('typeOfTest').setValue({display: 'TEST', code: 'typeOfTest'});
			creationDataService.emitResetCalled();
			expect(component.testForm.value.typeOfTest).toEqual({display: 'TEST', code: 'typeOfTest'});
		});

		it('should reset the product correctly', () => {
			component.testForm.get('product').setValue({display: 'TEST', code: 'product'});
			creationDataService.emitResetCalled();
			expect(component.testForm.value.product).toEqual({display: 'TEST', code: 'product'});
		});

		it('should reset the sampleDate correctly', () => {
			const dateString = '2021-08-24T08:00:00.482Z';
			const date = new Date(dateString);
			Date.now = jest.fn().mockReturnValue(date);
			component.testForm.get('sampleDate').setValue('TEST');
			creationDataService.emitResetCalled();
			const momentDate: moment.Moment = component.testForm.value.sampleDate.date;
			expect(momentDate.toISOString()).toEqual(dateString);
		});

		it('should reset the center correctly', () => {
			component.testForm.get('center').setValue('Testcenter');
			creationDataService.emitResetCalled();
			expect(component.testForm.value.center).toBe('Testcenter');
		});

		it('should reset the countryOfTest correctly', () => {
			component.testForm.get('countryOfTest').setValue({display: 'TEST', code: 'country'});
			creationDataService.emitResetCalled();
			expect(component.testForm.value.countryOfTest).toEqual({display: 'TEST-CH', code: 'CH'});
		});
	});
});

const addZeroIfLessThanTen = (n: number): string => `0${n}`.slice(-2);
